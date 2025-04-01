const express = require("express");
const crawlWebsite = require("./crawler"); // Import the crawlWebsite function
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/crawl", async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const results = await crawlWebsite(url);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while crawling the website." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
