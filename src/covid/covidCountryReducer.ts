import {
    CountryActionTypes,
    FETCH_ALL_COUNTRIES_RESULT
} from "./covidCountryActions";
import { CovidCountry } from "./models/CovidCountry";


export interface BluePrintState {
    availableCountries: Array<CovidCountry>;
}

const initialState: BluePrintState = {
    availableCountries: []
};

function bluePrintReducer(state = initialState, action: CountryActionTypes) {
    switch (action.type) {
        case FETCH_ALL_COUNTRIES_RESULT:
            return {
                availableCountries: [
                    ...state.availableCountries,
                    action.country
                ]
            };
        default:
            return state;
    }
}

export default bluePrintReducer;
