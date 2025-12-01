// Page Loader - Handles dynamic page content loading for static HTML pages
class PageLoader {
    constructor() {
        this.pageMetadata = null;
        this.init();
    }

    async init() {
        // Load page metadata
        // Use relative path - works for both root and subdirectory deployments
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const isSubdirectory = pathParts.length > 1; // More than just the filename
        const metadataPath = isSubdirectory ? '../page-metadata.json' : 'page-metadata.json';
        try {
            const response = await fetch(metadataPath);
            if (response.ok) {
                this.pageMetadata = await response.json();
            }
        } catch (error) {
            console.error('Error loading page metadata:', error);
        }

        // Update page content if on a content page
        if (this.isContentPage()) {
            this.updatePageContent();
        }
    }

    isContentPage() {
        const path = window.location.pathname;
        return path.includes('/doctrine/') || path.includes('/activities/');
    }

    getPageKey() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        return filename;
    }

    getPageSource() {
        const path = window.location.pathname;
        if (path.includes('/activities/')) {
            return 'activities';
        } else if (path.includes('/doctrine/')) {
            return 'doctrine';
        }
        return null;
    }

    updatePageContent() {
        if (!this.pageMetadata) return;

        const source = this.getPageSource();
        const pageKey = this.getPageKey();

        if (!source || !pageKey) return;

        const metadata = this.pageMetadata[source]?.[pageKey];
        if (!metadata) return;

        // Determine base path for relative links
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const isSubdirectory = pathParts.length > 1;
        const basePath = isSubdirectory ? '../' : '';

        // Don't update background image - it's already correctly set in the HTML
        // The background image is set inline in the HTML with the correct relative path

        // Update back button link - use relative path
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            if (source === 'activities') {
                backButton.href = basePath + '#activities';
            } else {
                backButton.href = basePath + '#doctrine';
            }
        }

        // Update related links - use relative paths
        const relatedLinks = document.querySelectorAll('.related-link');
        if (relatedLinks.length > 0 && metadata.related_links) {
            relatedLinks.forEach((link, index) => {
                if (index < metadata.related_links.length) {
                    const linkData = metadata.related_links[index];
                    link.href = basePath + `${source}/${linkData.url}`;
                    link.textContent = linkData.text;
                }
            });
        }

        // Update contact CTA link - use relative path
        const contactCta = document.querySelector('.contact-cta-button');
        if (contactCta) {
            if (source === 'activities') {
                contactCta.href = basePath + `#contact?activity=${metadata.page_key}`;
            } else {
                contactCta.href = basePath + '#contact';
            }
        }
    }
}

// Initialize page loader
const pageLoader = new PageLoader();

