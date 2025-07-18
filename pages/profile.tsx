'use client';

import type { NextApiRequest, NextApiResponse } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { colors, Paper, Avatar, Box, Button, Stack, Container, TextField } from '@mui/material';
import Layout from '@/components/Layout';
import Client from '@/utils/Client';
import { useEffect, useState, useReducer } from 'react';
import Router from 'next/router';
import { getServerClient } from '@/utils/getServerClient';
import { SaveCancelButtons, StyledTextField } from '@/components/StyledFields';
import ImageManager from '@/components/images/ImageManager';
import { userReducer, UserActions, initialUserState } from '@/reducers/userState';
import { useClient, useToast } from '@/contexts';
import type { AuthSession, User, ServerSideProps } from '@/types/types';

interface ProfileProps {
  jwt: string;
  user: User;
}

export async function getServerSideProps({ req, res, params }: ServerSideProps) {
  const { client, jwt, session } = await getServerClient(req, res);
  const id = session?.id as string;

  try {
    const user = await client.getUser({ id });
    return {
      props: {
        jwt,
        user,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}

export default function Profile({ jwt, user: initialUser }: ProfileProps) {
  const { client, dispatchCurrentUser } = useClient();
  const { toastSuccess, toastError } = useToast();
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const { user, edited, saving } = state;
  const { first_name, last_name, email } = user || {};
  const [open, setOpen] = useState<boolean>(false);
  const { data: session, update } = useSession();

  useEffect(() => {
    dispatch({ type: UserActions.USER, payload: initialUser });
  }, [initialUser]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: UserActions.UPDATE, name: event.target.name, value: event.target.value });
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await updateUser();
  };

  const updateUser = async (): Promise<void> => {
    dispatch({ type: UserActions.SUBMIT });
    try {
      const userData = await client.updateUser(user);
      const updatedSession = await update({
        user: userData, // Set full userData as session.user
      });
      console.log('Updated session:', updatedSession);
      // Force session refresh to ensure components update
      await update(null);
      dispatch({ type: UserActions.USER, payload: userData });
      dispatchCurrentUser({ type: UserActions.USER, payload: userData });
      setOpen(false);
      toastSuccess('Profile updated successfully.');
    } catch (error) {
      console.error('Failed to update user:', error);
      toastError('Failed to update profile.');
    }
  };

  const cancelForm = (): void => {
    dispatch({ type: UserActions.RESET });
  };

  async function deleteImage(user: User) {
    await client.deleteUserImage(user);
  }

  return (
    <>
      <Head>
        <title>Profile - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" component={Paper} sx={{ backgroundColor: colors.blueGrey[300], color: 'black', marginTop: 2, py: 2 }}>
            <Box component="form" onSubmit={handleUpdate}>
              <Stack spacing={2} sx={{ width: 500 }}>
                {!open && (
                  <Button sx={{ width: 100 }} onClick={() => setOpen(!open)}>
                    <Avatar alt="N" src={user?.image_url || ''} sx={{ width: 100, height: 100 }} />
                  </Button>
                )}
                {open && user?.id && (
                  <ImageManager name="user" entity={user} updateEntity={updateUser} deleteImage={deleteImage} apiEndpoint="users" />
                )}
                <Stack spacing={2} direction="row">
                  <StyledTextField fullWidth name="first_name" label="First name" value={first_name || ''} variant="outlined" onChange={handleChange} />
                  <StyledTextField fullWidth name="last_name" label="Last name" value={last_name || ''} variant="outlined" onChange={handleChange} />
                </Stack>
                <StyledTextField name="email" label="Email" value={email || ''} variant="outlined" onChange={handleChange} />
                <Stack alignItems="flex-end" spacing={2} direction="row">
                  <SaveCancelButtons disabled={saving || !edited} onCancel={cancelForm} />
                </Stack>
              </Stack>
            </Box>
          </Container>
        </Layout>
      </main>
    </>
  );
}
