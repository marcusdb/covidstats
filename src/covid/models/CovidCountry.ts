export interface CovidCountry {
  name: string;
  subRegions: { [name: string]: CovidCountrySubRegion };
}

export interface CovidCountrySubRegion {
  name: string;
  lat: number;
  long: number;
  data?: { [date: string]: CovidDataPoint };
}

export interface CovidDataPoint {
  date: number; //yyyymmdd
  realDate: Date;
  deaths: number;
  confirmed?: number;
}
