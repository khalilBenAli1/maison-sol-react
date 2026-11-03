function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export default function Photo({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 600px) 100vw, 50vw',
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const width = src.includes('hotel-hero') ? 1600 : 1200;
  const height = src.includes('hotel-hero') ? 900 : 800;
  return (
    <img
      className={className}
      src={asset(src)}
      srcSet={`${asset(src.replace('.webp', '-small.webp'))} ${width === 1600 ? 800 : 640}w, ${asset(src)} ${width}w`}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
