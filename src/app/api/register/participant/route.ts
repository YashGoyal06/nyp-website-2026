import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract only the fields that are in the current form
    const fullName = formData.get('fullName') as string;
    const registrationNumber = formData.get('registrationNumber') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const branch = formData.get('branch') as string;
    const year = formData.get('year') as string;
    const gender = formData.get('gender') as string;
    const reason = formData.get('reason') as string;
    const experience = formData.get('experience') as string;
    const comfortableOutside = formData.get('comfortableOutside') === 'true' ? 'Yes' : 'No';

    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      console.warn("Google credentials missing. Returning simulated success.");
      return NextResponse.json({ success: true, message: 'Simulated success' });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Columns: A=Timestamp, B=Name, C=RegNo, D=Email, E=Phone,
    //          F=Branch, G=Year, H=Gender, I=Reason, J=Experience, K=ComfortableOutside
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Participants!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString(),
          fullName,
          registrationNumber,
          `'${email}`,          // Prefix with ' to prevent Excel formula issues
          `'${phone}`,          // Prefix with ' to prevent phone number formatting
          branch,
          year,
          gender || 'Not Specified',
          reason,
          experience,
          comfortableOutside,
        ]]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Participant Error:', error.message);
    return NextResponse.json({ success: false, error: 'Registration failed via server' }, { status: 500 });
  }
}
