import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import PlanetsProvider from '../context/PlanetsProvider';
import mockData from './MockData';

afterEach(() => {
    jest.clearAllMocks();
  });
  
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });
  });

  describe('Testa se os filtros da aplicação funcionam da maneira correta', () => {
    it('verifica se os filtros são aplicados corretamente', async () => {
        render( <PlanetsProvider>
            <App />
            </PlanetsProvider>);
        
        const columnFilter = await screen.findByTestId('column-filter')
        userEvent.selectOptions(columnFilter, 'diameter')
        const comparasionFilter = await screen.findByTestId('comparison-filter')
        userEvent.selectOptions(comparasionFilter, 'menor que')
        const inputNumber = await screen.findByTestId('value-filter')
        userEvent.type(inputNumber, '10000')
        const filterBtn = await screen.findByTestId('button-filter')
        userEvent.click(filterBtn);
        
        const dagobah = await screen.findByText(/dagobah/i);
        const endor = await screen.findByText(/endor/i);

        expect(dagobah).toBeInTheDocument()
        expect(endor).toBeInTheDocument()

        userEvent.selectOptions(columnFilter, 'surface_water')
        userEvent.selectOptions(comparasionFilter, 'igual a')
        userEvent.type(inputNumber, '100')

        const hoth = await screen.findByText(/hoth/i);
        const idPlanet = await screen.findAllByTestId('planet-name')
        expect(hoth).toBeInTheDocument()
        expect(idPlanet[0]).not.toHaveTextContent(/dagobah/i)
    })
    it('verifica se é possível remover filtros individualmente', async () => {
        render( <PlanetsProvider>
            <App />
            </PlanetsProvider>);
            
       
        const dagobah = await screen.findByText(/dagobah/i);
        const endor = await screen.findByText(/endor/i);
        expect(dagobah).toBeInTheDocument()
        expect(endor).toBeInTheDocument()

        const columnFilter = await screen.findByTestId('column-filter')
        userEvent.selectOptions(columnFilter, 'orbital_period')

        const inputNumber = await screen.findByTestId('value-filter')
        userEvent.type(inputNumber, '500')

        const filterBtn = await screen.findByTestId('button-filter')
        userEvent.click(filterBtn);
        
        const hoth = await screen.findByText(/hoth/i);
        expect(hoth).toBeInTheDocument()
        

        const removeOneFilter = await screen.findByRole('button', { name: 'X' })
        expect(removeOneFilter).toBeInTheDocument()
        userEvent.click(removeOneFilter);
        expect(removeOneFilter).not.toBeInTheDocument()
        expect(columnFilter[4]).toHaveTextContent('orbital_period')
        expect(await screen.findByText(/dagobah/i)).toBeInTheDocument()
    })
    it('verifica se é possível remover todos os filtros', async () => {
        render( <PlanetsProvider>
            <App />
            </PlanetsProvider>);
        
        const numberOfPlanetes = await screen.findAllByTestId('planet-name');
        expect(numberOfPlanetes.length).toBe(10)

        const columnFilter = await screen.findByTestId('column-filter')
        userEvent.selectOptions(columnFilter, 'rotation_period')

        const inputNumber = await screen.findByTestId('value-filter')
        userEvent.type(inputNumber, '24')

        const filterBtn = await screen.findByTestId('button-filter')
        userEvent.click(filterBtn);

        const numberOfPlanetsFilter = await screen.findAllByTestId('planet-name');
        expect(numberOfPlanetsFilter.length).toBe(2)

        const removeAllFilters = await screen.findByTestId('button-remove-filters')
        userEvent.click(removeAllFilters);

        const resetPlanetsFilter = await screen.findAllByTestId('planet-name');
        expect(resetPlanetsFilter.length).toBe(10)
    })
    it('verifica se é possível ordenar de forma crescente', async () => {
        render( <PlanetsProvider>
            <App />
            </PlanetsProvider>);


       const AscRadio = await screen.findByTestId('column-sort-input-asc')
       const orderBtn =  await screen.findByRole('button', { name: 'Ordenar' })
       const planetName = await screen.findAllByTestId('planet-name');
       expect(planetName[0]).toHaveTextContent('Tatooine')

       
       userEvent.click(AscRadio);
       userEvent.click(orderBtn);

       const planetNameSorted = await screen.findAllByTestId('planet-name');
       expect(planetNameSorted[0]).toHaveTextContent('Yavin IV')
       expect(planetNameSorted[9]).toHaveTextContent('Dagobah')
    })
    it('verifica se é possível ordenar de forma decrescente', async () => {
        render( <PlanetsProvider>
            <App />
            </PlanetsProvider>);


       const DescRadio = await screen.findByTestId('column-sort-input-desc')
       const columnSort = await screen.findByTestId('column-sort')
       userEvent.selectOptions(columnSort, 'diameter')
    
       const orderBtn =  await screen.findByRole('button', { name: 'Ordenar' })
       const planetName = await screen.findAllByTestId('planet-name');
       expect(planetName[0]).toHaveTextContent('Tatooine')

       
       userEvent.click(DescRadio);
       userEvent.click(orderBtn);

       const planetNameSorted = await screen.findAllByTestId('planet-name');
       expect(planetNameSorted[0]).toHaveTextContent('Bespin')
       expect(planetNameSorted[9]).toHaveTextContent('Endor')
    })
})
