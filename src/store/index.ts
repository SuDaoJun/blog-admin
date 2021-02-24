import { createStore } from 'redux'
import reducer from './reducers'

const { composeWithDevTools } = require('redux-devtools-extension');
const store = process.env.NODE_ENV === 'development'?createStore(reducer, composeWithDevTools()):createStore(reducer);

export default store