import { NextResponse } from 'next/server';
import { getParticipantByCredentials, getParticipantByRegistrationNumber } from '@/lib/google-sheets';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = await decrypt(sessionCookie);

    if (!session || session.role !== 'participant') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.registrationNumber) {
      return NextResponse.json({ error: 'No user identifier' }, { status: 400 });
    }

    // Attempt to fetch fresh data for this user
    const participant = await getParticipantByRegistrationNumber(session.registrationNumber);

    if (!participant) {
      return NextResponse.json({ error: 'User not found in records' }, { status: 404 });
    }

    return NextResponse.json({ participant });
  } catch (error: any) {
    console.error("Profile Fetch API error:", error);
    return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
  }
}
