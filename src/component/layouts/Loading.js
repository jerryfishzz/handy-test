import React from 'react'
import { Grid, Typography, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(0.5) // compensate the nagative margin caused by the bug in container when using spacing
  },
  item: {
    paddingTop: theme.spacing(3)
  },
}))

function Loading() {
  const classes = useStyles()

  return (
    <Grid container justifyContent="center" className={classes.container}>
      <Grid 
        item 
        container 
        className={classes.item} 
        direction="column" 
        alignItems="center" 
        spacing={1}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
        <Grid item>
          <Typography variant="button">Loading...</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Loading
