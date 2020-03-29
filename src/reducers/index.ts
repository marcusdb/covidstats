import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import covidCountryReducer from "../covid/covidCountryReducer";
import {CovidCountryEpic} from '../covid/covidCountryEpics';

const rootReducer = combineReducers({
    covidCountryReducer
});


export const rootEpic = combineEpics(
    CovidCountryEpic
);

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;






