// Language Manager - Handles language switching and content updates
class LanguageManager {
    constructor() {
        this.currentLanguage = 'es'; // Default to Spanish
        this.supportedLanguages = ['es', 'en', 'ca', 'fr'];
        this.languageNames = {
            'es': 'Español',
            'en': 'English',
            'ca': 'Català',
            'fr': 'Français'
        };
        this.translations = {}; // Will store loaded translations
        this.loadingPromises = {}; // Cache for loading promises
        this.init();
    }

    async init() {
        // Check sessionStorage for saved language preference
        const savedLanguage = sessionStorage.getItem('selectedLanguage');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        }
        
        // Load default language first
        await this.loadLanguage(this.currentLanguage);
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updatePageContent();
                this.updateLanguageSelector();
            });
        } else {
            // DOM is already ready
            this.updatePageContent();
            this.updateLanguageSelector();
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    async loadLanguage(lang) {
        // Return cached promise if already loading
        if (this.loadingPromises[lang]) {
            return this.loadingPromises[lang];
        }

        // Return immediately if already loaded
        if (this.translations[lang]) {
            return Promise.resolve(this.translations[lang]);
        }

        // Create loading promise
        const loadPromise = fetch(`/translations/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${lang}.json`);
                }
                return response.json();
            })
            .then(data => {
                this.translations[lang] = data;
                return data;
            })
            .catch(error => {
                console.error(`Error loading language ${lang}:`, error);
                // Fallback to Spanish if available
                if (lang !== 'es' && this.translations['es']) {
                    return this.translations['es'];
                }
                throw error;
            });

        this.loadingPromises[lang] = loadPromise;
        return loadPromise;
    }

    async setLanguage(lang) {
        if (this.supportedLanguages.includes(lang)) {
            // Load language if not already loaded
            await this.loadLanguage(lang);
            
            this.currentLanguage = lang;
            sessionStorage.setItem('selectedLanguage', lang);
            document.documentElement.lang = lang;
            this.updatePageContent();
            this.updateLanguageSelector();
            
            // Dispatch custom event for other scripts to listen
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        if (!value) {
            // Fallback to Spanish if current language not loaded
            value = this.translations['es'];
            if (!value) {
                return key; // Return key if no translations loaded
            }
        }
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to Spanish if translation not found
                const fallbackValue = this.translations['es'];
                if (fallbackValue) {
                    value = fallbackValue;
                    for (const k2 of keys) {
                        if (value && typeof value === 'object' && k2 in value) {
                            value = value[k2];
                        } else {
                            return key; // Return key if translation not found
                        }
                    }
                } else {
                    return key;
                }
                break;
            }
        }
        
        return typeof value === 'string' ? value : key;
    }

    updatePageContent() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'text' || element.type === 'email' || element.type === 'tel' || element.type === 'search') {
                    // Don't update placeholder here, use data-i18n-placeholder instead
                    if (!element.hasAttribute('data-i18n-placeholder')) {
                        element.value = translation;
                    }
                } else {
                    element.value = translation;
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                // For buttons and links, update text content but preserve inner HTML structure
                const icon = element.querySelector('i');
                if (icon) {
                    element.innerHTML = icon.outerHTML + ' ' + translation;
                } else {
                    element.textContent = translation;
                }
            } else {
                element.textContent = translation;
            }
        });

        // Update title attribute translations
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.getTranslation(key);
        });

        // Update alt attribute translations
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            element.alt = this.getTranslation(key);
        });

        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.getTranslation(key);
        });
    }

    updateLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.value = this.currentLanguage;
        }
        
        const currentLangDisplay = document.querySelector('.current-language');
        if (currentLangDisplay) {
            currentLangDisplay.textContent = this.languageNames[this.currentLanguage];
        }
    }

    // Helper method to translate strings with placeholders
    translateWithPlaceholders(key, placeholders) {
        let translation = this.getTranslation(key);
        Object.keys(placeholders).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, placeholders[placeholder]);
        });
        return translation;
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Function to change language (called from HTML)
async function changeLanguage(lang) {
    await languageManager.setLanguage(lang);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}

