import React, { useState } from 'react';

interface BubbleModalProps {
  onSubmit: (label: string, color: string) => void;
  onClose: () => void;
}

const BubbleModal: React.FC<BubbleModalProps> = ({ onSubmit, onClose }) => {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#00AA00');

  const handleSubmit = () => {
    if (label.trim() === '') return;
    onSubmit(label, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2">バブル追加</h2>
        <input
          type="text"
          placeholder="単語を入力"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="border p-1 mb-2 w-full"
        />
        <div className="mb-2">
          <label className="mr-2">色:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 bg-gray-300 px-3 py-1 rounded">
            キャンセル
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-3 py-1 rounded">
            追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default BubbleModal;
