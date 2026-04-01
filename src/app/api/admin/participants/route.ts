import { NextResponse } from 'next/server';
import { getAllParticipants, updateParticipantAdminData } from '@/lib/google-sheets';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

// Helper to check admin access
async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload = await decrypt(session);
  return payload?.role === 'admin';
}

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const participants = await getAllParticipants();
    return NextResponse.json({ participants });
  } catch (error: any) {
    console.error("Fetch API error:", error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rowIndex, data } = await req.json();

    if (!rowIndex || !data) {
      return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
    }

    const success = await updateParticipantAdminData(rowIndex, data);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to update Google Sheets' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Update API error:", error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
