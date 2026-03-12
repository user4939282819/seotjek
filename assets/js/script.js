/* SEOTJEK.DK - Core JavaScript */

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Intersection Observer for lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
});

// Observe all lazy images
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
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

// ============================================
// FAQ ACCORDION
// ============================================

document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all other items
    document.querySelectorAll('.faq-item').forEach(other => {
      other.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// ============================================
// NAVIGATION ACTIVE STATE
// ============================================

const setActiveNavLink = () => {
  const currentPath = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || currentPath.startsWith(href.replace(/\/$/, ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

setActiveNavLink();
window.addEventListener('load', setActiveNavLink);

// ============================================
// ANIMATIONS ON SCROLL
// ============================================

const animateOnScroll = () => {
  const elements = document.querySelectorAll('.card, .stat, .faq-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
  animateOnScroll();
}

// ============================================
// GOOGLE ANALYTICS (WITH CONSENT)
// ============================================

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Check for cookie consent before loading GA
const checkGAConsent = () => {
  const consent = localStorage.getItem('seo-tjek-analytics');
  if (consent === 'accepted') {
    gtag('config', 'G-C6ST7XTRB2', {
      'anonymize_ip': true,
      'allow_google_signals': false,
      'allow_ad_personalization_signals': false
    });
  }
};

// Defer GA check until after page load
window.addEventListener('load', checkGAConsent);

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Core Web Vitals tracking
if ('web-vital' in window) {
  const {onCLS, onFID, onFCP, onLCP, onTTFB} = window['web-vital'];
  
  onCLS(metric => {
    console.log('CLS:', metric.value);
  });
  
  onFID(metric => {
    console.log('FID:', metric.value);
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get URL parameters
const getUrlParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Track CTA clicks
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.gtag) {
      gtag('event', 'click', {
        'event_category': 'cta',
        'event_label': btn.textContent
      });
    }
  });
});

// ============================================
// REFERRAL TRACKING
// ============================================

const trackReferral = () => {
  const ref = getUrlParam('ref');
  if (ref) {
    localStorage.setItem('seo-tjek-referral', ref);
    if (window.gtag) {
      gtag('event', 'page_view', {
        'referral_source': ref
      });
    }
  }
};

trackReferral();
