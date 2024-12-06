import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  console.log('1. Save search endpoint hit');
  
  if (req.method !== 'POST') {
    console.log('Wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('2. Checking authorization token');
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token found in headers');
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  console.log('3. Checking search data');
  const { search } = req.body;
  console.log('Search data received:', search);
  if (!search) {
    console.log('No search data found in request body');
    return res.status(400).json({ error: 'Missing search data' });
  }

  try {
    console.log('4. Fetching Whop user ID');
    const whopResponse = await fetch('https://api.whop.com/v5/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('5. Whop response status:', whopResponse.status);
    if (!whopResponse.ok) {
      console.log('Whop verification failed:', whopResponse.status);
      throw new Error('Failed to verify user with Whop');
    }

    const whopData = await whopResponse.json();
    console.log('6. Whop data received:', whopData);
    const whopUserId = whopData.id;

    console.log('7. Preparing database query');
    console.log('Query parameters:', {
      whopUserId,
      name: search.name,
      locations: search.locations,
      minPrice: search.minPrice,
      maxPrice: search.maxPrice,
      minBedrooms: search.minBedrooms,
      maxBedrooms: search.maxBedrooms,
      propertyTypes: search.propertyTypes,
      mustHaves: search.mustHaves,
      notifications: search.notifications
    });

    console.log('8. Executing database query');
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

    console.log('9. Database query complete:', result.rows[0]);
    return res.status(200).json({ 
      message: 'Search saved successfully',
      searchId: result.rows[0].id 
    });

  } catch (error) {
    console.error('Error in save-search:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Failed to save search',
      details: error.message
    });
  }
}