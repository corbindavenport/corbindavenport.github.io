import { DateTime } from "luxon";
import fs from "node:fs/promises";
import path from "node:path";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import Parser from "rss-parser";
import { JSDOM } from "jsdom";

const parser = new Parser({
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36" },
    timeout: 5000,
});

// Time zone for blog posts
const globalTimeZone = "America/New_York";

// robots.txt list
const robotsTxt = "https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/refs/heads/main/robots.txt";

// Eleventy configuration
export default function (eleventyConfig) {
    // Set time zone for all date strings
    // Credit: https://www.11ty.dev/docs/dates/#change-a-projects-default-time-zone
    eleventyConfig.addDateParsing(function (dateValue) {
        let localDate;
        if (dateValue instanceof Date) { // and YAML
            localDate = DateTime.fromJSDate(dateValue, { zone: "utc" }).setZone(globalTimeZone, { keepLocalTime: true });
        } else if (typeof dateValue === "string") {
            localDate = DateTime.fromISO(dateValue, { zone: globalTimeZone });
        }
        if (localDate?.isValid === false) {
            throw new Error(`Invalid \`date\` value (${dateValue}) is invalid for ${this.page.inputPath}: ${localDate.invalidReason}`);
        }
        return localDate;
    });
    // Set default layout
    eleventyConfig.addGlobalData("layout", "layout.njk");
    // Use Eleventy image plugin for converting and rendering images
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        defaultAttributes: {
            alt: ""
        },
        formats: ["webp", "auto"],
        sharpOptions: {
            animated: true,
            limitInputPixels: 999999999999
        },
        htmlOptions: {
            imgAttributes: {
                loading: "lazy",
                decoding: "async",
            }
        },
    });
    // Copy video media attachments to each page's output location, because the Eleventy image plugin won't do it
    eleventyConfig.addPassthroughCopy(["blog/**/*.mp4"], {
		mode: "html-relative"
	});
    // Don't add the base README to the site
    eleventyConfig.ignores.add("README.md");
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
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/chrome-btn.png" alt="Download on Chrome Web Store" eleventy:ignore /></a>`;
        } else if (platform === 'firefox') {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/firefox-btn.png" alt="Download for Firefox" eleventy:ignore /></a>`;
        } else if (platform === 'edge') {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/microsoft-btn.png" alt="Download for Microsoft Edge" eleventy:ignore /></a>`;
        } else if (platform === "spotify") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/spotify-btn.png" alt="Listen on Spotify" eleventy:ignore /></a>`;
        } else if (platform === "youtube") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/youtube-btn.png" alt="Available on YouTube" eleventy:ignore /></a>`;
        } else if (platform === "youtube-music") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/youtube-music-btn.png" alt="Listen on YouTube Music" eleventy:ignore /></a>`;
        } else if (platform === "pocket-casts") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/pocket-casts-btn.png" alt="Listen on Pocket Casts" eleventy:ignore /></a>`;
        } else if (platform === "apple-podcasts") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/apple-podcasts-btn.png" alt="Listen on Apple Podcasts" eleventy:ignore /></a>`;
        } else if (platform === "amazon-music") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/amazon-music-btn.png" alt="Listen on Amazon Music" eleventy:ignore /></a>`;
        } else if (platform === "rss") {
            html = `<a href="${url}" target="_blank" class="img-btn"><img src="/media/rss-btn.png" alt="Get the RSS feed" eleventy:ignore /></a>`;
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
                html += `<a href="${photo.link}" target="_blank" rel="nofollow"><img loading="lazy" src="${imgUrl}" alt="${imgTitle}" eleventy:ignore /></a>`;
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
        // Skip this step for links in redirect pages, and non-HTML files
        if ((!this.outputPath.endsWith(".html")) || this.inputPath.includes("redirects.njk")) {
            return content;
        }
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
    // Long date format, like "Wednesday, August 19, 2026"
    eleventyConfig.addFilter("longDate", function (date) {
        return Intl.DateTimeFormat("en", { dateStyle: "full" }).format(date);
    });
    // Generate fallback excerpt for a blog post
    eleventyConfig.addFilter("excerptFallback", function (content) {
        const dom = new JSDOM(content);
        let text = dom.window.document.body.textContent.trim().split("\n")[0]
        if (text.length > 150) {
            text = text.substring(0, 145) + "..."
        }
        return text;
    });
    // Get the rendered URL for the first image in a blog post
    // This is used primarily for filling out the og:image meta tag
    eleventyConfig.addFilter("findImage", function (content) {
        const dom = new JSDOM(content);
        const img = dom.window.document.querySelector("img[src]")
        if (img) {
            return [img.getAttribute("src"), img.getAttribute("alt")]
        } else {
            return ["",""]
        }
    });
    // Generate RSS feeds
    eleventyConfig.addPlugin(pluginRss, {
		posthtmlRenderOptions: {
			closingSingleTag: "slash"
		},
	});
    // Post-processing steps
    eleventyConfig.on("eleventy.after", async function ({ dir }) {
        // Add duplicate RSS feed at /rss for redirects from https://blog.corbin.io/rss
        const source = path.join(dir.output, "feed.xml");
        const dest = path.join(dir.output, "rss");
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.copyFile(source, dest);
        // Add ai.robots.txt list to robots.txt
        try {
            const response = await fetch(robotsTxt);
            const remoteRobotsTxt = await response.text();
            const outputPath = path.join(dir.output, "robots.txt");
            await fs.appendFile(outputPath, `\n\n# AI Crawlers (ai.robots.txt)\n${remoteRobotsTxt}`);
        } catch (error) {
            console.error("Failed to fetch ai.robots.txt list:", error);
        }
        // Force exit on site builds, because there's sometimes a hanging process
        if (process.env.ELEVENTY_ENV === "production" || !process.argv.includes("--serve")) {
            console.log("Forcing exit...");
            process.exit(0);
        }
    });
};