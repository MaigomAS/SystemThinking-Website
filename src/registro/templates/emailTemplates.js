export const buildConfirmationMessage = ({ fullName, programName }) => ({
  subject: `Confirmación de registro · ${programName}`,
  body: `Hola ${fullName || 'postulante'}, tu registro para ${programName} fue recibido correctamente. Te compartiremos próximos pasos por este canal.`,
});

export const buildInternalNotification = ({ fullName, organization, role, programName }) => ({
  subject: `Nuevo registro · ${programName}`,
  body: `Nueva postulación de ${fullName || 'Postulante'} (${role || 'Rol no declarado'} · ${organization || 'Organización no declarada'}).`,
});
