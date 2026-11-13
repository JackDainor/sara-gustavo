import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
async function main(){
 const email=process.env.ADMIN_EMAIL, password=process.env.ADMIN_PASSWORD;
 if(!email || !password) throw new Error("Configura ADMIN_EMAIL y ADMIN_PASSWORD");
 await db.user.upsert({where:{email},update:{},create:{name:"Administrador",email,phoneCountryCode:"+55",phoneNumber:"",passwordHash:await bcrypt.hash(password,12),role:"ADMIN"}});
 console.log("Administrador inicial creado/verificado.");
}
main().finally(()=>db.$disconnect());