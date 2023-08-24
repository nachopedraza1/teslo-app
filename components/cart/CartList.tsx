import { FC, useContext } from 'react';
import NextLink from 'next/link';

import { CartContext } from '@/context';

import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { ItemCounter } from '../ui';

import { ICartProduct, IOrderItem } from '@/interfaces';

interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

    const { cart, onUpdateQuantityCart, removeCartProduct } = useContext(CartContext);

    const onUpdateQuantityFromCart = (product: ICartProduct, newValue: number) => {
        product.quantity = newValue
        onUpdateQuantityCart(product)
    }

    const displayProducts = products ? products : cart;

    return (
        <>
            {
                displayProducts.map(product => (
                    <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
                        <Grid item xs={3}>
                            <NextLink href={`/product/${product.slug}`}>
                                <CardActionArea>
                                    <CardMedia
                                        image={`/products/${product.images}`}
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'>{product.title}</Typography>
                                <Typography variant='body1'>Talla: <strong> {product.size} </strong></Typography>

                                {
                                    editable
                                        ? <ItemCounter
                                            currentValue={product.quantity}
                                            maxValue={10}
                                            onUpdateProduct={(value) => onUpdateQuantityFromCart(product as ICartProduct, value)}
                                        />
                                        : <Typography variant='h5'> {product.quantity} {product.quantity > 1 ? 'Productos' : 'Producto'} </Typography>
                                }

                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1'>{`$${product.price}`}</Typography>

                            {
                                editable && (
                                    <Button variant='text' color='secondary' onClick={() => removeCartProduct(product as ICartProduct)} >
                                        Remover
                                    </Button>
                                )
                            }
                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}
