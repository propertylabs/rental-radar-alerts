import axios from 'axios';

export default async function handler(req, res) {
  console.log("Client ID:", process.env.WHOP_CLIENT_ID);
  console.log("Client Secret:", process.env.WHOP_CLIENT_SECRET);
  console.log("Redirect URI:", process.env.WHOP_REDIRECT_URI);

  const { code } = req.query;

  if (!code) {
    const errorMessage = 'Authorization code is missing. Ensure that you are redirected to this endpoint with a valid code parameter after the user authorizes the application.';
    console.error(errorMessage);
    return res.status(400).json({ error: errorMessage, logs: [] });
  }

  try {
    console.log("Starting token exchange process...");

    const response = await axios.post('https://api.whop.com/v5/oauth/token', {
      code,
      client_id: process.env.WHOP_CLIENT_ID,
      client_secret: process.env.WHOP_CLIENT_SECRET,
      redirect_uri: process.env.WHOP_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    console.log("Token exchange successful. Access token received.");
    return res.status(200).json({ ...response.data, logs: ["Token exchange successful."] });
  } catch (error) {
    // Detailed error handling
    const errorDetails = {
      error: error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
    };
    
    const detailedErrorMessage = `
      Error during token exchange:
      - Authorization Code: ${code}
      - Client ID: ${process.env.WHOP_CLIENT_ID}
      - Redirect URI: ${process.env.WHOP_REDIRECT_URI}
      - Error Details: ${JSON.stringify(errorDetails, null, 2)}
      - Possible Causes:
        - The authorization code might be invalid, expired, or already used.
        - The client ID, client secret, or redirect URI might be incorrect.
        - There might be network issues or the Whop API might be temporarily unavailable.
    `;

    console.error(detailedErrorMessage);
    return res.status(500).json({
      error: detailedErrorMessage,
      logs: [
        "Client ID: " + process.env.WHOP_CLIENT_ID,
        "Redirect URI: " + process.env.WHOP_REDIRECT_URI,
        "Error Details: " + JSON.stringify(errorDetails, null, 2),
      ],
    });
  }
}