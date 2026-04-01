import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extract textual data
    const fullName = formData.get('fullName') as string;
    const registrationNumber = formData.get('registrationNumber') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const branch = formData.get('branch') as string;
    const year = formData.get('year') as string;
    const gender = formData.get('gender') as string;
    const fatherName = formData.get('fatherName') as string;
    const motherName = formData.get('motherName') as string;
    const aadharNumber = formData.get('aadharNumber') as string;
    const reason = formData.get('reason') as string;
    const experience = formData.get('experience') as string;
    
    // Checkbox is usually "true" or null if FormData mapped it
    const comfortableOutside = formData.get('comfortableOutside') === 'true' ? 'Yes' : 'No';

    // Extract File blobs
    const fileVideo = formData.get('fileVideo') as File | null;
    const filePassportPhoto = formData.get('filePassportPhoto') as File | null;
    const fileSignature = formData.get('fileSignature') as File | null;
    const fileAadhar = formData.get('fileAadhar') as File | null;

    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // The folder where all files will be dumped

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID || !GOOGLE_DRIVE_FOLDER_ID) {
      console.warn("Google credentials missing. Returning simulated success without uploading.");
      return NextResponse.json({ success: true, message: 'Simulated success' });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY,
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file' // Required to upload files
      ],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Google Drive Upload helper
    const uploadToDrive = async (file: File | null, prefix: string) => {
      if (!file) return 'No File';

      try {
        const fileExt = file.name.split('.').pop() || 'tmp';
        const safeRegNum = registrationNumber.replace(/[^a-zA-Z0-9]/g, '');
        const fileName = `${safeRegNum}_${prefix}_${Date.now()}.${fileExt}`;

        // Node.js Buffer from file arrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const stream = Readable.from(buffer);

        // Upload the file to Google Drive (Shared Drive requires supportsAllDrives)
        const response = await drive.files.create({
          requestBody: {
            name: fileName,
            parents: [GOOGLE_DRIVE_FOLDER_ID],
          },
          media: {
            mimeType: file.type || 'application/octet-stream',
            body: stream,
          },
          supportsAllDrives: true,
          fields: 'webViewLink, id',
        });

        // Make file publicly viewable (Shared Drives inherit permissions so this may be a no-op)
        if (response.data.id) {
          try {
            await drive.permissions.create({
              fileId: response.data.id,
              supportsAllDrives: true,
              requestBody: {
                role: 'reader',
                type: 'anyone',
              },
            });
          } catch (permError) {
            console.warn(`Permission set skipped for ${fileName} — Shared Drive may manage access automatically.`);
          }
        }

        return response.data.webViewLink || 'Upload Missing Link';
      } catch (err: any) {
        console.error(`Google Drive Upload Error (${prefix}):`, err.message);
        return 'Upload Failed';
      }
    };

    // Parallel upload of files to Google Drive
    const [videoUrl, photoUrl, signatureUrl, aadharUrl] = await Promise.all([
      uploadToDrive(fileVideo, 'video'),
      uploadToDrive(filePassportPhoto, 'photo'),
      uploadToDrive(fileSignature, 'signature'),
      uploadToDrive(fileAadhar, 'aadhar')
    ]);

    const sheets = google.sheets({ version: 'v4', auth });

    // Assuming a tab named "Participants" exists in your Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Participants!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toISOString(), // Timestamp
            fullName,
            registrationNumber,
            email,
            phone,
            branch,
            year,
            gender || 'Not Specified',
            fatherName,
            motherName,
            aadharNumber,
            reason,
            experience,
            comfortableOutside,
            photoUrl, 
            signatureUrl,
            aadharUrl,
            videoUrl
          ]
        ]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Participant Error:', error.message);
    return NextResponse.json({ success: false, error: 'Registration failed via server' }, { status: 500 });
  }
}
