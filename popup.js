document.addEventListener('DOMContentLoaded', () => {
    const listElement = document.getElementById('urlList');
    const countElement = document.getElementById('count');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');

    let scannedUrls = [];

    // Function to update the UI
    function displayUrls(urls) {
        scannedUrls = urls;
        listElement.innerHTML = '';
        countElement.textContent = `${urls.length} URLs found`;

        if (urls.length === 0) {
            listElement.innerHTML = '<li class="loading">No URLs found on this page.</li>';
            return;
        }

        urls.forEach(url => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = url;
            a.textContent = url;
            a.target = "_blank"; // Open in new tab
            li.appendChild(a);
            listElement.appendChild(li);
        });
    }

    // Function to get active tab and send message
    function scanPage() {
        listElement.innerHTML = '<li class="loading">Deep scanning page & resources...<br>(This may take a few seconds)</li>';

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            const activeTab = tabs[0];

            // Send message to content script
            chrome.tabs.sendMessage(activeTab.id, { action: "scrape_urls" }, (response) => {
                if (chrome.runtime.lastError) {
                    listElement.innerHTML = '<li class="loading">Cannot access page. Try refreshing or check if this is a system page.</li>';
                    console.error(chrome.runtime.lastError);
                } else if (response && response.urls) {
                    displayUrls(response.urls);
                } else {
                    listElement.innerHTML = '<li class="loading">No response from content script.</li>';
                }
            });
        });
    }

    // Initial Scan
    scanPage();

    // Copy to Clipboard
    copyBtn.addEventListener('click', () => {
        if (scannedUrls.length === 0) return;
        const textToCopy = scannedUrls.join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            copyBtn.textContent = 'Error';
        });
    });

    // Save as Text File
    saveBtn.addEventListener('click', () => {
        if (scannedUrls.length === 0) return;
        const blob = new Blob([scannedUrls.join('\r\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.href = url;
        a.download = `exported_urls_${timestamp}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
