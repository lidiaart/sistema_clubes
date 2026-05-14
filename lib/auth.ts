import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { query } from './db';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const SECRET = process.env.AUTH_SECRET || 'change-this-secret-in-production';
export const SESSION_COOKIE_NAME = 'session_token';

export function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_LENGTH, { N: 16384, r: 8, p: 1 });
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, KEY_LENGTH, { N: 16384, r: 8, p: 1 });
  const storedBuffer = Buffer.from(key, 'hex');
  return timingSafeEqual(derivedKey, storedBuffer);
}

export function createSessionToken(userId: number) {
  const payload = JSON.stringify({ userId, iat: Date.now() });
  const payloadBase64 = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = createHmac('sha256', SECRET).update(payloadBase64).digest('hex');
  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string) {
  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) {
    return null;
  }

  const expected = createHmac('sha256', SECRET).update(payloadBase64).digest('hex');
  const signatureBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8')) as { userId: number; iat: number };
  } catch {
    return null;
  }
}

export async function getSessionUser(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const payload = verifySessionToken(token);
  if (!payload?.userId) {
    return null;
  }

  const result = await query('SELECT id, name, email FROM users WHERE id = ?', [payload.userId]);
  return result.rows[0] ?? null;
}

export function setSessionCookie(response: NextResponse, userId: number) {
  const sessionToken = createSessionToken(userId);
  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
}
