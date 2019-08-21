import React from 'react';
import { 
  withStyles, 
  List, 
  ListItem, 
  ListItemText, 
  Icon 
} from '@material-ui/core';
import classNames from 'classnames';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import { getTheAlphanumericOrder } from '../../../utils/store';
import { connect } from 'react-redux'
// import { withContext } from '../../../context';
import { clickAnswer } from '../../../actions/test/testQuestions';

class Answers extends React.Component {
  // handleListItemClick = i => {
  //   this.props.handleAnswerActions('selectedAnswer', i)
  // };

  componentDidMount() {
    // For Font Awesome
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#insertion-point-jss'),
    );
  }

  // Render the check and cross icon
  renderIcon = (i) => {
    const { classes, currentQuestion } = this.props

    if (currentQuestion.selectedAnswer === null) return null
    if (currentQuestion.submittedAnswer === null) return null

    let icon

    if (i === currentQuestion.selectedAnswer) {
      icon = currentQuestion.data.answers[i].correctness
        ? <Icon className={classNames(classes.icon, 'far fa-check-square')} />
        : <Icon className={classNames(classes.icon, 'far fa-times-circle')} />
    } else {
      icon = currentQuestion.data.answers[i].correctness
        ? <Icon className={classNames(classes.icon, 'far fa-check-square')} />
        : null
    }

    return icon
  }

  render() {
    const { classes, clickAnswer, currentQuestionNumber, testQuestions } = this.props;

    // Re-render only happens when the state itself in redux appears in the render method. Cannot just use a result calculated by mapStateToProps without any real state in redux.
    const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}

    // if (!currentQuestion.data.answers) return null
    // console.log(currentQuestion.selectedAnswer)

    return (
      <div className={classes.root}>
        <List component="nav">
          {currentQuestion.data.answers.map((a, i) => {
            const answerContent = getTheAlphanumericOrder(i) + '. ' + a.content
            
            return (
              <ListItem 
                key={i}
                button={!currentQuestion.isSubmitted} 
                selected={currentQuestion.selectedAnswer === i}
                onClick={
                  currentQuestion.isSubmitted 
                  ? null 
                  : () => clickAnswer(currentQuestion.id, i)
                }
              >
                <ListItemText primary={answerContent} />
                {this.renderIcon(i)}
              </ListItem>
            )
          })}
        </List>
      </div>  
    );
  }
}

const mapStateToProps = ({ test: { currentQuestionNumber, testQuestions } }) => {
  const currentQuestion = testQuestions.length 
    ? testQuestions.filter((q, index) => index === currentQuestionNumber)[0]
    : {}
  // console.log(currentQuestion)

  return {
    currentQuestion,
    currentQuestionNumber,
    testQuestions
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

export default connect(
  mapStateToProps,
  {clickAnswer}
)(withStyles(styles)(Answers))
