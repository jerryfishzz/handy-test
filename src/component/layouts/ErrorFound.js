import React, { useEffect } from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import { connect } from 'react-redux'

import sad from '../../images/sad.png'
import { stopLoading } from '../../actions/appStatus'

const useStyles = makeStyles(theme => ({
  container: {
    padding: 12,
  },
  item: {
    paddingTop: theme.spacing(5),
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  img: {
    width: '40%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  }
}))

const ErrorFound = ({ error, stopLoading }) => {
  const classes = useStyles()

  useEffect(() => {
    stopLoading()
  }, [])

  return (
    <Grid container justifyContent="center" className={classes.container}>
      <Grid 
        item 
        container 
        className={classes.item} 
        direction="column" 
        alignItems="center" 
        spacing={3}
      >
        <Grid item>
          <Typography variant="h5">{error}</Typography>
        </Grid>
        <Grid item container justifyContent="center">
          <img alt="error" src={sad} className={classes.img} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default connect(null, { stopLoading })(ErrorFound)
