import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    console.log('GET /api/get-user-searches - userId:', userId);

    try {
      const result = await pool.query(
        `SELECT 
          id,
          search_name,
          postcodes,
          min_price,
          max_price,
          min_bedrooms,
          max_bedrooms,
          property_types,
          must_haves,
          notifications,
          last_alert,
          created_at
        FROM searches 
        WHERE user_id = $1
        ORDER BY created_at DESC`,
        [userId]
      );

      console.log('Database query result:', result.rows);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No searches found for the user' });
      }

      // Format the response to match the frontend expectations
      const searches = result.rows.map(row => ({
        id: row.id,
        searchName: row.search_name,
        postcodes: row.postcodes,
        notifications: row.notifications,
        created_at: row.created_at,
        criteria: {
          minPrice: row.min_price,
          maxPrice: row.max_price,
          minBedrooms: row.min_bedrooms,
          maxBedrooms: row.max_bedrooms,
          propertyTypes: row.property_types,
          mustHaves: row.must_haves
        },
        last_alert: row.last_alert || 'No alerts yet'
      }));

      console.log('Formatted response:', searches);
      return res.status(200).json(searches);

    } catch (error) {
      console.error('Error fetching user searches:', error);
      return res.status(500).json({ error: 'Error fetching user searches' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}