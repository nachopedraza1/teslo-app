import { Box, CircularProgress } from "@mui/material"

export const FullScreenLoading = () => {
    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='calc(100vh - 200px)'
        >
            <CircularProgress />
        </Box>
    )
}
