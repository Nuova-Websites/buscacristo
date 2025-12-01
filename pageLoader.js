// Page Loader - Handles dynamic page content loading for static HTML pages
class PageLoader {
    constructor() {
        this.pageMetadata = null;
        this.init();
    }

    async init() {
        // Load page metadata
        // Use relative path - works for both root and subdirectory deployments
        const basePath = window.location.pathname.split('/').slice(0, -1).join('/') || '';
        const metadataPath = basePath ? `${basePath}/page-metadata.json` : 'page-metadata.json';
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

        // Update background image if needed
        const doctrinePage = document.querySelector('.doctrine-page');
        if (doctrinePage && metadata.background_image) {
            doctrinePage.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${metadata.background_image}')`;
        }

        // Update back button link
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            if (source === 'activities') {
                backButton.href = '/#activities';
            } else {
                backButton.href = '/#doctrine';
            }
        }

        // Update related links
        const relatedLinks = document.querySelectorAll('.related-link');
        if (relatedLinks.length > 0 && metadata.related_links) {
            relatedLinks.forEach((link, index) => {
                if (index < metadata.related_links.length) {
                    const linkData = metadata.related_links[index];
                    link.href = `/${source}/${linkData.url}`;
                    link.textContent = linkData.text;
                }
            });
        }

        // Update contact CTA link
        const contactCta = document.querySelector('.contact-cta-button');
        if (contactCta) {
            if (source === 'activities') {
                contactCta.href = `/#contact?activity=${metadata.page_key}`;
            } else {
                contactCta.href = '/#contact';
            }
        }
    }
}

// Initialize page loader
const pageLoader = new PageLoader();

