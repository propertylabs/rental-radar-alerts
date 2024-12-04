import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { userId, searchId, searchName, criteria, postcodes } = req.body;

    try {
      // Ensure arrays are properly formatted
      const propertyTypes = criteria.propertyTypes && Array.isArray(criteria.propertyTypes) ? criteria.propertyTypes : [];
      const mustHaves = criteria.mustHaves && Array.isArray(criteria.mustHaves) ? criteria.mustHaves : [];
      const postcodesArray = postcodes && Array.isArray(postcodes) ? postcodes : [];

      // Check if the search belongs to the user
      const searchOwnerResult = await pool.query(
        'SELECT user_id FROM searches WHERE id = $1',
        [searchId]
      );

      if (searchOwnerResult.rows.length === 0) {
        return res.status(404).json({ error: 'Search not found' });
      }

      if (searchOwnerResult.rows[0].user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized to update this search' });
      }

      // Update all fields in the unified searches table
      await pool.query(
        `UPDATE searches SET
          search_name = $1,
          postcodes = $2,
          min_price = $3,
          max_price = $4,
          min_bedrooms = $5,
          max_bedrooms = $6,
          property_types = $7,
          must_haves = $8
        WHERE id = $9`,
        [
          searchName,
          postcodesArray,
          criteria.minPrice,
          criteria.maxPrice,
          criteria.minBedrooms,
          criteria.maxBedrooms,
          propertyTypes,
          mustHaves,
          searchId
        ]
      );

      return res.status(200).json({ message: 'Search updated successfully' });
    } catch (error) {
      console.error('Error updating search:', error);
      return res.status(500).json({ error: 'Error updating search' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}