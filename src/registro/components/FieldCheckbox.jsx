function FieldCheckbox({ checked, onChange, error, children }) {
  return (
    <label className="registro-checkbox">
      <span className="registro-checkbox__control">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      </span>
      <span>{children}</span>
      {error ? <span className="registro-field__error">{error}</span> : null}
    </label>
  );
}

export default FieldCheckbox;
