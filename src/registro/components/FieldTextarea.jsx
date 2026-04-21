import FormField from './FormField.jsx';

function FieldTextarea({ label, hint, error, required, ...props }) {
  return (
    <FormField label={label} hint={hint} error={error} required={required}>
      <textarea className="registro-input registro-input--textarea" {...props} />
    </FormField>
  );
}

export default FieldTextarea;
