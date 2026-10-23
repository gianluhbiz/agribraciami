import { motion, useInView, type HTMLMotionProps } from 'framer-motion'
import { useRef, useState, type ReactNode } from 'react'
import { img } from '../data/site'
import { easeOut } from '../lib/motion'


type PhotoProps = {
  name: string
  alt: string
  small?: boolean
  className?: string
  imgClassName?: string
  eager?: boolean
  sizes?: string
}

/** Photo that fades and un-blurs once decoded, so nothing pops in. */
export function Photo({ name, alt, small, className = '', imgClassName = '', eager, sizes = '100vw' }: PhotoProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`overflow-hidden bg-soot ${className}`}>
      <img
        src={img(name, small)}
        srcSet={small ? undefined : `${img(name, true)} 720w, ${img(name)} 1800w`}
        sizes={small ? undefined : sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-[opacity,filter,scale] duration-700 ease-out-strong ${
          loaded ? 'scale-100 opacity-100 blur-0' : 'scale-[1.04] opacity-0 blur-md'
        } ${imgClassName}`}
      />
    </div>
  )
}

/** Splits a line into words that rise into place when scrolled into view. */
export function RiseText({
  text,
  className = '',
  delay = 0,
  as = 'span',
}: {
  text: string
  className?: string
  delay?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const Tag = as as 'span'
  return (
    <Tag ref={ref as React.Ref<HTMLSpanElement>} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ transform: 'translateY(105%)' }}
            animate={inView ? { transform: 'translateY(0%)' } : undefined}
            transition={{ duration: 0.9, ease: easeOut, delay: delay + i * 0.045 }}
          >
            {w}
            {' '}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function FadeIn({ children, delay = 0, className = '', ...rest }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: 'translateY(24px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: easeOut, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] ${className}`}>
      <span className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  )
}

type CtaProps = {
  href?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  children: ReactNode
  icon?: string
  variant?: 'ember' | 'cream' | 'ghost'
  className?: string
  external?: boolean
}

export function Cta({ href, onClick, children, icon = 'ri-arrow-right-up-line', variant = 'ember', className = '', external }: CtaProps) {
  const styles = {
    ember: 'bg-ember text-cream hover:bg-[#ff5b38]',
    cream: 'bg-cream text-coal hover:bg-white',
    ghost: 'bg-cream/5 text-cream ring-1 ring-cream/25 hover:bg-cream/10 backdrop-blur-md',
  }[variant]
  const cls = `group inline-flex min-h-12 items-center gap-3 rounded-full py-3 pl-6 pr-3 text-sm font-semibold tracking-wide transition-[background-color,transform] duration-200 ease-out active:scale-[0.97] ${styles} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      <span
        className={`grid size-8 place-items-center rounded-full transition-transform duration-300 ease-out-strong group-hover:rotate-45 ${
          variant === 'cream' ? 'bg-coal text-cream' : variant === 'ember' ? 'bg-coal/25' : 'bg-cream/15'
        }`}
      >
        <i className={`${icon} text-base`} aria-hidden />
      </span>
    </>
  )
  if (href)
    return (
      <a href={href} onClick={onClick} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    )
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

export function Logo({ className = '', glow = false }: { className?: string; glow?: boolean }) {
  return (
    <img
      src="/logo-white.png"
      alt="Braciami"
      width={455}
      height={279}
      className={`${className} ${glow ? 'drop-shadow-[0_0_14px_rgba(255,90,78,0.8)]' : ''}`}
    />
  )
}
