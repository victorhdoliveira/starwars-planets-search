import { useContext, useEffect, useState } from 'react';
import PlanetContext from '../context/PlanetsContext';

const fullColumnOptions = ['population', 'orbital_period',
  'diameter', 'rotation_period', 'surface_water'];

export default function Table() {
  const { data: { results }, isLoading,
    filterPlanet, setFilterPlanet, filterReset } = useContext(PlanetContext);
  const [search, setSearch] = useState('');
  const [numericFilters, setNumericFilters] = useState([]);
  const [filterColumn, setFilterColumn] = useState('population');
  const [operator, setOperator] = useState('maior que');
  const [valueFilter, setValueFilter] = useState(0);
  const [columnOptions, setColumnOptions] = useState(fullColumnOptions);
  const [previousOptions, setpreviousOptions] = useState('');
  const [reset, setReset] = useState(false);
  const [ascOrDesc, setAscOrDes] = useState('');
  const [orderColumn, setOrderColum] = useState('population');
  const [isOrder, setIsOrder] = useState(false);
  const [planetOrder, setPlanetOrder] = useState([]);

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
    setpreviousOptions(filterColumn);
    setNumericFilters([...numericFilters, chosenFilter]);
    setColumnOptions(columnOptions.filter((opt) => opt !== filterColumn));
    setFilterColumn(columnOptions[0]);
  };

  const removeFilter = (index, target) => {
    setNumericFilters(numericFilters.filter((_, i) => i !== index));
    const addOption = target.value;
    setColumnOptions(columnOptions.concat(addOption));
  };

  const removeAllFilters = () => {
    setFilterPlanet(filterReset);
    setColumnOptions(fullColumnOptions);
    setReset(true);
  };

  const order = () => {
    setIsOrder(true);
    const knownsData = filterPlanet.filter((e) => (e[orderColumn] !== 'unknown'));
    const unknowns = filterPlanet.filter((e) => (e[orderColumn] === 'unknown'));
    if (ascOrDesc === 'ASC') {
      const asc = knownsData.sort((a, b) => a[orderColumn] - b[orderColumn]);
      setPlanetOrder(asc.concat(unknowns));
    } else if (ascOrDesc === 'DESC') {
      const desc = knownsData.sort((a, b) => b[orderColumn] - a[orderColumn]);
      setPlanetOrder(desc.concat(unknowns));
    }
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
                {columnOptions
                  .map((options) => <option key={ options }>{options}</option>)}
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
            <label htmlFor="Ordenar">
              Ordenar por:
              <select
                data-testid="column-sort"
                value={ orderColumn }
                onChange={ ({ target }) => setOrderColum(target.value) }
              >
                {fullColumnOptions
                  .map((options) => <option key={ options }>{options}</option>)}
              </select>
              <input
                type="radio"
                data-testid="column-sort-input-asc"
                value="ASC"
                name="order"
                onChange={ ({ target }) => setAscOrDes(target.value) }
              />
              Ascendente
              <input
                type="radio"
                data-testid="column-sort-input-desc"
                value="DESC"
                name="order"
                onChange={ ({ target }) => setAscOrDes(target.value) }
              />
              Decrescente
            </label>
            <button
              type="button"
              data-testid="column-sort-button"
              onClick={ order }
            >
              Ordenar
            </button>
          </form>
          { !reset ? (
            <div>
              {numericFilters.map(
                (filter, index) => (
                  <p
                    data-testid="filter"
                    key={ `${filter.filterColumn}-${index}` }
                  >
                    {`${filter.filterColumn} ${filter.operator} ${filter.valueFilter}`}
                    <button
                      type="button"
                      value={ previousOptions }
                      onClick={ ({ target }) => removeFilter(index, target) }
                    >
                      X
                    </button>
                  </p>
                ),
              )}
            </div>
          ) : ('')}
          <button
            type="button"
            data-testid="button-remove-filters"
            onClick={ removeAllFilters }
          >
            Remover Filtros
          </button>
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
              {(isOrder ? (planetOrder) : (filterPlanet)).map((result, index) => (
                <tr key={ index }>
                  <td data-testid="planet-name">{result.name}</td>
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
