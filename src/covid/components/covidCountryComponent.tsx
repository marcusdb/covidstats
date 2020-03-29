import React from "react";

import { connect, ConnectedProps } from "react-redux";
import { fetchAllCountries } from "../covidCountryActions";
import { RootState } from "../../reducers";
import {CovidCountry} from "../models/CovidCountry"

const mapState = (state: RootState) => {
    return {
        countries: state.covidCountryReducer.availableCountries
    };
};

const mapDispatch = {
    onClick: () => fetchAllCountries()
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    //blueprints: Array<BluePrint>;
    /** callback function passed to the onClick handler*/
    onClick: () => void;
};
const BPComponent = ({ onClick, countries }: Props) => (
    <div>
        BLA BLA
        <button onClick={onClick}> Toggle is</button>
        {countries.map(ct => (
            <li key={ct.name}>
                <CovidCountryComponent country={ct} />
            </li>
        ))}
    </div>
);

const CovidCountryComponent = (props: { country: CovidCountry }) => {
    return <div>{props.country.name}</div>;
};

export default connector(BPComponent);
