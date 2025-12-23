// Component Loader - Loads header and footer HTML files
(function() {
    // Determine base path based on current page location
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const isSubdirectory = pathParts.length > 1; // More than just the filename
    const basePath = isSubdirectory ? '../' : '';
    
    // Load header
    function loadHeader() {
        const headerPath = basePath + 'header.html';
        fetch(headerPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load header');
                }
                return response.text();
            })
            .then(html => {
                const headerContainer = document.getElementById('header-container');
                if (headerContainer) {
                    headerContainer.innerHTML = html;
                    
                    // Update paths in header for subdirectory pages
                    if (isSubdirectory) {
                        const headerLinks = headerContainer.querySelectorAll('a[href^="#"]');
                        headerLinks.forEach(link => {
                            const href = link.getAttribute('href');
                            if (href && href.startsWith('#')) {
                                link.setAttribute('href', basePath + href);
                            }
                        });
                        const headerImages = headerContainer.querySelectorAll('img[src]');
                        headerImages.forEach(img => {
                            const src = img.getAttribute('src');
                            if (src && !src.startsWith('http') && !src.startsWith('../') && !src.startsWith('/')) {
                                img.setAttribute('src', basePath + src);
                            }
                        });
                    }
                    
                    // Re-initialize language manager and other scripts
                    if (typeof languageManager !== 'undefined') {
                        languageManager.updatePageContent();
                        languageManager.updateLanguageSelector();
                    }
                    
                    // Re-initialize mobile menu - use the function from script.js if available
                    if (typeof initializeMobileMenu === 'function') {
                        setTimeout(initializeMobileMenu, 100);
                    } else {
                        // Fallback: initialize directly
                        const hamburger = headerContainer.querySelector('.hamburger');
                        const navMenu = headerContainer.querySelector('.nav-menu');
                        if (hamburger && navMenu) {
                            hamburger.addEventListener('click', () => {
                                hamburger.classList.toggle('active');
                                navMenu.classList.toggle('active');
                            });
                        }
                        
                        // Close mobile menu when clicking on a link
                        headerContainer.querySelectorAll('.nav-link').forEach(link => {
                            link.addEventListener('click', () => {
                                if (hamburger && navMenu) {
                                    hamburger.classList.remove('active');
                                    navMenu.classList.remove('active');
                                }
                            });
                        });
                    }
                    
                    // Initialize navbar scroll handler after header loads
                    setTimeout(() => {
                        const navbar = headerContainer.querySelector('.navbar');
                        if (navbar && typeof window.updateNavbarScrollState === 'function') {
                            window.updateNavbarScrollState();
                            // Trigger scroll to update state
                            window.dispatchEvent(new Event('scroll'));
                        }
                        // Also try to initialize scroll handler if not already done
                        if (typeof initializeScrollHandler === 'function' && !window.scrollHandlerInitialized) {
                            initializeScrollHandler();
                        }
                    }, 150);
                }
            })
            .catch(error => {
                console.error('Error loading header:', error);
                // Retry once after a short delay
                setTimeout(() => {
                    const headerContainer = document.getElementById('header-container');
                    if (headerContainer && !headerContainer.innerHTML.trim()) {
                        loadHeader();
                    }
                }, 500);
            });
    }
    
    // Load footer
    function loadFooter() {
        const footerPath = basePath + 'footer.html';
        fetch(footerPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load footer');
                }
                return response.text();
            })
            .then(html => {
                const footerContainer = document.getElementById('footer-container');
                if (footerContainer) {
                    footerContainer.innerHTML = html;
                    
                    // Update paths in footer for subdirectory pages
                    if (isSubdirectory) {
                        const footerLinks = footerContainer.querySelectorAll('a[href^="#"]');
                        footerLinks.forEach(link => {
                            const href = link.getAttribute('href');
                            if (href && href.startsWith('#')) {
                                link.setAttribute('href', basePath + href);
                            }
                        });
                    }
                    
                    // Re-initialize language manager
                    if (typeof languageManager !== 'undefined') {
                        languageManager.updatePageContent();
                        updateFooterResourceLinks();
                    } else {
                        // If languageManager not ready yet, try again after a short delay
                        setTimeout(() => {
                            if (typeof languageManager !== 'undefined') {
                                updateFooterResourceLinks();
                            }
                        }, 200);
                    }
                }
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // Retry once after a short delay
                setTimeout(() => {
                    const footerContainer = document.getElementById('footer-container');
                    if (footerContainer && !footerContainer.innerHTML.trim()) {
                        loadFooter();
                    }
                }, 500);
            });
    }
    
    // Update footer Resources links based on current language
    function updateFooterResourceLinks() {
        if (typeof languageManager === 'undefined') return;
        
        const currentLang = languageManager.getCurrentLanguage();
        // Map our language codes to church website language codes
        // For Catalan, most pages redirect to Spanish, but Scriptures has Catalan support
        const langMap = {
            'en': 'eng',
            'es': 'spa',
            'ca': 'spa', // Catalan redirects to Spanish for most pages
            'fr': 'fra'
        };
        const scripturesLangMap = {
            'en': 'eng',
            'es': 'spa',
            'ca': 'cat', // Scriptures has Catalan support
            'fr': 'fra'
        };
        const churchLangCode = langMap[currentLang] || 'eng'; // Default to English
        const scripturesLangCode = scripturesLangMap[currentLang] || 'eng'; // Default to English
        
        // Update Church Website link
        const churchWebsiteLink = document.getElementById('footer-church-website-link');
        if (churchWebsiteLink) {
            churchWebsiteLink.href = `https://www.churchofjesuschrist.org?lang=${churchLangCode}`;
        }
        
        // Update Scriptures link (uses different map for Catalan)
        const scripturesLink = document.getElementById('footer-scriptures-link');
        if (scripturesLink) {
            scripturesLink.href = `https://www.churchofjesuschrist.org/study/scriptures?lang=${scripturesLangCode}`;
        }
        
        // Update Temples link
        const templesLink = document.getElementById('footer-temples-link');
        if (templesLink) {
            templesLink.href = `https://www.churchofjesuschrist.org/temples?lang=${churchLangCode}`;
        }
        
        // Update Locations link
        const locationsLink = document.getElementById('footer-locations-link');
        if (locationsLink) {
            locationsLink.href = `https://www.churchofjesuschrist.org/welcome/find-a-church?lang=${churchLangCode}`;
        }
        
        // Update Missionary "Learn More Online" link
        const missionaryLearnLink = document.getElementById('missionary-learn-more-link');
        if (missionaryLearnLink) {
            missionaryLearnLink.href = `https://www.churchofjesuschrist.org/comeuntochrist?lang=${churchLangCode}`;
        }
    }
    
    // Listen for language changes to update the links
    window.addEventListener('languageChanged', function() {
        updateFooterResourceLinks();
    });
    
    // Also update links when DOM is ready (for links in main page, not just footer)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(updateFooterResourceLinks, 300);
        });
    } else {
        setTimeout(updateFooterResourceLinks, 300);
    }
    
    // Load components when DOM is ready
    function initializeComponents() {
        loadHeader();
        loadFooter();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        // DOM already loaded, but wait a bit to ensure everything is ready
        setTimeout(initializeComponents, 0);
    }
    
    // Also reload components on page show (handles back/forward navigation and page loads)
    window.addEventListener('pageshow', function(event) {
        // Check if components are missing and reload them
        const headerContainer = document.getElementById('header-container');
        const footerContainer = document.getElementById('footer-container');
        if (headerContainer && !headerContainer.innerHTML.trim()) {
            loadHeader();
        }
        if (footerContainer && !footerContainer.innerHTML.trim()) {
            loadFooter();
        }
    });
    
    // Check and reload components after a short delay (handles navigation from other pages)
    setTimeout(function() {
        const headerContainer = document.getElementById('header-container');
        const footerContainer = document.getElementById('footer-container');
        if (headerContainer && !headerContainer.innerHTML.trim()) {
            loadHeader();
        }
        if (footerContainer && !footerContainer.innerHTML.trim()) {
            loadFooter();
        }
    }, 100);
})();

