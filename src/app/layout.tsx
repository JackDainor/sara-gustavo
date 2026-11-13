import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Sara y Gustavo | Viajes",description:"Reserva tus pasajes entre Brasil y Bolivia.",manifest:"/manifest.json"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}