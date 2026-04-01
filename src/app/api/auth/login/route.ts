import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { getParticipantByCredentials } from '@/lib/google-sheets';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;

    // ADMIN LOGIN
    if (type === 'admin') {
      const { username, password } = body;
      const expectedUser = process.env.ADMIN_USERNAME || 'admin';
      const expectedPass = process.env.ADMIN_PASSWORD || 'admin123';

      if (username === expectedUser && password === expectedPass) {
        const session = await encrypt({ role: 'admin' });
        const res = NextResponse.json({ success: true });

        res.cookies.set('session', session, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });

        return res;
      } else {
        return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
      }
    }
    // PARTICIPANT LOGIN
    else if (type === 'participant') {
      const { email, registrationNumber } = body;

      const participant = await getParticipantByCredentials(email, registrationNumber);

      if (participant) {
        const session = await encrypt({
          role: 'participant',
          email: participant.email,
          registrationNumber: participant.registrationNumber,
          rowIndex: participant.rowIndex
        });

        const res = NextResponse.json({ success: true });

        res.cookies.set('session', session, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });

        return res;
      } else {
        return NextResponse.json({ success: false, error: 'Invalid credentials or participant not found' }, { status: 401 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid login type' }, { status: 400 });

  } catch (err: any) {
    console.error("Login Exception:", err.message);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
