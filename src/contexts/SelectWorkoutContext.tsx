'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SelectWorkoutContextType {
  isOpen: boolean;
  courseId: string | null;
  courseName: string | null;
  openModal: (courseId: string, courseName: string) => void;
  closeModal: () => void;
}

const SelectWorkoutContext = createContext<SelectWorkoutContextType | undefined>(
  undefined,
);

export function SelectWorkoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState<string | null>(null);

  const openModal = (id: string, name: string) => {
    setCourseId(id);
    setCourseName(name);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCourseId(null);
    setCourseName(null);
  };

  return (
    <SelectWorkoutContext.Provider
      value={{ isOpen, courseId, courseName, openModal, closeModal }}
    >
      {children}
    </SelectWorkoutContext.Provider>
  );
}

export function useSelectWorkout() {
  const context = useContext(SelectWorkoutContext);
  if (context === undefined) {
    throw new Error('useSelectWorkout must be used within a SelectWorkoutProvider');
  }
  return context;
}
