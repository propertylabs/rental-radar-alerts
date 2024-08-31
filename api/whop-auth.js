import pkg from 'pg';
const { Client } = pkg;

export default async function handler(req, res) {
  const clientId = process.env.REACT_APP_WHOP_CLIENT_ID;
  const clientSecret = process.env.WHOP_CLIENT_SECRET;
  const redirectUri = process.env.WHOP_REDIRECT_URI;
  const dbUrl = process.env.POSTGRES_URL;

  console.log("Client ID:", clientId || "Not Accessible");
  console.log("Client Secret:", clientSecret || "Not Accessible");
  console.log("Redirect URI:", redirectUri || "Not Accessible");

  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).json({ error: "Client Secret, Client ID, or Redirect URI is not accessible." });
  }

  const { code } = req.query;
  console.log("Authorization Code Extracted:", code);

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    console.log("Starting token exchange process...");

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
    console.log("Response from Whop API:", tokenData);

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      return res.status(tokenResponse.status).json({ error: tokenData });
    }

    // Fetch user details from Whop API
    const userResponse = await fetch('https://api.whop.com/v5/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    console.log("User Data Response:", userData);

    if (!userResponse.ok || !userData.id) {
      console.error("Failed to retrieve user data:", userData);
      return res.status(500).json({ error: "Failed to retrieve user data." });
    }

    // Fetch membership data
    const membershipResponse = await fetch('https://api.whop.com/v5/me/memberships', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const membershipData = await membershipResponse.json();
    console.log("Membership Data Response:", membershipData);

    if (!membershipResponse.ok) {
      console.error("Failed to retrieve membership data:", membershipData);
      return res.status(500).json({ error: "Failed to retrieve membership data." });
    }

    // Check if the user has a valid membership
    const hasValidMembership = membershipData.data.some(membership => membership.product_id === 'prod_GtVfwuPeiuWoU' && membership.valid);

    if (!hasValidMembership || membershipData.data.length === 0) {
      return res.status(403).json({ error: "You must be subscribed to Rental Radar to access this app." });
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
      userData.name || userData.username, // Fallback to username if name is null
      userData.email,
    ]);

    await client.end();

    // Return the access token
    return res.status(200).json(tokenData);

  } catch (error) {
    console.error("Error during token exchange or user data processing:", error.message);
    return res.status(500).json({ error: "An error occurred during the process." });
  }
}