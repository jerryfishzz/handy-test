import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(0.5) // compensate the nagative margin caused by the bug in container when using spacing
  },
  item: {
    paddingTop: theme.spacing(3)
  },
}))

function Info({ info }) {
  const classes = useStyles()

  return (
    <Grid container justifyContent="center" className={classes.container}>
      <Grid 
        item 
        className={classes.item} 
        spacing={1}
      >
        <Typography variant="h5">{info}</Typography>
      </Grid>
    </Grid>
  )
}

export default Info
