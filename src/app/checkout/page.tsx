 
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CheckoutContent() {
  const q = useSearchParams();

  const trip = q.get("trip") || "";
  const seats = (q.get("seats") || "").split(",").filter(Boolean);
  const currency = q.get("currency") || "BRL";

  const [method, setMethod] = useState("PIX");
  const [passengers, setPassengers] = useState(
    seats.map((seatCode) => ({
      seatCode,
      fullName: "",
      idNumber: "",
    }))
  );
  const [msg, setMsg] = useState("");

  return (
    <>
      <header className="top">
        <b className="brand">
          SARA <span>Y GUSTAVO</span>
        </b>
        <Link href="/" style={{ color: "white" }}>
          Inicio
        </Link>
      </header>

      <main className="wrap">
        <div className="card" style={{ maxWidth: 760, margin: "auto" }}>
          <h1>Completar reserva</h1>

          <div className="notice">
            Los asientos se bloquearán durante 2 horas al enviar la solicitud.
            La reserva solo será confirmada después de verificar el pago.
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setMsg("Enviando reserva...");

              try {
                const form = new FormData(e.currentTarget);

                const r = await fetch("/api/bookings", {
                  method: "POST",
                  body: form,
                });

                const d = await r.json();

                setMsg(
                  r.ok
                    ? `Reserva creada: ${d.referenceCode}. Sube documentos y comprobante desde el área de cliente o espera instrucciones del administrador.`
                    : d.error || "Error al crear reserva."
                );
              } catch {
                setMsg("No se pudo conectar con el servidor. Inténtalo nuevamente.");
              }
            }}
          >
            <input type="hidden" name="tripId" value={trip} />
            <input type="hidden" name="currency" value={currency} />
            <input type="hidden" name="seats" value={seats.join(",")} />

            {passengers.map((p, i) => (
              <div
                key={p.seatCode}
                className="card"
                style={{ margin: "15px 0", padding: 16 }}
              >
                <h3>Pasajero · Asiento {p.seatCode}</h3>

                <div className="field">
                  <label>Nombre completo</label>
                  <input
                    required
                    name={`name_${i}`}
                    value={p.fullName}
                    onChange={(e) =>
                      setPassengers((a) =>
                        a.map((x, j) =>
                          i === j ? { ...x, fullName: e.target.value } : x
                        )
                      )
                    }
                  />
                </div>

                <div className="field">
                  <label>Número de carnet / documento</label>
                  <input
                    required
                    name={`id_${i}`}
                    value={p.idNumber}
                    onChange={(e) =>
                      setPassengers((a) =>
                        a.map((x, j) =>
                          i === j ? { ...x, idNumber: e.target.value } : x
                        )
                      )
                    }
                  />
                </div>
              </div>
            ))}

            <div className="field">
              <label>Método de pago</label>
              <select
                name="paymentMethod"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="PIX">Pix</option>
                <option value="TRANSFER">Transferencia bancaria</option>
              </select>
            </div>

            <p className="muted">
              Después de crear la reserva deberás adjuntar el carnet por ambos
              lados de cada pasajero y el comprobante de pago. El administrador
              revisará manualmente el pago.
            </p>

            <button className="btn" disabled={msg === "Enviando reserva..."}>
              {msg === "Enviando reserva..."
                ? "Enviando..."
                : "Enviar solicitud de reserva"}
            </button>
          </form>

          {msg && <p>{msg}</p>}
        </div>
      </main>
    </>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <main className="wrap">
          <div className="card">Cargando formulario de reserva...</div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
