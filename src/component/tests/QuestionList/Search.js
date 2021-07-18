import React from 'react';
import { makeStyles, fade } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { searchRecords, handleGetList } from '../../../actions/questionList';
import { getPostType } from '../../../utils/helpers'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { getError } from '../../../actions/appStatus';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  search: {
    border: '1px solid rgba(224, 224, 224, 0.5)',
    position: 'relative',
    borderRadius: 24,
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.08),
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 5),
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  searchIcon: {
    width: theme.spacing(5),
    height: '100%',
    position: 'absolute',
    top: 0,
    pointerEvents: 'none',
  },
}));

function Search({ postType, searchRecords, handleGetList, getError }) {
  const classes = useStyles();

  const handleChange = event => {
    searchRecords(event.target.value)
    handleGetList(postType)
      .catch(err => {
        alert(err)
        getError(err)
      })
  }

  return (
    <Grid container className={classes.search}>
      <Grid item>
        <InputBase
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          placeholder="Search"
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid 
        item 
        container 
        alignItems="center" 
        justifyContent="center" 
        className={classes.searchIcon}
      >
        <SearchIcon />
      </Grid>
    </Grid>
  );
}

const mapStatesToProps = (state, { location: { pathname }}) => ({
  postType: getPostType(pathname),
})

export default withRouter(connect(
  mapStatesToProps, 
  { handleGetList, searchRecords, getError }
)(Search))