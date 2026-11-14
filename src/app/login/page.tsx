
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const [mode, setMode] = useState("register");
  const [name, SN] = useState("");
  const [email, SE] = useState("");
  const [code, SC] = useState("+55");
  const [phone, SP] = useState("");
  const [password, SPW] = useState("");
  const [msg, SM] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    SM("Procesando...");

    try {
      const r = await fetch(
        "/api/auth/" + (mode === "register" ? "register" : "login"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phoneCountryCode: code,
            phoneNumber: phone,
            password,
          }),
        }
      );

      const d = await r.json();

      if (!r.ok) {
        SM(d.error || "No se pudo ingresar.");
        setLoading(false);
        return;
      }

      window.location.href = params.get("next") || "/account";
    } catch {
      SM("Error de conexión. Inténtalo nuevamente.");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="top">
        <Link
          href="/"
          style={{ color: "white", textDecoration: "none" }}
          className="brand"
        >
          SARA <span>Y GUSTAVO</span>
        </Link>

        <small>Cuenta de pasajero</small>
      </header>

      <main className="wrap">
        <div className="card auth">
          <h1>
            {mode === "register"
              ? "Crear cuenta"
              : "Bienvenido de nuevo"}
          </h1>

          <p className="muted">
            Regístrate para reservar y administrar tus pasajes.
          </p>

          <form onSubmit={submit}>
            {mode === "register" && (
              <div className="field">
                <label>Nombre completo</label>
                <input
                  required
                  value={name}
                  onChange={(e) => SN(e.target.value)}
                />
              </div>
            )}

            <div className="field">
              <label>Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => SE(e.target.value)}
              />
            </div>

            {mode === "register" && (
              <div className="grid">
                <div className="field">
                  <label>Código de país</label>

                  <select
                    value={code}
                    onChange={(e) => SC(e.target.value)}
                  >
                    {[
                      ["+55", "Brasil"],
                      ["+591", "Bolivia"],
                      ["+54", "Argentina"],
                      ["+51", "Perú"],
                      ["+56", "Chile"],
                      ["+595", "Paraguay"],
                      ["+598", "Uruguay"],
                      ["+57", "Colombia"],
                      ["+52", "México"],
                      ["+1", "EE.UU. / Canadá"],
                      ["+34", "España"],
                    ].map((x) => (
                      <option value={x[0]} key={x[0]}>
                        {x[1]} ({x[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>WhatsApp</label>
                  <input
                    required
                    value={phone}
                    onChange={(e) => SP(e.target.value)}
                    placeholder="Número sin código"
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label>Contraseña</label>
              <input
                type="password"
                minLength={8}
                required
                value={password}
                onChange={(e) => SPW(e.target.value)}
              />
            </div>

            <button
              className="btn"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : mode === "register"
                  ? "Crear cuenta"
                  : "Ingresar"}
            </button>
          </form>

          {msg && <p className="error">{msg}</p>}

          <p className="muted">
            {mode === "register"
              ? "¿Ya tienes cuenta?"
              : "¿No tienes cuenta?"}

            {" "}

            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setMode(mode === "register" ? "login" : "register");
                SM("");
              }}
            >
              {mode === "register" ? "Ingresar" : "Registrarme"}
            </button>
          </p>

          <Link href="/">Volver al inicio</Link>
        </div>
      </main>
    </>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <main className="wrap">
          <div className="card">
            Cargando cuenta de pasajero...
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
