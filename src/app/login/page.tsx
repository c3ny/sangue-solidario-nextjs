"use client";

import {
  Link,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{ color: "#dc3545", fontWeight: "bold" }}
        fontSize={30}
        marginTop={15}
        width={"100%"}
        padding={5}
        variant="h4"
        align="center"
        gutterBottom
      >
        Faça login na Sangue Solidário
      </Typography>

      <Box
        component={"form"}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "10px",
          width: "100%",
        }}
        maxWidth={400}
        margin="0 auto"
      >
        <FormControl>
          <TextField
            label="Email"
            placeholder="Digite seu email"
            variant="outlined"
            required
          />
        </FormControl>
        <TextField label="Senha" placeholder="********" variant="outlined" />
        <FormControlLabel
          control={<Checkbox value="remember" color="error" />}
          label="Lembrar de mim"
          sx={{ marginLeft: "-10px" }}
        />

        <Button
          type="submit"
          onClick={() => {
            alert("Login realizado com sucesso!");
          }}
          variant="contained"
          sx={{ backgroundColor: "#dc3545", color: "#fff" }}
          size="large"
        >
          Fazer Login
        </Button>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          maxWidth="460px"
          alignItems={"center"}
          margin="0 auto"
        >
          <Link href="" variant="body2">
            <Typography>Esqueci minha senha</Typography>
          </Link>
          <Link href="" variant="body2">
            <Typography>
              Ainda não possui uma conta?
              <br /> Cadastre-se agora!
            </Typography>
          </Link>
        </Box>
        <Box
          alignItems={"center"}
          margin="0 auto"
          maxWidth="360px"
          padding={5}
          gap={2}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Button
            onClick={() => {
              alert("Login realizado com sucesso!");
            }}
            variant="outlined"
            sx={{ color: "#dc3545", borderColor: "#dc3545" }}
            startIcon={<FcGoogle />}
          >
            Entrar com Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
