import { google } from "googleapis";

// Define the shape of our row data
export interface ParticipantRow {
  rowIndex: number;
  timestamp: string;
  fullName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  gender: string;
  reason: string;
  experience: string;
  comfortableOutside: string;
  // Admin fields (cols L-R)
  screeningSlot?: string;
  status?: string;
  attendance?: string;
  marks?: string;
  selectionTimestamp?: string;
  ministry?: string;
  ministryStatus?: string;
  // Portal serial number (col S)
  serialNumber?: string;
}

function getEnv() {
  const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
  return { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID };
}

function getAuth() {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = getEnv();

  const missing: string[] = [];
  if (!GOOGLE_CLIENT_EMAIL) missing.push("GOOGLE_CLIENT_EMAIL");
  if (!GOOGLE_PRIVATE_KEY) missing.push("GOOGLE_PRIVATE_KEY");
  if (!GOOGLE_SHEET_ID) missing.push("GOOGLE_SHEET_ID");

  if (missing.length > 0) {
    throw new Error(`Missing Google Credentials: ${missing.join(", ")}. Please check your .env file.`);
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheetId() {
  return getEnv().GOOGLE_SHEET_ID;
}

function parseRow(row: any[], index: number): ParticipantRow {
  return {
    rowIndex: index + 1,
    timestamp: row[0] || "",
    fullName: row[1] || "",
    registrationNumber: row[2] || "",
    email: (row[3] || "").replace(/^'/, ""),
    phone: (row[4] || "").replace(/^'/, ""),
    branch: row[5] || "",
    year: row[6] || "",
    gender: row[7] || "",
    reason: row[8] || "",
    experience: row[9] || "",
    comfortableOutside: row[10] || "",
    // Admin fields (cols L=11, M=12, N=13, O=14, P=15, Q=16, R=17)
    screeningSlot: row[11] || "",
    status: row[12] || "None",
    attendance: row[13] || "Absent",
    marks: row[14] || "",
    selectionTimestamp: row[15] || "",
    ministry: row[16] || "",
    ministryStatus: row[17] || "None",
    // VBNYP serial number (col S=18)
    serialNumber: row[18] || "",
  };
}

export async function getAllParticipants(): Promise<ParticipantRow[]> {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // We fetch from row 2 (skipping header)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: getSheetId(),
      range: 'Participants!A1:S',
    });

    const rows = response.data.values || [];
    return rows.map((row, index) => parseRow(row, index));
  } catch (error) {
    console.error("Error fetching participants:", error);
    return [];
  }
}

export async function getParticipantByCredentials(emailOrSerial: string, regNum: string): Promise<ParticipantRow | null> {
  const participants = await getAllParticipants();
  const found = participants.find(p => {
    const emailMatch = p.email.toLowerCase() === emailOrSerial.toLowerCase();
    const serialMatch = p.serialNumber && p.serialNumber.toUpperCase() === emailOrSerial.toUpperCase();
    return (emailMatch || serialMatch) && p.registrationNumber === regNum;
  });
  return found || null;
}

export async function getParticipantByRegistrationNumber(regNum: string): Promise<ParticipantRow | null> {
  const participants = await getAllParticipants();
  const found = participants.find(p => p.registrationNumber === regNum);
  return found || null;
}

export async function updateParticipantAdminData(
  rowIndex: number,
  data: { screeningSlot?: string; status?: string; attendance?: string; marks?: string; selectionTimestamp?: string; ministry?: string; ministryStatus?: string }
) {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch existing row to avoid overwriting with empties if not provided
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: getSheetId(),
      range: `Participants!L${rowIndex}:R${rowIndex}`,
    });

    const currentRow = response.data.values?.[0] || [];

    const screeningSlot = data.screeningSlot !== undefined ? data.screeningSlot : (currentRow[0] || "");
    const status = data.status !== undefined ? data.status : (currentRow[1] || "None");
    const attendance = data.attendance !== undefined ? data.attendance : (currentRow[2] || "Absent");
    const marks = data.marks !== undefined ? data.marks : (currentRow[3] || "");
    let selectionTimestamp = data.selectionTimestamp !== undefined ? data.selectionTimestamp : (currentRow[4] || "");
    const ministry = data.ministry !== undefined ? data.ministry : (currentRow[5] || "");
    const ministryStatus = data.ministryStatus !== undefined ? data.ministryStatus : (currentRow[6] || "None");

    // Logic: If ministryStatus just changed to 'Selected' and no timestamp exists, add one.
    if (ministryStatus === 'Selected' && !selectionTimestamp) {
      selectionTimestamp = new Date().toISOString();
    }

    const valuesToUpdate = [
      [screeningSlot, status, attendance, marks, selectionTimestamp, ministry, ministryStatus]
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: getSheetId(),
      range: `Participants!L${rowIndex}:R${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: valuesToUpdate
      }
    });

    return true;
  } catch (error) {
    console.error("Error updating participant admin data:", error);
    return false;
  }
}
