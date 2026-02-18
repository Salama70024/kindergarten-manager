export const authConfig = {
  pages: {
    signIn: '/', // The home page serves as the login page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Allow access to the login page
      if (nextUrl.pathname === '/') {
        return true;
      }

      // Allow access to auth API routes
      if (nextUrl.pathname.startsWith('/api/auth')) {
        return true;
      }

      // Default: Require login for everything else (including other API routes)
      return isLoggedIn;
    },
  },
  providers: [], // Configured in auth.js
};
