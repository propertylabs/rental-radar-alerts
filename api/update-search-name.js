import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { userId, searchId, searchName } = req.body;

    try {
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

      // Update just the name
      await pool.query(
        'UPDATE searches SET search_name = $1 WHERE id = $2',
        [searchName, searchId]
      );

      return res.status(200).json({ 
        message: 'Search name updated successfully',
        searchName: searchName 
      });
    } catch (error) {
      console.error('Error updating search name:', error);
      return res.status(500).json({ error: 'Error updating search name' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 