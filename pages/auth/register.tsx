import { useState } from 'react';
import NextLink from 'next/link';

import { tesloApi } from '@/api';
import { validations } from '@/utils';
import { useForm } from 'react-hook-form'


import { Box, Button, Chip, Grid, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { AuthLayout } from '@/components/layouts'


type FormData = {
    name: string,
    email: string,
    password: string,
}


const RegisterPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const [showError, setShowError] = useState(false);

    const onRegisterUser = async ({ name, email, password }: FormData) => {

        setShowError(false)

        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password });
            console.log(data);
        } catch (error) {
            console.log('error en las credenciales');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        }

    }

    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onRegisterUser)}>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Crear cuenta</Typography>
                            <Chip
                                label="Email o contraseña inválidos."
                                color='error'
                                icon={<ErrorOutline />}
                                sx={{ display: showError ? 'flex' : 'none' }}
                                className='fadeIn'
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Nombre completo"
                                variant="filled"
                                fullWidth
                                {...register('name', {
                                    minLength: { value: 2, message: 'Debe tener como mínimo 2 letras.' }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    validate: validations.isEmail,
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    minLength: { value: 6, message: 'Debe tener como mínimo 6 letras.' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type='submit' color="secondary" className='circular-btn' size='large' fullWidth>
                                crear cuenta
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href="/auth/login">
                                ¿Ya tienes cuenta?
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage