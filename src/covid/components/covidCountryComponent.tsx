import React from "react";

import { connect, ConnectedProps } from "react-redux";
import { fetchAllCountries } from "../covidCountryActions";
import { RootState } from "../../reducers";
import { CovidCountry } from "../models/CovidCountry";
import { Icon, Label, Menu, Table } from "semantic-ui-react";

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
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
          <Table.HeaderCell>Header</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Label ribbon>First</Label>
          </Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
          <Table.Cell>Cell</Table.Cell>
        </Table.Row>
      </Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="3">
            <Menu floated="right" pagination>
              <Menu.Item as="a" icon>
                <Icon name="chevron left" />
              </Menu.Item>
              <Menu.Item as="a">1</Menu.Item>
              <Menu.Item as="a">2</Menu.Item>
              <Menu.Item as="a">3</Menu.Item>
              <Menu.Item as="a">4</Menu.Item>
              <Menu.Item as="a" icon>
                <Icon name="chevron right" />
              </Menu.Item>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
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
