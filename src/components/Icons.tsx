import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;
export function Arrow(props: IconProps) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 12h17m-7-7 7 7-7 7" />
    </svg>
  );
}
export function Heart({
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />
    </svg>
  );
}
export function Sun(props: IconProps) {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      {...props}
    >
      <circle cx="30" cy="30" r="10" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M30 4v9" transform={`rotate(${i * 30} 30 30)`} />
      ))}
    </svg>
  );
}
export function Close(props: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      {...props}
    >
      <path d="m5 5 14 14M5 19 19 5" />
    </svg>
  );
}
export function Chevron(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      {...props}
    >
      <path d="m5 7 5 5 5-5" />
    </svg>
  );
}
