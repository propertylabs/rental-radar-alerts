import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, searchName, criteria, postcodes } = req.body; // Added postcodes here

    try {
      // Ensure that propertyTypes, mustHaves, and postcodes are defined and arrays
      const propertyTypes = criteria.propertyTypes && Array.isArray(criteria.propertyTypes) ? criteria.propertyTypes : [];
      const mustHaves = criteria.mustHaves && Array.isArray(criteria.mustHaves) ? criteria.mustHaves : [];
      const postcodesArray = postcodes && Array.isArray(postcodes) ? postcodes : [];

      console.log('Full request body:', req.body);
      console.log('Criteria received on backend:', criteria);
      console.log('Postcodes received on backend:', postcodesArray); // Now logging postcodes correctly

      // Insert into user_searches table
      const searchResult = await pool.query(
        'INSERT INTO user_searches (user_id, search_name) VALUES ($1, $2) RETURNING id',
        [userId, searchName]
      );
      const searchId = searchResult.rows[0].id;

      // Insert into search_criteria table (convert arrays to PostgreSQL array literals)
      await pool.query(
        `INSERT INTO search_criteria (
          search_id, min_bedrooms, max_bedrooms, min_price, max_price, property_types, must_haves, postcodes
        ) VALUES ($1, $2, $3, $4, $5, $6::text[], $7::text[], $8::text[])`,
        [
          searchId,
          criteria.minBedrooms,
          criteria.maxBedrooms,
          criteria.minPrice,
          criteria.maxPrice,
          propertyTypes, // No need to join into a string, let PostgreSQL handle the array
          mustHaves,     // Same for mustHaves
          postcodesArray // Updated to use postcodesArray
        ]
      );

      return res.status(200).json({ message: 'Search saved successfully' });
    } catch (error) {
      console.error('Error saving search:', error);
      return res.status(500).json({ error: 'Error saving search' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}