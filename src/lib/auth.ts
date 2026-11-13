import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "dev-only-change-this-secret-please-123456");
export async function createSession(user:{id:string;role:string;name:string}) {
 const token=await new SignJWT(user).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(secret);
 (await cookies()).set("sg_session",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7});
}
export async function getSession() {
 const token=(await cookies()).get("sg_session")?.value;
 if(!token) return null;
 try { return (await jwtVerify(token,secret)).payload as {id:string;role:string;name:string}; } catch { return null; }
}
export async function requireAdmin() {
 const s=await getSession(); if(!s || !["ADMIN","EMPLOYEE"].includes(s.role)) throw new Error("NO_AUTH"); return s;
}