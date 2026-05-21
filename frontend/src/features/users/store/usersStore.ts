import { create } from 'zustand';

interface UsersState {
  selectedUserId: string | null;
  isDeleteModalOpen: boolean;
  isRoleModalOpen: boolean;
  isEditModalOpen: boolean;

  selectUser: (id: string | null) => void;
  openDeleteModal: (id: string) => void;
  closeDeleteModal: () => void;
  openRoleModal: (id: string) => void;
  closeRoleModal: () => void;
  openEditModal: (id: string) => void;
  closeEditModal: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  selectedUserId: null,
  isDeleteModalOpen: false,
  isRoleModalOpen: false,
  isEditModalOpen: false,

  selectUser: (id) => set({ selectedUserId: id }),

  openDeleteModal: (id) => set({ selectedUserId: id, isDeleteModalOpen: true }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedUserId: null }),

  openRoleModal: (id) => set({ selectedUserId: id, isRoleModalOpen: true }),
  closeRoleModal: () => set({ isRoleModalOpen: false, selectedUserId: null }),

  openEditModal: (id) => set({ selectedUserId: id, isEditModalOpen: true }),
  closeEditModal: () => set({ isEditModalOpen: false, selectedUserId: null }),
}));
