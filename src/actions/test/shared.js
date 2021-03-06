import { 
  nextQuestion, 
  previousQuestion, 
  shrinkFromDelete, 
  resetNumber,
  expandFromRestore,
} from "./currentQuestionNumber";
import { resetEdit } from "./editQuestion";
import { 
  removeQuestion, 
  submitQuestion, 
  resetTestquestions,
  restoreQuestion,
} from "./testQuestions";
import { removeQuestionFromWp, getQuestionFromWp, getAnswersForQuestionFromWp } from "../../utils/api";
import { startDeleting } from "../appStatus";
import { handleFormatQuestionFromWordPress, addAnswersToQuestion, QUESTION_COUNTS } from "../../utils/helpers";
import { plusOffset, minusOffset, resetTestOffset } from "./offset";

export function handleNext() {
  return dispatch => {
    dispatch(nextQuestion())
    dispatch(resetEdit())
  }
}

export function handleBack() {
  return dispatch => {
    dispatch(previousQuestion())
    dispatch(resetEdit())
  }
}

export function handleSubmitQuestion(id) {
  return dispatch => {
    dispatch(submitQuestion(id))
    dispatch(resetEdit())
  }
}

export function removeQuestionFromStore(dispatch, testQuestions, currentQuestionNumber, id) {
  const currentTestLength = testQuestions.length >= QUESTION_COUNTS
    ? QUESTION_COUNTS : testQuestions.length

  // Offset the currentQuestionNumber by -1 if the deleted question is the last
  if (currentQuestionNumber === currentTestLength - 1) {
    dispatch(shrinkFromDelete())
  }

  dispatch(removeQuestion(id))
  dispatch(plusOffset())
  dispatch(resetEdit())
}

export function handleRemoveQuestionFromWp(id, postType) {
  return async (dispatch, getState) => {
    dispatch(startDeleting())

    const { test: { testQuestions, currentQuestionNumber } } = getState()
    const currentQuestion = 
      testQuestions.filter(question => question.id === id)[0]
    
    removeQuestionFromStore(dispatch, testQuestions, currentQuestionNumber, id)

    const { test: { 
      currentQuestionNumber: currentQuestionNumberMaybeAfterShrinking
    } } = getState()

    try {
      const { data } = await getQuestionFromWp(postType, id)

      if (currentQuestion.data.modified_gmt === data.modified_gmt) {
        return removeQuestionFromWp(id, postType)
          .catch(err => {
            dispatch(restoreQuestion(currentQuestionNumber, currentQuestion))
            dispatch(minusOffset())
            if (currentQuestionNumber !== currentQuestionNumberMaybeAfterShrinking) {
              dispatch(expandFromRestore())
            }
            throw err
          })
      } else {
        const answers = await getAnswersForQuestionFromWp(id)
        const questionWithoutAnswers = handleFormatQuestionFromWordPress(data)
        const question = addAnswersToQuestion(answers, questionWithoutAnswers)

        dispatch(restoreQuestion(currentQuestionNumber, question))
        dispatch(minusOffset())

        if (currentQuestionNumber !== currentQuestionNumberMaybeAfterShrinking) {
          dispatch(expandFromRestore())
        }

        // Here need to return an error-throwing function 
        // but not throw directly;
        // Otherwise, the error will go to the below catch block,
        // making the logic messy
        return () => {
          const RECORD_NOT_MATCHED_ERROR = 998
          throw RECORD_NOT_MATCHED_ERROR
        }
      }
    } catch (err) { // This catch only deals with errors from the await above
      if (err !== 401) {
        dispatch(restoreQuestion(currentQuestionNumber, currentQuestion))
        dispatch(minusOffset())
        if (currentQuestionNumber !== currentQuestionNumberMaybeAfterShrinking) {
          dispatch(expandFromRestore())
        }
      }
      throw err
    }
  }
}

export function handleResetTest() {
  return dispatch => {
    dispatch(resetTestquestions())
    dispatch(resetEdit())
    dispatch(resetNumber())
    dispatch(resetTestOffset())
  }
}
