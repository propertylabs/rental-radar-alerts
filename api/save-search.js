import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, searchName, criteria, postcodes } = req.body;

    try {
      // Ensure arrays are properly formatted
      const propertyTypes = criteria.propertyTypes && Array.isArray(criteria.propertyTypes) ? criteria.propertyTypes : [];
      const mustHaves = criteria.mustHaves && Array.isArray(criteria.mustHaves) ? criteria.mustHaves : [];
      const postcodesArray = postcodes && Array.isArray(postcodes) ? postcodes : [];

      // Generate a unique ID
      const searchId = Date.now().toString() + Math.random().toString(36).substr(2, 5);

      const result = await pool.query(
        `INSERT INTO searches (
          id,
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [
          searchId,
          userId,
          searchName,
          postcodesArray,
          criteria.minPrice,
          criteria.maxPrice,
          criteria.minBedrooms,
          criteria.maxBedrooms,
          propertyTypes,
          mustHaves,
          'disabled'
        ]
      );

      return res.status(200).json({ 
        message: 'Search saved successfully',
        searchId: result.rows[0].id
      });
    } catch (error) {
      console.error('Error saving search:', error);
      return res.status(500).json({ error: 'Error saving search' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}