import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { FightProvider } from "@/contexts/FightContext"
import { CampaignProvider } from "@/contexts/CampaignContext"
import { ClientProvider } from "@/contexts/ClientContext"
import { ToastProvider } from "@/contexts/ToastContext"
import { LocalStorageProvider } from "@/contexts/LocalStorageContext"
import { WebSocketProvider } from "@/contexts/WebSocketContext"
import PopupToast from "@/components/PopupToast"

import { GlobalStyles, createTheme, colors, ThemeProvider } from "@mui/material"

const theme = createTheme({
  palette: {
    primary: {
      main: colors.blue[800]
    },
    secondary: {
      main: colors.red[600]
    },
    highlight: {
      main: colors.purple[600]
    },
    common: {
      black: colors.grey[50],
      white: colors.grey[900]
    },
    text: {
      primary: colors.grey[100],
      secondary: colors.grey[200],
      disabled: colors.blueGrey[600]
    },
    background: {
      paper: colors.blueGrey[800],
      default: colors.blueGrey[900]
    }
  }
})

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{body: {backgroundColor: colors.blueGrey[900], color: colors.blueGrey[100]}}} />
        <SessionProvider session={session}>
          <LocalStorageProvider>
            <ClientProvider>
                <CampaignProvider>
                  <FightProvider>
                    <WebSocketProvider>
                      <ToastProvider>
                          <Component {...pageProps} />
                          <PopupToast />
                      </ToastProvider>
                    </WebSocketProvider>
                  </FightProvider>
                </CampaignProvider>
            </ClientProvider>
          </LocalStorageProvider>
        </SessionProvider>
      </ThemeProvider>
  )
}
