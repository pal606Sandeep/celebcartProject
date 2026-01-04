
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(req:NextRequest){
  const {pathname} = req.nextUrl
  const publicRoutes = ["/signin","/register","/api/auth","/api/socket/connect","/api/socket/update-location","/api/chat/messages","/api/chat/save"]
  if (publicRoutes.some((path)=>pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const session = await auth()
  // console.log(token);
  // console.log(req.url);
  
  if (!session) {
    const loginUrl = new URL("/signin",req.url)
    loginUrl.searchParams.set("callbackUrl",req.url)
    // console.log(loginUrl);
    return NextResponse.redirect(loginUrl) 
  }

   const role = session.user?.role
   if (pathname.startsWith("/user") && role!=="user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
   }
   if (pathname.startsWith("/delivery") && role!=="deliveryBoy") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
   }
   if (pathname.startsWith("/admin") && role!=="admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
   }

  return NextResponse.next()
}

export const config = {
    matcher: [
      '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js)$).*)',
    ],
  };