// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Get form and modal elements
    const form = document.getElementById('feedbackForm');
    const modal = document.getElementById('successModal');
    const starRating = document.getElementById('starRating');
    const ratingInput = document.getElementById('rating');
    
    // Star rating functionality
    const stars = starRating.querySelectorAll('.star');
    let currentRating = 0;
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            highlightStars(index + 1);
        });
        
        star.addEventListener('mouseout', () => {
            highlightStars(currentRating);
        });
        
        star.addEventListener('click', () => {
            currentRating = index + 1;
            ratingInput.value = currentRating;
            highlightStars(currentRating);
            
            // Add a little animation
            star.style.transform = 'scale(1.3)';
            setTimeout(() => {
                star.style.transform = 'scale(1.1)';
            }, 150);
        });
    });
    
    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate required fields
        if (!validateForm()) {
            return;
        }
        
        // Add loading state to button
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success modal
            showModal();
            
            // Reset form
            form.reset();
            currentRating = 0;
            highlightStars(0);
            ratingInput.value = '';
            
        }, 2000);
    });
    
    // Form validation
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });
        
        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate rating
        if (!ratingInput.value) {
            showRatingError();
            isValid = false;
        } else {
            clearRatingError();
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.style.borderColor = 'var(--error-color)';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function showRatingError() {
        clearRatingError();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'rating-error';
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = 'Please select a rating';
        
        starRating.parentNode.appendChild(errorDiv);
        
        // Add shake animation to stars
        starRating.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            starRating.style.animation = '';
        }, 500);
    }
    
    function clearRatingError() {
        const errorDiv = starRating.parentNode.querySelector('.rating-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Modal functions
    function showModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add celebration effect
        createConfetti();
    }
    
    // Smooth scrolling for navigation (if needed)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form field animations
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'translateY(-2px)';
            this.parentNode.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = '';
        });
    });
    
    // Character counter for textarea
    const textarea = document.getElementById('comments');
    const maxLength = 500;
    
    // Create character counter
    const counterDiv = document.createElement('div');
    counterDiv.style.textAlign = 'right';
    counterDiv.style.fontSize = '0.875rem';
    counterDiv.style.color = 'var(--text-secondary)';
    counterDiv.style.marginTop = '0.25rem';
    textarea.parentNode.appendChild(counterDiv);
    
    textarea.addEventListener('input', function() {
        const remaining = maxLength - this.value.length;
        counterDiv.textContent = `${remaining} characters remaining`;
        
        if (remaining < 0) {
            counterDiv.style.color = 'var(--error-color)';
            this.style.borderColor = 'var(--error-color)';
        } else if (remaining < 50) {
            counterDiv.style.color = 'var(--warning-color)';
            this.style.borderColor = '';
        } else {
            counterDiv.style.color = 'var(--text-secondary)';
            this.style.borderColor = '';
        }
    });
    
    // Initialize character counter
    textarea.dispatchEvent(new Event('input'));
    
    // Confetti animation for success
    function createConfetti() {
        const colors = ['#4f46e5', '#f59e0b', '#ec4899', '#10b981'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        .field-error {
            animation: slideInError 0.3s ease;
        }
        
        @keyframes slideInError {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Close modal function (global scope for onclick)
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});