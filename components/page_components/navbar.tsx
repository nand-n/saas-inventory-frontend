'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { Bars2Icon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Link } from './link'
import { Logo } from './logo'
import { PlusGrid, PlusGridItem, PlusGridRow } from './plus-grid'

const links = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/company', label: 'Company' },
  { href: '/blog', label: 'Blog' },
  { href: '/auth/login', label: 'Login' },
]

function DesktopNav({ dark = false }: { dark?: boolean }) {
  return (
    <nav className="relative hidden lg:flex">
      {links.map(({ href, label }) => (
        <PlusGridItem key={href} className="relative flex">
          <Link
            href={href}
            className={clsx(
              "flex items-center px-4 py-3 text-base font-medium",
              dark ? "text-white data-hover:bg-white/5" : "text-gray-950 data-hover:bg-black/[2.5%]"
            )}
          >
            {label}
          </Link>
        </PlusGridItem>
      ))}
    </nav>
  )
}

function MobileNavButton({ dark = false }: { dark?: boolean }) {
  return (
    <DisclosureButton
      className={clsx(
        "flex size-12 items-center justify-center self-center rounded-lg lg:hidden",
        dark ? "text-white data-hover:bg-white/10" : "text-gray-950 data-hover:bg-black/5"
      )}
      aria-label="Open main menu"
    >
      <Bars2Icon className="size-6" />
    </DisclosureButton>
  )
}

function MobileNav({ dark = false }: { dark?: boolean }) {
  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        {links.map(({ href, label }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut',
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={href}
          >
            <Link href={href} className={clsx("text-base font-medium", dark ? "text-white" : "text-gray-950")}>
              {label}
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className={clsx("absolute inset-x-0 top-0 border-t", dark ? "border-white/10" : "border-black/5")} />
        <div className={clsx("absolute inset-x-0 top-2 border-t", dark ? "border-white/10" : "border-black/5")} />
      </div>
    </DisclosurePanel>
  )
}

export function Navbar({ banner, dark = false }: { banner?: React.ReactNode; dark?: boolean }) {
  return (
    <Disclosure as="header" className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title="Home">
                <div className={clsx("flex justify-start items-center gap-1", dark ? "text-white" : "text-gray-950")}>
                  <Logo className="h-9" /> <span className='font-bold text-2xl'>Topper</span>
                </div>
              </Link>
            </PlusGridItem>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <DesktopNav dark={dark} />
          <MobileNavButton dark={dark} />
        </PlusGridRow>
      </PlusGrid>
      <MobileNav dark={dark} />
    </Disclosure>
  )
}
