import { REGISTRO_EVENT } from './event.js';

const defaultTexts = {
  eyebrow: 'ANNiA · Admisiones',
  title: `Registro de liderazgo · ${REGISTRO_EVENT.eventNameShort}`,
  subtitle: REGISTRO_EVENT.eventNameFull,
  eventMeta: REGISTRO_EVENT.eventLocationDate,
  intro:
    'Este registro nos permite comprender tu trayectoria, el contexto donde lideras y el tipo de impacto que deseas habilitar. Cada aplicación es evaluada por el equipo académico y estratégico de ANNiA para este encuentro.',
  sectionTitles: {
    identity: '01 · Identidad profesional',
    profile: '02 · Contexto y trayectoria',
    contact: '03 · Canales de coordinación',
    participation: '04 · Tu participación en el encuentro',
    consent: '05 · Confirmaciones',
  },
  sectionDescriptions: {
    identity: 'Comencemos con los datos base de identificación.',
    profile: 'Buscamos entender tu rol, sector y marco de influencia.',
    contact: 'Estos canales se usan para confirmación y seguimiento del proceso.',
    participation: 'Aquí evaluamos motivación, disponibilidad y punto de entrada al encuentro.',
    consent: 'Necesario para procesar la aplicación y habilitar comunicación oficial.',
  },
  actions: {
    submit: 'Enviar postulación',
    submitting: 'Enviando registro de forma segura…',
    reset: 'Registrar una nueva postulación',
    nextSteps: 'Ver próximos pasos del encuentro',
  },
  states: {
    loading: 'Validando y preparando tu registro…',
    errorTitle: 'Revisemos algunos datos',
  },
  success: {
    title: 'Tu postulación fue recibida',
    description:
      'Gracias por completar el registro. Recibirás un correo de confirmación y, en la siguiente ventana de revisión, te compartiremos estado, logística y recursos de preparación.',
    steps: [
      'Confirmación automática por email en los próximos minutos.',
      'Revisión de perfil por el comité de admisiones ANNiA.',
      'Contacto con siguientes pasos, materiales y agenda del encuentro.',
    ],
  },
  errors: {
    submitFailed:
      'No logramos completar el envío por una interrupción temporal. Tu información sigue segura; intenta nuevamente en unos minutos.',
  },
};

const defaultTemplates = {
  confirmationSubject: 'Confirmación de registro · {{programName}}',
  internalNotificationSubject: 'Nuevo registro recibido · {{programName}}',
};

const defaultUrls = {
  privacyPolicy: 'https://annia.no/privacy',
  communityGuidelines: 'https://annia.no/community',
  nextSteps: 'https://annia.no',
};

export const createRegistroConfig = (overrides = {}) => {
  const programName = overrides.programName || REGISTRO_EVENT.eventNameShort;
  const programKey = overrides.programKey || REGISTRO_EVENT.eventKey;

  return {
    programName,
    programKey,
    event: { ...REGISTRO_EVENT, ...(overrides.event || {}) },
    texts: {
      ...defaultTexts,
      ...overrides.texts,
      sectionTitles: { ...defaultTexts.sectionTitles, ...(overrides.texts?.sectionTitles || {}) },
      sectionDescriptions: {
        ...defaultTexts.sectionDescriptions,
        ...(overrides.texts?.sectionDescriptions || {}),
      },
      actions: { ...defaultTexts.actions, ...(overrides.texts?.actions || {}) },
      states: { ...defaultTexts.states, ...(overrides.texts?.states || {}) },
      success: {
        ...defaultTexts.success,
        ...(overrides.texts?.success || {}),
        steps: overrides.texts?.success?.steps || defaultTexts.success.steps,
      },
      errors: { ...defaultTexts.errors, ...(overrides.texts?.errors || {}) },
    },
    emailTemplates: { ...defaultTemplates, ...(overrides.emailTemplates || {}) },
    urls: { ...defaultUrls, ...(overrides.urls || {}) },
    featureFlags: {
      enableAutoReply: true,
      enableInternalNotification: true,
      enableClassification: true,
      ...overrides.featureFlags,
    },
  };
};

export const registroOptions = {
  sectors: [
    'Educación',
    'Salud',
    'Tecnología',
    'Consultoría',
    'Sector público',
    'Impacto social',
    'Otro',
  ],
  attendanceAvailability: ['Disponible para todas las sesiones', 'Disponible parcialmente', 'Necesito revisar agenda'],
  referralSource: ['Comunidad ANNiA', 'Recomendación directa', 'LinkedIn', 'Evento', 'Otro'],
};
