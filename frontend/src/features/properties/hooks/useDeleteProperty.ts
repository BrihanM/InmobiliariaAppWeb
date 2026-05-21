import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesApi } from '../api/propertiesApi';
import { PROPERTIES_QUERY_KEY } from '../types';

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY] });
    },
  });
}
