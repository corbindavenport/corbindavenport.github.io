// Eleventy configuration
module.exports = function (eleventyConfig) {
    // Add favicon to site
    eleventyConfig.addPassthroughCopy("favicon.ico");
    // Add robots.txt to site
    eleventyConfig.addPassthroughCopy("robots.txt");
    // Add media folder to site
    eleventyConfig.addPassthroughCopy("media");
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
};
