import twilio from 'twilio';

export default async function handler(req, res) {
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // "From" phone number as env variable

    const { to, message } = req.body;

    // Log environment variables for debugging
    console.log('Environment Variables Check:', {
        accountSid: accountSid ? 'Found' : 'Not Found',
        authToken: authToken ? 'Found' : 'Not Found',
        messagingServiceSid: messagingServiceSid ? 'Found' : 'Not Found',
        whatsappNumber: whatsappNumber ? 'Found' : 'Not Found',
    });

    // Check if environment variables are set
    if (!accountSid || !authToken || !messagingServiceSid || !whatsappNumber) {
        return res.status(500).json({
            error: "Twilio credentials are not properly set in environment variables."
        });
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    try {
        // Send WhatsApp message using the "from" number
        const messageResponse = await client.messages.create({
            from: `whatsapp:${whatsappNumber}`, // Use "from" number from env
            to: `whatsapp:${to}`, // WhatsApp number format
            body: message,
        });

        // Respond with success status and message SID
        console.log('Twilio Message Response:', messageResponse);
        return res.status(200).json({
            sid: messageResponse.sid,
            status: 'Message sent successfully!'
        });
    } catch (error) {
        console.error('Twilio Error:', error);
        return res.status(500).json({ error: error.message });
    }
}