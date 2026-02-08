import * as SecureStore from 'expo-secure-store';

class SecureStoreService {
  // Save a value
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      throw error;
    }
  }

  // Retrieve a value
  async getItem(key: string): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (error) {
      return null;
    }
  }

  // Delete a value
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      throw error;
    }
  }

  // Save a JSON object
  async setObject(key: string, value: object): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      throw error;
    }
  }

  // Retrieve a JSON object
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      return null;
    }
  }

  // Check if a key exists
  async hasItem(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      return false;
    }
  }

  // Specific functions for authentication
  async saveToken(token: string): Promise<void> {
    await this.setItem('authToken', token);
  }

  async getToken(): Promise<string | null> {
    return await this.getItem('authToken');
  }

  async removeToken(): Promise<void> {
    await this.removeItem('authToken');
  }

  async saveUser(user: object): Promise<void> {
    await this.setObject('user', user);
  }

  async getUser<T>(): Promise<T | null> {
    return await this.getObject<T>('user');
  }

  async removeUser(): Promise<void> {
    await this.removeItem('user');
  }

  async saveRefreshToken(token: string): Promise<void> {
    await this.setItem('refreshToken', token);
  }

  async getRefreshToken(): Promise<string | null> {
    return await this.getItem('refreshToken');
  }

  async removeRefreshToken(): Promise<void> {
    await this.removeItem('refreshToken');
  }

  async isAuthenticated(): Promise<boolean> {
    const refreshToken = await this.getRefreshToken();
    return refreshToken !== null;
  }

  // Clear all data (logout)
  async clearAll(keys: string[]): Promise<void> {
    try {
      await Promise.all(keys.map(key => this.removeItem(key)));
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.clearAll(['authToken', 'refreshToken', 'user']);
  }
}

export default new SecureStoreService();