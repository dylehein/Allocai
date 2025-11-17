export const storage = {
  get: async (key) => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return { key, value, shared: false };
      }
      throw new Error('Key not found');
    } catch (error) {
      throw error;
    }
  },

  set: async (key, value) => {
    try {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    } catch (error) {
      console.error('Storage set error:', error);
      return null;
    }
  },

  delete: async (key) => {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    } catch (error) {
      console.error('Storage delete error:', error);
      return null;
    }
  },

  list: async (prefix = '') => {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        prefix ? key.startsWith(prefix) : true
      );
      return { keys, prefix, shared: false };
    } catch (error) {
      console.error('Storage list error:', error);
      return null;
    }
  }
};

if (typeof window !== 'undefined') {
  window.storage = storage;
}