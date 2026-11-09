import React, { useState } from 'react';
import { Car } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackTitle?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const ResilientImage: React.FC<ResilientImageProps> = React.memo(
  ({
    src,
    alt,
    className = '',
    style,
    fallbackTitle,
    loading = 'lazy',
    fetchPriority = 'auto',
  }) => {
    const [hasError, setHasError] = useState(false);

    if (hasError || !src) {
      return (
        <div
          className={`flex flex-col items-center justify-center bg-[#111111] text-zinc-300 p-6 ${className}`}
          style={style}
        >
          <Car className="w-9 h-9 text-white/75 mb-2 stroke-[1.5]" />
          <span className="text-xs font-medium text-zinc-200 tracking-wide text-center">
            {fallbackTitle || alt}
          </span>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onError={() => setHasError(true)}
        className={className}
        style={style}
      />
    );
  }
);
