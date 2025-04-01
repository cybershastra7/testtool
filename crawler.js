const axios = require("axios");
const cheerio = require("cheerio");

// Regex to find endpoints in JavaScript files
const endpointRegex = /['"`](https?:\/\/[a-zA-Z0-9._\/\-]+|\/[a-zA-Z0-9._\/\-]+)['"`]/g;

// Fetch website content
async function fetchWebsite(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error.message);
        return null;
    }
}

// Extract endpoints from HTML
async function extractEndpointsFromHTML(html, baseURL) {
    const $ = cheerio.load(html);
    const endpoints = new Set();
    const jsFiles = [];

    // Extract links from <a> tags
    $('a[href], link[href]').each((_, element) => {
        let href = $(element).attr('href');
        if (href && href.startsWith('/')) href = baseURL + href; // Resolve relative paths
        if (href && href.startsWith('http')) endpoints.add(href);
    });

    // Extract JavaScript file URLs
    $('script[src]').each((_, element) => {
        let src = $(element).attr('src');
        if (src && src.startsWith('/')) src = baseURL + src; // Resolve relative paths
        if (src && src.startsWith('http')) jsFiles.push(src);
    });

    return { endpoints, jsFiles };
}

// Extract endpoints from JavaScript files
async function extractEndpointsFromJS(jsURL) {
    try {
        const jsContent = await fetchWebsite(jsURL);
        const matches = jsContent.match(endpointRegex);
        return matches ? matches.map(match => match.replace(/['"`]/g, "")) : [];
    } catch (error) {
        console.error(`Failed to fetch JS file ${jsURL}:`, error.message);
        return [];
    }
}

// Crawl the website
async function crawlWebsite(url) {
    console.log(`Crawling website: ${url}`);
    const html = await fetchWebsite(url);

    if (!html) return { siteEndpoints: [], jsEndpoints: [] };

    const baseURL = new URL(url).origin;
    const { endpoints: siteEndpoints, jsFiles } = await extractEndpointsFromHTML(html, baseURL);

    const jsEndpoints = new Set();
    for (const jsFile of jsFiles) {
        const extracted = await extractEndpointsFromJS(jsFile);
        extracted.forEach(endpoint => jsEndpoints.add(endpoint));
    }

    return {
        siteEndpoints: Array.from(siteEndpoints),
        jsEndpoints: Array.from(jsEndpoints),
    };
}

module.exports = crawlWebsite;