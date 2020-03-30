import axios from "axios";
import { Observable } from "rxjs/internal/Observable";
import { filter, mergeMap, map, groupBy, reduce, tap } from "rxjs/operators";
import {
  CountryActionTypes,
  FetchAllCountriesResult
} from "./covidCountryActions";
import {
  CovidCountry,
  CovidDataPoint,
  CovidCountrySubRegion
} from "./models/CovidCountry";
import neatCsv from "neat-csv";

interface CountryRawData {
  [key: string]: string;
}

export const CovidCountryEpic = (
  action$: Observable<CountryActionTypes>
): Observable<CountryActionTypes> =>
  action$.pipe(
    filter(action => action.type === "FETCH_ALL_COUNTRIES_REQUEST"),
    mergeMap(_ => {
      return new Observable<CountryRawData>(subscriber => {
        axios
          .get(
            "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
          )
          .then(async function(response) {
            // handle success
            //console.log(response);
            let countriesRawData: Array<CountryRawData> = await neatCsv(
              response.data
            );
            countriesRawData.forEach(countryRawData =>
              subscriber.next(countryRawData)
            );
            subscriber.complete();
          })
          .catch(function(error) {
            // handle error
            subscriber.error(error);
            console.log(error);
          })
          .finally(() => {
            console.log("COMPLETE!!");
            subscriber.complete();
          });
      }).pipe(
        tap(null, null, () => console.log("COMPLETE RECEIVED")),
        map(countryRawData => parseRawData(countryRawData)),
        //tap(covidCountry=>console.log(`covid:${covidCountry.name}`)),
        groupBy(country => country.name),

        mergeMap(countryObservable =>
          countryObservable.pipe(
            //tap(covidCountry=>console.log(`covidGroupBy:${covidCountry.name}`)),
            reduce<CovidCountry>((covidCountry, covidCountrySubRegion) => {
              //console.log(`reduce:${covidCountry.name} --- ${covidCountrySubRegion.name}`)
              covidCountry.subRegions.total = covidCountry.subRegions.total || {
                name: "total",
                lat: 0,
                long: 0,
                data: {}
              };
              for (const region in covidCountrySubRegion.subRegions) {
                for (const date in covidCountrySubRegion.subRegions[region].data) {
                  if (covidCountry.subRegions.total.data) {
                    covidCountry.subRegions.total.data[date] = covidCountry
                      .subRegions.total.data[date] || { deaths: 0 };

                    let subRegionsData =
                      covidCountrySubRegion.subRegions[region].data;
                    if (subRegionsData && subRegionsData[date]) {
                      let deaths = subRegionsData[date].deaths;
                      covidCountry.subRegions.total.data[date].deaths =
                        covidCountry.subRegions.total.data[date].deaths +
                        deaths;
                    }
                  }

                  //covidCountry.subRegions["country"].data[date]=covidCountry.subRegions["country"].data[date] || {deaths:0}
                  // if(covidCountry.subRegions["country"].data && covidCountry.subRegions["country"].data[date] && covidCountry.subRegions["country"].data[date].deaths
                  // && covidCountrySubRegion.subRegions && covidCountrySubRegion.subRegions[region] && covidCountrySubRegion.subRegions[region].data && covidCountrySubRegion.subRegions[region].data[date] && covidCountrySubRegion.subRegions[region].data[date].deaths)
                  //covidCountrySubRegion.subRegions[region].data[date].deaths=0;
                  //covidCountry.subRegions["country"].data[date].deaths=covidCountry.subRegions["country"].data[date].deaths + covidCountrySubRegion.subRegions[region].data[date].deaths;
                }
              }

              Object.assign(
                covidCountry.subRegions,
                covidCountrySubRegion.subRegions
              );

              //   console.log(
              //     `reducerResult1:${covidCountry.subRegions.map(sr => sr.name)}`
              //   );
              return covidCountry;
            })
            // tap(covidCountry =>
            //   console.log(`reducerResult:${covidCountry.name}`)
            // )
          )
        )
      );
    }),

    tap(covidCountry => {
      if (covidCountry.name === "China") console.log(covidCountry);
    }),
    map(covidCountry => FetchAllCountriesResult(covidCountry))
  );

function parseRawData(countryRawData: CountryRawData): CovidCountry {
  let result: CovidCountry = {
    name: "N/A",
    subRegions: {}
  };
  let subRegion: CovidCountrySubRegion = {
    name: "total",
    lat: 0,
    long: 0,
    data: {}
  };
  for (const prop in countryRawData) {
    if (prop === "Province/State" && countryRawData[prop].trim().length > 0) {
      subRegion.name = countryRawData[prop];
    }
    if (prop === "Country/Region") {
      result.name = countryRawData[prop];
    }
    if (prop === "Lat") {
      subRegion.lat = parseFloat(countryRawData[prop]);
    }
    if (prop === "Long") {
      subRegion.long = parseFloat(countryRawData[prop]);
    }
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/gm;

    let matches;

    while ((matches = regex.exec(prop)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (matches.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      let dataPoint: CovidDataPoint = {
        date: 10000101,
        realDate: new Date(),
        deaths: 0
      };
      // The result can be accessed through the `m`-variable.
      dataPoint.date = parseInt(
        `2020${("0" + parseInt(matches[1])).slice(-2)}${(
          "0" + parseInt(matches[2])
        ).slice(-2)}`
      );
      dataPoint.realDate = new Date(
        2020,
        parseInt(matches[1]) - 1,
        parseInt(matches[2])
      );
      dataPoint.deaths = parseInt(countryRawData[prop]);
      if (subRegion.data) subRegion.data[dataPoint.date] = dataPoint;
      result.subRegions[subRegion.name] = subRegion;
    }
  }
  //console.log(`result:${JSON.stringify(result)}`);
  return result;
}
