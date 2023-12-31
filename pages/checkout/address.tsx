import { useContext } from "react";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from "@mui/material"
import { ShopLayout } from "@/components/layouts"

import { countries, getAdressFromCookies } from "@/utils"
import { CartContext } from "@/context";

type FormData = {
    firstName: string,
    lastName: string,
    address: string,
    address2: string,
    zip: string,
    city: string,
    country: string,
    phone: string,
}


const AddressPage = () => {

    const router = useRouter();

    const { updateAdress } = useContext(CartContext);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAdressFromCookies()
    });

    const onSubmitData = (data: FormData) => {
        updateAdress(data);
        router.push('/checkout/summary');
    }

    return (
        <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino">
            <Typography variant="h1" component='h1'>Dirección</Typography>

            <form onSubmit={handleSubmit(onSubmitData)}>
                <Grid container spacing={2} sx={{ mt: 2 }}>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant="filled"
                            fullWidth
                            {...register('firstName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'El campo debe tener 2 caracteres como mínimo.' }
                            })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellido'
                            variant="filled"
                            fullWidth
                            {...register('lastName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'El campo debe tener 2 caracteres como mínimo.' }
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección'
                            variant="filled"
                            fullWidth
                            {...register('address', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'El campo debe tener 2 caracteres como mínimo.' }
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección 2 (opcional)'
                            variant="filled"
                            fullWidth
                            {...register('address2')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Código Postal'
                            variant="filled"
                            fullWidth
                            {...register('zip', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'El campo debe tener 2 caracteres como mínimo.' }
                            })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad'
                            variant="filled"
                            fullWidth
                            {...register('city', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'El campo debe tener 2 caracteres como mínimo.' }
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                variant="filled"
                                label="País"
                                defaultValue={Cookies.get('country' || countries[0].code)}
                                {...register('country', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.country}
                            >
                                {
                                    countries.map(country => (
                                        <MenuItem
                                            key={country.code}
                                            value={country.code}
                                        >
                                            {country.name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Teléfono'
                            variant="filled"
                            fullWidth
                            {...register('phone', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'El campo debe tener 2 caracteres como mínimo.' }
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                    <Button type="submit" color="secondary" className="circular-btn" size="large">
                        Revisar pedido
                    </Button>
                </Box>
            </form>

        </ShopLayout >
    )
}

export default AddressPage