import { create } from 'zustand';
import type { Property } from '@/features/properties/types';

interface PropertyModalState {
  property: Property | null;
  isOpen: boolean;
  openModal: (property: Property) => void;
  closeModal: () => void;
}

export const usePropertyModalStore = create<PropertyModalState>((set) => ({
  property: null,
  isOpen: false,
  openModal: (property) => set({ property, isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
