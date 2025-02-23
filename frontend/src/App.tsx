import React, { useState } from 'react';
import GraphComponent from './components/Graph';
import BubbleModal from './components/BubbleModal';
import { v4 as uuidv4 } from 'uuid';
import { useBubbleStore, Bubble } from './store';

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const bubbles = useBubbleStore((state) => state.bubbles);
  const addBubble = useBubbleStore((state) => state.addBubble);

  const handleAddBubble = (label: string, color: string) => {
    const newBubble: Bubble = {
      id: uuidv4(),
      label,
      color,
      x: Math.random() * 100, // ランダムな初期位置（後でレイアウト調整可能）
      y: Math.random() * 100,
    };
    addBubble(newBubble);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">バブル可視化アプリ</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        ＋ バブル追加
      </button>
      {modalOpen && (
        <BubbleModal
          onSubmit={handleAddBubble}
          onClose={() => setModalOpen(false)}
        />
      )}
      <GraphComponent bubbles={bubbles} />
    </div>
  );
};

export default App;
