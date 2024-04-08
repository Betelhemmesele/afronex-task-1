import { combineReducers } from 'redux';
import authReducer from './auth';
// import tasksReducer from './tasks';

const rootReducer = combineReducers({
  auth: authReducer,
//   tasks: tasksReducer,
  // Add other reducers here if needed
});

export default rootReducer;