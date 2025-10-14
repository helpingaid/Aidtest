// ==========================================
// KINDORYA - COOKIE CONSENT SYSTEM
// GDPR Compliant Cookie Management
// ==========================================

const CookieConsent = {
    // Configurazione
    config: {
        cookieName: 'kindorya_cookie_consent',
        cookieExpireDays: 365,
        
        // Default preferences
        defaultPreferences: {
            necessary: true,    // Sempre true
            analytics: false,
            marketing: false,
            functional: false,
            timestamp: null
        }
    },

    // Elementi DOM
    elements: {
        overlay: null,
        banner: null,
        settingsModal: null,
        privacyModal: null,
        settingsLink: null
    },

    // Inizializzazione
    init: function() {
        console.log('🍪 Initializing Cookie Consent System...');
        
        // Carica elementi DOM
        this.elements.overlay = document.getElementById('cookie-overlay');
        this.elements.banner = document.getElementById('cookie-consent-banner');
        this.elements.settingsModal = document.getElementById('cookie-settings-modal');
        this.elements.privacyModal = document.getElementById('privacy-policy-modal');
        this.elements.settingsLink = document.getElementById('cookie-settings-link');

        // Controlla se l'utente ha già dato il consenso
        const savedConsent = this.getConsent();
        
        if (!savedConsent) {
            // Prima visita - mostra banner
            this.showBanner();
        } else {
            console.log('✅ Consent already given:', savedConsent);
            this.applyConsent(savedConsent);
        }

        // Event listeners
        this.attachEventListeners();
    },

    // Mostra il banner
    showBanner: function() {
        this.elements.overlay.classList.add('active');
        this.elements.banner.classList.add('active');
    },

    // Nascondi il banner
    hideBanner: function() {
        this.elements.overlay.classList.remove('active');
        this.elements.banner.classList.remove('active');
    },

    // Mostra modal settings
    showSettingsModal: function() {
        this.elements.overlay.classList.add('active');
        this.elements.settingsModal.classList.add('active');
        
        // Carica preferenze salvate
        const saved = this.getConsent();
        if (saved) {
            document.getElementById('analytics-cookies').checked = saved.analytics;
            document.getElementById('marketing-cookies').checked = saved.marketing;
            document.getElementById('functional-cookies').checked = saved.functional;
        }
    },

    // Nascondi modal settings
    hideSettingsModal: function() {
        this.elements.overlay.classList.remove('active');
        this.elements.settingsModal.classList.remove('active');
    },

    // Mostra modal privacy
    showPrivacyModal: function() {
        this.elements.overlay.classList.add('active');
        this.elements.privacyModal.classList.add('active');
    },

    // Nascondi modal privacy
    hidePrivacyModal: function() {
        this.elements.overlay.classList.remove('active');
        this.elements.privacyModal.classList.remove('active');
    },

    // Salva consenso
    saveConsent: function(preferences) {
        preferences.timestamp = new Date().toISOString();
        const consentString = JSON.stringify(preferences);
        
        // Salva in cookie
        const expires = new Date();
        expires.setTime(expires.getTime() + (this.config.cookieExpireDays * 24 * 60 * 60 * 1000));
        document.cookie = `${this.config.cookieName}=${consentString};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        
        console.log('✅ Consent saved:', preferences);
        
        // Applica il consenso
        this.applyConsent(preferences);
    },

    // Ottieni consenso salvato
    getConsent: function() {
        const name = this.config.cookieName + "=";
        const cookies = document.cookie.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(name) === 0) {
                const consentString = cookie.substring(name.length);
                try {
                    return JSON.parse(consentString);
                } catch (e) {
                    console.error('Error parsing consent:', e);
                    return null;
                }
            }
        }
        return null;
    },

    // Applica il consenso (carica script esterni)
    applyConsent: function(preferences) {
        console.log('🔧 Applying consent preferences...');

        // Google Analytics
        if (preferences.analytics) {
            console.log('✅ Loading Google Analytics...');
            this.loadGoogleAnalytics();
        } else {
            console.log('❌ Google Analytics disabled');
        }

        // Google AdSense
        if (preferences.marketing) {
            console.log('✅ Loading Google AdSense...');
            this.loadGoogleAdSense();
        } else {
            console.log('❌ Google AdSense disabled');
        }

        // Functional (search counter, etc)
        if (preferences.functional) {
            console.log('✅ Functional cookies enabled');
        } else {
            console.log('❌ Functional cookies disabled');
        }
    },

    // Carica Google Analytics
    loadGoogleAnalytics: function() {
        if (window.gtag) {
            console.log('Google Analytics already loaded');
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-TP3S3CX0L4';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-TP3S3CX0L4', {
            'anonymize_ip': true
        });
        
        window.gtag = gtag;
    },

    // Carica Google AdSense
    loadGoogleAdSense: function() {
        if (document.querySelector('script[src*="adsbygoogle"]')) {
            console.log('Google AdSense already loaded');
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3825054531176545';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    },

    // Event listeners
    attachEventListeners: function() {
        const self = this;

        // Accept All
        document.getElementById('accept-all-btn').addEventListener('click', function() {
            const preferences = {
                necessary: true,
                analytics: true,
                marketing: true,
                functional: true
            };
            self.saveConsent(preferences);
            self.hideBanner();
        });

        // Reject All
        document.getElementById('reject-all-btn').addEventListener('click', function() {
            const preferences = {
                necessary: true,
                analytics: false,
                marketing: false,
                functional: false
            };
            self.saveConsent(preferences);
            self.hideBanner();
        });

        // Open Settings from banner
        document.getElementById('settings-btn').addEventListener('click', function() {
            self.hideBanner();
            self.showSettingsModal();
        });

        // Close settings modal
        document.getElementById('close-settings-modal').addEventListener('click', function() {
            self.hideSettingsModal();
        });

        // Save preferences from modal
        document.getElementById('save-preferences-btn').addEventListener('click', function() {
            const preferences = {
                necessary: true,
                analytics: document.getElementById('analytics-cookies').checked,
                marketing: document.getElementById('marketing-cookies').checked,
                functional: document.getElementById('functional-cookies').checked
            };
            self.saveConsent(preferences);
            self.hideSettingsModal();
        });

        // Reject from modal
        document.getElementById('reject-selected-btn').addEventListener('click', function() {
            const preferences = {
                necessary: true,
                analytics: false,
                marketing: false,
                functional: false
            };
            self.saveConsent(preferences);
            self.hideSettingsModal();
        });

        // Open Privacy Policy
        document.getElementById('open-privacy-link').addEventListener('click', function() {
            self.showPrivacyModal();
        });

        // Close Privacy Modal
        document.getElementById('close-privacy-modal').addEventListener('click', function() {
            self.hidePrivacyModal();
        });

        // Cookie Settings Link (always visible)
        this.elements.settingsLink.addEventListener('click', function() {
            self.showSettingsModal();
        });

        // Chiudi modals cliccando sull'overlay
        this.elements.overlay.addEventListener('click', function() {
            self.hideBanner();
            self.hideSettingsModal();
            self.hidePrivacyModal();
        });

        // Previeni chiusura quando si clicca dentro i modals
        this.elements.banner.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        this.elements.settingsModal.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        this.elements.privacyModal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
};

// Avvia il sistema al caricamento della pagina
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        CookieConsent.init();
    });
} else {
    CookieConsent.init();
}