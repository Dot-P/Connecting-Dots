import React, { useEffect, useRef } from 'react';
import { Sigma } from 'sigma';
import Graph from 'graphology';
import { Bubble } from '../store';

interface GraphProps {
  bubbles: Bubble[];
}

const GraphComponent: React.FC<GraphProps> = ({ bubbles }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaInstanceRef = useRef<Sigma | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // グラフインスタンスを新規作成
    const graph = new Graph();

    // バブルをノードとして追加（位置はランダムな値を例として設定）
    bubbles.forEach((bubble) => {
      graph.addNode(bubble.id, {
        label: bubble.label,
        x: bubble.x,
        y: bubble.y,
        color: bubble.color,
        size: 10,
      });
    });

    // 既存の Sigma インスタンスがあれば破棄
    if (sigmaInstanceRef.current) {
      sigmaInstanceRef.current.kill();
    }

    // 新たに Sigma インスタンスを生成
    sigmaInstanceRef.current = new Sigma(graph, containerRef.current);

    // クリーンアップ
    return () => {
      sigmaInstanceRef.current?.kill();
    };
  }, [bubbles]);

  return <div ref={containerRef} style={{ height: '500px', border: '1px solid #ccc' }} />;
};

export default GraphComponent;
