import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { BookingDock } from './components/BookingDock'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import Home from './pages/Home'
import { TransitionProvider } from './lib/transition'

const Menu = lazy(() => import('./pages/Menu'))

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  )
}

function Shell() {
  const location = useLocation()
  return (
    <div className="grain min-h-svh">
      <a
        href="#main"
        className="fixed left-3 top-3 z-[120] -translate-y-20 rounded-full bg-cream px-4 py-2 text-coal focus:translate-y-0"
      >
        Vai al contenuto
      </a>
      <Nav />
      <div id="main">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
            <Route
              path="/menu"
              element={
                <Page>
                  <Suspense fallback={<div className="h-svh bg-coal" />}>
                    <Menu />
                  </Suspense>
                </Page>
              }
            />
            <Route
              path="*"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
      <BookingDock />
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <TransitionProvider>
        <Shell />
      </TransitionProvider>
    </MotionConfig>
  )
}
