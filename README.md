# Sara y Gustavo — Sistema de reservas

Aplicación web PWA preparada para GitHub + Vercel + Neon PostgreSQL.

## Importante: estado de esta entrega
Esta es la **base funcional inicial** del proyecto: interfaz responsive, registro/login, modelos de datos, publicación de rutas/buses/viajes, selección visual de asientos, solicitud de reserva, aprobación/rechazo administrativo y estructura PWA.

Antes de recibir reservas reales hay que completar y probar el flujo de carga privada de documentos, PDF final, notificaciones Telegram y conexión de WhatsApp. No publiques el sistema con documentos reales hasta completar esos módulos y revisar seguridad/privacidad.

## Requisitos
- Node.js 20+
- Proyecto Neon PostgreSQL
- Cuenta Vercel y GitHub
- (Para archivos privados) bucket privado Cloudflare R2

## Instalación
1. Descomprime el ZIP y sube la carpeta a un repositorio privado de GitHub.
2. En Neon crea una base PostgreSQL y copia la cadena de conexión.
3. Copia `.env.example` a `.env` y completa `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_SETUP_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. En terminal ejecuta:
   ```bash
   npm install
   npx prisma db push
   npx tsx prisma/seed.ts
   npm run dev
   ```
5. Abre `http://localhost:3000`.
6. Inicia sesión como administrador en `/login`; después abre `/admin`.
7. Agrega destinos, buses y viajes. Los viajes públicos aparecen en la página principal.

## Despliegue en Vercel
1. Importa el repositorio en Vercel.
2. Configura las variables de `.env.example` en Project Settings → Environment Variables.
3. En Build Command usa `npx prisma generate && next build`.
4. Ejecuta `npx prisma db push` una vez contra la base Neon (local o job seguro).
5. Despliega.

## Variables de entorno
Consulta `.env.example`. Nunca subas `.env` a GitHub. No compartas tokens por chat ni los pongas en el frontend.

## Arquitectura
- Vercel / Next.js: interfaz y API.
- Neon: datos estructurados.
- Cloudflare R2 privado: carnets y comprobantes (pendiente de integrar el flujo de subida).
- Telegram Bot: notificación interna (pendiente de integración).
- WhatsApp: enlace manual de contacto; envío de PDF/recordatorios por API oficial queda como siguiente módulo.

## Reglas de operación recomendadas
- El asiento se mantiene bloqueado 2 horas.
- Confirmar pago cambia los asientos a ocupados.
- Rechazar pago libera los asientos.
- Los documentos de identidad deben tener acceso privado y retención limitada.
- No guardar imágenes dentro de PostgreSQL.
- Para concurrencia real, antes de producción se debe endurecer la transacción de reserva con bloqueos SQL y una restricción de exclusión/actualización atómica; la interfaz actual no sustituye esa prueba.

## Pendiente para producción
- Carga segura de 3 imágenes por pasajero (carnet frente/reverso y comprobante por reserva), validación MIME/tamaño, URL firmada privada.
- Telegram `sendPhoto` para adjuntar las imágenes a la notificación administrativa.
- Generación de boleto PDF con código de 6 dígitos y endpoint de descarga protegido.
- Botones de envío manual WhatsApp con PDF adjunto y recordatorio.
- Verificación de código en puerta, expiración automática de reservas y cron de recordatorios/limpieza.
- Gestión completa de empleados, edición/desactivación de destinos y buses, y auditoría ampliada.
- Pruebas de seguridad, rate limiting, protección CSRF, recuperación de contraseña y políticas LGPD.

## Nota
Los precios BRL y BOB se fijan por viaje desde el panel. No hay cobro automático: el pasajero paga por Pix o transferencia y el administrador verifica manualmente el comprobante.
