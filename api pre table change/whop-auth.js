import pkg from 'pg';
const { Client } = pkg;

export default async function handler(req, res) {
  const clientId = process.env.REACT_APP_WHOP_CLIENT_ID;
  const clientSecret = process.env.WHOP_CLIENT_SECRET;
  const redirectUri = process.env.WHOP_REDIRECT_URI;
  const dbUrl = process.env.POSTGRES_URL;

  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).json({ error: "Client Secret, Client ID, or Redirect URI is not accessible." });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const tokenResponse = await fetch('https://api.whop.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json({ error: tokenData });
    }

    // Fetch user details from Whop API
    const userResponse = await fetch('https://api.whop.com/v5/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok || !userData.id) {
      return res.status(500).json({ error: "Failed to retrieve user data." });
    }

    // Fetch membership data
    const membershipResponse = await fetch('https://api.whop.com/v5/me/memberships', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const membershipData = await membershipResponse.json();

    if (!membershipResponse.ok) {
      return res.status(500).json({ error: "Failed to retrieve membership data." });
    }

    // Check if the user has a valid membership
    const isSubscriber = membershipData.data.some(membership => membership.product_id === 'prod_GtVfwuPeiuWoU' && membership.valid);

    if (!isSubscriber) {
      return res.status(403).json({ error: "You must be subscribed to access this app." });
    }

    // Initialize PostgreSQL client
    const client = new Client({
      connectionString: dbUrl,
    });

    await client.connect();

    // Upsert user data based on whop_user_id
    const upsertQuery = `
      INSERT INTO users (whop_user_id, name, email)
      VALUES ($1, $2, $3)
      ON CONFLICT (whop_user_id) DO UPDATE
      SET name = EXCLUDED.name,
          email = EXCLUDED.email;
    `;

    await client.query(upsertQuery, [
      userData.id,
      userData.name || userData.username,
      userData.email,
    ]);

    await client.end();

    // Return the access token, Whop user ID, and subscription status
    return res.status(200).json({
      access_token: tokenData.access_token,
      whop_user_id: userData.id,
      isSubscriber: true,
    });

  } catch (error) {
    console.error("Error during token exchange or user data processing:", error.message);
    return res.status(500).json({ error: "An error occurred during the process." });
  }
}