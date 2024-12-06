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
    user_id,
    search_name,
    postcodes,
    min_price,
    max_price,
    min_bedrooms,
    max_bedrooms,
    property_types,
    must_haves,
    notifications
  } = req.body;

  try {
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
        user_id,
        search_name,
        postcodes,
        min_price,
        max_price,
        min_bedrooms,
        max_bedrooms,
        property_types,
        must_haves,
        notifications
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