const REQUIRED_MESSAGE = 'Este campo es obligatorio.';

const isValidUrl = (value) => {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const fieldRules = {
  firstName: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  lastName: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  role: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  organization: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  sector: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  organizationWebsite: (value) => (!isValidUrl(value) ? 'Ingresa una URL válida (https://...).': ''),
  whatsapp: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  email: (value) => {
    if (!value.trim()) return REQUIRED_MESSAGE;
    if (!isValidEmail(value)) return 'Ingresa un email válido.';
    return '';
  },
  professionalProfileUrl: (value) => (!isValidUrl(value) ? 'Ingresa una URL válida (https://...).': ''),
  bio: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  motivation: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  attendanceAvailability: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  referralSource: (value) => (!value.trim() ? REQUIRED_MESSAGE : ''),
  questions: () => '',
  consentData: (value) => (!value ? 'Debes aceptar el tratamiento de datos.' : ''),
  consentCommunity: (value) => (!value ? 'Debes aceptar lineamientos de comunidad.' : ''),
};

export const validateRegistration = (formData) => {
  const errors = Object.entries(fieldRules).reduce((acc, [key, validator]) => {
    const error = validator(formData[key]);
    if (error) acc[key] = error;
    return acc;
  }, {});

  if (formData.referralSource === 'Recomendación directa' && !formData.referralName.trim()) {
    errors.referralName = 'Indica quién te recomendó.';
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
};
