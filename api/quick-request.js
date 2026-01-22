import nodemailer from 'nodemailer';

const requiredFields = ['nombre', 'email', 'rol_organizacion', 'interes'];

const parseBody = async (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  const contentType = req.headers['content-type'] || '';
  const rawBody = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  if (!rawBody) {
    return {};
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(rawBody);
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }

  return {};
};

const buildMissingFields = (payload) =>
  requiredFields.filter((field) => !payload[field] || String(payload[field]).trim() === '');

const buildHtmlDetails = (payload) => `
  <h2>Nueva solicitud rápida</h2>
  <p><strong>Nombre:</strong> ${payload.nombre}</p>
  <p><strong>Correo:</strong> ${payload.email}</p>
  <p><strong>Rol / Organización:</strong> ${payload.rol_organizacion}</p>
  <p><strong>Interés:</strong> ${payload.interes}</p>
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  const payload = await parseBody(req);
  const missingFields = buildMissingFields(payload);

  if (missingFields.length > 0) {
    res.status(400).json({ error: 'Faltan campos obligatorios.', missingFields });
    return;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const mailTo = process.env.MAIL_TO || SMTP_USER;
  const mailFrom = process.env.MAIL_FROM || SMTP_USER;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !mailTo || !mailFrom) {
    res.status(500).json({ error: 'Configuración de correo incompleta.' });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    requireTLS: process.env.SMTP_REQUIRE_TLS === 'true',
  });

  try {
    await Promise.all([
      transporter.sendMail({
        from: `ANNiA <${mailFrom}>`,
        to: mailTo,
        replyTo: payload.email,
        subject: `Nueva solicitud rápida: ${payload.nombre}`,
        text: `Nombre: ${payload.nombre}\nCorreo: ${payload.email}\nRol/Organización: ${payload.rol_organizacion}\nInterés: ${payload.interes}`,
        html: buildHtmlDetails(payload),
      }),
      transporter.sendMail({
        from: `ANNiA <${mailFrom}>`,
        to: payload.email,
        subject: 'Recibimos tu solicitud en ANNiA',
        text:
          '¡Gracias por tu interés! Recibimos tu solicitud y el equipo de ANNiA te contactará pronto con el overview y próximos pasos.',
        html:
          '<p>¡Gracias por tu interés!</p><p>Recibimos tu solicitud y el equipo de ANNiA te contactará pronto con el overview y próximos pasos.</p>',
      }),
    ]);

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo enviar el correo.' });
  }
}
