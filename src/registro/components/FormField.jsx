function FormField({ label, hint, error, children, required }) {
  return (
    <label className="registro-field">
      <span className="registro-field__label">
        {label} {required ? <em aria-hidden="true">*</em> : null}
      </span>
      {hint ? <span className="registro-field__hint">{hint}</span> : null}
      {children}
      {error ? <span className="registro-field__error">{error}</span> : null}
    </label>
  );
}

export default FormField;
