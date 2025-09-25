import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionData {
  userId?: string;
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'user-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function getSession(): Promise<IronSession<SessionData>> {
  const session = getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
