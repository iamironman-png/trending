const express = require('express');
const cors = require('cors');
const googleTrends = require('google-trends-api');

const app = express();
app.use(cors());

app.get('/trends', async (req, res) => {
  const geo = req.query.geo || 'IN';
  try {
    const result = await googleTrends.dailyTrends({ geo });
    const data = JSON.parse(result);
    const trends = data.default.trendingSearchesDays[0].trendingSearches.map(t => t.title.query);
    res.json(trends.slice(0, 10));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
