import * as RadixAvatar from '@radix-ui/react-avatar'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { TouchTarget } from './ui/button'
import Link from 'next/link'

type AvatarProps = {
  src?: string | null
  square?: boolean
  initials?: string
  alt?: string
  className?: string
}

export function Avatar({
  src = null,
  square = false,
  initials,
  alt = '',
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<'span'>) {
  return (
    <RadixAvatar.Root
      {...props}
      className={clsx(
        className,
        // Basic layout
        'inline-grid shrink-0 align-middle [--avatar-radius:20%] *:col-start-1 *:row-start-1',
        'outline -outline-offset-1 outline-black/10 dark:outline-white/10',
        // Border radius
        square ? 'rounded-[--avatar-radius] *:rounded-[--avatar-radius]' : 'rounded-full *:rounded-full'
      )}
    >
      {initials && (
        <RadixAvatar.Fallback
          className="size-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-[48px] font-medium uppercase select-none"
          delayMs={600}
        >
          {initials}
        </RadixAvatar.Fallback>
      )}
      {src && (
        <RadixAvatar.Image
          className="size-full object-cover"
          src={src}
          alt={alt}
        />
      )}
    </RadixAvatar.Root>
  )
}

export const AvatarButton = forwardRef(function AvatarButton(
  {
    src,
    square = false,
    initials,
    alt,
    className,
    ...props
  }: AvatarProps & React.ComponentPropsWithoutRef<typeof Link>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  let classes = clsx(
    className,
    square ? 'rounded-[20%]' : 'rounded-full',
    'relative inline-grid focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500'
  )

  return (
    <Link {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar src={src} square={square} initials={initials} alt={alt} />
      </TouchTarget>
    </Link>
  )
})