import React from 'react';

interface ImageBadgeProps {
  /** The width of the badge (e.g., '100%', '200px', 150) */
  width?: string | number;
  /** The height of the badge (e.g., 'auto', '80px', 60) */
  height?: string | number;
  image?: string;
  /** Optional custom CSS class name */
  className?: string;
}

export const ImageBadge: React.FC<ImageBadgeProps> = ({
  width = 200,
  height = 'auto',
  image = '/stripe.png',
  className = '',
}) => {
  return (
    <img
      src={image}
      alt="Stripe Badge"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
};

export default ImageBadge;
