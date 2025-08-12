// Page management
const pages = {
    page1: document.getElementById('page1'),
    page2: document.getElementById('page2'),
    page3: document.getElementById('page3')
};

let currentPage = 'page1';

// Navigation functions
function showPage(pageId, direction = 'right') {
    const currentPageElement = pages[currentPage];
    const targetPageElement = pages[pageId];
    
    if (currentPage === pageId) return;
    
    // Add transition classes
    if (direction === 'right') {
        currentPageElement.classList.add('slide-out-left');
        targetPageElement.style.display = 'block';
        targetPageElement.classList.remove('active');
        
        setTimeout(() => {
            targetPageElement.classList.add('slide-in-right', 'active');
            currentPageElement.classList.remove('active', 'slide-out-left');
            currentPageElement.style.display = 'none';
        }, 50);
    } else {
        currentPageElement.classList.remove('active');
        currentPageElement.style.transform = 'translateX(100%)';
        currentPageElement.style.opacity = '0';
        
        targetPageElement.style.display = 'block';
        targetPageElement.style.transform = 'translateX(0)';
        targetPageElement.style.opacity = '1';
        targetPageElement.classList.add('active');
        
        setTimeout(() => {
            currentPageElement.style.display = 'none';
            currentPageElement.style.transform = '';
            currentPageElement.style.opacity = '';
        }, 300);
    }
    
    currentPage = pageId;
    
    // Update page title
    updatePageTitle(pageId);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function updatePageTitle(pageId) {
    const titles = {
        page1: 'Student Portal - Home',
        page2: 'Student Portal - Profile',
        page3: 'Student Portal - Personal Info'
    };
    document.title = titles[pageId] || 'Student Portal';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Profile button click (Page 1 -> Page 2)
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            showPage('page2', 'right');
        });
    }
    
    // Profile photo click (Page 2 -> Page 3)
    const profilePhoto = document.getElementById('profilePhoto');
    if (profilePhoto) {
        profilePhoto.addEventListener('click', function() {
            showPage('page3', 'right');
        });
    }
    
    // Back button clicks
    const backBtn1 = document.getElementById('backBtn1');
    if (backBtn1) {
        backBtn1.addEventListener('click', function() {
            showPage('page1', 'left');
        });
    }
    
    const backBtn2 = document.getElementById('backBtn2');
    if (backBtn2) {
        backBtn2.addEventListener('click', function() {
            showPage('page2', 'left');
        });
    }
    
    // Touch gestures for mobile
    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!isScrolling) {
            const deltaX = Math.abs(e.touches[0].clientX - startX);
            const deltaY = Math.abs(e.touches[0].clientY - startY);
            
            if (deltaY > deltaX) {
                isScrolling = true;
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;
        const threshold = 100;
        
        // Swipe right (go back)
        if (deltaX > threshold && Math.abs(deltaX) > Math.abs(e.changedTouches[0].clientY - startY)) {
            if (currentPage === 'page2') {
                showPage('page1', 'left');
            } else if (currentPage === 'page3') {
                showPage('page2', 'left');
            }
        }
        
        // Swipe left (go forward) - optional
        if (deltaX < -threshold && Math.abs(deltaX) > Math.abs(e.changedTouches[0].clientY - startY)) {
            if (currentPage === 'page1') {
                showPage('page2', 'right');
            } else if (currentPage === 'page2') {
                showPage('page3', 'right');
            }
        }
    }, { passive: true });
    
    // Add click handlers for setting items (optional functionality)
    const settingItems = document.querySelectorAll('.setting-item');
    settingItems.forEach(item => {
        item.addEventListener('click', function() {
            const settingName = this.querySelector('span').textContent;
            
            // Add haptic feedback for mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // You can add specific functionality for each setting here
            console.log(`${settingName} clicked`);
            
            // Example: Show alert for logout
            if (settingName === 'Logout') {
                if (confirm('Are you sure you want to logout?')) {
                    // Handle logout logic here
                    alert('Logout functionality would be implemented here');
                }
            }
        });
    });
    
    // Add click handlers for notice cards (optional)
    const noticeCards = document.querySelectorAll('.notice-card');
    noticeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
            
            // You can add notice detail view functionality here
            const noticeTitle = this.querySelector('h3').textContent;
            console.log(`Notice clicked: ${noticeTitle}`);
        });
    });
    
    // Handle browser back button
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            showPage(e.state.page, 'left');
        } else {
            showPage('page1', 'left');
        }
    });
    
    // Set initial state
    history.replaceState({ page: 'page1' }, '', '');
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// Utility functions
function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effects to interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('.notice-card, .setting-item, .profile-btn, .back-btn');
    interactiveElements.forEach(addRippleEffect);
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
}

// Add CSS for ripple effect
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);