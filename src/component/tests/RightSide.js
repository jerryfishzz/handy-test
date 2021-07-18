import React, { Fragment } from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { red } from '@material-ui/core/colors';

import Form from './Form'
import Notes from './Notes'

const useStyles = makeStyles(theme => ({
  columnContainer: {
    height: '100%'
  },
  contentWidth: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '75%'
    }
  },
  titleContainer: {
    minHeight: 72
  },
  itemQuestion: {
    overflowY: 'auto'
  },
  astra: {
    color: red[500]
  }
}))

function RightSide(props) {
  const classes = useStyles()
  const { test: { editQuestion } } = props

  return (
    <Grid 
      container 
      direction="column"
      alignItems="center"
      spacing={3} 
      className={classes.columnContainer}
    >
      <Grid item container justifyContent="center" className={classes.titleContainer}>
        <Grid 
          item 
          container 
          alignItems="center" 
          className={classes.contentWidth}
        >
          <Typography variant='h5'  color="primary">
            {editQuestion ? "Edit Question" : "NOTES"}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        container
        justifyContent="center"
        xs 
        className={classes.itemQuestion}
      >
        <Grid item className={classes.contentWidth}>
          {editQuestion
            ? <Fragment>
                <Typography variant="subtitle1" gutterBottom>
                  Items with <span className={classes.astra}>*</span> are required.
                </Typography>
                <Form />
              </Fragment>
            : <Notes />
          }
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = ({ test }) => {
  return { 
    test
  }
}

export default connect(mapStateToProps)(RightSide)
