import FormField from './FormField.jsx';

function FieldInput({ label, hint, error, required, ...props }) {
  return (
    <FormField label={label} hint={hint} error={error} required={required}>
      <input className="registro-input" {...props} />
    </FormField>
  );
}

export default FieldInput;
