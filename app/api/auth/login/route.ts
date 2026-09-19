import { NextResponse } from 'next/server';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-barberia-jwt-token-key-2026';

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJwt(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, barberId } = body;

    // Determine target role (defaults to ADMIN if admin email or requested role is ADMIN)
    const targetRole = role || (email?.includes('admin') ? 'ADMIN' : 'BARBER');

    let userSession: any;

    if (targetRole === 'ADMIN') {
      userSession = {
        id: 'admin-1',
        name: 'Administrador General',
        email: email || 'admin@barberia.com',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
      };
    } else {
      // Barber role
      let barberName = 'Barbero Staff';
      let bId = barberId ? Number(barberId) : 1;

      // Try fetching barber name from backend if available
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${backendUrl}/barbers/${bId}`);
        if (res.ok) {
          const barberData = await res.json();
          barberName = barberData.name;
          bId = barberData.id;
        }
      } catch {
        // Fallback if backend is not yet started
      }

      userSession = {
        id: `barber-${bId}`,
        name: barberName,
        email: email || `barbero${bId}@barberia.com`,
        role: 'BARBER',
        barberId: bId,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
      };
    }

    const payload = {
      sub: userSession.id,
      name: userSession.name,
      email: userSession.email,
      role: userSession.role,
      barberId: userSession.barberId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    };

    const token = signJwt(payload);

    return NextResponse.json({
      token,
      user: userSession,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Error en autenticación' },
      { status: 500 }
    );
  }
}
