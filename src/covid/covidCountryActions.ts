import { CovidCountry } from "./models/CovidCountry";

export const FETCH_ALL_COUNTRIES_REQUEST = "FETCH_ALL_COUNTRIES_REQUEST";
export const FETCH_ALL_COUNTRIES_RESULT =
  "FETCH_ALL_COUNTRIES_RESULT";

interface FetchAllCountriesAction {
  type: typeof FETCH_ALL_COUNTRIES_REQUEST;
}

interface FetchAllCountriesResultAction {
  type: typeof FETCH_ALL_COUNTRIES_RESULT;
  country: CovidCountry;
}

export type CountryActionTypes =
  | FetchAllCountriesResultAction
  | FetchAllCountriesAction;

export function fetchAllCountries(): CountryActionTypes {
  return {
    type: FETCH_ALL_COUNTRIES_REQUEST
  };
}

export function FetchAllCountriesResult(
  country: CovidCountry
): CountryActionTypes {
  return {
    type: FETCH_ALL_COUNTRIES_RESULT,
    country
  };
}
