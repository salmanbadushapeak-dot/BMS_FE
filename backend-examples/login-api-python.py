"""
Login API Example - Python/Flask
"""

from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import psycopg2
from psycopg2.extras import RealDictCursor
import re
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

bcrypt = Bcrypt(app)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT', 5432)
    )
    return conn

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
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT 
                u.id,
                u.email,
                u.encrypted_password,
                up.role,
                up.first_name,
                up.last_name,
                up.avatar_url
            FROM auth.users u
            LEFT JOIN user_profiles up ON u.id = up.id
            WHERE LOWER(u.email) = %s
        """, (email,))
        
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Invalid email or password',
                    'code': 'INVALID_CREDENTIALS'
                }
            }), 401
        
        # Verify password
        if not bcrypt.check_password_hash(user['encrypted_password'], password):
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
        
        # Return success response
        return jsonify({
            'success': True,
            'data': {
                'user': {
                    'id': str(user['id']),
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

