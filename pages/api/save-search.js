import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the authorization token from headers
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const { search } = req.body;
  if (!search) {
    return res.status(400).json({ error: 'Missing search data' });
  }

  try {
    // Fetch the Whop user ID using the token
    const whopResponse = await fetch('https://api.whop.com/v5/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!whopResponse.ok) {
      throw new Error('Failed to verify user with Whop');
    }

    const whopData = await whopResponse.json();
    const whopUserId = whopData.id;

    // Now insert the search with the verified whopUserId
    const { data, error } = await supabase
      .from('searches')
      .insert([{
        whop_user_id: whopUserId,
        name: search.name,
        city: search.city,
        locations: search.locations,
        property_types: search.propertyTypes,
        min_bedrooms: search.minBedrooms,
        max_bedrooms: search.maxBedrooms,
        min_price: search.minPrice,
        max_price: search.maxPrice,
        must_haves: search.mustHaves,
        notifications: search.notifications,
        created_at: Math.floor(Date.now() / 1000),
      }])
      .select();

    if (error) throw error;

    return res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error saving search:', error);
    return res.status(500).json({ error: 'Failed to save search' });
  }
} 