import FormField from './FormField.jsx';

function FieldSelect({ label, hint, error, required, options, placeholder = 'Selecciona una opción', ...props }) {
  return (
    <FormField label={label} hint={hint} error={error} required={required}>
      <select className="registro-input" {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export default FieldSelect;
