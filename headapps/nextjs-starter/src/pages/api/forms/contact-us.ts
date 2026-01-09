import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Webhook endpoint for Sitecore Forms: Contact Us
 * This receives form submissions from forms.sitecorecloud.io
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log the incoming webhook data
    console.log('=== Contact Form Webhook Received ===');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('=====================================');

    // Extract form data
    const formData = req.body;

    // Process the form submission
    // The field names will match what Sitecore sends
    const {
      firstName,
      lastName,
      email,
      phone,
      specialRequest,
      emailUpdates,
      // Sitecore might use different field names, check the logs
    } = formData.fields || formData;

    console.log('Processed form data:', {
      firstName,
      lastName,
      email,
      phone,
      specialRequest,
      emailUpdates,
      timestamp: new Date().toISOString(),
    });

    // TODO: Add your custom logic here:
    // - Save to database
    // - Send email notification using SendGrid, Mailgun, etc.
    // - Post to CRM (Salesforce, HubSpot, etc.)
    // - Send to Slack, Teams, etc.

    // Example: Send email notification
    // await sendEmailNotification({
    //   to: 'admin@yourcompany.com',
    //   subject: `New Contact: ${firstName} ${lastName}`,
    //   body: `
    //     Name: ${firstName} ${lastName}
    //     Email: ${email}
    //     Phone: ${phone}
    //     Special Request: ${specialRequest}
    //     Wants updates: ${emailUpdates}
    //   `
    // });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
    });
  } catch (error) {
    console.error('Error processing form webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing form submission',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
