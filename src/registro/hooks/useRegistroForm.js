import { useMemo, useState } from 'react';
import { validateRegistration } from '../lib/schema.js';
import { createEmptyRegistration } from '../types/registration.types.js';

export const useRegistroForm = ({ config, registrationService }) => {
  const initialData = useMemo(() => createEmptyRegistration(config.programKey), [config.programKey]);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const reset = () => {
    setFormData(initialData);
    setErrors({});
    setStatus('idle');
    setSubmitError('');
  };

  const submit = async () => {
    const result = validateRegistration(formData);
    if (!result.success) {
      setErrors(result.errors);
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setSubmitError('');

    try {
      await registrationService.submitRegistration(formData, config);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      if (error?.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setErrors(error.fieldErrors);
      }
      setSubmitError(error?.message || config.texts.errors.submitFailed);
    }
  };

  return {
    formData,
    errors,
    status,
    submitError,
    updateField,
    submit,
    reset,
  };
};
