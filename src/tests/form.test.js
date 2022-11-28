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

  describe('', () => {
    it('verifica se há a mensagem de loading antes da renderização da aplicação', () => {
        render( <PlanetsProvider>
            <App />
            </PlanetsProvider>);

        const loading = screen.getByRole('heading', { level: 2, name:/loading/i });
        expect(loading).toBeInTheDocument();
    })
    it('verfica se os botões e as opções do select estão renderizados corretamente', async () => {
      render( <PlanetsProvider>
        <App />
        </PlanetsProvider>);

        const columnFilter = await screen.findByTestId('column-filter')
        const comparasionFilter = await screen.findByTestId('comparison-filter')
        const columnSort = await screen.findByTestId('column-sort')
        const filterBtn = await screen.findByTestId('button-filter')
        const orderBtn = await screen.findByTestId('column-sort-button')
        const removeBtn = await screen.findByTestId('button-remove-filters')

        expect(columnFilter).toBeInTheDocument();
        expect(comparasionFilter).toBeInTheDocument();
        expect(columnSort).toBeInTheDocument();
        expect(filterBtn).toBeInTheDocument();
        expect(orderBtn).toBeInTheDocument();
        expect(removeBtn).toBeInTheDocument();
    })
    it('verifica se o input de filtro por nome está funcionando corretamente', async () => {
      render( <PlanetsProvider>
        <App />
        </PlanetsProvider>);

        const nameFilter = await screen.findByTestId('name-filter')
        expect(nameFilter).toBeInTheDocument();
        const endor = await screen.findByText(/Endor/i);
       
        userEvent.type(nameFilter, 'na')
        const naboo = await screen.findByText(/Naboo/i);

        expect(naboo).toBeInTheDocument();
        expect(endor).not.toBeInTheDocument();
    })
  })