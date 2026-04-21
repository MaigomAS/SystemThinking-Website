const REQUIRED_MESSAGE = 'Este campo es obligatorio.';

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const requiredText = (value) => (!String(value || '').trim() ? REQUIRED_MESSAGE : '');

const emailRule = (value) => {
  if (!String(value || '').trim()) return REQUIRED_MESSAGE;
  if (!isValidEmail(value)) return 'Ingresa un email válido.';
  return '';
};

const fieldRules = {
  fullName: requiredText,
  email: emailRule,
  phone: requiredText,
  organization: requiredText,
  role: requiredText,
  birthDate: requiredText,
  residenceCountry: requiredText,
  bio: requiredText,
  workArea: requiredText,
  educationLevel: requiredText,
  leadershipChallenge: requiredText,
  leadershipQuestion: requiredText,
  currentProjects: requiredText,
  encounterExpectation: requiredText,
  referralSource: () => '',
  reference1FullName: requiredText,
  reference1Organization: requiredText,
  reference1Role: requiredText,
  reference1Email: emailRule,
  reference1Phone: requiredText,
  reference2FullName: requiredText,
  reference2Organization: requiredText,
  reference2Role: requiredText,
  reference2Email: emailRule,
  reference2Phone: requiredText,
  accessibilityNeeds: () => '',
  personalBoundaries: () => '',
  consentData: (value) => (!value ? 'Debes aceptar el tratamiento de datos.' : ''),
  consentCommunity: (value) => (!value ? 'Debes aceptar lineamientos de comunidad.' : ''),
};

export const validateRegistration = (formData) => {
  const errors = Object.entries(fieldRules).reduce((acc, [key, validator]) => {
    const error = validator(formData[key]);
    if (error) acc[key] = error;
    return acc;
  }, {});

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
};
