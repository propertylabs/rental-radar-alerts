import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { 
      user_id,
      searchId,
      search_name,
      postcodes,
      min_price,
      max_price,
      min_bedrooms,
      max_bedrooms,
      property_types,
      must_haves,
      notifications,
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

      // Build dynamic update query based on provided fields
      let updateFields = [];
      let values = [searchId];  // First value is always searchId
      let valueIndex = 2;  // Start at 2 since $1 is searchId

      if (search_name !== undefined) {
        updateFields.push(`search_name = $${valueIndex++}`);
        values.push(search_name);
      }
      if (postcodes !== undefined) {
        updateFields.push(`postcodes = $${valueIndex++}`);
        values.push(postcodes);
      }
      if (min_price !== undefined) {
        updateFields.push(`min_price = $${valueIndex++}`);
        values.push(min_price);
      }
      if (max_price !== undefined) {
        updateFields.push(`max_price = $${valueIndex++}`);
        values.push(max_price);
      }
      if (min_bedrooms !== undefined) {
        updateFields.push(`min_bedrooms = $${valueIndex++}`);
        values.push(min_bedrooms);
      }
      if (max_bedrooms !== undefined) {
        updateFields.push(`max_bedrooms = $${valueIndex++}`);
        values.push(max_bedrooms);
      }
      if (property_types !== undefined) {
        updateFields.push(`property_types = $${valueIndex++}`);
        values.push(property_types);
      }
      if (must_haves !== undefined) {
        updateFields.push(`must_haves = $${valueIndex++}`);
        values.push(must_haves);
      }
      if (notifications !== undefined) {
        updateFields.push(`notifications = $${valueIndex++}`);
        values.push(notifications);
      }

      // Only proceed if there are fields to update
      if (updateFields.length > 0) {
        const query = `
          UPDATE searches 
          SET ${updateFields.join(', ')}
          WHERE id = $1
        `;

        console.log('Update query:', query);
        console.log('Update values:', values);

        await pool.query(query, values);
      }

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