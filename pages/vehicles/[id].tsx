import Layout from '../../components/Layout'
import Head from 'next/head'

import { colors, Typography, Paper, Container } from "@mui/material"

import { VehicleProvider } from "../../contexts/VehicleContext"
import EditVehicle from "../../components/vehicles/edit/EditVehicle"
import { GetServerSideProps } from 'next'

import { getServerClient } from "../../utils/getServerClient"

import { ParamsType, AuthSession, ServerSideProps, User, Vehicle } from "../../types/types"
import { AxiosError } from 'axios'

export async function getServerSideProps<GetServerSideProps>({ req, res, params }: ServerSideProps) {
  const { client } = await getServerClient(req, res)
  const { id } = params as ParamsType

  try {
    const vehicle = await client.getVehicle({ id })

    return {
      props: {
        vehicle: vehicle
      }
    }
  } catch(error: unknown | AxiosError) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
}

interface VehicleViewProps {
  vehicle: Vehicle
}

export default function VehicleView({ vehicle }: VehicleViewProps) {
  return (
    <>
      <Head>
        <title>{`${vehicle?.name || "Vehicles"} - Chi War`}</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" component={Paper} sx={{backgroundColor: colors.blueGrey[300], color: "black", marginTop: 2, py: 2}}>
            <Typography variant="h2" gutterBottom>Edit Vehicle</Typography>
            <VehicleProvider vehicle={vehicle}>
              <EditVehicle vehicle={vehicle} />
            </VehicleProvider>
          </Container>
        </Layout>
      </main>
    </>
  )
}
