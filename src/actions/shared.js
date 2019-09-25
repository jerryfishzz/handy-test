import shuffle from 'shuffle-array'
import * as R from 'ramda'

import { receiveQuestions } from "./test/testQuestions";
import { receiveTags } from "./tags";
import { 
  getInitialDataFromWordPress, 
  getAnswersForQuestionFromWp  
} from "../utils/api";
import { 
  formatQuestion, 
  formatQuestionsFromWordPress, 
  addAnswersToQuestion 
} from "../utils/helpers";
import { handleResetTest } from './test/shared';

export function initializeAppFromWordPress(cb = null, postType) {
  return async dispatch => {
    try {
      dispatch(handleResetTest())

      let [questions, tags] = await getInitialDataFromWordPress(postType) // Get at most 50 random-ordered questions
      let questionsForTest = []
      
      if (questions.length) {
        questions = formatQuestionsFromWordPress(questions) // an object

        // an array of objects
        const formattedQuestionArray = 
          Object.keys(questions).map(id => formatQuestion(questions[id])) // Object.key will order elements ascendingly by their keys

        const shuffleArrayThenTakeFirstTen = R.compose(R.take(10), shuffle)
        
        questionsForTest = postType !== 'temps'
          ? shuffleArrayThenTakeFirstTen(formattedQuestionArray)
          : formattedQuestionArray

        // questionsForTest = shuffleArrayThenTakeFirstTen(formattedQuestionArray)
        
        questionsForTest = await Promise.all(
          questionsForTest.map(async question => {
            try {
              const answers = await getAnswersForQuestionFromWp(question.id)

              return addAnswersToQuestion(answers, question)
            } catch(err) {
              throw err
            }
          })
        )
      }
      
      dispatch(receiveQuestions(questionsForTest))
      dispatch(receiveTags(tags))

      if (cb) dispatch(cb())
    } catch(err) {
      throw Error('Initialize error')
    }
  }
}