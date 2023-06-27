import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';


interface Props {
  maxValue: number,
  currentValue: number,
  onUpdateProduct: (quantity: number) => void;
}

export const ItemCounter: FC<Props> = ({ maxValue, onUpdateProduct, currentValue }) => {

  const onAddQuantity = () => {
    onUpdateProduct(currentValue + 1);
  }

  const onDecQuantity = () => {
    onUpdateProduct(currentValue - 1);
  }

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={onDecQuantity} disabled={currentValue === 1}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}> {currentValue} </Typography>
      <IconButton onClick={onAddQuantity} disabled={currentValue >= maxValue}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
