import React, { useState } from 'react';
import { Modal, Input } from 'antd';

interface BubbleModalProps {
  visible: boolean;
  onSubmit: (text: string, color: string) => void;
  onClose: () => void;
}

const BubbleModal: React.FC<BubbleModalProps> = ({ visible, onSubmit, onClose }) => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#000000');

  // OKボタンを押したときの処理
  const handleOk = () => {
    onSubmit(text, color);
    setText('');
    setColor('#000000');
    onClose();
  };

  // キャンセルボタン or 閉じるアイコンを押したときの処理
  const handleCancel = () => {
    setText('');
    setColor('#000000');
    onClose();
  };

  return (
    <Modal
      title="バブル追加"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="追加"
      cancelText="キャンセル"
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="テキストを入力"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: 8 }}>色を選択:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: 40, height: 40, border: 'none', padding: 0 }}
        />
      </div>
    </Modal>
  );
};

export default BubbleModal;
