import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    // --- Log to Google Sheets ---
    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

    if (GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY && GOOGLE_SHEET_ID) {
      try {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: GOOGLE_CLIENT_EMAIL,
            private_key: GOOGLE_PRIVATE_KEY,
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
          spreadsheetId: GOOGLE_SHEET_ID,
          range: 'Contact!A1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              new Date().toISOString(),
              name,
              email,
              subject,
              message,
              'Unread',
            ]],
          },
        });
      } catch (sheetErr: any) {
        console.warn('Contact sheet log failed (non-fatal):', sheetErr.message);
      }
    }

    // --- Send email via Nodemailer (if SMTP configured) ---
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 587,
          secure: Number(SMTP_PORT) === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        });

        await transporter.sendMail({
          from: `"VBNYP 2026 Contact Form" <${SMTP_USER}>`,
          to: 'nss@vitbhopal.ac.in',
          replyTo: email,
          subject: `[VBNYP Contact] ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563EB;">New Contact Form Submission</h2>
              <hr style="border-color: #E2E8F0;" />
              <table style="width:100%; border-collapse: collapse;">
                <tr><td style="padding:8px; font-weight:bold; color:#374151;">Name:</td><td style="padding:8px;">${name}</td></tr>
                <tr style="background:#F9FAFB"><td style="padding:8px; font-weight:bold; color:#374151;">Email:</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px; font-weight:bold; color:#374151;">Subject:</td><td style="padding:8px;">${subject}</td></tr>
              </table>
              <div style="margin-top:16px; padding:16px; background:#F3F4F6; border-radius:8px;">
                <p style="font-weight:bold; color:#374151; margin:0 0 8px;">Message:</p>
                <p style="color:#4B5563; white-space:pre-wrap; margin:0;">${message}</p>
              </div>
              <p style="margin-top:24px; font-size:12px; color:#9CA3AF;">
                Sent via VBNYP 2026 Contact Form · nss@vitbhopal.ac.in
              </p>
            </div>
          `,
        });
      } catch (mailErr: any) {
        console.warn('Email send failed (non-fatal):', mailErr.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API error:', error.message);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
