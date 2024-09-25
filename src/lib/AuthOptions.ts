/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/lib/Schemas/UserSchema";
import { dbConnect, dbDisconnect } from "@/config/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
// import { IUser } from "./Types";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await dbConnect();

        try {
          const user = await User.findOne({ email: credentials?.email });

          if (user) {
            const isPasswordCorrect = await compare(
              credentials.password,
              user.password
            );

            if (isPasswordCorrect) {
              // Only return relevant user data for the token
              return {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                google: user.google,
                events: user.events,
                tickets: user.tickets,
                notifications: user.notifications,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              };
            }
          }
          throw new Error("Invalid credentials");
        } catch (err: any) {
          throw new Error(err.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // This callback is invoked whenever a JWT is created or updated
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.image = user.image;
        token.google = user.google;
        token.events = user.events;
        token.tickets = user.tickets;
        token.notifications = user.notifications;
        token.role = user.role;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;

        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
        token.exp = expirationTime;
      }

      return token;
    },

    session: async ({ session }: any) => {
      // Attach the user data stored in JWT to the session object
      try {
        await dbConnect();
        const sessionUser = await User.findOne({ email: session.user.email });

        if (sessionUser) {
          session.user.id = sessionUser._id;
          session.user.name = sessionUser.name;
          session.user.email = sessionUser.email;
          session.user.phone = sessionUser.phone;
          session.user.image = sessionUser.image;
          session.user.google = sessionUser.google;
          session.user.events = sessionUser.events;
          session.user.tickets = sessionUser.tickets;
          session.user.notifications = sessionUser.notifications;
          session.user.role = sessionUser.role;
          session.user.createdAt = sessionUser.createdAt;
          session.user.updatedAt = sessionUser.updatedAt;
        }
        return session;
      } catch (err: any) {
        throw new Error(err);
      } finally {
        dbDisconnect();
      }
    },
    async signIn({ profile, credentials }: any) {
      try {
        await dbConnect();

        // Handle Google OAuth login (profile will exist)
        if (profile) {
          const profileUser = await User.findOne({ email: profile.email });

          if (!profileUser) {
            // Create a new user if they don't already exist
            await User.create({
              name: profile.name,
              email: profile.email,
              image: profile.picture,
              google: true, // Mark as Google sign-in
            });
          }
          return true; // Allow the sign-in
        }

        // Handle Credentials-based login (credentials will exist)
        if (credentials) {
          // console.log("Credentials:", credentials);
          const credentialUser = await User.findOne({
            email: credentials.email,
          });

          if (credentialUser) {
            return true; // User exists, allow sign-in
          }
          return false; // User doesn't exist, deny sign-in
        }

        return false; // If neither profile nor credentials are provided, deny sign-in
      } catch (error) {
        console.log("SignIn Error:", error);
        return false;
      } finally {
        dbDisconnect();
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2, // Optional: session maxAge (in seconds) for automatic session expiration
  },
};
