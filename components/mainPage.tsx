import React from 'react'
import { Header } from './header'
import { ColumnFilterSelect } from './columnFilterSelect'
import { ReleaseSelect } from './releaseSelect'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

export const MainPage = () => {
  return (
    <Box>
      <Box>
        <Header />
        <Divider data-testid="divider" />
      </Box>
      <Box>
        <ReleaseSelect />
        <ColumnFilterSelect />
      </Box>
    </Box>
  )
}
