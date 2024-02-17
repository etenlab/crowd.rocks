import { useContext } from 'react';

import { AppContext } from '../AppContext';

export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext must be within AppContextProvider');
  }

  return context;
}
