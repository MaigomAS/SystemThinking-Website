function SectionCard({ title, description, children }) {
  return (
    <section className="registro-section-card">
      <header>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      <div className="registro-section-card__body">{children}</div>
    </section>
  );
}

export default SectionCard;
