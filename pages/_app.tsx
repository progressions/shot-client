import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { FightProvider } from "../contexts/FightContext"
import { ToastProvider } from "../contexts/ToastContext"
import PopupToast from "../components/PopupToast"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <FightProvider>
        <ToastProvider>
          <Component {...pageProps} />
          <PopupToast />
        </ToastProvider>
      </FightProvider>
    </SessionProvider>
  )
}
