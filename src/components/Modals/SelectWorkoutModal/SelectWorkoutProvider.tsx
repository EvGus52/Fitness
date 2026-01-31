'use client';

import { SelectWorkoutProvider as Provider } from '@/contexts/SelectWorkoutContext';
import SelectWorkoutModal from './SelectWorkoutModal';
import { ReactNode } from 'react';

export default function SelectWorkoutProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Provider>
      {children}
      <SelectWorkoutModal />
    </Provider>
  );
}
