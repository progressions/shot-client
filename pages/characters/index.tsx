import Head from "next/head"
import Layout from "../../components/Layout"
import Client from "../../components/Client"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerClient } from "../../utils/getServerClient"

import { useState } from "react"
import Router from "next/router"

import { Link, Paper, Switch, FormControlLabel, Stack, Avatar, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography } from "@mui/material"

import { ButtonBar } from "../../components/StyledFields"
import ActionValues from "../../components/characters/ActionValues"
import ActionButtons from "../../components/characters/ActionButtons"
import CharacterModal from "../../components/characters/CharacterModal"
import VehicleModal from "../../components/vehicles/VehicleModal"
import AvatarBadge from "../../components/characters/AvatarBadge"
import CreateCharacter from "../../components/characters/CreateCharacter"
import CreateVehicle from "../../components/vehicles/CreateVehicle"
import CharacterFilters from "../../components/characters/CharacterFilters"
import GamemasterOnly from "../../components/GamemasterOnly"

import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { PaginationMeta, AuthSession, Person, Vehicle, Character, CharacterFilter, ServerSideProps, Toast } from "../../types/types"
import { defaultCharacter } from "../../types/types"
import Characters from "../../components/admin/characters/Characters"

interface CharactersProps {
  characters: Character[]
  meta: PaginationMeta
}

export async function getServerSideProps({ req, res }: ServerSideProps) {
  const { client } = await getServerClient(req, res)

  const campaignResponse = await client.getCurrentCampaign()
  const currentCampaign = campaignResponse.status === 200 ? await campaignResponse.json() : null

  if (!currentCampaign) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      },
      props: {
      }
    }
  }

  const { characters, meta } = await client.getCharactersAndVehicles()

  console.log({ characters })
  return {
    props: {
      characters: characters,
      meta: meta,
    }, // will be passed to the page component as props
  }
}

export default function CharactersIndex({ characters, meta }: CharactersProps) {
  console.log({ characters })
  return (
    <>
      <Head>
        <title>Characters - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="lg">
            <Characters characters={characters} meta={meta} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
