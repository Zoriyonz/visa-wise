import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <Image
      src="/visawise_logo_v3.svg"
      alt="Visa-Wise"
      width={size}
      height={size}
      priority
      unoptimized
      className={className}
    />
  );
}
