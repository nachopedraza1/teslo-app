import type { GetServerSideProps, NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { dbProduct } from '@/database';
import { IProduct } from '@/interfaces';
import { getAllProducts } from '@/database/dbProducts';

interface Props {
    products: IProduct[],
    foundProducts: boolean,
    query: string,
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

    return (
        <ShopLayout title={'Teslo-Shop - Buscar'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
            <Typography variant='h1' component='h1'>Buscar Productos</Typography>
            {
                foundProducts
                    ? <Typography variant='h2' component='h1' textTransform="capitalize">Término: {query} </Typography>
                    : <Typography variant='h2' sx={{ mb: 1 }} textTransform="capitalize">No encontramos ningun producto con: {query} </Typography>
            }

            <ProductList products={products} />
        </ShopLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { query = '' } = params as { query: string };

    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProduct.getProductByTerm(query);
    const foundProducts = products.length > 0;

    if (!foundProducts) {

        products = await getAllProducts();

        return {
            props: {
                products,
                foundProducts,
                query,
            }
        }
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage;
