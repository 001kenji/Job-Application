import { createStore, applyMiddleware, compose} from 'redux'
import {composeWithDevTools} from '@redux-devtools/extension'
import {thunk} from 'redux-thunk'
import rootReducer from './reducers'

const initialState = {};
//devtools exposes your states to others to remove do applyMiddlwware(...middeware)


 
const middleware = [thunk];

const Store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
    //applyMiddleware(...middleware)
)
export default Store




