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
                    
                    // Re-initialize mobile menu
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
            })
            .catch(error => {
                console.error('Error loading header:', error);
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
                    }
                }
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
    }
    
    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadHeader();
            loadFooter();
        });
    } else {
        loadHeader();
        loadFooter();
    }
})();

