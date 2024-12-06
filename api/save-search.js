import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the authorization token from headers
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const { search } = req.body;
  if (!search) {
    return res.status(400).json({ error: 'Missing search data' });
  }

  try {
    // Fetch the Whop user ID using the token
    const whopResponse = await fetch('https://api.whop.com/v5/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!whopResponse.ok) {
      throw new Error('Failed to verify user with Whop');
    }

    const whopData = await whopResponse.json();
    const whopUserId = whopData.id;

    // Now insert the search with the verified whopUserId
    const result = await pool.query(
      `INSERT INTO searches (
        user_id,
        search_name,
        postcodes,
        min_price,
        max_price,
        min_bedrooms,
        max_bedrooms,
        property_types,
        must_haves,
        notifications,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING id`,
      [
        whopUserId,
        search.name,
        search.locations,
        search.minPrice,
        search.maxPrice,
        search.minBedrooms,
        search.maxBedrooms,
        search.propertyTypes,
        search.mustHaves,
        search.notifications
      ]
    );

    return res.status(200).json({ 
      message: 'Search saved successfully',
      searchId: result.rows[0].id 
    });

  } catch (error) {
    console.error('Error saving search:', error);
    return res.status(500).json({ error: 'Failed to save search' });
  }
}