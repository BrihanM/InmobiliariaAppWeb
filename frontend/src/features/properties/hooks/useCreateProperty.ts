import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { propertiesApi } from '../api/propertiesApi';
import { PROPERTIES_QUERY_KEY } from '../types';
import type { CreatePropertyPayload } from '../types';

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) => propertiesApi.create(payload),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: [PROPERTIES_QUERY_KEY] });
      navigate(`/properties/${created.id}`);
    },
  });
}
