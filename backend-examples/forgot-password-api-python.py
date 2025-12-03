"""
Forgot Password & Reset Password API Example - Python/Flask
"""

from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
import psycopg2
from psycopg2.extras import RealDictCursor
import secrets
import re
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

app = Flask(__name__)
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

def generate_reset_token():
    """Generate secure random token"""
    return secrets.token_urlsafe(32)

def send_reset_email(email, token):
    """Send password reset email"""
    reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password?token={token}"
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Reset Your Password - School Management System'
    msg['From'] = os.getenv('SMTP_FROM', 'noreply@school.com')
    msg['To'] = email
    
    # HTML email
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested to reset your password for your School Management System account.</p>
        <p>Click the link below to reset your password:</p>
        <p>
            <a href="{reset_link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
            </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">{reset_link}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this, please ignore this email or contact support.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Best regards,<br>School Management System Team</p>
    </div>
    """
    
    html_part = MIMEText(html, 'html')
    msg.attach(html_part)
    
    # Send email
    try:
        smtp = smtplib.SMTP(os.getenv('SMTP_HOST'), os.getenv('SMTP_PORT', 587))
        smtp.starttls()
        smtp.login(os.getenv('SMTP_USER'), os.getenv('SMTP_PASSWORD'))
        smtp.send_message(msg)
        smtp.quit()
    except Exception as e:
        print(f'Email sending error: {str(e)}')
        raise

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """
    POST /api/auth/forgot-password
    
    Request Body:
    {
        "email": "admin@school.com"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Request body is required',
                    'code': 'VALIDATION_ERROR'
                }
            }), 400
        
        email = data.get('email', '').strip().lower()
        
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
        
        # Rate limiting check
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check rate limit (3 requests per hour)
        cur.execute("""
            SELECT COUNT(*) as count 
            FROM password_reset_tokens 
            WHERE user_id = (SELECT id FROM auth.users WHERE LOWER(email) = %s)
            AND created_at > NOW() - INTERVAL '1 hour'
        """, (email,))
        
        rate_limit = cur.fetchone()
        if rate_limit['count'] >= 3:
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Too many reset requests. Please try again later',
                    'code': 'RATE_LIMIT_EXCEEDED',
                    'retry_after': 3600
                }
            }), 429
        
        # Check if user exists (but don't reveal)
        cur.execute(
            'SELECT id, email FROM auth.users WHERE LOWER(email) = %s',
            (email,)
        )
        user = cur.fetchone()
        
        # Always return success to prevent email enumeration
        if user:
            # Generate reset token
            token = generate_reset_token()
            expires_at = datetime.now() + timedelta(hours=1)
            
            # Store token
            cur.execute("""
                INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at)
                VALUES (%s, %s, %s, NOW())
            """, (user['id'], token, expires_at))
            
            conn.commit()
            
            # Send email
            try:
                send_reset_email(user['email'], token)
            except Exception as email_error:
                print(f'Email sending error: {str(email_error)}')
                # Still return success
        
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'If an account with that email exists, a password reset link has been sent.',
            'data': {
                'expires_in': 3600
            }
        }), 200
        
    except Exception as e:
        print(f'Forgot password error: {str(e)}')
        return jsonify({
            'success': False,
            'error': {
                'message': 'Internal server error',
                'code': 'INTERNAL_ERROR'
            }
        }), 500

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """
    POST /api/auth/reset-password
    
    Request Body:
    {
        "token": "reset-token-from-email",
        "password": "newpassword123",
        "confirm_password": "newpassword123"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Request body is required',
                    'code': 'VALIDATION_ERROR'
                }
            }), 400
        
        token = data.get('token', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        
        # Validation
        if not token:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Validation failed',
                    'code': 'VALIDATION_ERROR',
                    'errors': {
                        'token': 'Reset token is required'
                    }
                }
            }), 422
        
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
        
        if password != confirm_password:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Validation failed',
                    'code': 'VALIDATION_ERROR',
                    'errors': {
                        'confirm_password': 'Passwords do not match'
                    }
                }
            }), 422
        
        # Find token
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT prt.*, u.email
            FROM password_reset_tokens prt
            JOIN auth.users u ON prt.user_id = u.id
            WHERE prt.token = %s
        """, (token,))
        
        reset_token = cur.fetchone()
        
        if not reset_token:
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Invalid or expired reset token',
                    'code': 'INVALID_TOKEN'
                }
            }), 400
        
        # Check if expired
        if reset_token['expires_at'] < datetime.now():
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Invalid or expired reset token',
                    'code': 'INVALID_TOKEN'
                }
            }), 400
        
        # Check if already used
        if reset_token['used']:
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': {
                    'message': 'This reset token has already been used',
                    'code': 'TOKEN_ALREADY_USED'
                }
            }), 400
        
        # Hash new password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Update password
        cur.execute(
            'UPDATE auth.users SET encrypted_password = %s, updated_at = NOW() WHERE id = %s',
            (hashed_password, reset_token['user_id'])
        )
        
        # Mark token as used
        cur.execute(
            'UPDATE password_reset_tokens SET used = TRUE, updated_at = NOW() WHERE id = %s',
            (reset_token['id'],)
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        # Send confirmation email (optional)
        # try:
        #     send_confirmation_email(reset_token['email'])
        # except:
        #     pass
        
        return jsonify({
            'success': True,
            'message': 'Password has been reset successfully'
        }), 200
        
    except Exception as e:
        print(f'Reset password error: {str(e)}')
        return jsonify({
            'success': False,
            'error': {
                'message': 'Internal server error',
                'code': 'INTERNAL_ERROR'
            }
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

