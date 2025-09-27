// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

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

// Navbar background change on scroll - removed duplicate handler

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add CSS animations for notifications
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
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.activity-card, .location-card, .doctrine-text, .contact-info');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Add loading state to buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    button.style.opacity = '0.7';
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    };
}

// Enhanced form submission with loading state
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const resetLoading = addLoadingState(submitButton, 'Sending...');
        
        // Simulate API call
        setTimeout(() => {
            resetLoading();
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            this.reset();
        }, 2000);
    });
}

// Add scroll-to-top functionality
const scrollToTopButton = document.createElement('button');
scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopButton.className = 'scroll-to-top';
scrollToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #1A4B5C, #2C5F5F);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollToTopButton);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopButton.style.opacity = '1';
        scrollToTopButton.style.visibility = 'visible';
    } else {
        scrollToTopButton.style.opacity = '0';
        scrollToTopButton.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll to top button
scrollToTopButton.addEventListener('mouseenter', () => {
    scrollToTopButton.style.transform = 'translateY(-2px)';
    scrollToTopButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
});

scrollToTopButton.addEventListener('mouseleave', () => {
    scrollToTopButton.style.transform = 'translateY(0)';
    scrollToTopButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add focus management for mobile menu
hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        // Focus first menu item when opening
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            firstLink.focus();
        }
    }
});

// Add ARIA attributes for accessibility
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA attributes to hamburger menu
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    
    navMenu.setAttribute('aria-label', 'Main navigation');
    
    // Update ARIA expanded state
    hamburger.addEventListener('click', () => {
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded.toString());
    });
    
    // Add ARIA labels to form inputs
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach((input, index) => {
        const labels = ['Name', 'Email', 'Message'];
        input.setAttribute('aria-label', labels[index] || 'Form input');
    });
    
    // Debug image loading
    const hero = document.querySelector('.hero');
    if (hero) {
        const img = new Image();
        img.onload = function() {
            console.log('Hero background image loaded successfully');
        };
        img.onerror = function() {
            console.log('Hero background image failed to load');
            // Try alternative path
            hero.style.background = 'url("/images/creencia-bautismo.jpeg")';
        };
        img.src = '/images/creencia-bautismo.jpeg';
    }
});

// Activity Modal Functions
function showActivityDetails(activityType) {
    const modal = document.getElementById('activityModal');
    const modalTitle = document.getElementById('modalTitle');
    const activityDetails = document.getElementById('activityDetails');
    
    const activityData = {
        worship: {
            title: 'Worship Services',
            description: 'Join us for our weekly worship services and special devotional meetings.',
            activities: [
                'Sunday Sacrament Meeting - 9:00 AM',
                'Sunday School Classes - 10:10 AM',
                'Priesthood/Relief Society - 11:00 AM',
                'Fast Sunday Testimony Meeting - First Sunday of each month',
                'Special Devotionals - Various times throughout the year'
            ]
        },
        youth: {
            title: 'Youth Programs',
            description: 'Engaging activities and programs designed specifically for youth ages 12-18.',
            activities: [
                'Young Men/Young Women Activities - Wednesday evenings',
                'Youth Conferences - Quarterly',
                'Summer Camps - Annual',
                'Service Projects - Monthly',
                'Dances and Social Activities - Bi-monthly'
            ]
        },
        family: {
            title: 'Family Activities',
            description: 'Programs and activities that bring families together in faith and fellowship.',
            activities: [
                'Family Home Evening - Monday evenings',
                'Family History Activities - Saturday mornings',
                'Family Service Projects - Monthly',
                'Family Dinners and Socials - Quarterly',
                'Family Temple Trips - Monthly'
            ]
        },
        education: {
            title: 'Religious Education',
            description: 'Learn and grow in your understanding of the gospel through various educational opportunities.',
            activities: [
                'Sunday School Classes - All ages',
                'Institute Classes - Young adults',
                'Seminary - High school students',
                'Gospel Doctrine Classes - Adults',
                'Scripture Study Groups - Weekly'
            ]
        },
        service: {
            title: 'Service Projects',
            description: 'Opportunities to serve others and make a positive impact in our community.',
            activities: [
                'Community Clean-up Projects - Monthly',
                'Food Bank Volunteering - Weekly',
                'Humanitarian Aid Projects - Quarterly',
                'Visiting the Sick and Elderly - Ongoing',
                'Emergency Response Service - As needed'
            ]
        },
        temple: {
            title: 'Temple Activities',
            description: 'Sacred ordinances and activities that strengthen families and individuals.',
            activities: [
                'Temple Worship Sessions - Daily',
                'Family History Research - Daily',
                'Temple Preparation Classes - Monthly',
                'Temple Open Houses - Special events',
                'Temple Dedication Services - Special events'
            ]
        }
    };
    
    const data = activityData[activityType];
    if (data) {
        modalTitle.textContent = data.title;
        activityDetails.innerHTML = `
            <div class="activity-description">
                <p>${data.description}</p>
            </div>
            <div class="activity-list">
                <h4>Available Activities:</h4>
                <ul>
                    ${data.activities.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
            </div>
        `;
        modal.style.display = 'block';
    }
}

function closeActivityModal() {
    const modal = document.getElementById('activityModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('activityModal');
    if (event.target === modal) {
        closeActivityModal();
    }
});

// Location Finder Functions
function findNearestChurch() {
    const locationInput = document.getElementById('locationInput');
    const locationResults = document.getElementById('locationResults');
    const searchTerm = locationInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        showNotification('Please enter a location to search.', 'error');
        return;
    }
    
    // Simulate location search
    const locations = [
        { name: 'Main Chapel', address: '123 Faith Street, Barcelona', distance: '0.5 miles' },
        { name: 'North Building', address: '456 Hope Avenue, Barcelona', distance: '1.2 miles' },
        { name: 'East Building', address: '789 Charity Road, Barcelona', distance: '2.1 miles' },
        { name: 'South Building', address: '321 Grace Boulevard, Barcelona', distance: '1.8 miles' }
    ];
    
    // Filter locations based on search term
    const filteredLocations = locations.filter(location => 
        location.name.toLowerCase().includes(searchTerm) || 
        location.address.toLowerCase().includes(searchTerm)
    );
    
    if (filteredLocations.length > 0) {
        locationResults.innerHTML = `
            <h4>Churches near "${searchTerm}":</h4>
            ${filteredLocations.map(location => `
                <div class="location-result">
                    <h5>${location.name}</h5>
                    <p>${location.address}</p>
                    <p class="distance">Distance: ${location.distance}</p>
                    <button class="btn btn-primary" onclick="getDirections('${location.address}')">Get Directions</button>
                </div>
            `).join('')}
        `;
        locationResults.style.display = 'block';
    } else {
        locationResults.innerHTML = `
            <p>No churches found near "${searchTerm}". Please try a different location or check all locations below.</p>
        `;
        locationResults.style.display = 'block';
    }
}

function getDirections(address) {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
}

// Location Functions
function useMyLocation() {
    if (navigator.geolocation) {
        const locationInput = document.getElementById('locationInput');
        const button = event.target;
        const originalText = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
        button.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Use reverse geocoding to get address
                const geocoder = new google.maps.Geocoder();
                const latlng = { lat: lat, lng: lng };
                
                geocoder.geocode({ location: latlng }, function(results, status) {
                    if (status === 'OK' && results[0]) {
                        const address = results[0].formatted_address;
                        locationInput.value = address;
                        
                        // Automatically search for churches
                        findNearestChurch();
                        
                        showNotification('Location found! Searching for nearby churches...', 'success');
                    } else {
                        // Fallback to coordinates
                        locationInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                        findNearestChurch();
                        showNotification('Location found! Searching for nearby churches...', 'success');
                    }
                    
                    // Reset button
                    button.innerHTML = originalText;
                    button.disabled = false;
                });
            },
            function(error) {
                let errorMessage = 'Unable to get your location. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                showNotification(errorMessage, 'error');
                
                // Reset button
                button.innerHTML = originalText;
                button.disabled = false;
            }
        );
    } else {
        showNotification('Geolocation is not supported by this browser.', 'error');
    }
}

// Map Functions

function showMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const mapsUrl = `https://www.google.com/maps/@${lat},${lng},15z`;
                window.open(mapsUrl, '_blank');
            },
            function(error) {
                showNotification('Unable to get your location. Please try again or use the search bar.', 'error');
            }
        );
    } else {
        showNotification('Geolocation is not supported by this browser.', 'error');
    }
}

function openInMaps() {
    const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Barcelona,Spain';
    window.open(mapsUrl, '_blank');
}

// Location Info Form Handling
const locationInfoForm = document.getElementById('locationInfoForm');
if (locationInfoForm) {
    locationInfoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const preferredLocation = formData.get('preferredLocation');
        const interests = formData.getAll('interests');
        const message = formData.get('message');
        
        // Basic validation
        if (!firstName || !lastName || !email || !preferredLocation) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you! We will send you location-specific information within 24 hours.', 'success');
        this.reset();
        closeActivityModal();
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    
    // Get the height of the hero section to determine when navbar should change color
    const heroHeight = heroSection ? heroSection.offsetHeight : 600;
    
    if (window.scrollY > heroHeight - 70) { // 70px is navbar height
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (window.scrollY > 300) {
        scrollToTopButton.style.opacity = '1';
        scrollToTopButton.style.visibility = 'visible';
    } else {
        scrollToTopButton.style.opacity = '0';
        scrollToTopButton.style.visibility = 'hidden';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);
