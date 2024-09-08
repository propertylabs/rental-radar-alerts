import pkg from 'pg';  // Import pg as a package
const { Pool } = pkg;  // Destructure to get the Pool class

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    // Query to select searches and their criteria based on user ID
    const result = await pool.query(
      `SELECT us.id, us.search_name, sc.min_bedrooms, sc.max_bedrooms, sc.min_price, sc.max_price, sc.property_types, sc.must_haves, sc.postcodes
       FROM user_searches us
       JOIN search_criteria sc ON us.id = sc.search_id
       WHERE us.user_id = $1`,
      [userId]
    );

    // Map the results to format the criteria as an object
    const searches = result.rows.map(row => ({
      id: row.id,
      searchName: row.search_name,
      postcodes: row.postcodes, // Already an array, no modification needed here
      criteria: {
        minBedrooms: row.min_bedrooms,
        maxBedrooms: row.max_bedrooms,
        minPrice: row.min_price,
        maxPrice: row.max_price,
        propertyTypes: row.property_types,
        mustHaves: row.must_haves,
      }
    }));

    // Return the results as JSON
    return res.status(200).json(searches);
  } catch (error) {
    // Error handling and logging
    console.error('Error fetching searches:', error.message, error.stack);
    return res.status(500).json({
      error: 'Error fetching searches',
      details: error.message, // Send back the error message for easier debugging
    });
  }
}