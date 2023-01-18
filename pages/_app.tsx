import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { FightProvider } from "../contexts/FightContext"
import { CampaignProvider } from "../contexts/CampaignContext"
import { ClientProvider } from "../contexts/ClientContext"
import { ToastProvider } from "../contexts/ToastContext"
import PopupToast from "../components/PopupToast"

import { GlobalStyles, createTheme, colors, ThemeProvider } from "@mui/material"

const theme = createTheme({
  palette: {
    primary: {
      main: colors.deepPurple[800]
    },
    secondary: {
      main: colors.red[600]
    },
    common: {
      black: colors.grey[50],
      white: colors.grey[900]
    }
  }
})

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{zbody: {backgroundColor: "black", color: "white"}}} />
        <SessionProvider session={session}>
          <ClientProvider>
            <CampaignProvider>
              <FightProvider>
                <ToastProvider>
                  <Component {...pageProps} />
                  <PopupToast />
                </ToastProvider>
              </FightProvider>
            </CampaignProvider>
          </ClientProvider>
        </SessionProvider>
      </ThemeProvider>
  )
}
