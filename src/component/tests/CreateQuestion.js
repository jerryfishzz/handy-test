import React, { Fragment, useEffect } from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import { red } from '@material-ui/core/colors';

import Form from './Form'
import { connect } from 'react-redux';
import LoadingPage from '../../pages/LoadingPage';
import { stopLoading, resetAppStatus } from '../../actions/appStatus';
import { getQueryString, postTypes, errorGenerator } from '../../utils/helpers';
import { ErrorFound } from '../layouts';

const useStyles = makeStyles(theme => ({
  columnContainer: {
    height: '100%',
    width: '60%',
  },
  contentWidth: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '85%'
    }
  },
  required: {
    paddingTop: theme.spacing(3)
  },
  titleContainer: {
    minHeight: 72
  },
  astra: {
    color: red[500]
  }
}))

function CreateQuestion(props) {
  const classes = useStyles()
  const { appStatus: { isLoading }, stopLoading, resetAppStatus, postType } = props

  useEffect(() => {
    resetAppStatus()
    stopLoading()
  }, [])

  if (isLoading) return <LoadingPage />

  if (postTypes.indexOf(postType) === -1) {
    // Only need to return ErrorFound but not 404 page
    // because the current component has been wrapped by Main
    return <ErrorFound error={errorGenerator()} />
  }

  return (
    <Grid container justifyContent="center">
      <Grid 
        item
        container 
        direction="column"
        alignItems="center"
        spacing={3} 
        className={classes.columnContainer}
      >
        <Grid item xs className={classes.contentWidth}>
          <Fragment>
            <Typography 
              variant="overline" 
              gutterBottom
              display="block"
              className={classes.required}
            >
              Items with <span className={classes.astra}>*</span> are required.
            </Typography>
            <Form isNewlyCreated={true} />
          </Fragment>
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = ({ appStatus }, { location }) => ({ 
  appStatus,
  postType: getQueryString(location)
})

export default connect(mapStateToProps, { stopLoading, resetAppStatus })(CreateQuestion)
