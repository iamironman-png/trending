const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/trends', async (req, res) => {
  const geo = req.query.geo || 'IN';

  try {
    const url = `https://trends.google.com/trends/api/dailytrends?hl=en-US&ed=20250430&geo=${geo}&ns=15`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    // Clean up the response (Google sends a weird prefix)
    const dataStr = response.data.replace(")]}',", '');
    const data = JSON.parse(dataStr);
    const trends = data.default.trendingSearchesDays[0].trendingSearches.map(t => t.title.query);
    res.json(trends.slice(0, 10));
  } catch (e) {
    console.error('Trend fetch failed:', e.message);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
