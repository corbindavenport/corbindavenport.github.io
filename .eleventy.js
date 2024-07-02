
const Parser = require('rss-parser');
const parser = new Parser();

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
    // Profile picture shortcode
    eleventyConfig.addShortcode("photo", function (url) {
        return `<img alt="Photo of Corbin" class="profile-photo" src="https://www.gravatar.com/avatar/bd4dc9257737f89e59f71b4851fc1b74?s=500">`
    });
    // Redirect shortcode
    eleventyConfig.addShortcode("redirect", function (url) {
        return `<p>You are being redirected...</p><meta http-equiv="refresh" content="0; url=${url}" />`
    });
    // Letterboxd shortcode
    eleventyConfig.addShortcode("letterboxd", async function (url) {
        let html = '';
        let feed = await parser.parseURL('https://letterboxd.com/corbindavenport/rss/');
        console.log('Parsed feed:', feed);
        for (let i = 0; i < Math.min(feed.items.length, 5); i++) {
            let review = feed.items[i];
            let snippet = review.contentSnippet;
            if (snippet.length > 300) {
                snippet = snippet.substring(0, 300) + '...';
            }
            html += '<p><a href="' + review.link + '" target="_blank" rel="nofollow">' + review.title + '</a><br /><i>' + snippet + '</i></p>';
        }
        return html;
    });
    // Flickr shortcode
    eleventyConfig.addShortcode("flickr", async function (url) {
        let html = '<div class="fickr-images">';
        const regex = /<img src="(https:\/\/live\.staticflickr\.com\/\d+\/\d+_[a-zA-Z0-9]+_m\.jpg)"/;
        let feed = await parser.parseURL('https://www.flickr.com/services/feeds/photos_public.gne?id=199183592@N06&lang=en-us&format=rss');
        console.log('Parsed feed:', feed);
        for (let i = 0; i < Math.min(feed.items.length, 6); i++) {
            let photo = feed.items[i];
            html += '<a href="' + photo.link + '" target="_blank" rel="nofollow"><img src="' + photo.content.match(regex)[1] + '" alt="' + photo.title + '" /></a>';
        }
        html += '</div>';
        return html;
    });
};
