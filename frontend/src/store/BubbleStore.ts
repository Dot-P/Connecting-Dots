import { create } from 'zustand';
import axios from 'axios';

// フロントエンドで扱うバブルの型定義（バックエンドとフィールド名を統一）
export interface Bubble {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
}

// 状態管理用のインターフェース
interface BubbleState {
  bubbles: Bubble[];
  loading: boolean;
  error: string | null;
  fetchBubbles: () => Promise<void>;
  addBubble: (bubble: Omit<Bubble, 'id' | 'x' | 'y'>) => Promise<void>;
  updateBubble: (bubble: Bubble) => Promise<void>;
  deleteBubble: (bubbleId: string) => Promise<void>;
}

// Vite の環境変数を利用してバックエンドの URL を設定
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useBubbleStore = create<BubbleState>((set, get) => ({
  bubbles: [],
  loading: false,
  error: null,
  // API からバブル一覧を取得
  fetchBubbles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Bubble[]>('/bubbles/');
      set({ bubbles: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ loading: false });
    }
  },
  // バブルを追加（バックエンドに POST リクエスト）
  addBubble: async (bubbleData: Omit<Bubble, 'id' | 'x' | 'y'>) => {
    try {
      // フロントエンドの 'text' と 'color' をそのまま送信
      const payload = { text: bubbleData.text, color: bubbleData.color };
      console.log(payload);
      const response = await axios.post('/bubbles/', payload);
      set((state) => ({ bubbles: [...state.bubbles, response.data] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  },
  // バブルを更新（バックエンドに PUT リクエスト）
  updateBubble: async (bubble: Bubble) => {
    try {
      const payload = { text: bubble.text, color: bubble.color, x: bubble.x, y: bubble.y };
      const response = await axios.put(`/bubbles/${bubble.id}`, payload);
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
