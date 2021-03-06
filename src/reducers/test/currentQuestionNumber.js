import { 
  NEXT_QUESTION, 
  PREVIOUS_QUESTION, 
  SHRINK_FROM_DELETE, 
  RESET_NUMBER, 
  EXPAND_FROM_RESTORE
} from "../../actions/test/currentQuestionNumber";

export default function currentQuestionNumber(state, action) {
  switch (action.type) {
    case NEXT_QUESTION:
    case EXPAND_FROM_RESTORE:
      return state + 1
    case PREVIOUS_QUESTION:
    case SHRINK_FROM_DELETE:
      return state - 1
    case RESET_NUMBER:
      return 0
    default:
      return state
  }
}