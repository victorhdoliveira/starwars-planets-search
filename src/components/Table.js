import { useContext, useState } from 'react';
import PlanetContext from '../context/PlanetsContext';

export default function Table() {
  const { data: { results } } = useContext(PlanetContext);
  const [search, setSearch] = useState('');

  return (
    <div>
      { results === undefined ? ('...loading') : (
        <>
          <form>
            <label htmlFor="filtros">
              <input
                data-testid="name-filter"
                type="text"
                name="filtros"
                placeholder="buscar"
                value={ search }
                onChange={ (e) => setSearch(e.target.value) }
              />
            </label>
          </form>
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
              {results.filter((el) => el.name.includes(search)).map((result, index) => (
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
