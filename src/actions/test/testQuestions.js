import { updateQuestion, addQuestionToDB, addQuestionToWp, removeQuestionFromWp, updateQuestionToWp } from "../../utils/api";
import { formatForDB, formatForWp } from "../../utils/helpers";
// import shuffle from 'shuffle-array'
// import * as R from 'ramda'
// import { formatQuestion } from "../../utils/helpers";

export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS'
export const CLICK_ANSWER = 'CLICK_ANSWER'
export const SUBMIT_QUESTION = 'SUBMIT_QUESTION'
export const REMOVE_QUESTION = 'REMOVE_QUESTION'
export const SAVE_QUESTION = 'SAVE_QUESTION'
export const CREATE_QUESTION = 'CREATE_QUESTION'

export function receiveQuestions(questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions
  }
}

// export function handleReceiveQuestions() {
//   return async dispatch => {
//     try {
//       const questionsObj = await getQuestions()
//       const questionsArr = Object.keys(questionsObj).map(id => formatQuestion(questionsObj[id]))

//       const shuffleArrayThenTakeFirstTen = R.compose(R.take(10), shuffle)
//       const randomizedQuestionsForTest = shuffleArrayThenTakeFirstTen(questionsArr)

//       dispatch(receiveQuestions(randomizedQuestionsForTest))
//     } catch(err) {
//       throw Error('Get questions error')
//     }
//   }
// }

export function clickAnswer(id, index) {
  return {
    type: CLICK_ANSWER,
    id,
    index
  }
}

export function submitQuestion(id, index) {
  return {
    type: SUBMIT_QUESTION,
    id,
    index
  }
}

export function removeQuestion(id) {
  return {
    type: REMOVE_QUESTION,
    id
  }
}

function saveQuestion(updatedQuestion) {
  return {
    type: SAVE_QUESTION,
    updatedQuestion
  }
}

export function handleSaveQuestion(id, updatedQuestion) {
  return async (dispatch, getState) => {
    const { test: { testQuestions } } = getState()
    const currentQuestion = 
      testQuestions.filter(question => question.id === id)[0]

    try {
      const questionForDB = formatForDB(updatedQuestion)
      await updateQuestion(questionForDB)

      dispatch(saveQuestion(updatedQuestion))
    } catch(err) {
      dispatch(saveQuestion(currentQuestion))
      throw Error('Update error')
    }
  }
}

export function handleSaveQuestionToWp(id, updatedQuestion) {
  return async (dispatch, getState) => {
    const { test: { testQuestions } } = getState()
    const currentQuestion = 
      testQuestions.filter(question => question.id === id)[0]

    try {
      // const questionForDB = formatForDB(updatedQuestion)
      const questionForWp = formatForWp(updatedQuestion)
      await updateQuestionToWp(id, questionForWp)

      dispatch(saveQuestion(updatedQuestion))
    } catch(err) {
      dispatch(saveQuestion(currentQuestion))
      throw err
    }
  }
}

export function createQuestion(newQuestion) {
  return {
    type: CREATE_QUESTION,
    newQuestion
  }
}

export function handleCreateQuestion(newQuestion, cb) {
  return async dispatch => {
    try {
      const questionForDB = formatForDB(newQuestion)
      await addQuestionToDB(questionForDB)

      dispatch(createQuestion(newQuestion))
      cb()
    } catch(err) {
      throw Error('Create question error')
    }
  }
}

export function handleCreateQuestionToWp(newQuestion, cb) {
  // console.log(11111111)
  return async dispatch => {
    try {
      const questionForWp = formatForWp(newQuestion)
      // console.log(questionForWp)
      const { id } = await addQuestionToWp(questionForWp)

      const questionWithWpId = {
        ...newQuestion,
        id,
        data: {
          ...newQuestion.data,
          id
        }
      }
      dispatch(createQuestion(questionWithWpId))
      cb()
    } catch(err) {
      throw err
    }
  }
}
