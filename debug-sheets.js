const { google } = require('googleapis');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const email = env.match(/GOOGLE_CLIENT_EMAIL=(.+)/)?.[1]?.trim();
const rawKey = env.match(/GOOGLE_PRIVATE_KEY="(.+)"/)?.[1]?.trim();
const sheetId = env.match(/GOOGLE_SHEET_ID=(.+)/)?.[1]?.trim();
const key = rawKey.replace(/\\n/g, '\n');
const auth = new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: key },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
google.sheets({ version: 'v4', auth }).spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Participants!A1:E5'
}).then(r => {
    console.log('Rows found:', r.data.values?.length || 0);
    (r.data.values || []).forEach((row, i) => console.log('Row', i, ':', JSON.stringify(row.slice(0, 4))));
}).catch(e => console.log('ERROR:', e.message));
