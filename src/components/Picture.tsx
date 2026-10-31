import type { CSSProperties } from 'react';
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
  const portrait = asset.portrait?.srcWidths
    .map((w) => `${url(`${asset.id}-portrait-${w}`)}`)
    .map((file, index) => ({ file, width: asset.portrait!.srcWidths[index] }));
  const portraitSet = (ext: string) => portrait?.map(({ file, width }) => `${file}.${ext} ${width}w`).join(', ');
  const style = { '--focus-wide': asset.focus.wide, '--focus-narrow': asset.focus.narrow } as CSSProperties;

  return (
    <picture className={className}>
      {portrait && <source media="(max-width: 767px)" type="image/avif" srcSet={portraitSet('avif')} sizes="100vw" width={asset.portrait!.width} height={asset.portrait!.height} />}
      {portrait && <source media="(max-width: 767px)" type="image/webp" srcSet={portraitSet('webp')} sizes="100vw" width={asset.portrait!.width} height={asset.portrait!.height} />}
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
