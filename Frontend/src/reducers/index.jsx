import {combineReducers} from 'redux'
import auth from './auth'
import chatReducer from './chatReducer';

//combineReduxers creates a single object called 'rootReducer'
export default combineReducers({
    auth,
    chatReducer
});