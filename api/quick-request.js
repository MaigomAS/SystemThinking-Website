import nodemailer from 'nodemailer';

const requiredFields = ['nombre', 'email', 'rol_organizacion', 'interes'];

const parseBody = async (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string' && req.body.trim() !== '') {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      if (req.body.includes('=')) {
        return Object.fromEntries(new URLSearchParams(req.body));
      }
    }
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

const parseBoolean = (value) => String(value).toLowerCase() === 'true';


const messages = {
  es: {
    methodNotAllowed: 'Método no permitido.',
    missingFields: 'Faltan campos obligatorios.',
    mailConfig: 'Configuración de correo incompleta.',
    sendError: 'No se pudo enviar el correo.',
    newRequestSubject: (name) => `Nueva solicitud rápida: ${name}`,
    confirmationSubject: 'Recibimos tu solicitud en ANNiA',
    confirmationText:
      '¡Gracias por tu interés! Recibimos tu solicitud y el equipo de ANNiA te contactará pronto con el overview y próximos pasos.',
    confirmationHtml:
      '<p>¡Gracias por tu interés!</p><p>Recibimos tu solicitud y el equipo de ANNiA te contactará pronto con el overview y próximos pasos.</p>',
  },
  en: {
    methodNotAllowed: 'Method not allowed.',
    missingFields: 'Required fields are missing.',
    mailConfig: 'Mail configuration is incomplete.',
    sendError: "We couldn't send the email.",
    newRequestSubject: (name) => `New quick request: ${name}`,
    confirmationSubject: 'We received your ANNiA request',
    confirmationText:
      "Thank you for your interest! We received your request and the ANNiA team will contact you soon with the overview and next steps.",
    confirmationHtml:
      '<p>Thank you for your interest!</p><p>We received your request and the ANNiA team will contact you soon with the overview and next steps.</p>',
  },
};

const getLanguage = (payload, headers = {}) => {
  const payloadLanguage = String(payload?.language || '').toLowerCase();
  if (payloadLanguage === 'en' || payloadLanguage === 'es') {
    return payloadLanguage;
  }

  const acceptLanguage = String(headers['accept-language'] || '').toLowerCase();
  return acceptLanguage.includes('en') ? 'en' : 'es';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    const language = getLanguage({}, req.headers);
    res.status(405).json({ error: messages[language].methodNotAllowed });
    return;
  }

  const payload = await parseBody(req);
  const language = getLanguage(payload, req.headers);
  const m = messages[language];
  const missingFields = buildMissingFields(payload);

  if (missingFields.length > 0) {
    res.status(400).json({ error: m.missingFields, missingFields });
    return;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const mailTo = process.env.MAIL_TO || 'info@annia.no';
  const mailFrom = process.env.MAIL_FROM || SMTP_USER;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !mailTo || !mailFrom) {
    res.status(500).json({ error: m.mailConfig });
    return;
  }

  const smtpPort = Number(SMTP_PORT);
  const smtpSecure =
    process.env.SMTP_SECURE !== undefined ? parseBoolean(process.env.SMTP_SECURE) : smtpPort === 465;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    requireTLS: parseBoolean(process.env.SMTP_REQUIRE_TLS),
  });

  try {
    await transporter.sendMail({
      from: `ANNiA <${mailFrom}>`,
      to: mailTo,
      replyTo: payload.email,
      subject: m.newRequestSubject(payload.nombre),
      text: `Nombre: ${payload.nombre}\nCorreo: ${payload.email}\nRol/Organización: ${payload.rol_organizacion}\nInterés: ${payload.interes}`,
      html: buildHtmlDetails(payload),
    });

    try {
      await transporter.sendMail({
        from: `ANNiA <${mailFrom}>`,
        to: payload.email,
        subject: m.confirmationSubject,
        text: m.confirmationText,
        html: m.confirmationHtml,
      });
    } catch (confirmationError) {
      console.error('Quick request confirmation email error:', confirmationError);
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Quick request email error:', error);
    res.status(500).json({ error: m.sendError });
  }
}
