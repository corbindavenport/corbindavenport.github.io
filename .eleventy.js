
const Parser = require("rss-parser");
const parser = new Parser({
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36" },
    timeout: 5000,
});
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Eleventy configuration
module.exports = function (eleventyConfig) {
    // Add favicon to site
    eleventyConfig.addPassthroughCopy("favicon.ico");
    // Add robots.txt to site
    eleventyConfig.addPassthroughCopy("robots.txt");
    // Add media folder to site
    eleventyConfig.addPassthroughCopy("media");
    // Download button shortcode
    eleventyConfig.addShortcode("imgBtn", function (platform, url) {
        var html = '';
        if (platform === 'chrome') {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/chrome-btn.png" alt="Download on Chrome Web Store" /></a>`;
        } else if (platform === 'firefox') {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/firefox-btn.png" alt="Download for Firefox" /></a>`;
        } else if (platform === 'edge') {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/microsoft-btn.png" alt="Download for Microsoft Edge" /></a>`;
        } else if (platform === "spotify") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/spotify-btn.png" alt="Listen on Spotify" /></a>`;
        } else if (platform === "youtube") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/youtube-btn.png" alt="Available on YouTube" /></a>`;
        } else if (platform === "youtube-music") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/youtube-music-btn.png" alt="Listen on YouTube Music" /></a>`;
        } else if (platform === "pocket-casts") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/pocket-casts-btn.png" alt="Listen on Pocket Casts" /></a>`;
        } else if (platform === "apple-podcasts") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/apple-podcasts-btn.png" alt="Listen on Apple Podcasts" /></a>`;
        } else if (platform === "amazon-music") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/amazon-music-btn.png" alt="Listen on Amazon Music" /></a>`;
        } else if (platform === "rss") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/rss-btn.png" alt="Get the RSS feed" /></a>`;
        }
        return html;
    });
    // RSS feed shortcode
    eleventyConfig.addShortcode("rssFeed", async function (url, showDescription = true, maxLength = 5) {
        try {
            let html = '';
            let feed = await parser.parseURL(url);
            // console.log('Parsed feed:', feed);
            for (let i = 0; i < Math.min(feed.items.length, maxLength); i++) {
                let item = feed.items[i];
                let title = item.title;
                let description = item?.contentSnippet;
                // Return generated snippet
                html += `\n<h4 style="margin-bottom: 0"><a href="${item.link}" target="_blank" rel="nofollow">${title}</a></h4>`;
                if (description && showDescription) {
                    // Cut description off at first line break
                    description = description.split('\n', 1)[0];
                    // Shorten description further if needed
                    if (description && (description.length > 230)) {
                        description = description.substring(0, 230) + '...';
                    }
                    html += `\n<i>${description}</i>`;
                }
                if (item?.enclosure?.type && item?.enclosure?.type && item?.enclosure?.url) {
                    html += `\n<audio preload="none" controls><source src="${item.enclosure.url}" type="${item.enclosure.type}"></audio><br />`;
                }
            }
            return html;
        } catch (e) {
            console.error(`Error parsing RSS feed at ${url}:`, e);
            return 'There was an error loading these feed items.';
        }
    });
    // Flickr shortcode
    eleventyConfig.addShortcode("flickr", async function (url) {
        try {
            let html = '<div class="flickr-container">';
            const regex = /<img src="(https:\/\/live\.staticflickr\.com\/\d+\/\d+_[a-zA-Z0-9]+_m\.jpg)"/;
            let feed = await parser.parseURL('https://www.flickr.com/services/feeds/photos_public.gne?id=199183592@N06&lang=en-us&format=rss');
            // console.log('Parsed feed:', feed);
            for (let i = 0; i < Math.min(feed.items.length, 6); i++) {
                // Image size documentation: https://www.flickr.com/services/api/misc.urls.html
                const photo = feed.items[i];
                const imgUrl = photo.content.match(regex)[1].replace('_m', '_c');
                const imgTitle = photo?.title || 'Photo';
                html += `<a href="${photo.link}" target="_blank" rel="nofollow"><img loading="lazy" src="${imgUrl}" alt="${imgTitle}" /></a>`;
            }
            html += '</div>'
            return html;
        } catch (e) {
            console.error(`Error parsing Flickr feed`, e);
            return 'There was an error loading my photos, <a href="https://www.flickr.com/photos/corbindavenport/" target="_blank">check them out on Flickr</a> instead!';
        }
    });
    // Set nofollow, noreferrer, noopener, and target blank attributes for all external links
    eleventyConfig.addTransform("update-links", async function (content) {
        const dom = new JSDOM(content);
        dom.window.document.querySelectorAll('a').forEach(function (el) {
            if (el.href.startsWith('https://') || el.href.startsWith('http://')) {
                el.setAttribute('rel', 'nofollow noreferrer noopener');
                el.setAttribute('target', '_blank');
            }
        });
        return dom.serialize();
    });
    // Function to get favicon of an external site (used for reviews page)
    eleventyConfig.addShortcode("favicon", function (value) {
        var url = new URL(value);
        var domain = url.hostname;
        var favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        var el = `<img src="${favicon}" alt="" style="width: 32px; height: 32px;" />`
        return el;
    });
    // Force exit on site builds, because there's sometimes a hanging process
    if (process.env.ELEVENTY_ENV === "production" || !process.argv.includes("--serve")) {
        eleventyConfig.on("eleventy.after", function () {
            console.log("Forcing exit...");
            process.exit(0);
        });
    }
};