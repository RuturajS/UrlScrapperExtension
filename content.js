// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrape_urls") {
        const urls = scrapeUrls();
        sendResponse({ urls: urls });
    }
});

function scrapeUrls() {
    // Select all anchor tags
    const anchors = document.querySelectorAll('a[href]');
    const urlSet = new Set();

    anchors.forEach(a => {
        try {
            // Clean and normalize the URL
            const url = new URL(a.href, document.baseURI).href;
            // Filter out empty, js, mailto, tel links if desired, but user asked for "all urls"
            // We will filter out javascript: and mailto: as they aren't typically what "scrapers" want,
            // but we'll include everything else to be safe.
            if (!url.startsWith('javascript:') && !url.startsWith('mailto:')) {
                 urlSet.add(url);
            }
        } catch (e) {
            // Ignore invalid URLs
        }
    });

    return Array.from(urlSet);
}
