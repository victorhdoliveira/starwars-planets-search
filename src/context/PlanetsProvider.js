import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import requestAPI from '../services/requestAPI';
import PlanetsContext from './PlanetsContext';

export default function PlanetsProvider({ children }) {
  const [data, setData] = useState([]);

  const fetch = async () => {
    setData(await requestAPI());
  };

  useEffect(() => {
    fetch();
  }, []);

  const value = useMemo(() => ({ data }), [data]);

  return (
    <PlanetsContext.Provider value={ value }>
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
