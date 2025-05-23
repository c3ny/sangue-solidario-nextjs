'use client'

import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from "@mui/material/Select";

export default function CadastroPage() {
  const [userType, setUserType] = useState('');

  const handleUserTypeChange = (event: SelectChangeEvent) => {
    setUserType(event.target.value as string);
  };

  return (
    <>
      <Header />
      <Box maxWidth={500} 
        margin="0 auto"
        marginTop={15}
        marginBottom={10} 
        p={3} 
        boxShadow={3} 
        borderRadius={2}>
        
        <Box display="flex" justifyContent="center">
          <Image src="/assets/images/logo/sangue-main.svg" alt="Signup Icon" width={250} height={150} />
        </Box>

        <Typography variant="h5" align="center" gutterBottom>
          Cadastre-se
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="user-type-label">Tipo de Usuário</InputLabel>
          <Select
            labelId="user-type-label"
            value={userType}
            onChange={handleUserTypeChange}
            required
          >
            <ListSubheader value="">Selecione o tipo de usuário</ListSubheader>
            <MenuItem value="fisica">Pessoa Física</MenuItem>
            <MenuItem value="juridica">Pessoa Jurídica</MenuItem>
          </Select>
        </FormControl>

        {userType === 'fisica' && (
          <>
            <TextField fullWidth label="Nome Completo" margin="normal" required />
            <TextField fullWidth label="Data de Nascimento" margin="normal" type="date" InputLabelProps={{ shrink: true }} required />
            <TextField fullWidth label="CPF" margin="normal" required />
            <FormControl fullWidth margin="normal">
              <InputLabel id="blood-type-label">Tipo Sanguíneo</InputLabel>
              <Select labelId="blood-type-label" required>
                <ListSubheader value="">Selecione o tipo sanguíneo</ListSubheader>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        {userType === 'juridica' && (
          <>
            <TextField fullWidth label="Nome do Responsável" margin="normal" required />
            <TextField fullWidth label="Nome da Instituição" margin="normal" required />
            <TextField fullWidth label="CNPJ" margin="normal" required />
            <TextField fullWidth label="CNES" margin="normal" />
          </>
        )}

        {userType && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select labelId="estado-label" required>
                <ListSubheader value="">Selecione o estado</ListSubheader>
                {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                  <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth label="Cidade" margin="normal" required />
            <TextField fullWidth label="Endereço" margin="normal" required />
            <TextField fullWidth label="CEP" margin="normal" required />
            <TextField fullWidth label="Email" type="email" margin="normal" required />
            <TextField fullWidth label="Senha" type="password" margin="normal" required />

            <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
              Cadastrar
            </Button>
          </>
        )}
      </Box>
    </>
  );
}