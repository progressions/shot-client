import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { FightProvider } from "../contexts/FightContext"
import { CampaignProvider } from "../contexts/CampaignContext"
import { ToastProvider } from "../contexts/ToastContext"
import PopupToast from "../components/PopupToast"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <CampaignProvider>
        <FightProvider>
          <ToastProvider>
            <Component {...pageProps} />
            <PopupToast />
          </ToastProvider>
        </FightProvider>
      </CampaignProvider>
    </SessionProvider>
  )
}
