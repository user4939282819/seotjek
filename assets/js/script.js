/* ============================================
   SEOTJEK.DK - Shared JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeAccordions();
    initializeScrollAnimations();
    initializeFormHandling();
    initializeCopyButtons();
});

/* ============================================
   NAVIGATION
   ============================================ */

function initializeNavigation() {
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

/* ============================================
   ACCORDIONS (FAQ, COLLAPSIBLE CONTENT)
   ============================================ */

function initializeAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                toggleAccordion(item);
            });

            // Allow keyboard navigation
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAccordion(item);
                }
            });
        }
    });
}

function toggleAccordion(item) {
    const isActive = item.classList.contains('active');
    
    // Close all other items
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(i => {
        if (i !== item) {
            i.classList.remove('active');
        }
    });
    
    // Toggle current item
    item.classList.toggle('active');
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation classes based on data attribute
                const animation = entry.target.dataset.animation || 'slideInUp';
                entry.target.classList.add('animate-' + animation);
                
                // Optional: only animate once
                if (entry.target.dataset.animateOnce === 'true') {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('[data-animation]').forEach(element => {
        observer.observe(element);
    });
}

/* ============================================
   FORM HANDLING
   ============================================ */

function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="animate-spin">⟳</span> Sender...';
            
            try {
                // Simulate form submission (replace with actual API endpoint)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                submitBtn.innerHTML = '✓ Sent!';
                submitBtn.classList.add('btn-success');
                form.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-success');
                }, 3000);
                
            } catch (error) {
                submitBtn.innerHTML = '✕ Fejl';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });
}

/* ============================================
   COPY TO CLIPBOARD
   ============================================ */

function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const text = button.dataset.copy;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Kopieret!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        });
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Smooth scroll to element
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   SEO CHECKER FUNCTIONALITY
   ============================================ */

function checkSEO(domain) {
    return new Promise((resolve) => {
        // Normalize domain
        let url = domain.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // Validate domain
        try {
            new URL(url);
        } catch {
            resolve(null);
            return;
        }

        // Simulate analysis (in production, call backend API)
        setTimeout(() => {
            const scores = {
                mobile: 60 + Math.random() * 40,
                meta: 50 + Math.random() * 50,
                heading: 65 + Math.random() * 35,
                speed: 40 + Math.random() * 60,
                ssl: Math.random() > 0.3 ? 100 : 0,
                schema: 30 + Math.random() * 70,
            };

            const totalScore = Math.round(
                (scores.mobile + scores.meta + scores.heading + scores.speed + scores.ssl + scores.schema) / 6
            );

            resolve({
                domain: url,
                totalScore,
                ...scores
            });
        }, 1500);
    });
}

/* ============================================
   ANALYTICS TRACKING (Google Analytics compatible)
   ============================================ */

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

lazyLoadImages();

/* ============================================
   ACCESSIBILITY HELPERS
   ============================================ */

// Skip to main content link
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && e.ctrlKey) {
        const main = document.querySelector('main');
        if (main) {
            main.focus();
            main.scrollIntoView();
        }
    }
});

// Announce dynamic content changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = message;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

/* ============================================
   EXPORT FOR USE IN OTHER MODULES
   ============================================ */

window.seotjek = {
    scrollToElement,
    isInViewport,
    debounce,
    throttle,
    checkSEO,
    trackEvent,
    toggleAccordion,
    announceToScreenReader,
    lazyLoadImages
};