import CredentialsProvider from 'next-auth/providers/credentials';
import { JWTPayload, SignJWT, importJWK } from 'jose';
import bcrypt from 'bcryptjs';
import prisma from '@/db';
import { NextAuthOptions } from 'next-auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { randomUUID } from 'crypto';

export interface session extends Session {
  user: {
    id: string;
    jwtToken: string;
    role: string;
    email: string;
    name: string;
  };
}

interface token extends JWT {
  uid: string;
  role: string;
  jwtToken: string;
}

interface user {
  id: string;
  name: string;
  email: string;
  token: string;
}

const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET || 'secret';
  const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });

  const jwt = await new SignJWT({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    jti: randomUUID(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('365d')
    .sign(jwk);

  return jwt;
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'email', type: 'text', placeholder: '' },
        password: { label: 'password', type: 'password', placeholder: '' },
      },
      async authorize(credentials: any) {
        try {      
          if (!credentials?.username) {
            console.error('Username (email) is required');
            return null;  // Return null if username is missing
          }
      
          const userDb = await prisma.user.findUnique({
            where: {
              email: credentials.username,  // Ensure credentials.username is passed as email
            },
          });
      
          if (userDb && userDb.password && await bcrypt.compare(credentials.password, userDb.password)) {
            const jwt = await generateJWT({ id: userDb.id });
            return {
              id: userDb.id,
              name: userDb.name,
              email: credentials.username,
              token: jwt,
            };
          }
      
          return null;  // Return null if authentication fails
        } catch (e) {
          console.error('Error during authentication:', e);
        }
        return null;  // Fallback return null
      }
      
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'secr3t',
  callbacks: {
    session: async ({ session, token }) => {
      const newSession: session = session as session;
      if (newSession.user && token.uid) {
        newSession.user.id = token.uid as string;
        newSession.user.jwtToken = token.jwtToken as string;
        newSession.user.role = process.env.ADMINS?.split(',').includes(
          session.user?.email ?? '',
        )
          ? 'admin'
          : 'user';
      }
      return newSession!;
    },
    jwt: async ({ token, user }): Promise<JWT> => {
      const newToken: token = token as token;
      if (user) {
        newToken.uid = user.id;
        newToken.jwtToken = (user as user).token;
        newToken.role = process.env.ADMINS?.split(',').includes(
          user?.email ?? '',
        )
          ? 'admin'
          : 'user';
      }
      return newToken;
    },
  },
  pages: {
    signIn: '/signin',
  },
} satisfies NextAuthOptions;
