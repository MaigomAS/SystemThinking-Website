function Container({ className = '', children, ...props }) {
  return (
    <div className={`ui-container ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export default Container;
