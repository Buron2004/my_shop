function BrandIcon({ icon, size = 14, className = '' }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}

export default BrandIcon;