
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres."),
  email: z.string().trim().email("El correo electrónico no es válido."),
  phoneCountryCode: z.string().min(1, "Selecciona el código de país."),
  phoneNumber: z.string().trim().min(6, "El número de WhatsApp debe tener al menos 6 caracteres."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Revisa los datos ingresados." },
        { status: 400 }
      );
    }

    const v = validation.data;

    const exists = await db.user.findUnique({
      where: { email: v.email },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Ese correo ya está registrado. Intenta iniciar sesión." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(v.password, 12);

    const user = await db.user.create({
      data: {
        name: v.name,
        email: v.email,
        phoneCountryCode: v.phoneCountryCode,
        phoneNumber: v.phoneNumber,
        passwordHash,
      },
    });

    await createSession({
      id: user.id,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      { error: "No se pudo crear la cuenta. Revisa los datos o inténtalo más tarde." },
      { status: 500 }
    );
  }
}
