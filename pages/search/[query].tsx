import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';
import { FullScreenLoading } from '@/components/ui';


const SearchPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products');

    return (
        <ShopLayout title={'Teslo-Shop - Buscar'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
            <Typography variant='h1' component='h1'>Buscar Producto</Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>ABC---123</Typography>


            {isLoading
                ? <FullScreenLoading />
                : <ProductList
                    products={products}
                />
            }


        </ShopLayout>
    )
}

export default SearchPage
