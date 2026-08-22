'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { HalomotButton } from './halomot-button';

type ShowcaseItem = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  link?: string;
};

type ProjectShowcaseProps = {
  testimonials: ShowcaseItem[];
  autoplay?: boolean;
  colors?: { name?: string; position?: string; testimony?: string };
  fontSizes?: { name?: string; position?: string; testimony?: string };
  spacing?: {
    top?: string;
    bottom?: string;
    lineHeight?: string;
    nameTop?: string;
    nameBottom?: string;
    positionTop?: string;
    positionBottom?: string;
    testimonyTop?: string;
    testimonyBottom?: string;
  };
  desktopVersionBottomThreshold?: number;
  imageAspectRatio?: number;
  onItemClick?: (link: string) => void;
  outerRounding?: string;
  innerRounding?: string;
  outlineColor?: string;
  hoverOutlineColor?: string;
  buttonInscriptions?: {
    previousButton: string;
    nextButton: string;
    openWebAppButton: string;
  };
  halomotButtonGradient?: string;
  halomotButtonBackground?: string;
  halomotButtonTextColor?: string;
  halomotButtonOuterBorderRadius?: string;
  halomotButtonInnerBorderRadius?: string;
  halomotButtonHoverTextColor?: string;
};

export const ProjectShowcase = ({
  testimonials,
  autoplay = false,
  colors = { name: '#fff', position: '#888', testimony: '#ccc' },
  fontSizes = { name: '28px', position: '14px', testimony: '17px' },
  spacing = {
    lineHeight: '1.5',
    nameTop: '0',
    nameBottom: '0.5em',
    positionTop: '0',
    positionBottom: '0.25em',
    testimonyTop: '1em',
    testimonyBottom: '1em',
  },
  desktopVersionBottomThreshold = 900,
  imageAspectRatio = 1.37,
  onItemClick,
  outerRounding = '18.2px',
  innerRounding = '18px',
  outlineColor = '#33313d',
  hoverOutlineColor = '#403d4d',
  buttonInscriptions = {
    previousButton: 'Previous',
    nextButton: 'Next',
    openWebAppButton: 'Open case study',
  },
  halomotButtonGradient = 'linear-gradient(to right, #a123f4, #603dec)',
  halomotButtonBackground = '#111014',
  halomotButtonTextColor = '#fff',
  halomotButtonOuterBorderRadius = '6.34px',
  halomotButtonInnerBorderRadius = '6px',
  halomotButtonHoverTextColor,
}: ProjectShowcaseProps) => {
  const [active, setActive] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleNext = () => setActive((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () =>
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay]);

  const handleResize = useCallback(() => {
    if (!componentRef.current) return;
    setIsMobileView(componentRef.current.offsetWidth < desktopVersionBottomThreshold);
  }, [desktopVersionBottomThreshold]);

  useEffect(() => {
    const el = componentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    handleResize();
    return () => ro.unobserve(el);
  }, [handleResize]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const randomRotateY = () => (mounted ? Math.floor(Math.random() * 21) - 10 : 0);

  return (
    <div
      ref={componentRef}
      className="w-full mx-auto antialiased font-sans"
      style={{ lineHeight: spacing.lineHeight, backgroundColor: 'transparent' }}
    >
      <div
        className="relative"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobileView ? '1fr' : '1fr 1fr',
          gap: isMobileView ? '32px' : '64px',
        }}
      >
        <div className="w-full">
          <div
            className="relative"
            style={{ paddingTop: `${(1 / imageAspectRatio) * 100}%` }}
          >
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{ opacity: 0, scale: 0.9, z: -100, rotate: randomRotateY() }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 999 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9, z: 100, rotate: randomRotateY() }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute inset-0 origin-bottom"
                >
                  <ImageContainer
                    src={testimonial.src}
                    alt={testimonial.name}
                    outerRounding={outerRounding}
                    innerRounding={innerRounding}
                    outlineColor={outlineColor}
                    hoverOutlineColor={hoverOutlineColor}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-between flex-col py-4 w-full">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <h3
              className="font-bold"
              style={{
                fontSize: fontSizes.name,
                color: colors.name,
                marginTop: spacing.nameTop,
                marginBottom: spacing.nameBottom,
              }}
            >
              {testimonials[active].name}
            </h3>
            <p
              style={{
                fontSize: fontSizes.position,
                color: colors.position,
                marginTop: spacing.positionTop,
                marginBottom: spacing.positionBottom,
              }}
            >
              {testimonials[active].designation}
            </p>
            <motion.p
              style={{
                fontSize: fontSizes.testimony,
                color: colors.testimony,
                marginTop: spacing.testimonyTop,
                marginBottom: spacing.testimonyBottom,
              }}
            >
              {testimonials[active].quote.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                  animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.02 * index }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div
            className={`flex gap-3 flex-wrap ${isMobileView ? 'pt-8' : 'md:pt-0'} w-full`}
          >
            <HalomotButton
              inscription={buttonInscriptions.previousButton}
              onClick={handlePrev}
              fixedWidth="140px"
              gradient={halomotButtonGradient}
              backgroundColor={halomotButtonBackground}
              textColor={halomotButtonTextColor}
              innerBorderRadius={halomotButtonInnerBorderRadius}
              outerBorderRadius={halomotButtonOuterBorderRadius}
              {...(halomotButtonHoverTextColor
                ? { hoverTextColor: halomotButtonHoverTextColor }
                : {})}
            />
            <HalomotButton
              inscription={buttonInscriptions.nextButton}
              onClick={handleNext}
              fixedWidth="140px"
              gradient={halomotButtonGradient}
              backgroundColor={halomotButtonBackground}
              textColor={halomotButtonTextColor}
              innerBorderRadius={halomotButtonInnerBorderRadius}
              outerBorderRadius={halomotButtonOuterBorderRadius}
              {...(halomotButtonHoverTextColor
                ? { hoverTextColor: halomotButtonHoverTextColor }
                : {})}
            />
            <HalomotButton
              inscription={buttonInscriptions.openWebAppButton}
              onClick={() =>
                onItemClick && onItemClick(testimonials[active].link || '')
              }
              fillWidth
              gradient={halomotButtonGradient}
              backgroundColor={halomotButtonBackground}
              textColor={halomotButtonTextColor}
              innerBorderRadius={halomotButtonInnerBorderRadius}
              outerBorderRadius={halomotButtonOuterBorderRadius}
              {...(halomotButtonHoverTextColor
                ? { hoverTextColor: halomotButtonHoverTextColor }
                : {})}
              href={testimonials[active].link}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type ImageContainerProps = {
  src: string;
  alt: string;
  outerRounding: string;
  innerRounding: string;
  outlineColor: string;
  hoverOutlineColor: string;
};

const ImageContainer = ({
  src,
  alt,
  outerRounding,
  innerRounding,
  outlineColor,
  hoverOutlineColor,
}: ImageContainerProps) => (
  <div
    className="relative h-full w-full project-showcase-image-container"
    style={{
      borderRadius: outerRounding,
      padding: '1px',
      backgroundColor: outlineColor,
      transition: 'background-color 0.3s ease-in-out',
    }}
  >
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ borderRadius: innerRounding }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        draggable={false}
        sizes="(max-width: 900px) 100vw, 50vw"
        className="h-full w-full object-cover object-center"
      />
    </div>
    <style jsx>{`
      .project-showcase-image-container:hover {
        background-color: ${hoverOutlineColor} !important;
      }
    `}</style>
  </div>
);
