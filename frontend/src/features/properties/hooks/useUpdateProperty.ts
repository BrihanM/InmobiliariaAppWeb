import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { propertiesApi } from '../api/propertiesApi';
import { PROPERTIES_QUERY_KEY } from '../types';
import type { UpdatePropertyPayload } from '../types';

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: UpdatePropertyPayload) => propertiesApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY] });
      navigate(`/properties/${id}`);
    },
  });
}
