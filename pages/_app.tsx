import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { CurrentFightProvider } from "../contexts/CurrentFight"
import { ToastProvider } from "../contexts/ToastContext"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <CurrentFightProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </CurrentFightProvider>
    </SessionProvider>
  )
}
