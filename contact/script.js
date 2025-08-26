
// script.js
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    
    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            const value = formObject[field];
            
            if (!value || value.trim() === '') {
                showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(input);
            }
        });
        
        // Validate email format
        const email = formObject.email;
        if (email && !isValidEmail(email)) {
            showFieldError(document.getElementById('email'), 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone number if provided
        const phone = formObject.phone;
        if (phone && !isValidPhone(phone)) {
            showFieldError(document.getElementById('phone'), 'Please enter a valid phone number');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            submitForm(formObject);
        }
    });
    
    // Show field error
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    // Clear field error
    function clearFieldError(field) {
        field.style.borderColor = '#E9ECEF';
        field.style.boxShadow = 'none';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone validation
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }
    
    // Submit form
    function submitForm(formData) {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            contactForm.reset();
            
            // Log form submission (in real app, send to server)
            console.log('Form submitted:', formData);
        }, 2000);
    }
    
    // Show success modal
    function showSuccessModal() {
        successModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modal = successModal.querySelector('.modal');
        modal.style.animation = 'slideUp 0.3s ease';
    }
    
    // Close modal
    window.closeModal = function() {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // Close modal on overlay click
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Form field animations
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'scale(1.02)';
            this.parentNode.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'scale(1)';
            clearFieldError(this);
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                clearFieldError(this);
            }
        });
    });
    
    // Smooth scrolling for navigation links
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
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#FFFFFF';
            header.style.backdropFilter = 'none';
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.contact-form-container, .info-card, .info-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
    
    // Pet type selection enhancement
    const petTypeSelect = document.getElementById('petType');
    const petEmojis = {
        'dog': '🐕',
        'cat': '🐱',
        'bird': '🐦',
        'rabbit': '🐰',
        'hamster': '🐹',
        'other': '🐾'
    };
    
    petTypeSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        if (selectedValue && petEmojis[selectedValue]) {
            const emoji = petEmojis[selectedValue];
            this.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='50' font-size='30' text-anchor='middle' dominant-baseline='middle' x='50'>${emoji}</text></svg>`)}")`;
            this.style.backgroundRepeat = 'no-repeat';
            this.style.backgroundPosition = 'right 10px center';
            this.style.backgroundSize = '20px 20px';
            this.style.paddingRight = '40px';
        }
    });
    
    // Dynamic greeting based on time
    const now = new Date();
    const hour = now.getHours();
    const heroText = document.querySelector('.hero-text p');
    
    let greeting = "We'd love to hear from you and your furry friends!";
    
    if (hour >= 5 && hour < 12) {
        greeting = "Good morning! We'd love to hear from you and your furry friends!";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon! We'd love to hear from you and your furry friends!";
    } else if (hour >= 17 && hour < 22) {
        greeting = "Good evening! We'd love to hear from you and your furry friends!";
    } else {
        greeting = "We're here 24/7 for you and your furry friends!";
    }
    
    heroText.innerHTML = greeting + " Reach out to us for any questions, appointments, or emergency care.";
    
    // Add floating animation to pet icons
    const petIcons = document.querySelectorAll('.pet-illustration i');
    petIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    const maxLength = 500;
    
    // Create character counter
    const counterDiv = document.createElement('div');
    counterDiv.className = 'char-counter';
    counterDiv.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #7F8C8D;
        margin-top: 0.25rem;
    `;
    counterDiv.textContent = `0/${maxLength}`;
    messageTextarea.parentNode.appendChild(counterDiv);
    
    messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        counterDiv.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.8) {
            counterDiv.style.color = '#e74c3c';
        } else {
            counterDiv.style.color = '#7F8C8D';
        }
        
        if (currentLength > maxLength) {
            this.value = this.value.substring(0, maxLength);
            counterDiv.textContent = `${maxLength}/${maxLength}`;
        }
    });
    
    // Social icons hover effects
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.15) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
    });
    
    // Add pulse animation to emergency text
    const emergencyText = document.querySelector('.emergency-text');
    if (emergencyText) {
        setInterval(() => {
            emergencyText.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                emergencyText.style.animation = '';
            }, 1000);
        }, 5000);
    }
});

// Add pulse animation to CSS
const additionalCSS = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.char-counter {
    transition: color 0.3s ease;
}

.form-group:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
}

.info-item:hover .info-icon {
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);