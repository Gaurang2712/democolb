// Password toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Form validation and submission
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Social login handlers
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
    
    // Input animations
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Add focused class if input has value on page load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember')
    };
    
    // Basic validation
    if (!validateEmail(loginData.email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (loginData.password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccess('Login successful! Redirecting...');
        
        // Reset button
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Redirect to dashboard or home page
            // window.location.href = '/dashboard';
        }, 1500);
    }, 2000);
}

function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const signupData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        terms: formData.get('terms'),
        newsletter: formData.get('newsletter')
    };
    
    // Validation
    if (!signupData.firstName || !signupData.lastName) {
        showError('Please enter your full name');
        return;
    }
    
    if (!validateEmail(signupData.email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!validatePhone(signupData.phone)) {
        showError('Please enter a valid phone number');
        return;
    }
    
    if (signupData.password.length < 8) {
        showError('Password must be at least 8 characters long');
        return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (!signupData.terms) {
        showError('Please accept the terms and conditions');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccess('Account created successfully! Please check your email for verification.');
        
        // Reset button
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Redirect to login page
            // window.location.href = '/login';
        }, 2000);
    }, 2500);
}

function handleSocialLogin(e) {
    const provider = e.currentTarget.classList.contains('google') ? 'Google' : 'Facebook';
    
    // Show loading state
    const originalText = e.currentTarget.innerHTML;
    e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting to ${provider}...`;
    e.currentTarget.disabled = true;
    
    // Simulate social login
    setTimeout(() => {
        showSuccess(`${provider} login successful! Redirecting...`);
        
        // Reset button
        setTimeout(() => {
            e.currentTarget.innerHTML = originalText;
            e.currentTarget.disabled = false;
        }, 1500);
    }, 2000);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '1000',
        animation: 'slideInRight 0.3s ease-out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444'
    });
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Real-time form validation
document.addEventListener('input', function(e) {
    const input = e.target;
    const inputContainer = input.parentElement;
    
    // Remove existing validation classes
    inputContainer.classList.remove('error', 'success');
    
    if (input.value) {
        let isValid = true;
        
        // Email validation
        if (input.type === 'email') {
            isValid = validateEmail(input.value);
        }
        
        // Phone validation
        if (input.type === 'tel') {
            isValid = validatePhone(input.value);
        }
        
        // Password validation
        if (input.type === 'password' && input.name === 'password') {
            isValid = input.value.length >= 8;
        }
        
        // Confirm password validation
        if (input.name === 'confirmPassword') {
            const passwordInput = document.querySelector('input[name="password"]');
            isValid = passwordInput && input.value === passwordInput.value;
        }
        
        inputContainer.classList.add(isValid ? 'success' : 'error');
    }
});

// Add CSS for validation states
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .input-container.error input {
        border-color: #ef4444;
        background-color: #fef2f2;
    }
    
    .input-container.success input {
        border-color: #10b981;
        background-color: #f0fdf4;
    }
    
    .input-container.error i {
        color: #ef4444;
    }
    
    .input-container.success i {
        color: #10b981;
    }
`;
document.head.appendChild(validationStyles);
