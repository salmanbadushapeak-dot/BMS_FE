/**
 * Roles Management API Example - Node.js/Express with MySQL
 * 
 * Complete implementation for Roles & Permissions Management
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const router = express.Router();

// MySQL Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'school_management',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * GET /api/roles
 * Get all roles with user count
 */
router.get('/', async (req, res) => {
  try {
    const [roles] = await pool.execute(`
      SELECT 
        r.id,
        r.name,
        r.description,
        r.is_system_role,
        COUNT(DISTINCT up.user_id) AS user_count,
        r.created_at,
        r.updated_at
      FROM roles r
      LEFT JOIN user_profiles up ON LOWER(up.role) = LOWER(r.name)
      GROUP BY r.id, r.name, r.description, r.is_system_role, r.created_at, r.updated_at
      ORDER BY r.name
    `);

    res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

/**
 * GET /api/roles/:roleId/permissions
 * Get permissions for a specific role
 */
router.get('/:roleId/permissions', async (req, res) => {
  try {
    const { roleId } = req.params;

    // Verify role exists
    const [roles] = await pool.execute('SELECT id, name FROM roles WHERE id = ?', [roleId]);
    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Role not found',
          code: 'ROLE_NOT_FOUND'
        }
      });
    }

    // Get all permissions for this role
    const [permissions] = await pool.execute(`
      SELECT 
        pr.resource_id,
        pt.permission_id,
        COALESCE(rp.is_granted, FALSE) AS is_granted
      FROM page_resources pr
      CROSS JOIN permission_types pt
      LEFT JOIN role_permissions rp ON rp.role_id = ? 
        AND rp.resource_id = pr.resource_id 
        AND rp.permission_id = pt.permission_id
      WHERE pr.is_active = TRUE AND pt.is_active = TRUE
      ORDER BY pr.display_order, pt.display_order
    `, [roleId]);

    // Transform to nested object format
    const permissionsObject = {};
    permissions.forEach(perm => {
      if (!permissionsObject[perm.resource_id]) {
        permissionsObject[perm.resource_id] = {};
      }
      permissionsObject[perm.resource_id][perm.permission_id] = perm.is_granted;
    });

    res.status(200).json({
      success: true,
      data: permissionsObject
    });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

/**
 * POST /api/roles
 * Create a new role with permissions
 */
router.post('/', [
  body('name')
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Role name must be between 2 and 100 characters')
    .trim(),
  body('description').optional().isString().trim(),
  body('permissions')
    .isObject()
    .withMessage('Permissions must be an object'),
], async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      return res.status(422).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: errors.array().reduce((acc, err) => {
            acc[err.param] = err.msg;
            return acc;
          }, {})
        }
      });
    }

    const { name, description, permissions } = req.body;

    // Check if role name already exists
    const [existing] = await connection.execute(
      'SELECT id FROM roles WHERE LOWER(name) = LOWER(?)',
      [name]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        error: {
          message: 'Role with this name already exists',
          code: 'ROLE_EXISTS'
        }
      });
    }

    // Insert role
    const [result] = await connection.execute(
      'INSERT INTO roles (name, description, is_system_role) VALUES (?, ?, FALSE)',
      [name, description || null]
    );

    const roleId = result.insertId;

    // Insert permissions
    for (const [resourceId, resourcePerms] of Object.entries(permissions)) {
      for (const [permissionId, isGranted] of Object.entries(resourcePerms)) {
        if (typeof isGranted === 'boolean') {
          await connection.execute(
            `INSERT INTO role_permissions (role_id, resource_id, permission_id, is_granted)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE is_granted = VALUES(is_granted)`,
            [roleId, resourceId, permissionId, isGranted]
          );
        }
      }
    }

    await connection.commit();

    // Get created role with user count
    const [newRole] = await connection.execute(`
      SELECT 
        r.id,
        r.name,
        r.description,
        r.is_system_role,
        COUNT(DISTINCT up.user_id) AS user_count,
        r.created_at,
        r.updated_at
      FROM roles r
      LEFT JOIN user_profiles up ON LOWER(up.role) = LOWER(r.name)
      WHERE r.id = ?
      GROUP BY r.id, r.name, r.description, r.is_system_role, r.created_at, r.updated_at
    `, [roleId]);

    res.status(201).json({
      success: true,
      data: newRole[0]
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  } finally {
    connection.release();
  }
});

/**
 * PUT /api/roles/:roleId
 * Update role name, description, and permissions
 */
router.put('/:roleId', [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role name must be between 2 and 100 characters')
    .trim(),
  body('description').optional().isString().trim(),
  body('permissions')
    .optional()
    .isObject()
    .withMessage('Permissions must be an object'),
], async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { roleId } = req.params;
    const { name, description, permissions } = req.body;

    // Check if role exists
    const [roles] = await connection.execute('SELECT id, name, is_system_role FROM roles WHERE id = ?', [roleId]);
    if (roles.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'Role not found',
          code: 'ROLE_NOT_FOUND'
        }
      });
    }

    const role = roles[0];

    // Update role name/description if provided
    if (name || description !== undefined) {
      // Check if new name conflicts with existing role
      if (name && name.toLowerCase() !== role.name.toLowerCase()) {
        const [existing] = await connection.execute(
          'SELECT id FROM roles WHERE LOWER(name) = LOWER(?) AND id != ?',
          [name, roleId]
        );
        if (existing.length > 0) {
          await connection.rollback();
          return res.status(409).json({
            success: false,
            error: {
              message: 'Role with this name already exists',
              code: 'ROLE_EXISTS'
            }
          });
        }
      }

      await connection.execute(
        'UPDATE roles SET name = COALESCE(?, name), description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name || null, description || null, roleId]
      );
    }

    // Update permissions if provided
    if (permissions) {
      // Delete existing permissions
      await connection.execute('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);

      // Insert new permissions
      for (const [resourceId, resourcePerms] of Object.entries(permissions)) {
        for (const [permissionId, isGranted] of Object.entries(resourcePerms)) {
          if (typeof isGranted === 'boolean') {
            await connection.execute(
              'INSERT INTO role_permissions (role_id, resource_id, permission_id, is_granted) VALUES (?, ?, ?, ?)',
              [roleId, resourceId, permissionId, isGranted]
            );
          }
        }
      }
    }

    await connection.commit();

    // Get updated role
    const [updatedRole] = await connection.execute(`
      SELECT 
        r.id,
        r.name,
        r.description,
        r.is_system_role,
        COUNT(DISTINCT up.user_id) AS user_count,
        r.created_at,
        r.updated_at
      FROM roles r
      LEFT JOIN user_profiles up ON LOWER(up.role) = LOWER(r.name)
      WHERE r.id = ?
      GROUP BY r.id, r.name, r.description, r.is_system_role, r.created_at, r.updated_at
    `, [roleId]);

    res.status(200).json({
      success: true,
      data: updatedRole[0]
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  } finally {
    connection.release();
  }
});

/**
 * DELETE /api/roles/:roleId
 * Delete a role (cannot delete system roles)
 */
router.delete('/:roleId', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { roleId } = req.params;

    // Check if role exists and is not a system role
    const [roles] = await connection.execute(
      'SELECT id, name, is_system_role FROM roles WHERE id = ?',
      [roleId]
    );

    if (roles.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'Role not found',
          code: 'ROLE_NOT_FOUND'
        }
      });
    }

    const role = roles[0];

    if (role.is_system_role) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        error: {
          message: 'Cannot delete system role',
          code: 'SYSTEM_ROLE_PROTECTED'
        }
      });
    }

    // Check if role is assigned to any users
    const [userCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM user_profiles WHERE LOWER(role) = LOWER(?)',
      [role.name]
    );

    if (userCount[0].count > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        error: {
          message: `Cannot delete role. ${userCount[0].count} user(s) are assigned to this role`,
          code: 'ROLE_IN_USE'
        }
      });
    }

    // Delete role (cascade will delete permissions)
    await connection.execute('DELETE FROM roles WHERE id = ?', [roleId]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  } finally {
    connection.release();
  }
});

/**
 * POST /api/roles/:targetRoleId/copy-permissions
 * Copy permissions from one role to another (template functionality)
 */
router.post('/:targetRoleId/copy-permissions', [
  body('source_role_id')
    .notEmpty()
    .withMessage('Source role ID is required')
    .isInt()
    .withMessage('Source role ID must be an integer'),
], async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { targetRoleId } = req.params;
    const { source_role_id } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      return res.status(422).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: errors.array()
        }
      });
    }

    // Verify both roles exist
    const [roles] = await connection.execute(
      'SELECT id, name FROM roles WHERE id IN (?, ?)',
      [source_role_id, targetRoleId]
    );

    if (roles.length !== 2) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: {
          message: 'One or both roles not found',
          code: 'ROLE_NOT_FOUND'
        }
      });
    }

    // Use stored procedure to copy permissions
    await connection.execute(
      'CALL copy_role_permissions(?, ?)',
      [source_role_id, targetRoleId]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Permissions copied successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error copying permissions:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  } finally {
    connection.release();
  }
});

module.exports = router;


