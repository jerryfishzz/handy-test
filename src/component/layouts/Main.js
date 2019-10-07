import React from 'react'
import { 
  Paper, 
  Grid,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import FabIcon from './FabIcon'

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 5,
    minHeight: 'calc(100% - 64px - 5px)',
    position: 'relative'
  },
  paper: {
    height: '100%'
  },
  fabIcon: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
}))

export default function Main({ Component, ...other }) {
  const classes = useStyles()

  return (
    <Grid container className={classes.container}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Component {...other} />
        </Paper>
      </Grid>
      <Grid item className={classes.fabIcon}>
        <FabIcon />
      </Grid>
    </Grid>
  )
}
