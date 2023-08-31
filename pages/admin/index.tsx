import { NextPage } from 'next'
import useSWR from 'swr'

import { AdminLayout } from '@/components/layouts'
import { SummaryTile } from '@/components/admin'

import { Grid } from '@mui/material'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, Dashboard, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'

import { DashboardData } from '@/interfaces'
import { useEffect, useState } from 'react'

const DashboardPage: NextPage = () => {

    const { data, error } = useSWR<DashboardData>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000
    });

    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
        }, 1000)

        return () => clearInterval(interval)
    }, [])


    if (!error && !data) {
        return <> Cargando... </>
    }




    const {
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    } = data!

    return (
        <AdminLayout
            title='Dashboard'
            subTitle='Estadisticas generales'
            icon={<DashboardOutlined />}
        >

            <Grid container spacing={2}>

                <SummaryTile
                    title={numberOfOrders}
                    subTitle="Ordenes totales"
                    icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={paidOrders}
                    subTitle="Ordenes pagadas"
                    icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={notPaidOrders}
                    subTitle="Ordenes pendientes"
                    icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={numberOfClients}
                    subTitle="Clientes"
                    icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={numberOfProducts}
                    subTitle="Productos"
                    icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={productsWithNoInventory}
                    subTitle="Sin existencias"
                    icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={lowInventory}
                    subTitle="Bajo inventario"
                    icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={refreshIn}
                    subTitle="Actualización en:"
                    icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />

            </Grid>


        </AdminLayout>
    )
}

export default DashboardPage