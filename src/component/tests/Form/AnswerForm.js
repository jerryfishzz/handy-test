import React from 'react'
import { 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  withStyles,
  Grid,
  Avatar,
  Paper,
  useMediaQuery,
} from '@material-ui/core';
import { getTheAlphanumericOrder } from '../../../utils/helpers';
import { indigo, red } from '@material-ui/core/colors';
import { useTheme } from '@material-ui/core/styles';

import DraftEditor from './DraftEditor';

const styles = theme => ({
  item: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:first-child': {
      paddingTop: theme.spacing(2)
    },
    '&:last-child': {
      paddingBottom: 0
    }
  },
  paper: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(2.5)
  },
  caption: {
    color: theme.palette.text.secondary
  },
  specContainer: { 
    paddingTop: 8, 
    paddingBottom: 8,
    '&:first-child': {
      paddingTop: 0
    },
    '&:last-child': {
      paddingBottom: 0
    }
  },
  avatar: {
    backgroundColor: 'white',
    color: indigo[500],
    border: `2px solid ${indigo[500]}`,
    margin: '0 4px'
  },
  delete: {
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing(4),
    }
  },
  deleteEdit: {
    [theme.breakpoints.up('xl')]: {
      marginTop: theme.spacing(4),
    }
  },
  required: {
    marginRight: theme.spacing(0.5)
  },
  astra: {
    color: red[500]
  },
});

const AnswerForm = ({ 
  answers, 
  classes,
  onAnswerChange,
  onDelete,
  onNewAnswer,
  countsOfAnswer
}) => {
  const handleContentChange = onAnswerChange('content')
  const handleCorrectnessChange = onAnswerChange('correctness')
  const handleNoteChange = onAnswerChange('note')

  const theme = useTheme();
  const matchLg = useMediaQuery(theme.breakpoints.up('lg'));

  const answerContent = answers.map((a, i) => {
    const orderCode = getTheAlphanumericOrder(i)

    return (
      <Grid key={i} item className={classes.item}>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item container xs={12} lg={2}>
              <Grid 
                item 
                container
                direction={matchLg ? 'column' : 'row'}
                justifyContent={matchLg ? 'center' : 'space-between'}
                alignItems="center"
              >
                <Avatar className={classes.avatar}>
                  {orderCode}
                </Avatar>
                {answers.length > 1
                  ? <Button 
                      onClick={() => onDelete(i, a.id)} 
                      color="secondary"
                      size="small"
                      className={classes.delete}
                    >
                      Delete
                    </Button>
                  : null
                }
              </Grid>
            </Grid>

            <Grid item container direction="column" xs={12} lg={10}>
              <Grid item container direction="column" className={classes.specContainer}>
                <Typography variant="caption" gutterBottom className={classes.caption}>
                  <span className={classes.required}>Answer</span><span className={classes.astra}>*</span>
                </Typography>
                <DraftEditor 
                  contents={answers[i].content} 
                  handleDraftChange={handleContentChange(i)}
                />
              </Grid>
              <Grid item container direction="column" className={classes.specContainer}>
                <FormControl>
                  <InputLabel>
                    Correctness
                  </InputLabel>
                  <Select
                    value={answers[i].correctness}
                    onChange={handleCorrectnessChange(i)}
                  >
                    <MenuItem value={true}>
                      <em>True</em>
                    </MenuItem>
                    <MenuItem value={false}>
                      <em>False</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item container direction="column" className={classes.specContainer}>
                <Typography variant="caption" gutterBottom className={classes.caption}>
                  Comment
                </Typography>
                <DraftEditor 
                  contents={answers[i].note} 
                  handleDraftChange={handleNoteChange(i)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    )
  })
  
  return (
    <Grid container direction="column">
      <Grid 
        item
        container 
        justifyContent="space-between" 
        alignItems="center"
      >
        <Typography variant="button" color="primary">Answers</Typography>
        <Button 
          onClick={onNewAnswer}
          color="primary"
          variant="contained"
          size="small"
          disabled={countsOfAnswer >= 5}
        >
          Add
        </Button>
      </Grid>
      <Grid item container direction="column">
        {answerContent}
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(AnswerForm)
