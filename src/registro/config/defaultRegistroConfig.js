import { REGISTRO_EVENT } from './event.js';

const defaultTexts = {
  eyebrow: 'ANNiA · Admisiones',
  title: `Registro de liderazgo · ${REGISTRO_EVENT.eventNameShort}`,
  subtitle: REGISTRO_EVENT.eventNameFull,
  eventMeta: REGISTRO_EVENT.eventLocationDate,
  intro:
    'Este registro nos permite comprender tu trayectoria, el contexto donde lideras y el tipo de impacto que deseas habilitar. Cada solicitud es evaluada por el equipo académico y estratégico del encuentro.',
  sectionTitles: {
    identity: '01 · Identidad y contexto',
    profile: '02 · Trayectoria y perfil',
    leadership: '03 · Momento de liderazgo',
    references: '04 · Participación y referencias',
    considerations: '05 · Consideraciones de participación',
    consent: '06 · Consentimientos',
  },
  sectionDescriptions: {
    identity: 'Información base para comprender tu contexto actual.',
    profile: 'Este bloque nos ayuda a entender tu recorrido profesional y nivel de formación.',
    leadership:
      'Buscamos comprender el momento que atraviesas como líder y el tipo de desafíos que estás abordando actualmente.',
    references:
      'Esta información nos permite contextualizar tu participación y comprender mejor tu trayectoria profesional.',
    considerations: 'Comparte cualquier consideración relevante para acompañar tu participación de forma adecuada.',
    consent: 'Necesarios para procesar tu solicitud y habilitar la comunicación oficial sobre el encuentro.',
  },
  notes: {
    cvPlaceholder:
      'CV o perfil ampliado (opcional): Si deseas complementar tu postulación con una hoja de vida o perfil profesional, podrás adjuntarlo aquí en futuras versiones.',
    letterPlaceholder:
      'Carta o nota complementaria (opcional): Si deseas ampliar tu postulación con una reflexión adicional, podrás adjuntarla en futuras versiones.',
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
      notes: { ...defaultTexts.notes, ...(overrides.texts?.notes || {}) },
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
  educationLevels: [
    'Secundaria',
    'Técnico o tecnólogo',
    'Pregrado',
    'Especialización',
    'Maestría',
    'Doctorado',
    'Otro',
  ],
};
