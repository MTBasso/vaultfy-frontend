import { useContext } from 'react';
import { DataContext } from '../contexts/DataProvider';

export function useData() {
  return useContext(DataContext);
}
