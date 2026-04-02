import { buildConfirmationMessage, buildInternalNotification } from '../templates/emailTemplates.js';

export const createAutomationService = ({ transport } = {}) => {
  const safeTransport = transport || {
    async dispatch() {
      return { delivered: true };
    },
  };

  return {
    async sendAutoReply(payload, config) {
      const message = buildConfirmationMessage({ ...payload, programName: config.programName });
      return safeTransport.dispatch({ channel: 'email', to: payload.email, message });
    },
    async notifyInternalTeam(payload, config) {
      const message = buildInternalNotification({ ...payload, programName: config.programName });
      return safeTransport.dispatch({ channel: 'internal', message });
    },
    async classifyRegistration(payload) {
      const urgency = payload.attendanceAvailability === 'Disponible parcialmente' ? 'follow_up' : 'normal';
      return { segment: payload.sector || 'general', urgency };
    },
  };
};
