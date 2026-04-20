import { createRegistroConfig, registroOptions } from './config/defaultRegistroConfig.js';
import FieldCheckbox from './components/FieldCheckbox.jsx';
import FieldInput from './components/FieldInput.jsx';
import FieldSelect from './components/FieldSelect.jsx';
import FieldTextarea from './components/FieldTextarea.jsx';
import { useRegistroForm } from './hooks/useRegistroForm.js';
import { createAutomationService } from './services/automation.service.js';
import { createRegistrationService } from './services/registration.service.js';
import SectionCard from './sections/SectionCard.jsx';
import './registro.css';

function RegistroPage({ config: customConfig, services = {} }) {
  const config = createRegistroConfig(customConfig);
  const automationService = services.automationService || createAutomationService();
  const registrationService =
    services.registrationService || createRegistrationService({ apiClient: services.apiClient, automationService });

  const { formData, errors, status, submitError, updateField, submit, reset, showReferralName } = useRegistroForm({
    config,
    registrationService,
  });

  if (status === 'success') {
    return (
      <main className="registro-shell registro-shell--success">
        <article className="registro-success-card">
          <p className="registro-eyebrow">{config.programName}</p>
          <h1>{config.texts.success.title}</h1>
          <p>{config.texts.success.description}</p>
          <ul className="registro-success-list">
            {config.texts.success.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <div className="registro-success-actions">
            <a className="registro-button registro-button--ghost" href={config.urls.nextSteps}>
              {config.texts.actions.nextSteps}
            </a>
            <button type="button" className="registro-button" onClick={reset}>
              {config.texts.actions.reset}
            </button>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="registro-shell">
      <article className="registro-page-card">
        <header className="registro-header">
          <p className="registro-eyebrow">{config.texts.eyebrow}</p>
          <h1>{config.texts.title}</h1>
          <p className="registro-subtitle">{config.texts.subtitle}</p>
          <p className="registro-event-meta">{config.texts.eventMeta}</p>
          <p>{config.texts.intro}</p>
        </header>

        <form
          className="registro-form"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          {status === 'submitting' ? <p className="registro-state-banner">{config.texts.states.loading}</p> : null}
          {submitError ? (
            <p className="registro-state-banner registro-state-banner--error">
              <strong>{config.texts.states.errorTitle}:</strong> {submitError}
            </p>
          ) : null}

          <SectionCard
            title={config.texts.sectionTitles.identity}
            description={config.texts.sectionDescriptions.identity}
          >
            <div className="registro-grid registro-grid--2">
              <FieldInput
                label="Nombre"
                hint="Tal como quieres que aparezca en comunicaciones oficiales."
                required
                placeholder="Ej. Ana"
                value={formData.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
                error={errors.firstName}
              />
              <FieldInput
                label="Apellido"
                hint="Incluye ambos si los utilizas profesionalmente."
                required
                placeholder="Ej. Pérez"
                value={formData.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
                error={errors.lastName}
              />
            </div>
          </SectionCard>

          <SectionCard title={config.texts.sectionTitles.profile} description={config.texts.sectionDescriptions.profile}>
            <div className="registro-grid registro-grid--2">
              <FieldInput
                label="Rol actual"
                hint="Función principal desde la que lideras decisiones."
                required
                placeholder="Ej. Directora de Innovación"
                value={formData.role}
                onChange={(e) => updateField('role', e.target.value)}
                error={errors.role}
              />
              <FieldInput
                label="Organización"
                hint="Empresa, institución, startup o colectivo."
                required
                placeholder="Ej. Laboratorio Horizonte"
                value={formData.organization}
                onChange={(e) => updateField('organization', e.target.value)}
                error={errors.organization}
              />
              <FieldSelect
                label="Sector"
                hint="Elige el sector que mejor representa tu operación actual."
                required
                options={registroOptions.sectors}
                value={formData.sector}
                onChange={(e) => updateField('sector', e.target.value)}
                error={errors.sector}
              />
              <FieldInput
                label="Sitio web de la organización"
                hint="Opcional, pero recomendado para revisión contextual."
                value={formData.organizationWebsite}
                onChange={(e) => updateField('organizationWebsite', e.target.value)}
                error={errors.organizationWebsite}
                placeholder="https://tuorganizacion.com"
              />
              <FieldInput
                label="Perfil profesional"
                hint="LinkedIn u otra referencia pública de trayectoria."
                value={formData.professionalProfileUrl}
                onChange={(e) => updateField('professionalProfileUrl', e.target.value)}
                error={errors.professionalProfileUrl}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <FieldTextarea
              label="Biografía ejecutiva"
              hint="Resume experiencia, enfoque y tipo de impacto que lideras (4–6 líneas)."
              required
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              error={errors.bio}
              rows={4}
              placeholder="Cuéntanos tu trayectoria y foco de trabajo actual."
            />
          </SectionCard>

          <SectionCard title={config.texts.sectionTitles.contact} description={config.texts.sectionDescriptions.contact}>
            <div className="registro-grid registro-grid--2">
              <FieldInput
                label="WhatsApp de contacto"
                hint="Incluye código país para una coordinación ágil."
                required
                placeholder="Ej. +57 300 000 0000"
                value={formData.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                error={errors.whatsapp}
              />
              <FieldInput
                label="Correo principal"
                hint="Aquí enviaremos confirmación y documentos del proceso."
                type="email"
                required
                placeholder="nombre@organizacion.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                error={errors.email}
              />
            </div>
          </SectionCard>

          <SectionCard
            title={config.texts.sectionTitles.participation}
            description={config.texts.sectionDescriptions.participation}
          >
            <FieldTextarea
              label="Motivación para aplicar"
              hint="¿Qué transformación buscas activar y por qué este encuentro es relevante para este momento?"
              required
              value={formData.motivation}
              onChange={(e) => updateField('motivation', e.target.value)}
              error={errors.motivation}
              rows={4}
              placeholder="Comparte intención, objetivos y el tipo de resultado que esperas construir."
            />
            <div className="registro-grid registro-grid--2">
              <FieldSelect
                label="Disponibilidad de asistencia"
                required
                options={registroOptions.attendanceAvailability}
                value={formData.attendanceAvailability}
                onChange={(e) => updateField('attendanceAvailability', e.target.value)}
                error={errors.attendanceAvailability}
              />
              <FieldSelect
                label="¿Cómo conociste este encuentro?"
                required
                options={registroOptions.referralSource}
                value={formData.referralSource}
                onChange={(e) => updateField('referralSource', e.target.value)}
                error={errors.referralSource}
              />
            </div>
            {showReferralName ? (
              <FieldInput
                label="Nombre de quien te recomendó"
                hint="Nos ayuda a comprender tu contexto de llegada."
                required
                placeholder="Ej. Laura Gómez"
                value={formData.referralName}
                onChange={(e) => updateField('referralName', e.target.value)}
                error={errors.referralName}
              />
            ) : null}
            <FieldTextarea
              label="Preguntas o contexto adicional"
              hint="Opcional: necesidades logísticas, dudas o temas que quieras anticipar."
              value={formData.questions}
              onChange={(e) => updateField('questions', e.target.value)}
              error={errors.questions}
              rows={3}
              placeholder="Si deseas, agrega aquí información relevante para el equipo ANNiA."
            />
          </SectionCard>

          <SectionCard title={config.texts.sectionTitles.consent} description={config.texts.sectionDescriptions.consent}>
            <FieldCheckbox checked={formData.consentData} onChange={(value) => updateField('consentData', value)} error={errors.consentData}>
              Autorizo el tratamiento de mis datos para gestionar admisión, seguimiento y comunicaciones asociadas al programa.{' '}
              <a href={config.urls.privacyPolicy}>Política de Privacidad</a>.
            </FieldCheckbox>
            <FieldCheckbox checked={formData.consentCommunity} onChange={(value) => updateField('consentCommunity', value)} error={errors.consentCommunity}>
              Acepto lineamientos de colaboración y convivencia profesional de la comunidad ANNiA.{' '}
              <a href={config.urls.communityGuidelines}>Lineamientos de comunidad</a>.
            </FieldCheckbox>
          </SectionCard>

          <button type="submit" className="registro-button" disabled={status === 'submitting'}>
            {status === 'submitting' ? config.texts.actions.submitting : config.texts.actions.submit}
          </button>
        </form>
      </article>
    </main>
  );
}

export default RegistroPage;
