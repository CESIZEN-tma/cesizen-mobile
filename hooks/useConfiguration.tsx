import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Configuration, Bookmark } from '@/types/api.types';
import { configurationApi } from '@/app/services/api/configurationApi';
import { CreateConfigurationRequestDTO, UpdateConfigurationRequestDTO } from '@/app/services/api/types';

type ConfigurationContextType = {
  adminConfigurations: Configuration[];
  myConfigurations: Configuration[];
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
  refreshAdminConfigurations: () => Promise<void>;
  refreshMyConfigurations: () => Promise<void>;
  refreshBookmarks: () => Promise<void>;
  createConfiguration: (data: CreateConfigurationRequestDTO) => Promise<Configuration>;
  updateConfiguration: (id: string, data: UpdateConfigurationRequestDTO) => Promise<Configuration>;
  deleteConfiguration: (id: string) => Promise<void>;
  addBookmark: (configurationId: string) => Promise<void>;
  removeBookmark: (configurationId: string) => Promise<void>;
  isBookmarked: (configurationId: string) => boolean;
};

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export function ConfigurationProvider({ children }: { children: ReactNode }) {
  const [adminConfigurations, setAdminConfigurations] = useState<Configuration[]>([]);
  const [myConfigurations, setMyConfigurations] = useState<Configuration[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAdminConfigurations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const configs = await configurationApi.getAdminConfigurations();
      setAdminConfigurations(configs);
    } catch (err: any) {
      console.error('Failed to load admin configurations:', err);
      setError(err.message || 'Erreur lors du chargement des configurations');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMyConfigurations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const configs = await configurationApi.getMyConfigurations();
      setMyConfigurations(configs);
    } catch (err: any) {
      console.error('Failed to load my configurations:', err);
      setError(err.message || 'Erreur lors du chargement des configurations');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBookmarks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const bookmarksList = await configurationApi.getBookmarks();
      setBookmarks(bookmarksList);
    } catch (err: any) {
      console.error('Failed to load bookmarks:', err);
      setError(err.message || 'Erreur lors du chargement des favoris');
    } finally {
      setIsLoading(false);
    }
  };

  const createConfiguration = async (
    data: CreateConfigurationRequestDTO
  ): Promise<Configuration> => {
    try {
      setIsLoading(true);
      setError(null);
      const newConfig = await configurationApi.createConfiguration(data);
      await refreshMyConfigurations();
      return newConfig;
    } catch (err: any) {
      console.error('Failed to create configuration:', err);
      setError(err.message || 'Erreur lors de la création de la configuration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfiguration = async (
    id: string,
    data: UpdateConfigurationRequestDTO
  ): Promise<Configuration> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedConfig = await configurationApi.updateConfiguration(id, data);
      await refreshMyConfigurations();
      return updatedConfig;
    } catch (err: any) {
      console.error('Failed to update configuration:', err);
      setError(err.message || 'Erreur lors de la mise à jour de la configuration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConfiguration = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await configurationApi.deleteConfiguration(id);
      await refreshMyConfigurations();
    } catch (err: any) {
      console.error('Failed to delete configuration:', err);
      setError(err.message || 'Erreur lors de la suppression de la configuration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addBookmark = async (configurationId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await configurationApi.addBookmark(configurationId);
      await refreshBookmarks();
    } catch (err: any) {
      console.error('Failed to add bookmark:', err);
      setError(err.message || "Erreur lors de l'ajout aux favoris");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeBookmark = async (configurationId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await configurationApi.removeBookmark(configurationId);
      await refreshBookmarks();
    } catch (err: any) {
      console.error('Failed to remove bookmark:', err);
      setError(err.message || 'Erreur lors du retrait des favoris');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isBookmarked = (configurationId: string): boolean => {
    return bookmarks.some((b) => b.configurationId === configurationId);
  };

  return (
    <ConfigurationContext.Provider
      value={{
        adminConfigurations,
        myConfigurations,
        bookmarks,
        isLoading,
        error,
        refreshAdminConfigurations,
        refreshMyConfigurations,
        refreshBookmarks,
        createConfiguration,
        updateConfiguration,
        deleteConfiguration,
        addBookmark,
        removeBookmark,
        isBookmarked,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
}
