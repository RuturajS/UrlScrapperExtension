// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrape_urls") {
        deepScrape().then(urls => {
            sendResponse({ urls: urls });
        });
        return true; // Indicates we will respond asynchronously
    }
});

async function deepScrape() {
    const urlSet = new Set();
    const urlRegex = /(https?:\/\/[^\s"'<>\`\(\)]+)/g;

    // Helper to add found URLs to the set
    const addUrls = (text) => {
        if (!text) return;
        const matches = text.match(urlRegex);
        if (matches) {
            matches.forEach(url => {
                // Basic cleanup
                let cleanUrl = url.trim();
                // Remove trailing punctuation often captured by regex
                cleanUrl = cleanUrl.replace(/[.,;:]$/, '');
                if (!cleanUrl.startsWith('javascript:') && !cleanUrl.startsWith('mailto:')) {
                    urlSet.add(cleanUrl);
                }
            });
        }
    };

    // 1. Scan the current page HTML source
    console.log("Scanning page source...");
    addUrls(document.documentElement.innerHTML);

    // 2. Scan standard anchors (absolute resolution)
    console.log("Scanning anchor tags...");
    document.querySelectorAll('a[href]').forEach(a => {
        try {
            urlSet.add(new URL(a.href, document.baseURI).href);
        } catch (e) { }
    });

    // 3. Find external scripts and styles
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
    const resources = [...scripts, ...styles];

    // 4. Fetch and scan resources
    // We limit concurrency to avoid overwhelming the browser/network
    console.log(`Scanning ${resources.length} external resources...`);

    // Helper for fetching text
    const fetchResource = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) return null;
            return await response.text();
        } catch (err) {
            console.warn(`Failed to fetch ${url}:`, err);
            return null;
        }
    };

    const fetchPromises = resources.map(url => fetchResource(url).then(text => addUrls(text)));

    // Wait for all fetches (or at least try to)
    await Promise.all(fetchPromises);

    return Array.from(urlSet).sort();
}

