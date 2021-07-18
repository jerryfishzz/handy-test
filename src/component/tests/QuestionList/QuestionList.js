import React, { useState, useEffect } from 'react'
import { 
  Paper, 
  Grid, 
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TableFooter,
  TablePagination,
  useMediaQuery
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { useTheme } from '@material-ui/core/styles';

import { errorGenerator } from '../../../utils/helpers'
import { 
  handleGetList, 
  handleChangeRowsPerPage, 
  handleResetQuestionList, 
} from '../../../actions/questionList';
import TablePaginationActions from './TablePaginationActions'
import CreateDialog from '../Dialog'
import Search from './Search';
import { Loading, ErrorFound } from '../../layouts';
import { stopLoading, getError, resetAppStatus } from '../../../actions/appStatus';
import { openAlert } from '../../../actions/errorAlert';
import ErrorAlert from '../../layouts/ErrorAlert';

const useStyles = makeStyles(({
  titleContainer: {
    paddingBottom: 8
  },
  tableContainer: {
    width: '70%',
    paddingTop: 60,
    paddingBottom: 60
  },
  tablePaper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    minWidth: 650,
  },
  row: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
}))

const CreateQuestionList = (props) => {
  const classes = useStyles()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = React.useState(null);

  const { 
    questionList: { 
      rowsPerPage, page, totalQuestions, list 
    },
    postType,
    isLoading,
    errorFromAPI,
    openAlert
  } = props

  useEffect(() => {
    const { handleGetList, stopLoading, getError, resetAppStatus } = props

    resetAppStatus()
    handleGetList(postType)
      .then(res => stopLoading())
      .catch(err => {
        getError(err)
        stopLoading()
      })
  }, [])

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, totalQuestions - page * rowsPerPage);

  function handleChangeRPPage(event) {
    const { handleChangeRowsPerPage } = props
    handleChangeRowsPerPage(postType, parseInt(event.target.value, 10))
      .catch(err => {
        // alert(err)
        props.getError(err)
      })
  }

  function handleClickRow(event, id) {
    selected === id ? setSelected(null) : setSelected(id)
    setDialogOpen(true)
  }

  const isSelected = id => selected === id;

  const onClose = () => {
    setDialogOpen(false)
    setSelected(null)
  };

  const theme = useTheme();
  const matchSm = useMediaQuery(theme.breakpoints.up('sm'));

  if (!list || isLoading) return <Loading />

  switch (errorFromAPI) {
    case 400:
    case 404:
    case 997:
    case 999:
      return <ErrorFound error={errorGenerator(errorFromAPI)} />
    case 401:
    case 998:
      openAlert()
      break
    default:
      break;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item className={classes.tableContainer}>
        <Grid 
          container 
          alignItems={matchSm ? 'center' : 'stretch'}
          className={classes.titleContainer}
          direction={matchSm ? 'row' : 'column'}
        >
          <Grid item xs>
            <Typography variant='h5' gutterBottom={!matchSm}>
              Question List
            </Typography>
          </Grid>
          <Grid item>
            <Search />
          </Grid>
        </Grid>
        {!isLoading && (
          <Paper className={classes.tablePaper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Title</TableCell>
                  <TableCell align="right">Last Update</TableCell>
                  <TableCell align="right">Time Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map(row => {
                  const isItemSelected = isSelected(row.id);

                  return (
                    <TableRow 
                      key={row.id} 
                      hover={true} 
                      onClick={(event) => handleClickRow(event, row.id)} 
                      selected={isItemSelected}
                      className={classes.row}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell 
                        align="right" 
                        dangerouslySetInnerHTML={{ 
                          __html: row.title.rendered
                        }}
                      >
                      </TableCell>
                      <TableCell align="right">{row.modified}</TableCell>
                      <TableCell align="right">{row.date}</TableCell>
                    </TableRow>
                  )
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={4}
                    count={totalQuestions}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={() => null}
                    onChangeRowsPerPage={handleChangeRPPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
            <CreateDialog 
              comeFrom="questionList"
              open={dialogOpen}
              onClose={onClose}
              qid={selected}
            />
          </Paper>
        )}
      </Grid>
      <ErrorAlert error={errorGenerator(errorFromAPI)} />
    </Grid>
  )
}

const mapStatesToProps = ({ questionList, appStatus }, { match }) => ({
  questionList,
  postType: match.params.postType,
  isLoading: appStatus.isLoading,
  errorFromAPI: appStatus.errorFromAPI
})

export default withRouter(connect(
  mapStatesToProps,
  { 
    handleGetList, 
    handleChangeRowsPerPage, 
    handleResetQuestionList,
    stopLoading,
    getError,
    resetAppStatus,
    openAlert
  }
)(CreateQuestionList))
