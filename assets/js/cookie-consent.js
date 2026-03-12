/* ============================================
   SEOTJEK.DK - GDPR Cookie Consent Banner
   ============================================ */

(function() {
    'use strict';

    const CONSENT_KEY = 'seotjek_consent';
    const CONSENT_VERSION = '1';

    // Cookie banner configuration
    const CookieConsent = {
        // Check if user has already made a choice
        hasConsent: function() {
            const stored = localStorage.getItem(CONSENT_KEY);
            return stored !== null;
        },

        // Get user's consent choice
        getConsent: function() {
            const stored = localStorage.getItem(CONSENT_KEY);
            if (!stored) return null;
            try {
                return JSON.parse(stored);
            } catch (e) {
                return null;
            }
        },

        // Save user's consent choice
        saveConsent: function(choice) {
            localStorage.setItem(CONSENT_KEY, JSON.stringify({
                version: CONSENT_VERSION,
                analytics: choice.analytics,
                timestamp: new Date().toISOString()
            }));
        },

        // Initialize banner on page load
        init: function() {
            // Don't show if already has consent
            if (this.hasConsent()) {
                this.loadAnalyticsIfAllowed();
                return;
            }

            // Create and show banner
            this.showBanner();
        },

        // Create and inject banner HTML
        showBanner: function() {
            const banner = document.createElement('div');
            banner.id = 'seotjek-cookie-banner';
            banner.innerHTML = `
                <div style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999; background: linear-gradient(135deg, #0a0e14 0%, #141a23 100%); border-top: 1px solid #2a3142; padding: 1.5rem 2rem; box-shadow: 0 -4px 20px rgba(0,0,0,0.5);">
                    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: center;">
                        <div>
                            <h3 style="margin: 0 0 0.5rem 0; color: #ffffff; font-size: 1.125rem; font-weight: 600;">Vi bruger cookies</h3>
                            <p style="margin: 0; color: #a8b5c4; font-size: 0.95rem; line-height: 1.6;">
                                Vi bruger cookies til at analysere hjemmesidens brug og forbedre din oplevelse. Vi bruger <strong>aldrig</strong> cookies til markedsføring. 
                                <a href="/privatlivspolitik/" style="color: #00d9ff; text-decoration: none;">Læs vores privatlivspolitik</a>
                            </p>
                        </div>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-end;">
                            <button id="cookie-reject" style="padding: 0.75rem 1.5rem; border: 1px solid #2a3142; background: transparent; color: #00d9ff; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 150ms; font-family: 'Inter', sans-serif; font-size: 0.95rem;">
                                Afvis
                            </button>
                            <button id="cookie-accept" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #00d9ff 0%, #00a8cc 100%); color: #0a0e14; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 150ms; font-family: 'Inter', sans-serif; font-size: 0.95rem;">
                                Acceptér
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(banner);

            // Add event listeners
            document.getElementById('cookie-accept').addEventListener('click', () => {
                this.accept();
            });

            document.getElementById('cookie-reject').addEventListener('click', () => {
                this.reject();
            });

            // Add hover effects
            document.getElementById('cookie-accept').addEventListener('mouseover', (e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(0, 217, 255, 0.3)';
            });
            document.getElementById('cookie-accept').addEventListener('mouseout', (e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
            });

            document.getElementById('cookie-reject').addEventListener('mouseover', (e) => {
                e.target.style.borderColor = '#00d9ff';
                e.target.style.background = 'rgba(0, 217, 255, 0.1)';
            });
            document.getElementById('cookie-reject').addEventListener('mouseout', (e) => {
                e.target.style.borderColor = '#2a3142';
                e.target.style.background = 'transparent';
            });
        },

        // User accepted
        accept: function() {
            this.saveConsent({
                analytics: true
            });
            this.removeBanner();
            this.loadAnalytics();
        },

        // User rejected
        reject: function() {
            this.saveConsent({
                analytics: false
            });
            this.removeBanner();
        },

        // Remove banner from page
        removeBanner: function() {
            const banner = document.getElementById('seotjek-cookie-banner');
            if (banner) {
                banner.style.animation = 'slideDown 300ms ease-out';
                setTimeout(() => {
                    banner.remove();
                }, 300);
            }
        },

        // Load Google Analytics if consent given
        loadAnalyticsIfAllowed: function() {
            const consent = this.getConsent();
            if (consent && consent.analytics) {
                this.loadAnalytics();
            }
        },

        // Load Google Analytics script
        loadAnalytics: function() {
            if (window.gtag) return; // Already loaded

            // Google Analytics tag
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-C6ST7XTRB2', {
                'anonymize_ip': true,
                'allow_google_signals': false,
                'allow_ad_personalization_signals': false
            });

            // Load GA script
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
            document.head.appendChild(script);
        },

        // Revoke consent (user can call this to change settings)
        revokeConsent: function() {
            localStorage.removeItem(CONSENT_KEY);
            location.reload();
        }
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            CookieConsent.init();
        });
    } else {
        CookieConsent.init();
    }

    // Expose to global scope for manual control
    window.SeotjekCookies = CookieConsent;

})();

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(100%);
        }
    }

    #seotjek-cookie-banner {
        animation: slideUp 500ms ease-out;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(100%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        #seotjek-cookie-banner > div {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
        }

        #seotjek-cookie-banner button {
            width: 100%;
        }
    }
`;
document.head.appendChild(style);