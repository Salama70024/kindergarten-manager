import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (credentials.username === 'admin' && credentials.password === 'admin123') {
                    return { id: '1', name: 'Admin User', email: 'admin@kindergarten.com' };
                }
                return null;
            },
        }),
    ],
});
