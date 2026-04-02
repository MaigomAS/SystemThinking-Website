export const buildConfirmationMessage = ({ firstName, programName }) => ({
  subject: `Confirmación de registro · ${programName}`,
  body: `Hola ${firstName}, tu registro para ${programName} fue recibido correctamente. Te compartiremos próximos pasos por este canal.`,
});

export const buildInternalNotification = ({ firstName, lastName, organization, programName }) => ({
  subject: `Nuevo registro · ${programName}`,
  body: `Nueva postulación de ${firstName} ${lastName} (${organization || 'Organización no declarada'}).`,
});
