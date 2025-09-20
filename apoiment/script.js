// Pet Care Appointment Booking JavaScript

// DOM Elements
const form = document.getElementById('appointmentForm');
const modal = document.getElementById('successModal');
const submitBtn = document.querySelector('.submit-btn');

// Form validation patterns
const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePicker();
    setupFormValidation();
    setupFormSubmission();
    addSmoothScrolling();
});

// Set minimum date to today for appointment booking
function initializeDatePicker() {
    const dateInput = document.getElementById('appointmentDate');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    
    // Set max date to 3 months from now
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
}

// Form validation setup
function setupFormValidation() {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Remove error styling on focus
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Specific field validations
    switch (field.type) {
        case 'email':
            if (value && !validationPatterns.email.test(value)) {
                isValid = false;
            }
            break;
        case 'tel':
            if (value && !validationPatterns.phone.test(value.replace(/\D/g, ''))) {
                isValid = false;
            }
            break;
    }
    
    // Date validation - no past dates
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (selectedDate < tomorrow) {
            isValid = false;
        }
    }
    
    // Apply error styling
    if (!isValid) {
        field.classList.add('error');
    } else {
        field.classList.remove('error');
    }
    
    return isValid;
}

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 10) {
        if (value.length === 10) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length === 11 && value[0] === '1') {
            value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
        }
    }
    
    input.value = value;
}

// Form submission setup
function setupFormSubmission() {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
}

// Handle form submission
function handleFormSubmission() {
    // Validate all fields
    let isFormValid = true;
    const formData = new FormData(form);
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Check terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        isFormValid = false;
        termsCheckbox.parentElement.style.color = '#e74c3c';
        setTimeout(() => {
            termsCheckbox.parentElement.style.color = '';
        }, 3000);
    }
    
    if (!isFormValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState(true);
    
    // Simulate API call
    setTimeout(() => {
        showLoadingState(false);
        showSuccessModal(formData);
        resetForm();
    }, 2000);
}

// Show loading state
function showLoadingState(loading) {
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Booking...';
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-calendar-plus"></i> Book Appointment';
    }
}

// Show success modal
function showSuccessModal(formData) {
    // Populate modal with form data
    document.getElementById('confirmPetName').textContent = formData.get('petName');
    document.getElementById('confirmDate').textContent = formatDate(formData.get('appointmentDate'));
    document.getElementById('confirmTime').textContent = formatTime(formData.get('appointmentTime'));
    document.getElementById('confirmService').textContent = getServiceName(formData.get('service'));
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Auto close modal after 10 seconds
    setTimeout(() => {
        closeModal();
    }, 10000);
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Reset form
function resetForm() {
    form.reset();
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    
    return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Get service display name
function getServiceName(serviceValue) {
    const serviceNames = {
        'checkup': 'General Checkup',
        'vaccination': 'Vaccination',
        'grooming': 'Grooming',
        'dental': 'Dental Care',
        'surgery': 'Surgery',
        'emergency': 'Emergency Care'
    };
    
    return serviceNames[serviceValue] || serviceValue;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for navigation links
function addSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Modal event listeners
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Pet type change handler - update breed suggestions
document.getElementById('petType').addEventListener('change', function() {
    const breedInput = document.getElementById('petBreed');
    const petType = this.value;
    
    if (petType === 'dog') {
        breedInput.placeholder = 'e.g., Golden Retriever, German Shepherd, Poodle';
    } else if (petType === 'cat') {
        breedInput.placeholder = 'e.g., Persian, Siamese, British Shorthair';
    } else {
        breedInput.placeholder = 'Enter breed';
    }
});

// Form field animations
function addFieldAnimations() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if field has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Initialize field animations
document.addEventListener('DOMContentLoaded', addFieldAnimations);

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .form-group.focused label {
        color: #667eea;
        transform: scale(0.9);
    }
`;
document.head.appendChild(style);

// Service time availability (simulate different availability for different services)
document.getElementById('service').addEventListener('change', function() {
    const timeSelect = document.getElementById('appointmentTime');
    const selectedService = this.value;
    
    // Clear existing options
    timeSelect.innerHTML = '<option value="">Select Time</option>';
    
    let availableTimes = [];
    
    if (selectedService === 'emergency') {
        availableTimes = ['09:00', '11:00', '14:00', '16:00', '17:00'];
    } else if (selectedService === 'surgery') {
        availableTimes = ['09:00', '10:00', '14:00', '15:00'];
    } else {
        availableTimes = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    }
    
    availableTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        const [hours, minutes] = time.split(':');
        const timeObj = new Date();
        timeObj.setHours(parseInt(hours), parseInt(minutes));
        
        option.textContent = timeObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        timeSelect.appendChild(option);
    });
});

// Prevent form submission on Enter key in input fields (except textarea)
form.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
        e.preventDefault();
    }
});

// Auto-resize textarea
const textarea = document.getElementById('symptoms');
textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});