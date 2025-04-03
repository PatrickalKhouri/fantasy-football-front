import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Link 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import Navbar from '../components/Navbar';

// Set Brazilian Portuguese locale
dayjs.locale('pt-br');

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: null as dayjs.Dayjs | null,
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    birthDate: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      email: !formData.email,
      password: !formData.password,
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      birthDate: !formData.birthDate,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) return;

    console.log('Form submitted:', {
      ...formData,
      birthDate: formData.birthDate?.format('DD/MM/YYYY'),
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          p: 3,
          maxWidth: 400,
          mx: 'auto'
        }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Crie sua conta
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
            Crie sua conta e participe do melhor jogo de Fantasy do Campeonato Brasileiro
          </Typography>
          
          <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit}>
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              helperText={errors.email ? "Email é obrigatório" : ""}
              required
            />
            
            <TextField
              name="password"
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText={errors.password ? "Senha é obrigatória" : ""}
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="firstName"
                label="Nome"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Digite seu nome"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                helperText={errors.firstName ? "Nome é obrigatório" : ""}
                required
              />
              
              <TextField
                name="lastName"
                label="Sobrenome"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Digite seu sobrenome"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                helperText={errors.lastName ? "Sobrenome é obrigatório" : ""}
                required
              />
            </Box>
            
            <DatePicker
              label="Data de Nascimento"
              value={formData.birthDate}
              onChange={(newValue) => setFormData(prev => ({ ...prev, birthDate: newValue }))}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  error: errors.birthDate,
                  helperText: errors.birthDate ? "Data de nascimento é obrigatória" : "",
                  required: true,
                },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: '#1a1a1a',
                '&:hover': { backgroundColor: '#333' }
              }}
            >
              Criar Conta
            </Button>
          </Box>
          
          <Typography variant="body1" sx={{ mt: 2 }}>
            Já tem uma conta?{' '}
            <Link component={RouterLink} to="/signin" sx={{ fontWeight: 'bold' }}>
              Entrar
            </Link>
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default SignUp;