import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider"
import StoreProvider from "@/redux/StoreProvider";
import ReduxUser from "@/ReduxUser";



export const metadata: Metadata = {
  title: "Celebcart | takes 10 minutes for delivery",
  description: "takes 10 minutes for delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='w-full min-h-screen bg-linear-to-b from-green-100 to-white'>
        <Provider>
          <StoreProvider>
            <ReduxUser/>
          {children}
          </StoreProvider>
        
        </Provider>
      </body>
    </html>
  );
}
