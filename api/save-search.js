import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    userId, 
    propertyTypes, 
    minBedrooms, 
    maxBedrooms, 
    minPrice, 
    maxPrice, 
    postcodes,
    notifications 
  } = req.body;

  try {
    // First, create the search entry
    const searchResult = await pool.query(
      `INSERT INTO user_searches (user_id, notifications) 
       VALUES ($1, $2) 
       RETURNING id`,
      [userId, notifications]
    );

    const searchId = searchResult.rows[0].id;

    // Then, create the search criteria
    await pool.query(
      `INSERT INTO search_criteria 
       (search_id, property_types, min_bedrooms, max_bedrooms, min_price, max_price, postcodes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        searchId,
        propertyTypes,
        minBedrooms,
        maxBedrooms,
        minPrice,
        maxPrice,
        postcodes
      ]
    );

    return res.status(200).json({ 
      message: 'Search saved successfully',
      searchId 
    });

  } catch (error) {
    console.error('Error saving search:', error);
    return res.status(500).json({ error: 'Failed to save search' });
  }
}