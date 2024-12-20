import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { searchId } = req.body;

    if (!searchId) {
      return res.status(400).json({ error: 'Invalid search ID' });
    }

    try {
      const result = await pool.query(
        'DELETE FROM searches WHERE id = $1 RETURNING id',
        [searchId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Search not found' });
      }

      return res.status(200).json({ message: 'Search deleted successfully' });
    } catch (error) {
      console.error('Error deleting search:', error);
      return res.status(500).json({ error: 'Error deleting search' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}