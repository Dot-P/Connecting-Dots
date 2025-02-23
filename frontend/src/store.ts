import { create } from 'zustand';
import axios from 'axios';

// バブルの型定義
export interface Bubble {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
}

// 状態管理用のインターフェース
interface BubbleState {
  bubbles: Bubble[];
  loading: boolean;
  error: string | null;
  // バックエンド API との連携
  fetchBubbles: () => Promise<void>;
  addBubble: (bubble: Omit<Bubble, 'id'>) => Promise<void>;
  updateBubble: (bubble: Bubble) => Promise<void>;
  deleteBubble: (bubbleId: string) => Promise<void>;
}

// Axios のベースURL設定（環境に合わせて変更してください）
axios.defaults.baseURL =  import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useBubbleStore = create<BubbleState>((set, get) => ({
  bubbles: [],
  loading: false,
  error: null,
  // API からバブル一覧を取得
  fetchBubbles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Bubble[]>('/bubbles');
      set({ bubbles: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ loading: false });
    }
  },
  // バブルを追加（バックエンドに POST リクエスト）
  addBubble: async (bubbleData: Omit<Bubble, 'id'>) => {
    try {
      const response = await axios.post<Bubble>('/bubbles', bubbleData);
      set((state) => ({ bubbles: [...state.bubbles, response.data] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
  // バブルを更新（バックエンドに PUT リクエスト）
  updateBubble: async (bubble: Bubble) => {
    try {
      const response = await axios.put<Bubble>(`/bubbles/${bubble.id}`, bubble);
      set((state) => ({
        bubbles: state.bubbles.map((b) => (b.id === bubble.id ? response.data : b)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
  // バブルを削除（バックエンドに DELETE リクエスト）
  deleteBubble: async (bubbleId: string) => {
    try {
      await axios.delete(`/bubbles/${bubbleId}`);
      set((state) => ({
        bubbles: state.bubbles.filter((b) => b.id !== bubbleId),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
}));
