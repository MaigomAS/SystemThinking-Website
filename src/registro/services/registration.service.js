import { REGISTRATION_STATUS } from '../types/registration.types.js';
import { toIsoNow } from '../utils/date.js';

const defaultApiClient = {
  async saveRegistration(data) {
    const response = await fetch('/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(payload.error || 'No se pudo enviar la postulación.');
      error.fieldErrors = payload.fieldErrors || {};
      throw error;
    }

    return { ...data, id: payload.id, createdAt: payload.createdAt, status: payload.status };
  },
};

export const createRegistrationService = ({ apiClient, automationService } = {}) => {
  const client = apiClient || defaultApiClient;

  return {
    async submitRegistration(data, config) {
      const payload = {
        ...data,
        status: REGISTRATION_STATUS.NEW,
        createdAt: toIsoNow(),
      };

      const saved = await client.saveRegistration(payload);

      if (config.featureFlags.enableAutoReply) {
        await automationService.sendAutoReply(saved, config);
      }

      if (config.featureFlags.enableInternalNotification) {
        await automationService.notifyInternalTeam(saved, config);
      }

      if (config.featureFlags.enableClassification) {
        await automationService.classifyRegistration(saved, config);
      }

      return saved;
    },
  };
};
