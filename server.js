const express = require('express');
const cors = require('cors');
const crawlWebsite = require('./crawler');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/crawl', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const results = await crawlWebsite(url);
        res.json(results);
    } catch (error) {
        console.error('Error during crawl:', error);
        res.status(500).json({ error: 'Failed to crawl website' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});