import React, { useState, useEffect } from 'react';
import { Button, Typography } from 'antd';
import { FiPlus } from 'react-icons/fi';
import GraphComponent from './components/Graph';
import BubbleModal from './components/BubbleModal';
import { v4 as uuidv4 } from 'uuid';
import { useBubbleStore, Bubble } from './store/BubbleStore';

const { Title } = Typography;

const App: React.FC = () => {
  const fetchBubbles = useBubbleStore((state) => state.fetchBubbles);
  const [modalOpen, setModalOpen] = useState(false);
  const bubbles = useBubbleStore((state) => state.bubbles);
  const addBubble = useBubbleStore((state) => state.addBubble);

  // バブル追加時のロジック
  const handleAddBubble = (text: string, color: string) => {
    const newBubble: Bubble = {
      id: uuidv4(),
      text,
      color,
      x: Math.random() * 100,
      y: Math.random() * 100,
    };
    addBubble(newBubble);
  };

  useEffect(() => {
    fetchBubbles();
  }, [fetchBubbles]);

  return (
    <div style={{ padding: '16px' }}>
      <Title level={2} style={{ marginBottom: '16px' }}>
        バブル可視化アプリ
      </Title>

      {/* バブル追加ボタン */}
      <Button
        type="primary"
        style={{ marginBottom: '16px' }}
        onClick={() => setModalOpen(true)}
      >
        <FiPlus style={{ marginRight: '0.5rem' }} />
        バブル追加
      </Button>

      {/* モーダル (Ant Design) */}
      <BubbleModal
        visible={modalOpen}              // antd v4: visible / antd v5: open
        onSubmit={handleAddBubble}
        onClose={() => setModalOpen(false)}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <GraphComponent bubbles={bubbles} />
      </div>
    </div>
  );
};

export default App;
