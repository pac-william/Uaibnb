import axios from 'axios';
import type { CharacteristicResponse, LocationResponse, Location, Characteristic } from '../types';

const api = axios.create({
  baseURL: 'https://api.airtable.com/v0/appqkjRYvyIwSHLR7',
  headers: {
    Authorization: `Bearer patNIM0Lo6dcGG5oi.17e5f1e4ea00174d38fc29d288134a64b8dfd7862ea8a19d1876be0a8fdcd244`,
  },
});

export const getLocations = () => api.get<LocationResponse>('/locacoes?view=Grid%20view');

export const getLocation = (id: string) => api.get<Location>(`/locacoes/${id}`);

export const createLocation = (data: Omit<Location['fields'], 'id'>) =>
  api.post<LocationResponse>('/locacoes', { records: [{ fields: data }] });

export const updateLocation = (id: string, data: Location['fields']) =>
  api.patch<LocationResponse>('/locacoes', { records: [{ id, fields: data }] });

export const deleteLocation = (id: string) =>
  api.delete(`/locacoes/${id}`);

export const getCharacteristics = () =>
  api.get<CharacteristicResponse>('/caracteristicas?view=Grid%20view');

export const getCharacteristic = (id: string) =>
  api.get<Characteristic>(`/caracteristicas/${id}`);

export const createCharacteristic = (data: Omit<Characteristic['fields'], 'id'>) =>
  api.post<CharacteristicResponse>('/caracteristicas', { records: [{ fields: data }] });

export const updateCharacteristic = (id: string, data: Characteristic['fields']) =>
  api.patch<CharacteristicResponse>('/caracteristicas', { records: [{ id, fields: data }] });

export default api; 