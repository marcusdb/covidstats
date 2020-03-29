import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/index";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from '../reducers/index';

const epicMiddleware = createEpicMiddleware();

const middleware = [thunk, epicMiddleware];
const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(...middleware)
        // other store enhancers if any
    )
);




epicMiddleware.run(rootEpic);
export default store;
