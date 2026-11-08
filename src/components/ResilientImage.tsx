import React, { useState } from 'react';
import { Car } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  style,
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#14171F] via-[#0E1015] to-[#1A1016] text-zinc-400 p-6 ${className}`}
        style={style}
      >
        <Car className="w-10 h-10 text-rose-500/80 mb-2 stroke-[1.5]" />
        <span className="text-xs font-medium text-zinc-300 tracking-wide text-center">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      style={style}
    />
  );
};
