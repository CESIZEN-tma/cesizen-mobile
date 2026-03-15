import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import {
  ConfigurationDTO,
  CreateConfigurationRequestDTO,
  UpdateConfigurationRequestDTO,
  BookmarkDTO,
  AddBookmarkRequestDTO,
} from './types';
import { Configuration, Bookmark } from '@/types/api.types';

const mapConfigurationDtoToModel = (dto: ConfigurationDTO): Configuration => {
  return {
    id: dto.id,
    name: dto.name,
    inhalation: dto.inhalation,
    retention1: dto.retention1,
    exhalation: dto.exhalation,
    retention2: dto.retention2,
    durationMinutes: dto.durationMinutes,
    difficulty: dto.difficulty,
    objective: dto.objective,
    guidanceType: dto.guidanceType as 'visual' | 'audio' | 'haptic' | 'combined',
  };
};

const mapBookmarkDtoToModel = (dto: BookmarkDTO): Bookmark => {
  return {
    id: dto.id,
    configurationId: dto.idConfigurations,
  };
};

export const configurationApi = {
  getMyConfigurations: async (): Promise<Configuration[]> => {
    const response = await apiClient.get<ConfigurationDTO[]>(
      ENDPOINTS.USER_CONFIGURATIONS.GET_ALL
    );
    return response.map(mapConfigurationDtoToModel);
  },

  getConfigurationById: async (id: string): Promise<Configuration> => {
    const response = await apiClient.get<ConfigurationDTO>(
      ENDPOINTS.USER_CONFIGURATIONS.GET_BY_ID(id)
    );
    return mapConfigurationDtoToModel(response);
  },

  createConfiguration: async (
    data: CreateConfigurationRequestDTO
  ): Promise<Configuration> => {
    const response = await apiClient.post<ConfigurationDTO>(
      ENDPOINTS.USER_CONFIGURATIONS.CREATE,
      data
    );
    return mapConfigurationDtoToModel(response);
  },

  updateConfiguration: async (
    id: string,
    data: UpdateConfigurationRequestDTO
  ): Promise<Configuration> => {
    const response = await apiClient.put<ConfigurationDTO>(
      ENDPOINTS.USER_CONFIGURATIONS.UPDATE(id),
      data
    );
    return mapConfigurationDtoToModel(response);
  },

  deleteConfiguration: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.USER_CONFIGURATIONS.DELETE(id));
  },

  getBookmarks: async (): Promise<Bookmark[]> => {
    const response = await apiClient.get<BookmarkDTO[]>(
      ENDPOINTS.BOOKMARKS.GET_ALL
    );
    return response.map(mapBookmarkDtoToModel);
  },

  addBookmark: async (configurationId: string): Promise<Bookmark> => {
    const requestData: AddBookmarkRequestDTO = { configurationId };
    const response = await apiClient.post<BookmarkDTO>(
      ENDPOINTS.BOOKMARKS.ADD,
      requestData
    );
    return mapBookmarkDtoToModel(response);
  },

  removeBookmark: async (configurationId: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.BOOKMARKS.REMOVE(configurationId));
  },
};
