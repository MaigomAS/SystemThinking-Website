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

const RegistroFooter = () => (
  <footer className="registro-footer" aria-label="Créditos del encuentro">
    <p>#SystemThinking2026</p>
    <p>Un espacio de liderazgo impulsado por ANNiA</p>
    <p>
      en colaboración con{' '}
      <a href="https://www.vidaalcentro.com" target="_blank" rel="noopener noreferrer">
        Vida al Centro
      </a>
    </p>
  </footer>
);

function RegistroPage({ config: customConfig, services = {} }) {
  const config = createRegistroConfig(customConfig);
  const automationService = services.automationService || createAutomationService();
  const registrationService =
    services.registrationService || createRegistrationService({ apiClient: services.apiClient, automationService });

  const { formData, errors, status, submitError, updateField, submit, reset } = useRegistroForm({
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
        <RegistroFooter />
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

          <SectionCard title={config.texts.sectionTitles.identity} description={config.texts.sectionDescriptions.identity}>
            <div className="registro-grid registro-grid--2">
              <FieldInput
                label="Nombre completo"
                required
                value={formData.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                error={errors.fullName}
                placeholder="Ej. Ana Pérez"
              />
              <FieldInput
                label="Correo electrónico"
                type="email"
                required
                value={formData.email}
                onChange={(event) => updateField('email', event.target.value)}
                error={errors.email}
                placeholder="nombre@organizacion.com"
              />
              <FieldInput
                label="Teléfono"
                required
                value={formData.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                error={errors.phone}
                placeholder="Ej. +57 300 000 0000"
              />
              <FieldInput
                label="Organización actual"
                required
                value={formData.organization}
                onChange={(event) => updateField('organization', event.target.value)}
                error={errors.organization}
                placeholder="Ej. Laboratorio Horizonte"
              />
              <FieldInput
                label="Cargo o rol actual"
                required
                value={formData.role}
                onChange={(event) => updateField('role', event.target.value)}
                error={errors.role}
                placeholder="Ej. Directora de Innovación"
              />
              <FieldInput
                label="Fecha de nacimiento"
                hint="Indica día, mes y año."
                type="date"
                required
                value={formData.birthDate}
                onChange={(event) => updateField('birthDate', event.target.value)}
                error={errors.birthDate}
              />
              <FieldInput
                label="Residencia actual"
                hint="Indica el país en el que resides actualmente."
                required
                value={formData.residenceCountry}
                onChange={(event) => updateField('residenceCountry', event.target.value)}
                error={errors.residenceCountry}
                placeholder="Ej. Colombia"
              />
            </div>
          </SectionCard>

          <SectionCard title={config.texts.sectionTitles.profile} description={config.texts.sectionDescriptions.profile}>
            <FieldTextarea
              label="Biografía ejecutiva"
              hint="Resume tu experiencia, enfoque y tipo de impacto que lideras (4–6 líneas)."
              required
              value={formData.bio}
              onChange={(event) => updateField('bio', event.target.value)}
              error={errors.bio}
              rows={4}
              placeholder="Comparte tu trayectoria y enfoque actual."
            />
            <div className="registro-grid registro-grid--2">
              <FieldInput
                label="Área de trabajo"
                hint="Indica tu área principal: Recursos Humanos, Sostenibilidad, Asuntos de Mujer, Gestión de Riesgos, Movilidad Social, etc."
                required
                value={formData.workArea}
                onChange={(event) => updateField('workArea', event.target.value)}
                error={errors.workArea}
                placeholder="Ej. Sostenibilidad"
              />
              <FieldSelect
                label="Grado de estudios"
                hint="Indica tu nivel de formación formal."
                required
                options={registroOptions.educationLevels}
                value={formData.educationLevel}
                onChange={(event) => updateField('educationLevel', event.target.value)}
                error={errors.educationLevel}
              />
            </div>
            <p className="registro-note-placeholder">{config.texts.notes.cvPlaceholder}</p>
          </SectionCard>

          <SectionCard
            title={config.texts.sectionTitles.leadership}
            description={config.texts.sectionDescriptions.leadership}
          >
            <FieldTextarea
              label="¿Cuál es el reto más complejo que enfrenta tu organización en este momento?"
              required
              value={formData.leadershipChallenge}
              onChange={(event) => updateField('leadershipChallenge', event.target.value)}
              error={errors.leadershipChallenge}
              rows={4}
            />
            <FieldTextarea
              label="¿Qué tema o pregunta te genera mayor inquietud como líder hoy?"
              required
              value={formData.leadershipQuestion}
              onChange={(event) => updateField('leadershipQuestion', event.target.value)}
              error={errors.leadershipQuestion}
              rows={4}
            />
            <FieldTextarea
              label="¿Qué proyectos actuales lideras donde planeas aplicar estas herramientas?"
              required
              value={formData.currentProjects}
              onChange={(event) => updateField('currentProjects', event.target.value)}
              error={errors.currentProjects}
              rows={4}
            />
            <FieldTextarea
              label="¿Qué esperas encontrar en este encuentro que no encontrarías en otro espacio?"
              required
              value={formData.encounterExpectation}
              onChange={(event) => updateField('encounterExpectation', event.target.value)}
              error={errors.encounterExpectation}
              rows={4}
            />
            <p className="registro-note-placeholder">{config.texts.notes.letterPlaceholder}</p>
          </SectionCard>

          <SectionCard
            title={config.texts.sectionTitles.references}
            description={config.texts.sectionDescriptions.references}
          >
            <div className="registro-subblock">
              <h3>Referencia 1</h3>
              <div className="registro-grid registro-grid--2">
                <FieldInput
                  label="Nombre completo"
                  required
                  value={formData.reference1FullName}
                  onChange={(event) => updateField('reference1FullName', event.target.value)}
                  error={errors.reference1FullName}
                />
                <FieldInput
                  label="Organización"
                  required
                  value={formData.reference1Organization}
                  onChange={(event) => updateField('reference1Organization', event.target.value)}
                  error={errors.reference1Organization}
                />
                <FieldInput
                  label="Cargo"
                  required
                  value={formData.reference1Role}
                  onChange={(event) => updateField('reference1Role', event.target.value)}
                  error={errors.reference1Role}
                />
                <FieldInput
                  label="Email"
                  type="email"
                  required
                  value={formData.reference1Email}
                  onChange={(event) => updateField('reference1Email', event.target.value)}
                  error={errors.reference1Email}
                />
                <FieldInput
                  label="Teléfono"
                  required
                  value={formData.reference1Phone}
                  onChange={(event) => updateField('reference1Phone', event.target.value)}
                  error={errors.reference1Phone}
                />
              </div>
            </div>

            <div className="registro-subblock">
              <h3>Referencia 2</h3>
              <div className="registro-grid registro-grid--2">
                <FieldInput
                  label="Nombre completo"
                  required
                  value={formData.reference2FullName}
                  onChange={(event) => updateField('reference2FullName', event.target.value)}
                  error={errors.reference2FullName}
                />
                <FieldInput
                  label="Organización"
                  required
                  value={formData.reference2Organization}
                  onChange={(event) => updateField('reference2Organization', event.target.value)}
                  error={errors.reference2Organization}
                />
                <FieldInput
                  label="Cargo"
                  required
                  value={formData.reference2Role}
                  onChange={(event) => updateField('reference2Role', event.target.value)}
                  error={errors.reference2Role}
                />
                <FieldInput
                  label="Email"
                  type="email"
                  required
                  value={formData.reference2Email}
                  onChange={(event) => updateField('reference2Email', event.target.value)}
                  error={errors.reference2Email}
                />
                <FieldInput
                  label="Teléfono"
                  required
                  value={formData.reference2Phone}
                  onChange={(event) => updateField('reference2Phone', event.target.value)}
                  error={errors.reference2Phone}
                />
              </div>
            </div>

            <FieldInput
              label="¿Cómo supiste de este encuentro?"
              value={formData.referralSource}
              onChange={(event) => updateField('referralSource', event.target.value)}
              error={errors.referralSource}
              placeholder="Opcional"
            />
          </SectionCard>

          <SectionCard
            title={config.texts.sectionTitles.considerations}
            description={config.texts.sectionDescriptions.considerations}
          >
            <FieldTextarea
              label="Necesidades de accesibilidad o salud"
              hint="Si hay alguna condición médica, alimentaria o de accesibilidad que debamos tener en cuenta para acompañar tu participación adecuadamente, puedes indicarla aquí."
              value={formData.accessibilityNeeds}
              onChange={(event) => updateField('accessibilityNeeds', event.target.value)}
              error={errors.accessibilityNeeds}
              rows={4}
            />
            <FieldTextarea
              label="Límites o consideraciones personales"
              hint="¿Existe algún tema, enfoque o dinámica que prefieras no abordar en este espacio?"
              value={formData.personalBoundaries}
              onChange={(event) => updateField('personalBoundaries', event.target.value)}
              error={errors.personalBoundaries}
              rows={4}
            />
          </SectionCard>

          <SectionCard title={config.texts.sectionTitles.consent} description={config.texts.sectionDescriptions.consent}>
            <FieldCheckbox checked={formData.consentData} onChange={(value) => updateField('consentData', value)} error={errors.consentData}>
              Autorizo el tratamiento de mis datos para gestionar mi solicitud, el seguimiento del proceso y las comunicaciones oficiales relacionadas con este encuentro.{' '}
              <a href={config.urls.privacyPolicy} target="_blank" rel="noopener noreferrer">
                Política de Privacidad
              </a>
              .
            </FieldCheckbox>
            <FieldCheckbox checked={formData.consentCommunity} onChange={(value) => updateField('consentCommunity', value)} error={errors.consentCommunity}>
              Acepto los lineamientos de colaboración y convivencia profesional de la comunidad ANNiA.{' '}
              <a href={config.urls.communityGuidelines} target="_blank" rel="noopener noreferrer">
                Lineamientos de comunidad
              </a>
              .
            </FieldCheckbox>
          </SectionCard>

          <button type="submit" className="registro-button" disabled={status === 'submitting'}>
            {status === 'submitting' ? config.texts.actions.submitting : config.texts.actions.submit}
          </button>
        </form>
      </article>
      <RegistroFooter />
    </main>
  );
}

export default RegistroPage;
