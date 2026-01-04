import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ConnectDB } from "./lib/db"
import User from "./models/user.model"
import bcrypt from "bcryptjs"
import { SegmentBoundaryTriggerNode } from "next/dist/next-devtools/userspace/app/segment-explorer-node"

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
          email: { label: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, request) {
            
              await ConnectDB()

              const email = credentials.email
              const password = credentials.password as string

              const user = await User.findOne({email})
              if (!user) {
               throw new Error("No user found with this email")
              }

              const isPasswordCorrect = await bcrypt.compare(password, user.password)
              if (!isPasswordCorrect) {
                throw new Error("Inncorect Password")
              }
              return{
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
              }    
        },
      }),
  ],

  callbacks:{
    jwt({token, user, session}) {
       if (user) {
        token.id = user.id,
        token.email = user.email,
        token.name = user.name,
        token.role = user.role
       }
      //  if (trigger=="update") {
      //   token.role=session.role
      //  }
       return token
    },
    session({session, token}) {
        if (session.user) {
          session.user.id = token.id as string,
          session.user.email = token.email as string,
          session.user.name = token.name as string,
          session.user.role = token.role as string
        }
        return session
    }
  },
  pages:{
    signIn:"/login",
    error:"/login"
  },
  session:{
    strategy:"jwt",
    maxAge:7*24*60*60*1000
  },
  secret:process.env.AUTH_SECRET

})