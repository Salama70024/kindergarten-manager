import NextAuth from 'next-auth';
import { authConfig } from './src/lib/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // Protect everything except Next.js internals and static assets
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
