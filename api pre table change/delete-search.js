import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { searchId } = req.body;

    // Validate searchId
    if (!searchId) {
      return res.status(400).json({ error: 'Invalid search ID' });
    }

    try {
      // Start transaction
      await pool.query('BEGIN');

      // Delete the search criteria and the search itself
      await pool.query('DELETE FROM search_criteria WHERE search_id = $1', [searchId]);
      await pool.query('DELETE FROM user_searches WHERE id = $1', [searchId]);

      // Commit transaction
      await pool.query('COMMIT');

      return res.status(200).json({ message: 'Search deleted successfully' });
    } catch (error) {
      // Rollback transaction in case of error
      await pool.query('ROLLBACK');
      console.error('Error deleting search:', error);
      return res.status(500).json({ error: 'Error deleting search' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}