export default async function handler(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ isSubscriber: false });
    }
  
    try {
      // Use fetch to call Whop's API to verify subscription status
      const response = await fetch('https://api.whop.com/v5/me/memberships', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const membershipData = await response.json();
  
      if (!response.ok) {
        throw new Error('Failed to verify subscription status');
      }
  
      // Check if the user has a valid membership
      const isSubscriber = membershipData.data.some(membership => membership.product_id === 'prod_GtVfwuPeiuWoU' && membership.valid);
  
      return res.status(200).json({ isSubscriber });
    } catch (error) {
      console.error("Error verifying subscription status:", error.message);
      return res.status(500).json({ isSubscriber: false });
    }
  }