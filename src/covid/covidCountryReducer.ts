import {
    CountryActionTypes,
    FETCH_ALL_COUNTRIES_RESULT
} from "./covidCountryActions";
import { CovidCountry, CovidDataPoint } from "./models/CovidCountry";


export interface covidCountryState {
    availableCountries: Array<CovidCountry>;
}

const initialState: covidCountryState = {
    availableCountries: []
};

function covidCountryReducer(state = initialState, action: CountryActionTypes) {
    switch (action.type) {
        case FETCH_ALL_COUNTRIES_RESULT:
            findFirstDayAfterXD(action.country,10);
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

export default covidCountryReducer;

// function coviCountryAfterDaysAfterXDSelector(state:covidCountryState,daysAfterXD:number=10){

// }

function findFirstDayAfterXD(country:CovidCountry,daysAfterXD:number=10){
    console.log(country.subRegions);
    Object.values(country.subRegions.total.data as Object).sort((a, b) =>{
        return a.date - b.date;
      }).reduce((acc:number,value:CovidDataPoint)=>{
        if(acc+value.deaths>daysAfterXD){
            console.log(country.name)
            console.log(value.date);
        }
        return acc+value.deaths
      },0)


}
