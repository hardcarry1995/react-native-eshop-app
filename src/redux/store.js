import { applyMiddleware, createStore } from 'redux';

import appReducer from '../redux/reducers/appReducer';

const store = createStore(appReducer);

export default store;
