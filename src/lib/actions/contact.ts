'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function sendContactEmail(formData: ContactFormData): Promise<ContactFormResult> {
  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return {
        success: false,
        message: 'All fields are required.',
        error: 'MISSING_FIELDS'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
        error: 'INVALID_EMAIL'
      };
    }

    // Get recipient email from environment variables
    const recipientEmail = process.env.CONTACT_EMAIL;
    if (!recipientEmail) {
      console.error('CONTACT_EMAIL environment variable is not set');
      return {
        success: false,
        message: 'Server configuration error. Please try again later.',
        error: 'CONFIG_ERROR'
      };
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <noreply@resend.dev>', // Using Resend's default domain
      to: [recipientEmail],
      replyTo: formData.email,
      subject: `Portfolio Contact: ${formData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 5px;">From:</h3>
              <p style="margin: 0; padding: 10px; background-color: #f8f9fa; border-left: 4px solid #007bff;">
                <strong>${formData.name}</strong><br>
                <a href="mailto:${formData.email}" style="color: #007bff; text-decoration: none;">${formData.email}</a>
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 5px;">Subject:</h3>
              <p style="margin: 0; padding: 10px; background-color: #f8f9fa; border-left: 4px solid #28a745;">
                ${formData.subject}
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 5px;">Message:</h3>
              <div style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #ffc107; border-radius: 5px;">
                ${formData.message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
              <p>This message was sent from your portfolio contact form.</p>
              <p>Sent at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

From: ${formData.name} (${formData.email})
Subject: ${formData.subject}

Message:
${formData.message}

---
This message was sent from your portfolio contact form.
Sent at: ${new Date().toLocaleString()}
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again later.',
        error: 'SEND_ERROR'
      };
    }

    console.log('Email sent successfully:', data);
    return {
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.'
    };

  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      error: 'UNKNOWN_ERROR'
    };
  }
}
