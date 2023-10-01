import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { NextAuthOptions } from 'next-auth'
import bcrypt from 'bcrypt'
import axios from 'axios'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      id: 'credentials',
      type: 'credentials',
      credentials: {
        nisn: { label: 'Nisn', type: 'string' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        if (!credentials?.nisn || !credentials?.password) {
          return null
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: {
            nisn: credentials.nisn,
          },
        })

        if (!user) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.nisn,
          name: user.nisn,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 1 * 24 * 60 * 60, // 3 days
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth',
    signOut: '/auth',
    // error: '/auth' // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },
  callbacks: {
    async signIn({ user }) {
      if (user) {
        return true
      } else {
        return false
      }
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
    async session({ session, token }: any) {
      session.user = token.user
      session.jwt = token?.jwt
      session.iat = token?.iat
      session.exp = token?.exp
      session.jti = token?.jti
      return session
    },
    async jwt({ token, user, account }: any) {
      token.user = user?.user
      token.type = user?.type || 'user'
      token.jwt = user?.token as string
      return token
    },
  },
  events: {},
  theme: {
    colorScheme: 'light',
  },
  debug: false,
}
