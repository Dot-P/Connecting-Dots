import { create } from 'zustand';
import axios from 'axios';

export interface Relation {
  id: string;
  bubble1_id: string;
  bubble2_id: string;
}

interface RelationState {
  relations: Relation[];
  loading: boolean;
  error: string | null;
  fetchRelations: () => Promise<void>;
  addRelation: (relation: Omit<Relation, 'id'>) => Promise<void>;
  deleteRelation: (relationId: string) => Promise<void>;
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useRelationStore = create<RelationState>((set) => ({
  relations: [],
  loading: false,
  error: null,
  fetchRelations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Relation[]>('/relations/');
      set({ relations: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ loading: false });
    }
  },
  addRelation: async (relationData: Omit<Relation, 'id'>) => {
    try {
      const response = await axios.post('/relations/', relationData);
      set((state) => ({ relations: [...state.relations, response.data] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
  deleteRelation: async (relationId: string) => {
    try {
      await axios.delete(`/relations/${relationId}`);
      set((state) => ({
        relations: state.relations.filter((r) => r.id !== relationId),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
}));
