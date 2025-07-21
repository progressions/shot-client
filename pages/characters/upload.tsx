import Layout from '@/components/Layout'
import Head from 'next/head'

import { useState, FormEvent } from 'react';
import { Box, Button, Typography, TextField, Alert, Paper, Link } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useClient } from '@/contexts/ClientContext';
import { useToast } from '@/contexts/ToastContext';
import { getServerClient } from '@/utils/getServerClient';
import type { ServerSideProps, Character } from '@/types/types';
import { GetServerSideProps } from 'next';

export async function getServerSideProps({ req, res }: ServerSideProps) {
  const { client } = await getServerClient(req, res);
  try {
    await client.getCurrentCampaign();
    return { props: {} };
  } catch (error) {
    return { props: { fights: [] } };
  }
}

export default function UploadForm() {
  const { client } = useClient();
  const { toastError } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [character, setCharacter] = useState<Character | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf_file', file);

    try {
      const character = await client.uploadCharacterPdf(formData);
      setCharacter(character); // Store returned character
      setSuccess('Character created successfully!');
      setFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred while uploading the file.');
      toastError('Failed to upload PDF');
    }
  };

  return (
    <>
      <Head>
        <title>Schticks - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Upload PDF to Create Character
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {character && (
                <Box sx={{ mb: 2 }}>
                  <Typography>
                    View character:{' '}
                    <Link href={`/characters/${character.id}`} target="_blank">
                      {character.name}
                    </Link>
                  </Typography>
                </Box>
              )}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="file"
                  label="Upload PDF Form"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'application/pdf' }}
                  onChange={handleFileChange}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  disabled={!file}
                  fullWidth
                >
                  Create Character
                </Button>
              </Box>
            </Paper>
          </Box>
      </Layout>
    </main>
  </>)
}
