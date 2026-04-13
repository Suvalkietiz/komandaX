/** @jest-environment jsdom */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('App integration: search flow', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('shows only places within 2km and sorts from nearest to farthest', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => [{ lat: '54.6869', lon: '25.2873' }],
      })
      .mockResolvedValueOnce({
        json: async () => [
          {
            id: '2',
            name: 'Kavinė mokymuisi',
            address: 'Toliau g. 2',
            lat: 54.6949,
            lon: 25.2873,
            wifi_speed: '100 Mbps',
            noise_level: 'Vidutinis',
            has_outlets: true,
          },
          {
            id: '1',
            name: 'Labai arti biblioteka',
            address: 'Arti g. 1',
            lat: 54.6871,
            lon: 25.2875,
            wifi_speed: '300 Mbps',
            noise_level: 'Tylu',
            has_outlets: true,
          },
          {
            id: '3',
            name: 'Per toli erdvė',
            address: 'Toli g. 99',
            lat: 54.7300,
            lon: 25.3000,
            wifi_speed: '50 Mbps',
            noise_level: 'Triukšminga',
            has_outlets: false,
          },
        ],
      });

    global.fetch = fetchMock as unknown as typeof fetch;

    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Ieškoti studijų vietos...'), 'Vilnius');
    await user.click(screen.getByRole('button', { name: 'Ieškoti' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    expect(await screen.findByText('Labai arti biblioteka')).toBeInTheDocument();
    expect(await screen.findByText('Kavinė mokymuisi')).toBeInTheDocument();
    expect(screen.queryByText('Per toli erdvė')).not.toBeInTheDocument();

    const cardTitles = screen.getAllByRole('heading', { level: 3 }).map((node) => node.textContent);
    expect(cardTitles).toEqual(['Labai arti biblioteka', 'Kavinė mokymuisi']);
  });

  it('shows not-found message when no places are within 2km', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => [{ lat: '54.6869', lon: '25.2873' }],
      })
      .mockResolvedValueOnce({
        json: async () => [
          {
            id: '10',
            name: 'Labai toli vieta',
            address: 'Toli g. 1',
            lat: 55.1000,
            lon: 25.1000,
            wifi_speed: '100 Mbps',
            noise_level: 'Tylu',
            has_outlets: true,
          },
        ],
      });

    global.fetch = fetchMock as unknown as typeof fetch;

    render(<App />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Ieškoti studijų vietos...'), 'Vilnius');
    await user.click(screen.getByRole('button', { name: 'Ieškoti' }));

    expect(await screen.findByText('Šioje vietoje studijų erdvių nerasta')).toBeInTheDocument();
  });
});
