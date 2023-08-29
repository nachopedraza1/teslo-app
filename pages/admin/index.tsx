import React from 'react'

import { AdminLayout } from '@/components/layouts'
import { SummaryTile } from '@/components/admin'

import { Grid } from '@mui/material'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, Dashboard, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'

const DashboardPage = () => {
    return (
        <AdminLayout
            title='Dashboard'
            subTitle='Estadisticas generales'
            icon={<DashboardOutlined />}
        >

            <Grid container spacing={2}>

                <SummaryTile
                    title={2}
                    subTitle="Ordenes totales"
                    icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={3}
                    subTitle="Ordenes pagadas"
                    icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={5}
                    subTitle="Ordenes pendientes"
                    icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={6}
                    subTitle="Clientes"
                    icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={7}
                    subTitle="Productos"
                    icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={8}
                    subTitle="Sin existencias"
                    icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={9}
                    subTitle="Bajo inventario"
                    icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={2}
                    subTitle="Actualización en:"
                    icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />

            </Grid>


        </AdminLayout>
    )
}

export default DashboardPage