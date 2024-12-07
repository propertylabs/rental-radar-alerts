import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
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
      notifications,
      searchId  // Additional parameter for update
    } = req.body;

    if (!user_id || !searchId) {
      console.error('Missing required fields in request:', req.body);
      return res.status(400).json({ error: 'user_id and searchId are required' });
    }

    try {
      // Check if the search belongs to the user
      const searchOwnerResult = await pool.query(
        'SELECT user_id FROM searches WHERE id = $1',
        [searchId]
      );

      if (searchOwnerResult.rows.length === 0) {
        return res.status(404).json({ error: 'Search not found' });
      }

      if (searchOwnerResult.rows[0].user_id !== user_id) {
        return res.status(403).json({ error: 'Unauthorized to update this search' });
      }

      // Update using the same structure as save-search
      await pool.query(
        `UPDATE searches SET
          user_id = $1,
          search_name = $2,
          postcodes = $3,
          min_price = $4,
          max_price = $5,
          min_bedrooms = $6,
          max_bedrooms = $7,
          property_types = $8,
          must_haves = $9,
          notifications = $10
        WHERE id = $11`,
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
          notifications,
          searchId
        ]
      );

      return res.status(200).json({ 
        message: 'Search updated successfully',
        searchId: searchId 
      });

    } catch (error) {
      console.error('Error updating search:', error);
      return res.status(500).json({ error: 'Failed to update search' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}