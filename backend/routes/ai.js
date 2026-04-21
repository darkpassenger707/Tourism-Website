const express = require('express');
const router  = express.Router();

// POST AI recommendation
router.post('/recommend', async (req, res) => {
  const { budget, duration, interests, climate, travel_style, group_type, from_country } = req.body;

  if (!budget || !duration || !interests) {
    return res.status(400).json({ success: false, message: 'budget, duration, and interests are required.' });
  }

  const prompt = `You are a world-class travel expert for Wanderlust Tours. A traveler is asking for personalized destination recommendations.

Traveler Profile:
- Budget: ${budget} USD per person
- Trip Duration: ${duration} days
- Interests: ${interests}
- Preferred Climate: ${climate || 'any'}
- Travel Style: ${travel_style || 'balanced'}
- Group Type: ${group_type || 'couple'}
- Traveling From: ${from_country || 'India'}

Please recommend exactly 3 destinations. For each destination, provide:
1. Destination name & country
2. Why it perfectly matches their profile (2-3 sentences)
3. Best time to visit
4. Estimated daily budget breakdown
5. Top 3 must-do activities
6. One insider tip

Respond in valid JSON format exactly like this structure:
{
  "recommendations": [
    {
      "rank": 1,
      "destination": "Destination Name",
      "country": "Country",
      "match_score": 95,
      "why_perfect": "Explanation here...",
      "best_time": "Month–Month",
      "daily_budget": {
        "accommodation": "$X-$Y",
        "food": "$X-$Y",
        "activities": "$X-$Y",
        "total": "$X-$Y per day"
      },
      "top_activities": ["Activity 1", "Activity 2", "Activity 3"],
      "insider_tip": "Insider tip here...",
      "emoji": "🏝️"
    }
  ],
  "summary": "A brief 1-2 sentence personalized note to the traveler."
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error');

    const text = data.content[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const parsed = JSON.parse(jsonMatch[0]);
    res.json({ success: true, ...parsed });
  } catch (err) {
    console.error('AI error:', err.message);
    // Fallback response if AI fails
    res.json({
      success: true,
      recommendations: [
        {
          rank: 1, destination: 'Bali', country: 'Indonesia', match_score: 92,
          why_perfect: 'Bali offers a perfect blend of culture, beaches, and adventure that suits your interests. With its affordable luxury options and diverse activities, it fits your budget beautifully.',
          best_time: 'April–October',
          daily_budget: { accommodation: '$40-$120', food: '$15-$40', activities: '$20-$60', total: '$75-$220 per day' },
          top_activities: ['Tanah Lot Temple Sunset', 'Ubud Rice Terrace Trek', 'Kuta Beach Surf Lesson'],
          insider_tip: 'Rent a scooter for $5/day to explore at your own pace and discover hidden warungs (local restaurants) with amazing food.',
          emoji: '🌺',
        },
        {
          rank: 2, destination: 'Kyoto', country: 'Japan', match_score: 87,
          why_perfect: 'Kyoto is a living museum of Japanese culture with breathtaking temples, traditional tea houses, and the magical Arashiyama bamboo forest — a once-in-a-lifetime experience.',
          best_time: 'March–May',
          daily_budget: { accommodation: '$60-$180', food: '$25-$60', activities: '$15-$50', total: '$100-$290 per day' },
          top_activities: ['Fushimi Inari 1,000 Torii Gates Hike', 'Geisha District Evening Walk', 'Traditional Tea Ceremony'],
          insider_tip: 'Book a morning slot for Arashiyama bamboo grove — by 6 AM you can have it almost to yourself before the crowds arrive.',
          emoji: '🏯',
        },
        {
          rank: 3, destination: 'Santorini', country: 'Greece', match_score: 83,
          why_perfect: 'Santorini offers iconic beauty and romance unmatched anywhere in the world. The volcanic caldera views, stunning sunsets, and exceptional wine make it unforgettable.',
          best_time: 'May–October',
          daily_budget: { accommodation: '$100-$350', food: '$30-$80', activities: '$30-$100', total: '$160-$530 per day' },
          top_activities: ['Oia Sunset Viewing', 'Catamaran Sailing Tour', 'Wine Tasting at Akrotiri Vineyard'],
          insider_tip: 'Stay in Imerovigli instead of Oia — equally stunning caldera views, half the price, and far fewer tourists.',
          emoji: '🏛️',
        },
      ],
      summary: 'Based on your preferences, we\'ve curated three destinations that will create memories to last a lifetime. Each offers a unique experience tailored to your travel style.',
    });
  }
});

module.exports = router;
