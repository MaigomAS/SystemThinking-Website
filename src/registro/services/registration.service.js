import { REGISTRATION_STATUS } from '../types/registration.types.js';
import { toIsoNow } from '../utils/date.js';

const defaultApiClient = {
  async saveRegistration(data) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { id: `reg_${Math.random().toString(36).slice(2, 10)}`, ...data };
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
