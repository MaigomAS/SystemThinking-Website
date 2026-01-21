const chipVariants = {
  soft: 'ui-chip--soft',
  solid: 'ui-chip--solid',
  outline: 'ui-chip--outline',
};

function Chip({ children, variant = 'soft', className = '', ...props }) {
  const variantClass = chipVariants[variant] ?? chipVariants.soft;

  return (
    <span className={`ui-chip ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}

export default Chip;
