# URL Scraper & Exporter Extension

A lightweight browser extension (Chrome, Edge, Brave, etc.) that scrapes all hyperlinks from the current web page and allows you to copy them to your clipboard or save them as a text file.

## Features

-   **One-Click Scraping**: Automatically grabs all URL links (`href` attributes) from the active tab.
-   **Clean UI**: Displays the unique URLs in a scrollable list.
-   **Copy to Clipboard**: detailed button to copy all found URLs instantly.
-   **Export to Text**: Save the list of URLs as a `.txt` file for later use.
-   **Privacy Focused**: Runs entirely locally in your browser. No data is sent to external servers.

## Installation

Since this extension is not yet in the Chrome Web Store, you need to load it manually (Developer Mode).

### Chrome / Edge / Brave

1.  **Clone or Download** this repository to your computer.
    ```bash
    git clone https://github.com/RuturajS/UrlScrapperExtension.git
    ```
2.  Open your browser and manage extensions:
    *   **Chrome**: Go to `chrome://extensions`
    *   **Edge**: Go to `edge://extensions`
3.  Enable **Developer mode** (toggle switch usually found in the top right or bottom left corner).
4.  Click the **Load unpacked** button.
5.  Select the **directory** where you cloned/downloaded this repository (the folder containing `manifest.json`).
6.  The extension should now appear in your toolbar.

## Usage

1.  Navigate to any website you want to scrape (e.g., `https://www.example.com`).
2.  **Refresh the page** if it was already open before installing the extension.
3.  Click the **URL Scraper** icon in your browser toolbar (you may need to click the puzzle piece icon to find it).
4.  The popup will open and list all the URLs found on the page.
5.  Click **Copy All** to put them in your clipboard, or **Save as .txt** to download a file.

## Technologies Used

-   **Manifest V3**: Using the latest Web Extensions standard.
-   **HTML/CSS**: Clean and responsive popup interface.
-   **JavaScript**: efficient DOM traversal and file handling.
