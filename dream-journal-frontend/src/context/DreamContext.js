import { createContext, useContext } from 'react';
import { 
  getDreams as apiGetDreams,
  createDream as apiCreateDream,
  updateDream as apiUpdateDream,
  deleteDream as apiDeleteDream
} from '../api';

const DreamContext = createContext();

export const DreamProvider = ({ children }) => {
  const getDreams = async (params) => {
    try {
      const { data } = await apiGetDreams(params);
      return data.data;
    } catch (error) {
      console.error('Error fetching dreams:', error);
      throw error;
    }
  };

  const createDream = async (dreamData) => {
    try {
      await apiCreateDream(dreamData);
    } catch (error) {
      console.error('Error creating dream:', error);
      throw error;
    }
  };

  const updateDream = async (id, dreamData) => {
    try {
      await apiUpdateDream(id, dreamData);
    } catch (error) {
      console.error('Error updating dream:', error);
      throw error;
    }
  };

  const deleteDream = async (id) => {
    try {
      await apiDeleteDream(id);
    } catch (error) {
      console.error('Error deleting dream:', error);
      throw error;
    }
  };

  return (
    <DreamContext.Provider
      value={{
        getDreams,
        createDream,
        updateDream,
        deleteDream
      }}
    >
      {children}
    </DreamContext.Provider>
  );
};

export const useDreamContext = () => useContext(DreamContext);