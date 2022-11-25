import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import PlanetsContext from './PlanetsContext';

export default function PlanetsProvider({ children }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPlanet, setFilterPlanet] = useState([]);
  const [filterReset, setFilterReset] = useState([]);

  const fetchApi = async () => {
    const response = await fetch('https://swapi.dev/api/planets');
    const planetsData = await response.json();
    planetsData.results.forEach((planet) => delete planet.residents);
    setData(planetsData);
    setFilterPlanet(planetsData.results);
    setFilterReset(planetsData.results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const value = useMemo(
    () => ({ data, isLoading, filterPlanet, setFilterPlanet, filterReset }),
    [data, isLoading, filterPlanet, setFilterPlanet, filterReset],
  );

  return (
    <PlanetsContext.Provider value={ value }>
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
