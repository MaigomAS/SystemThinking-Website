import fs from 'node:fs/promises';
import path from 'node:path';
import nodemailer from 'nodemailer';

const REQUIRED_FIELDS = [
  'fullName',
  'email',
  'phone',
  'organization',
  'role',
  'birthDate',
  'residenceCountry',
  'bio',
  'workArea',
  'educationLevel',
  'leadershipChallenge',
  'leadershipQuestion',
  'currentProjects',
  'encounterExpectation',
  'reference1FullName',
  'reference1Organization',
  'reference1Role',
  'reference1Email',
  'reference1Phone',
  'reference2FullName',
  'reference2Organization',
  'reference2Role',
  'reference2Email',
  'reference2Phone',
];

const EMAIL_FIELDS = ['email', 'reference1Email', 'reference2Email'];

const parseBoolean = (value) => String(value).toLowerCase() === 'true';

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(String(value || '').trim());

const toString = (value) => (value === null || value === undefined ? '' : String(value).trim());

const normalizePayload = (payload = {}) => ({
  fullName: toString(payload.fullName),
  email: toString(payload.email).toLowerCase(),
  phone: toString(payload.phone),
  organization: toString(payload.organization),
  role: toString(payload.role),
  birthDate: toString(payload.birthDate),
  residenceCountry: toString(payload.residenceCountry),
  bio: toString(payload.bio),
  workArea: toString(payload.workArea),
  educationLevel: toString(payload.educationLevel),
  leadershipChallenge: toString(payload.leadershipChallenge),
  leadershipQuestion: toString(payload.leadershipQuestion),
  currentProjects: toString(payload.currentProjects),
  encounterExpectation: toString(payload.encounterExpectation),
  referralSource: toString(payload.referralSource),
  reference1FullName: toString(payload.reference1FullName),
  reference1Organization: toString(payload.reference1Organization),
  reference1Role: toString(payload.reference1Role),
  reference1Email: toString(payload.reference1Email).toLowerCase(),
  reference1Phone: toString(payload.reference1Phone),
  reference2FullName: toString(payload.reference2FullName),
  reference2Organization: toString(payload.reference2Organization),
  reference2Role: toString(payload.reference2Role),
  reference2Email: toString(payload.reference2Email).toLowerCase(),
  reference2Phone: toString(payload.reference2Phone),
  accessibilityNeeds: toString(payload.accessibilityNeeds),
  personalBoundaries: toString(payload.personalBoundaries),
  consentData: Boolean(payload.consentData),
  consentCommunity: Boolean(payload.consentCommunity),
  programKey: toString(payload.programKey) || 'system-thinking-2026',
});

const validatePayload = (payload) => {
  const fieldErrors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!toString(payload[field])) {
      fieldErrors[field] = 'Este campo es obligatorio.';
    }
  });

  EMAIL_FIELDS.forEach((field) => {
    if (toString(payload[field]) && !isEmail(payload[field])) {
      fieldErrors[field] = 'Ingresa un email válido.';
    }
  });

  if (!payload.consentData) {
    fieldErrors.consentData = 'Debes aceptar el tratamiento de datos.';
  }

  if (!payload.consentCommunity) {
    fieldErrors.consentCommunity = 'Debes aceptar lineamientos de comunidad.';
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
};

const parseBody = async (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string' && req.body.trim() !== '') {
    return JSON.parse(req.body);
  }

  const rawBody = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  if (!rawBody) return {};
  return JSON.parse(rawBody);
};

const persistToLocalFile = async (record) => {
  const filePath = process.env.REGISTRO_FILE_PATH || path.join(process.cwd(), 'data', 'registro-submissions.ndjson');
  const directory = path.dirname(filePath);
  await fs.mkdir(directory, { recursive: true });
  await fs.appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');
  return filePath;
};

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  const smtpPort = Number(SMTP_PORT);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: smtpPort,
    secure: process.env.SMTP_SECURE !== undefined ? parseBoolean(process.env.SMTP_SECURE) : smtpPort === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    requireTLS: parseBoolean(process.env.SMTP_REQUIRE_TLS),
  });
};

const sendInternalNotification = async ({ transporter, mailFrom, mailTo, record }) => {
  const subject = `Nueva postulación recibida · ${record.programKey}`;
  const text = [
    `Nombre: ${record.fullName}`,
    `Email: ${record.email}`,
    `Organización: ${record.organization}`,
    `Cargo: ${record.role}`,
    `Residencia actual: ${record.residenceCountry}`,
    `Área de trabajo: ${record.workArea}`,
    `Fecha de envío: ${record.createdAt}`,
    '',
    'Resumen de respuestas clave:',
    `- Reto principal: ${record.leadershipChallenge}`,
    `- Inquietud de liderazgo: ${record.leadershipQuestion}`,
    `- Proyectos actuales: ${record.currentProjects}`,
    `- Expectativa del encuentro: ${record.encounterExpectation}`,
  ].join('\n');

  await transporter.sendMail({
    from: `ANNiA Registro <${mailFrom}>`,
    to: mailTo,
    replyTo: record.email,
    subject,
    text,
  });
};

const sendApplicantConfirmation = async ({ transporter, mailFrom, record }) => {
  const subject = 'Confirmación de postulación · #SystemThinking2026';
  const text = [
    `Hola ${record.fullName},`,
    '',
    'Gracias por completar tu registro para #SystemThinking2026.',
    'Hemos recibido tu solicitud y el equipo de ANNiA te contactará con próximos pasos del proceso.',
    '',
    'Este es un correo de confirmación automática.',
    '',
    'ANNiA',
  ].join('\n');

  await transporter.sendMail({
    from: `ANNiA Registro <${mailFrom}>`,
    to: record.email,
    subject,
    text,
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  let parsed;
  try {
    parsed = await parseBody(req);
  } catch (error) {
    console.error('registro: invalid json payload', error);
    res.status(400).json({ error: 'Payload JSON inválido.' });
    return;
  }

  const payload = normalizePayload(parsed);
  const validation = validatePayload(payload);

  if (!validation.valid) {
    res.status(400).json({ error: 'Hay campos por corregir.', fieldErrors: validation.fieldErrors });
    return;
  }

  const record = {
    ...payload,
    id: `reg_${Math.random().toString(36).slice(2, 10)}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const storageMode = process.env.REGISTRO_STORAGE_MODE || 'mailbox_only';

  try {
    if (storageMode === 'file_local') {
      const filePath = await persistToLocalFile(record);
      console.info('registro: persisted to local file', { filePath, id: record.id });
    } else {
      console.info('registro: storage mode mailbox_only (no file persistence)');
    }
  } catch (error) {
    console.error('registro: persistence error', error);
    res.status(500).json({ error: 'No se pudo persistir la postulación.' });
    return;
  }

  const transporter = createTransporter();
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
  const mailTo = process.env.REGISTRO_INTERNAL_TO || process.env.MAIL_TO || process.env.SMTP_USER;

  if (!transporter || !mailFrom || !mailTo) {
    res.status(500).json({
      error: 'Configuración de correo incompleta.',
      details: 'Define SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM y REGISTRO_INTERNAL_TO/MAIL_TO.',
    });
    return;
  }

  try {
    await sendInternalNotification({ transporter, mailFrom, mailTo, record });
    await sendApplicantConfirmation({ transporter, mailFrom, record });
  } catch (error) {
    console.error('registro: email delivery error', error);
    res.status(502).json({ error: 'La postulación se recibió, pero falló el envío de correos.' });
    return;
  }

  res.status(200).json({
    ok: true,
    id: record.id,
    createdAt: record.createdAt,
    status: record.status,
    storageMode,
  });
}
