'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

interface ReduxProviderProps {
  readonly children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps): React.ReactElement {
  return <Provider store={store}>{children}</Provider>;
}
