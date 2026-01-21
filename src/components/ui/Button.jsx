const buttonVariants = {
  primary: 'ui-button--primary',
  secondary: 'ui-button--secondary',
  ghost: 'ui-button--ghost',
  outline: 'ui-button--outline',
  dark: 'ui-button--dark',
};

const buttonSizes = {
  sm: 'ui-button--sm',
  md: '',
  lg: 'ui-button--lg',
};

function Button({
  as: Component = 'button',
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const variantClass = buttonVariants[variant] ?? buttonVariants.primary;
  const sizeClass = buttonSizes[size] ?? '';

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={`ui-button ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
