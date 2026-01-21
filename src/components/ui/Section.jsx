import Container from './Container.jsx';

function Section({ id, eyebrow, title, description, tone = 'dark', className = '', children }) {
  return (
    <section id={id} className={`ui-section ui-section--${tone} ${className}`.trim()}>
      <Container>
        {(eyebrow || title || description) && (
          <header className="ui-section__header">
            {eyebrow && <span className="ui-section__eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}

export default Section;
