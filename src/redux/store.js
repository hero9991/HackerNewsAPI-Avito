import thunk from "redux-thunk";

const { combineReducers, createStore, applyMiddleware } = require("redux");
const { default: mainReducer } = require("./main-reducer");
const { default: newsReducer } = require("./news-reducer");


const reducers = combineReducers({
    mainPage: mainReducer,
    newsPage: newsReducer
})

const store = createStore(reducers, applyMiddleware(thunk));
window.store = store;
export default store;