import React from 'react'
import { 
  Fab, 
  AppBar, 
  Toolbar, 
  Typography, 
  withStyles, 
  Tooltip 
} from '@material-ui/core';
import Shuffle from '@material-ui/icons/Shuffle';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import CreateDialog from '../tests/Dialog'
import { initializeAppFromWordPress } from '../../actions/shared.js';
import { resetNumber } from '../../actions/test/currentQuestionNumber.js';
import { resetEdit } from '../../actions/test/editQuestion';

const Header = ({ classes, shuffleQuestions, pathname }) => (
  <AppBar position="static">
    <Toolbar className={classes.toolBar}>
      <Typography 
        className={classes.flex} 
        variant="h5" 
        color="inherit"
      >
        CODE TEST
      </Typography>
      <Tooltip title="Shuffle Questions">
        <Fab 
          color="secondary"
          size="small"
          className={classes.fab}
          onClick={shuffleQuestions}
          disabled={pathname !== '/'}
        >
          <Shuffle />
        </Fab>
      </Tooltip>
      <CreateDialog />
    </Toolbar>
  </AppBar>
)

const mapStateToProps = (state, { location: { pathname } }) => {
  return { 
    pathname
  }
}

const mapDispatchToProps = (dispatch, { location: { pathname } }) => {
  const resetNumberAndEdit = () => {
    return dispatch => {
      dispatch(resetNumber())
      dispatch(resetEdit())
    }
  }

  const postType = pathname === '/' ? 'questions' : 'temps'

  return {
    shuffleQuestions: () => {
      dispatch(initializeAppFromWordPress(resetNumberAndEdit, postType))
    }
  }
}

const styles = theme => ({
  flex: {
    flex: 1
  },
  fab: {
    marginRight: 5,
  },
  toolBar: {
    marginLeft: 10,
    marginRight: 10
  },
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Header)))
