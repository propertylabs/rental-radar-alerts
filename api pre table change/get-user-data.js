import pkg from 'pg';

const { Client } = pkg;

export default async function handler(req, res) {
  const dbUrl = process.env.POSTGRES_URL;

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Step 1: Call Whop API to get whop_user_id using fetch
    const whopResponse = await fetch('https://api.whop.com/v5/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!whopResponse.ok) {
      throw new Error('Failed to fetch Whop user data');
    }

    const whopData = await whopResponse.json();
    const whopUserId = whopData.id;

    // Step 2: Connect to the PostgreSQL database
    const client = new Client({
      connectionString: dbUrl,
    });

    await client.connect();

    // Step 3: Query the database using the whop_user_id
    const query = `
      SELECT name, email
      FROM users
      WHERE whop_user_id = $1
    `;

    const result = await client.query(query, [whopUserId]);

    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Step 4: Return the user data
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    if (error.message.includes('Unauthorized')) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}