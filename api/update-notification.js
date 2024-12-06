import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { searchId, user_id, notifications } = req.body;

  if (!searchId || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'UPDATE searches SET notifications = $1 WHERE id = $2 AND user_id = $3 RETURNING id',
      [notifications, searchId, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Search not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Notification status updated successfully' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return res.status(500).json({ error: 'Failed to update notification status' });
  }
}