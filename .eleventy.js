
const Parser = require('rss-parser');
const parser = new Parser();
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
    // Add main JS
    eleventyConfig.addPassthroughCopy("main.js");
    // Download button shortcode
    eleventyConfig.addShortcode("downloadBtn", function (platform, url) {
        var html = '';
        if (platform === 'chrome') {
            html = `<a href="${url}" target="_blank" class="btn-container"><img src="/media/chrome-button.png" alt="Download on Chrome Web Store" /></a>`;
        } else if (platform === 'firefox') {
            html = `<a href="${url}" target="_blank" class="btn-container"><img src="/media/firefox-button.png" alt="Download for Firefox" /></a>`;
        } else if (platform === 'edge') {
            html = `<a href="${url}" target="_blank" class="btn-container"><img src="/media/microsoft-button.png" alt="Download for Microsoft Edge" /></a>`;
        }
        return html;
    });
    // RSS feed shortcode
    eleventyConfig.addShortcode("rssFeed", async function (url, showDescription = true, showDate = false) {
        try {
            let html = '';
            let feed = await parser.parseURL(url);
            // console.log('Parsed feed:', feed);
            for (let i = 0; i < Math.min(feed.items.length, 5); i++) {
                let item = feed.items[i];
                let title = item.title;
                let description = item.contentSnippet;
                // Remove username from title on GitHub feeds
                if (url.includes('github.com/')) {
                    // Get GitHub username
                    const username = url.split("/")[3].split(".")[0];
                    title = title.replace(`${username} `, '');
                }
                // Shorten description
                if (description?.length > 230) {
                    description = description.substring(0, 230) + '...';
                }
                // Return generated snippet
                html += `<p><a href="${item.link}" target="_blank" rel="nofollow">${title}</a>`;
                if (showDate && Object.hasOwn(item, 'isoDate')) {
                    html += ` (${formatDate(item.isoDate)})`;
                }
                if (description && showDescription) {
                    html += `<br /><i>${description}</i>`;
                }
                html += `</p>`;
            }
            return html;
        } catch (e) {
            console.error(e);
            return 'There was an error loading this content.';
        }
    });
    // Flickr shortcode
    eleventyConfig.addShortcode("flickr", async function (url) {
        let html = '<div class="fickr-images">';
        const regex = /<img src="(https:\/\/live\.staticflickr\.com\/\d+\/\d+_[a-zA-Z0-9]+_m\.jpg)"/;
        let feed = await parser.parseURL('https://www.flickr.com/services/feeds/photos_public.gne?id=199183592@N06&lang=en-us&format=rss');
        // console.log('Parsed feed:', feed);
        for (let i = 0; i < Math.min(feed.items.length, 6); i++) {
            // Image size documentation: https://www.flickr.com/services/api/misc.urls.html
            const photo = feed.items[i];
            const imgUrl = photo.content.match(regex)[1].replace('_m', '_c');
            html += `<a href="${photo.link}" target="_blank" rel="nofollow"><img loading="lazy" src="${imgUrl}" alt="${photo?.title}" /></a>`
        }
        html += '</div>';
        return html;
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
};