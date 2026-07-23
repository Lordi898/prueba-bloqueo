// middleware.js

// 🔴 1. AÑADE AQUÍ TUS DIRECCIONES IP PERMITIDAS
const ALLOWED_IPS = [
  '185.154.255.213', // <-- REEMPLAZA ESTO POR TU IP PÚBLICA REAL
];

export const config = {
  // Aplicar esta regla a TODAS las rutas y archivos de la aplicación
  matcher: '/:path*',
};

export default function middleware(request) {
  // Obtener la IP del cliente enviada por la infraestructura Edge de Vercel
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  
  // Extraer la IP principal si el encabezado contiene múltiples IPs de proxies
  const clientIp = xForwardedFor ? xForwardedFor.split(',')[0].trim() : xRealIp || '0.0.0.0';

  // Comprobar si la IP del usuario está en la lista blanca
  const isAllowed = ALLOWED_IPS.includes(clientIp);

  // Si la IP NO está permitida, devolver pantalla personalizada de Bloqueo 403 Forbidden
  if (!isAllowed) {
    return new Response(
      `<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acceso Restringido</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
          }
          .card {
            background-color: #1e293b;
            border: 1px solid #334155;
            border-radius: 16px;
            padding: 40px 30px;
            max-width: 450px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .icon { font-size: 50px; margin-bottom: 15px; }
          h1 { color: #ef4444; font-size: 24px; margin-bottom: 10px; font-weight: 700; }
          p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 25px; }
          .ip-badge {
            display: inline-block;
            background: #0f172a;
            color: #38bdf8;
            padding: 8px 16px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            border: 1px solid #0284c7;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">🔒</div>
          <h1>403 - Acceso Denegado</h1>
          <p>Esta aplicación es privada. Tu dirección IP no está en la lista de accesos autorizados.</p>
          <div class="ip-badge">Tu IP: ${clientIp}</div>
        </div>
      </body>
      </html>`,
      {
        status: 403,
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
      }
    );
  }

  // Si la IP SÍ está permitida, se continúa con la carga normal del sitio
  return;
}
