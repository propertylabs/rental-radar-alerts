import axios from 'axios';

export default async function handler(req, res) {
  // Log the environment variables to see if they are being accessed
  const clientId = process.env.WHOP_CLIENT_ID;
  const clientSecret = process.env.WHOP_CLIENT_SECRET;
  const redirectUri = process.env.WHOP_REDIRECT_URI;

  console.log("Client ID:", clientId || "Not Accessible");
  console.log("Client Secret:", clientSecret || "Not Accessible");
  console.log("Redirect URI:", redirectUri || "Not Accessible");

  // Check if the environment variables are being accessed correctly
  if (!clientId || !clientSecret || !redirectUri) {
    console.error("Client Secret, Client ID, or Redirect URI is not accessible.");
    return res.status(500).json({
      error: "Client Secret, Client ID, or Redirect URI is not accessible.",
      confirmation_code: "ClientSecretUnavailable",
    });
  }

  const { code } = req.query;

  if (!code) {
    console.error("Authorization code is missing.");
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    console.log("Starting token exchange process...");

    // Making the POST request to exchange the authorization code for an access token
    const response = await axios.post('https://api.whop.com/v5/oauth/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    console.log("Token exchange successful. Access token received.");
    return res.status(200).json(response.data);
  } catch (error) {
    // Extracting detailed error information
    const detailedErrorMessage = `
      Error during token exchange:
      - Request Details:
        - Authorization Code: ${code}
        - Client ID: ${clientId}
        - Redirect URI: ${redirectUri}
      - Error Response Data: ${JSON.stringify(error.response?.data, null, 2)}
      - Error Message: ${error.message}
      - Possible Causes:
        - The authorization code might be invalid, expired, or already used.
        - The client ID, client secret, or redirect URI might be incorrect.
        - There might be network issues or the Whop API might be temporarily unavailable.
    `;

    console.error(detailedErrorMessage);
    return res.status(500).json({ error: detailedErrorMessage });
  }
}