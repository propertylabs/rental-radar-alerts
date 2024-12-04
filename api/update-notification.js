import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { userId, searchId, notifications } = req.body;

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

      // Update the notifications status
      await pool.query(
        'UPDATE searches SET notifications = $1 WHERE id = $2',
        [notifications, searchId]
      );

      return res.status(200).json({ message: 'Notification status updated successfully' });
    } catch (error) {
      console.error('Error updating notification status:', error);
      return res.status(500).json({ error: 'Error updating notification status' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}