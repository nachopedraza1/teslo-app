import { useContext, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { CartContext } from '@/context';
import { dbProduct } from '@/database';

import { ProductSlideshow, SizeSelector } from '@/components/products';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ItemCounter } from '@/components/ui/ItemCounter';
import { ShopLayout } from '@/components/layouts';

import { IProduct, ISize } from '@/interfaces/products';
import { ICartProduct } from '@/interfaces/cart';


interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

  const router = useRouter();

  const { onAddProductToCart } = useContext(CartContext);


  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    images: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct({ ...tempCartProduct, size })
  }

  const onUpdateProduct = (quantity: number) => {
    setTempCartProduct({ ...tempCartProduct, quantity })
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;
    onAddProductToCart(tempCartProduct);
    router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>

      <Grid container spacing={3}>

        <Grid item xs={12} sm={7}>
          <ProductSlideshow
            images={product.images}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>

            {/* titulos */}
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>{`$${product.price}`}</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter
                maxValue={product.inStock}
                onUpdateProduct={onUpdateProduct}
                currentValue={tempCartProduct.quantity}
              />
              <SizeSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onSelectedSize={onSelectedSize}
              />
            </Box>


            {/* Agregar al carrito */}
            {
              product.inStock > 0
                ?
                (
                  <Button color="secondary" className='circular-btn' onClick={onAddProduct} >
                    {
                      tempCartProduct.size
                        ? 'Agregar al carrito'
                        : 'Seleccione una talla'
                    }
                  </Button>
                ) : (
                  <Chip label="No hay disponibles" color="error" variant='outlined' />
                )
            }


            {/* Descripción */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>

          </Box>
        </Grid>


      </Grid>

    </ShopLayout>
  )
}

/* export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { slug = '' } = params as { slug: string };
  const product = await dbProduct.getProdutBySlug(slug)
  console.log(product);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    }
  }
} */


export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const productsSlugs = await dbProduct.getAllProductSlugs();

  return {
    paths: productsSlugs.map(({ slug }) => ({
      params: {
        slug
      }
    })),
    fallback: 'blocking'
  }
}



export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug = '' } = params as { slug: string }

  const product = await dbProduct.getProdutBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }

    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  }
}

export default ProductPage;