// /api/get-google-maps-api-key.js
export default async function handler(req, res) {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not found' });
    }
  
    return res.status(200).json({ apiKey });
  }