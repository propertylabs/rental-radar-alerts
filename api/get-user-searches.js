import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      // Fetch user searches along with their criteria and notification status
      const result = await pool.query(
        `SELECT 
          us.id,
          us.search_name,
          us.user_id,
          sc.min_bedrooms,
          sc.max_bedrooms,
          sc.min_price,
          sc.max_price,
          sc.property_types,
          sc.must_haves,
          sc.postcodes,
          sc.notifications -- Include the notifications column
        FROM 
          user_searches us
        JOIN 
          search_criteria sc ON us.id = sc.search_id
        WHERE 
          us.user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No searches found for the user' });
      }

      // Format the response to match the old API's structure
      const searches = result.rows.map(row => ({
        id: row.id,
        searchName: row.search_name,
        postcodes: row.postcodes, // Ensure this is already in array format
        notifications: row.notifications, // Include the notifications status
        criteria: {
          minBedrooms: row.min_bedrooms,
          maxBedrooms: row.max_bedrooms,
          minPrice: row.min_price,
          maxPrice: row.max_price,
          propertyTypes: row.property_types,
          mustHaves: row.must_haves,
        }
      }));

      return res.status(200).json(searches);
    } catch (error) {
      console.error('Error fetching user searches:', error);
      return res.status(500).json({ error: 'Error fetching user searches' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}