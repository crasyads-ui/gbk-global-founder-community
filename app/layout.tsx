import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"GBK Global Founder Community",description:"Global blockchain + AI founder community dashboard."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}