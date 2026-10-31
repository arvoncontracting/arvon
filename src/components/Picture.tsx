import { images, type ImageId } from '../data/images';

interface PictureProps {
  image: ImageId;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

const url = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;

/** Responsive photograph with art-directed focus for wide and narrow crops. */
export function Picture({ image, alt, sizes, className, priority = false }: PictureProps) {
  const asset = images[image];
  const srcSet = (ext: string) => asset.srcWidths.map((w) => `${url(`${asset.id}-${w}.${ext}`)} ${w}w`).join(', ');
  const style = { '--focus-wide': asset.focus.wide, '--focus-narrow': asset.focus.narrow } as React.CSSProperties;

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={url(`${asset.id}.jpg`)}
        alt={alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  );
}
