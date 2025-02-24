import React, { useEffect, useRef } from 'react';
import { Sigma } from 'sigma';
import Graph from 'graphology';
import { Bubble, useBubbleStore } from '../store/BubbleStore';
import { useRelationStore } from '../store/RelationStore';

interface GraphProps {
  bubbles: Bubble[];
}

const GraphComponent: React.FC<GraphProps> = ({ bubbles }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaInstanceRef = useRef<Sigma | null>(null);
  // ここでドラッグ開始のノードIDを一時保持するための ref を用意
  const dragSourceRef = useRef<string | null>(null);

  // バブルの更新・削除関数
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const deleteBubble = useBubbleStore((state) => state.deleteBubble);

  // リレーションの状態と操作関数
  const relations = useRelationStore((state) => state.relations);
  const deleteRelation = useRelationStore((state) => state.deleteRelation);
  const addRelation = useRelationStore((state) => state.addRelation);

  useEffect(() => {
    if (!containerRef.current) return;

    // 新しいグラフインスタンスを生成
    const graph = new Graph();

    // 各バブルをノードとして追加
    bubbles.forEach((bubble) => {
      graph.addNode(bubble.id, {
        label: bubble.text, // 表示用ラベルに bubble.text を設定
        x: bubble.x,
        y: bubble.y,
        color: bubble.color,
        size: 10,
      });
    });

    // 既存のリレーションをエッジとして追加
    relations.forEach((relation) => {
      try {
        graph.addEdgeWithKey(relation.id, relation.bubble1_id, relation.bubble2_id, {
          label: 'relation',
          size: 1,
          color: '#ccc',
        });        
      } catch (error) {
        // すでにエッジが存在する場合はスキップ
      }
    });

    // 既存の Sigma インスタンスがあれば破棄
    if (sigmaInstanceRef.current) {
      sigmaInstanceRef.current.kill();
    }

    // Sigma インスタンスを生成
    const sigmaInstance = new Sigma(graph, containerRef.current);
    sigmaInstanceRef.current = sigmaInstance;

    // ノードクリック時：更新・削除処理
    sigmaInstance.on('clickNode', ({ node }) => {
      // ※クリック操作とドラッグ操作は併用するため、ここでの処理は短めに
      const nodeAttributes = graph.getNodeAttributes(node);
      const bubbleId = node;
      const choice = prompt(
        `バブル "${nodeAttributes.label}" がクリックされました。\n` +
        `更新する場合は "u"、削除する場合は "d" を入力してください。`
      );
      if (!choice) return;
      if (choice.toLowerCase() === 'd') {
        if (window.confirm(`バブル "${nodeAttributes.label}" を削除しますか？`)) {
          deleteBubble(bubbleId);
        }
      } else if (choice.toLowerCase() === 'u') {
        const newText = prompt("新しいテキストを入力してください：", nodeAttributes.label);
        if (newText == null || newText.trim() === "") return;
        const newColor = prompt("新しい色を入力してください（例: #ff0000）：", nodeAttributes.color);
        if (newColor == null || newColor.trim() === "") return;
        updateBubble({
          id: bubbleId,
          text: newText,
          color: newColor,
          x: nodeAttributes.x,
          y: nodeAttributes.y,
        });
      }
    });

    // エッジクリック時：リレーション削除処理
    sigmaInstance.on('clickEdge', ({ edge }) => {
      const edgeAttributes = graph.getEdgeAttributes(edge);
      const relationId = edge;
      if (window.confirm(`エッジ（リレーション）を削除しますか？`)) {
        deleteRelation(relationId);
      }
    });

    // ドラッグ操作によるエッジ追加
    sigmaInstance.on('downNode', ({ node }) => {
      // ドラッグ開始時に、開始ノードを記録
      dragSourceRef.current = node;
    });
    sigmaInstance.on('upNode', ({ node }) => {
      if (dragSourceRef.current && dragSourceRef.current !== node) {
        // ドラッグ開始と異なるノードでマウスアップした場合、エッジ追加を実施
        const sourceId = dragSourceRef.current;
        const targetId = node;
        // ここではエッジのIDは自動生成するため、バックエンド側で UUID を生成するか、
        // フロントエンドで uuidv4() を使って生成してもよい
        addRelation({ bubble1_id: sourceId, bubble2_id: targetId });
      }
      dragSourceRef.current = null;
    });

    // クリーンアップ
    return () => {
      sigmaInstance.kill();
    };
  }, [bubbles, relations, updateBubble, deleteBubble, deleteRelation, addRelation]);

  return <div ref={containerRef} style={{ height: '500px', border: '1px solid #ccc' }} />;
};

export default GraphComponent;
