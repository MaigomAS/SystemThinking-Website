const cardVariants = {
  elevated: 'ui-card--elevated',
  glass: 'ui-card--glass',
  outline: 'ui-card--outline',
};

function Card({ as: Component = 'div', variant = 'elevated', className = '', children, ...props }) {
  const variantClass = cardVariants[variant] ?? cardVariants.elevated;

  return (
    <Component className={`ui-card ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default Card;
