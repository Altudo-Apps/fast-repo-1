import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'FastLane Documentation',
  description: 'Component and template library documentation for Sitecore XM Cloud',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const pageMap = await getPageMap()
  
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          navbar={
            <Navbar
              logo={<strong>FastLane Documentation</strong>}
              projectLink="https://github.com/altudo-dev/xmc-fast-lane"
            />
          }
          footer={<Footer>Built with ❤️ by Altudo for Sitecore XM Cloud</Footer>}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/altudo-dev/xmc-fast-lane/tree/develop/docs"
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ backToTop: true }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
