import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';

import { Typography, Grid, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { ShopLayout } from '@/components/layouts';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';



interface Props {
    orders: IOrder[]
}


const HistoryPage: NextPage<Props> = ({ orders }) => {

    const rows = orders.map(({ _id, isPaid, shippingAdress }, index) => {
        return {
            id: index + 1,
            paid: isPaid,
            fullname: `${shippingAdress.firstName + " " + shippingAdress.lastName}`,
            orderId: _id,
        }
    })

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'fullname', headerName: 'Nombre Completo', width: 300 },

        {
            field: 'paid',
            headerName: 'Pagada',
            description: 'Muestra información si está pagada la orden o no',
            width: 200,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    params.row.paid
                        ? <Chip color="success" label="Pagada" variant='outlined' />
                        : <Chip color="error" label="No pagada" variant='outlined' />
                )
            }
        },
        {
            field: 'orden',
            headerName: 'Ver orden',
            width: 200,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <NextLink href={`/orders/${params.row.orderId}`}>
                        Ver orden
                    </NextLink>
                )
            }
        }
    ];


    return (
        <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
            <Typography variant='h1' component='h1'>Historial de ordenes</Typography>


            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                    />
                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersUser(session.user._id);

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage