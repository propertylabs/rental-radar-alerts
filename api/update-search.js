import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { userId, searchId, searchName, criteria, postcodes } = req.body;

    try {
      // Ensure that propertyTypes, mustHaves, and postcodes are defined and arrays
      const propertyTypes = criteria.propertyTypes && Array.isArray(criteria.propertyTypes) ? criteria.propertyTypes : [];
      const mustHaves = criteria.mustHaves && Array.isArray(criteria.mustHaves) ? criteria.mustHaves : [];
      const postcodesArray = postcodes && Array.isArray(postcodes) ? postcodes : [];

      console.log('Full request body:', req.body);
      console.log('Criteria received on backend:', criteria);
      console.log('Postcodes received on backend:', postcodesArray);

      // Check if the search belongs to the user
      const searchOwnerResult = await pool.query(
        'SELECT user_id FROM user_searches WHERE id = $1',
        [searchId]
      );

      if (searchOwnerResult.rows.length === 0) {
        return res.status(404).json({ error: 'Search not found' });
      }

      if (searchOwnerResult.rows[0].user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized to update this search' });
      }

      // Update the search name in user_searches table
      await pool.query(
        'UPDATE user_searches SET search_name = $1 WHERE id = $2',
        [searchName, searchId]
      );

      // Update the search criteria in search_criteria table
      await pool.query(
        `UPDATE search_criteria SET
          min_bedrooms = $1,
          max_bedrooms = $2,
          min_price = $3,
          max_price = $4,
          property_types = $5::text[],
          must_haves = $6::text[],
          postcodes = $7::text[]
        WHERE search_id = $8`,
        [
          criteria.minBedrooms,
          criteria.maxBedrooms,
          criteria.minPrice,
          criteria.maxPrice,
          propertyTypes,
          mustHaves,
          postcodesArray,
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