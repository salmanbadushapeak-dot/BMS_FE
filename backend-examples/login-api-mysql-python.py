"""
Login API Example - Python/Flask with MySQL
"""

from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import mysql.connector
from mysql.connector import Error
import re
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

bcrypt = Bcrypt(app)

# MySQL Database connection
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME', 'school_management'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT', 3306),
            autocommit=False
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def validate_email(email):
    """Validate email format"""
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    POST /api/auth/login
    
    Request Body:
    {
        "email": "admin@school.com",
        "password": "admin123"
    }
    """
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        # Validation
        if not data:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Request body is required',
                    'code': 'VALIDATION_ERROR'
                }
            }), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validate email
        if not email:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Validation failed',
                    'code': 'VALIDATION_ERROR',
                    'errors': {
                        'email': 'Email is required'
                    }
                }
            }), 422
        
        if not validate_email(email):
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Validation failed',
                    'code': 'VALIDATION_ERROR',
                    'errors': {
                        'email': 'Please provide a valid email address'
                    }
                }
            }), 422
        
        # Validate password
        if not password:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Validation failed',
                    'code': 'VALIDATION_ERROR',
                    'errors': {
                        'password': 'Password is required'
                    }
                }
            }), 422
        
        if len(password) < 6:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Validation failed',
                    'code': 'VALIDATION_ERROR',
                    'errors': {
                        'password': 'Password must be at least 6 characters'
                    }
                }
            }), 422
        
        # Query database
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Database connection failed',
                    'code': 'DATABASE_ERROR'
                }
            }), 500
        
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT 
                u.id,
                u.email,
                u.encrypted_password,
                u.email_confirmed_at,
                up.role,
                up.first_name,
                up.last_name,
                up.avatar_url
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE LOWER(u.email) = LOWER(%s)
        """, (email,))
        
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            connection.close()
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Invalid email or password',
                    'code': 'INVALID_CREDENTIALS'
                }
            }), 401
        
        # Verify password
        if not bcrypt.check_password_hash(user['encrypted_password'], password):
            cursor.close()
            connection.close()
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Invalid email or password',
                    'code': 'INVALID_CREDENTIALS'
                }
            }), 401
        
        # Generate JWT token
        token = create_access_token(
            identity=user['id'],
            additional_claims={
                'email': user['email'],
                'role': user['role'] or 'student'
            }
        )
        
        # Update last login
        cursor.execute(
            'UPDATE users SET last_login = NOW() WHERE id = %s',
            (user['id'],)
        )
        connection.commit()
        
        cursor.close()
        connection.close()
        
        # Return success response
        return jsonify({
            'success': True,
            'data': {
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'role': user['role'] or 'student'
                },
                'profile': {
                    'first_name': user['first_name'] or '',
                    'last_name': user['last_name'] or '',
                    'role': user['role'] or 'student',
                    'avatar_url': user['avatar_url']
                },
                'token': token
            }
        }), 200
        
    except Exception as e:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        print(f'Login error: {str(e)}')
        return jsonify({
            'success': False,
            'error': {
                'message': 'Internal server error',
                'code': 'INTERNAL_ERROR'
            }
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

