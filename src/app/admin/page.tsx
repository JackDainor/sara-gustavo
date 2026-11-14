
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Admin() {
  const s = await getSession();

  if (!s || !["ADMIN", "EMPLOYEE"].includes(s.role)) {
    redirect("/login");
  }

  const [pending, verified, rejected, trips, bookings] =
    await Promise.all([
      db.booking.count({
        where: { paymentStatus: "PENDING" },
      }),
      db.booking.count({
        where: { paymentStatus: "VERIFIED" },
      }),
      db.booking.count({
        where: { paymentStatus: "REJECTED" },
      }),
      db.trip.count({
        where: { active: true },
      }),
      db.booking.findMany({
        include: {
          user: true,
          trip: {
            include: {
              destination: true,
              bus: true,
            },
          },
          passengers: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 40,
      }),
    ]);

  const statistics = [
    {
      label: "Pendientes",
      value: pending,
      color: "#b7791f",
    },
    {
      label: "Verificados",
      value: verified,
      color: "#15945b",
    },
    {
      label: "Rechazados",
      value: rejected,
      color: "#dc4545",
    },
    {
      label: "Viajes activos",
      value: trips,
      color: "#1e5aa8",
    },
  ];

  return (
    <>
      <header className="top">
        <b className="brand">
          SARA <span>Y GUSTAVO</span> · ADMIN
        </b>

        <Link href="/" style={{ color: "white" }}>
          Ver sitio
        </Link>
      </header>

      <main className="wrap">
        <h1>Panel administrativo</h1>

        <p className="muted">
          Bienvenido, {s.name}. Control de reservas y operación.
        </p>

        <nav className="adminnav">
          <Link href="/admin">Resumen</Link>
          <Link href="/admin/trips">Viajes y precios</Link>
          <Link href="/admin/buses">Buses</Link>
          <Link href="/admin/destinations">Destinos</Link>
        </nav>

        <div
          className="grid"
          style={{ marginBottom: 20 }}
        >
          {statistics.map((item) => (
            <div className="card" key={item.label}>
              <div className="muted">{item.label}</div>

              <b
                style={{
                  fontSize: 30,
                  color: item.color,
                }}
              >
                {item.value}
              </b>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>Reservas recientes</h2>

          {bookings.length === 0 ? (
            <p className="muted">
              Todavía no hay reservas.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Viaje</th>
                    <th>Asientos</th>
                    <th>Pago</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <b>{b.referenceCode}</b>
                      </td>

                      <td>
                        {b.user.name}
                        <br />
                        <small>
                          {b.user.phoneCountryCode}
                          {b.user.phoneNumber}
                        </small>
                      </td>

                      <td>
                        {b.trip.destination.origin} →{" "}
                        {b.trip.destination.destination}
                        <br />
                        <small>
                          {b.trip.departureAt.toLocaleString("es-BO")}
                        </small>
                      </td>

                      <td>
                        {b.passengers
                          .map((p) => p.seatCode)
                          .join(", ")}
                      </td>

                      <td>{b.paymentStatus}</td>

                      <td>
                        <form
                          action={`/api/admin/bookings/${b.id}/verify`}
                          method="post"
                          style={{ display: "inline" }}
                        >
                          <button
                            className="btn green"
                            disabled={b.paymentStatus !== "PENDING"}
                          >
                            Pago recibido
                          </button>
                        </form>

                        {" "}

                        <form
                          action={`/api/admin/bookings/${b.id}/reject`}
                          method="post"
                          style={{ display: "inline" }}
                        >
                          <button
                            className="btn red"
                            disabled={b.paymentStatus !== "PENDING"}
                          >
                            No recibido
                          </button>
                        </form>

                        <div style={{ marginTop: 6 }}>
                          <a
                            href={`https://wa.me/${(
                              b.user.phoneCountryCode +
                              b.user.phoneNumber
                            ).replace(/\D/g, "")}?text=${encodeURIComponent(
                              "Hola " +
                                b.user.name +
                                ", te contactamos de Sara y Gustavo sobre tu reserva " +
                                b.referenceCode +
                                "."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
