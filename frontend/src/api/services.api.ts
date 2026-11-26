import { apiClient } from './client';
import type { ApiEnvelope } from '../types/auth.types';
import type { PlatformServiceCategory, ServiceSlug } from '../types/service.types';

export const servicesApi = {
  listServices: async (): Promise<ApiEnvelope<PlatformServiceCategory[]>> => {
    const { data } = await apiClient.get<ApiEnvelope<PlatformServiceCategory[]>>('/services');
    return data;
  },

  getServiceBySlug: async (slug: ServiceSlug): Promise<ApiEnvelope<PlatformServiceCategory>> => {
    const { data } = await apiClient.get<ApiEnvelope<PlatformServiceCategory>>(`/services/${slug}`);
    return data;
  },
};
