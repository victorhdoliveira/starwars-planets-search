import { useContext, useEffect, useState } from 'react';
import PlanetContext from '../context/PlanetsContext';

export default function Table() {
  const { data: { results }, isLoading,
    filterPlanet, setFilterPlanet } = useContext(PlanetContext);
  const [search, setSearch] = useState('');
  const [numericFilters, setNumericFilters] = useState([]);
  const [filterColumn, setFilterColumn] = useState('population');
  const [operator, setOperator] = useState('maior que');
  const [valueFilter, setValueFilter] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const filterByName = results.filter((planet) => planet.name.toLowerCase()
        .includes(search));

      setFilterPlanet(numericFilters.reduce((acc, curr) => acc.filter((data) => {
        const typedNumber = Number(curr.valueFilter);
        switch (curr.operator) {
        case 'maior que':
          return data[curr.filterColumn] > typedNumber;
        case 'menor que':
          return data[curr.filterColumn] < typedNumber;
        default:
          return data[curr.filterColumn].match(`^${typedNumber}$`);
        }
      }), filterByName));
    }
  }, [search, numericFilters]);

  const handleNumericFilter = () => {
    const chosenFilter = {
      filterColumn,
      operator,
      valueFilter,
    };
    setNumericFilters([...numericFilters, chosenFilter]);
  };

  return (
    <div>
      { isLoading ? (<h2>...loading</h2>) : (
        <>
          <form>
            <label htmlFor="filtros">
              <input
                data-testid="name-filter"
                type="text"
                name="filtros"
                placeholder="buscar"
                value={ search }
                onChange={ (e) => setSearch(e.target.value.toLowerCase()) }
              />
            </label>
            <label htmlFor="Coluna">
              Coluna
              <select
                data-testid="column-filter"
                onChange={ ({ target }) => setFilterColumn(target.value) }
              >
                <option>population</option>
                <option>orbital_period</option>
                <option>diameter</option>
                <option>rotation_period</option>
                <option>surface_water</option>
              </select>
            </label>
            <label htmlFor="Operador">
              Operador
              <select
                data-testid="comparison-filter"
                onChange={ ({ target }) => setOperator(target.value) }
              >
                <option>maior que</option>
                <option>menor que</option>
                <option>igual a</option>
              </select>
            </label>
            <input
              data-testid="value-filter"
              type="number"
              placeholder="0"
              value={ valueFilter }
              onChange={ ({ target }) => setValueFilter(target.value) }
            />
            <button
              data-testid="button-filter"
              type="button"
              onClick={ handleNumericFilter }
            >
              Filtrar
            </button>
          </form>
          {numericFilters.map(
            (filter, index) => (
              <p
                key={ `${filter.filterColumn}-${index}` }
              >
                {`${filter.filterColumn} ${filter.operator} ${filter.valueFilter}`}
              </p>
            ),
          )}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Rotation Period</th>
                <th>Orbital Period</th>
                <th>Diameter</th>
                <th>Climate</th>
                <th>Gravity</th>
                <th>Terrain</th>
                <th>Surface Water</th>
                <th>Population</th>
                <th>Films</th>
                <th>Created</th>
                <th>Edited</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {filterPlanet.map((result, index) => (
                <tr key={ index }>
                  <td>{result.name}</td>
                  <td>{result.rotation_period}</td>
                  <td>{result.orbital_period}</td>
                  <td>{result.diameter}</td>
                  <td>{result.climate}</td>
                  <td>{result.gravity}</td>
                  <td>{result.terrain}</td>
                  <td>{result.surface_water}</td>
                  <td>{result.population}</td>
                  <td>{result.films}</td>
                  <td>{result.created}</td>
                  <td>{result.edited}</td>
                  <td>{result.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
