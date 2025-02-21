#!/usr/bin/env bash

#--- 1) Conda環境をアクティベート ---
eval "$(conda shell.bash hook)"
conda activate connecting-dots

#--- 2) バックエンドのフォーマット／Lint ---
echo "=== Running Python format & lint ==="
echo ""
cd backend
black .
flake8 .
isort .

#--- 3) フロントエンドのフォーマット／Lint ---
echo ""
echo "=== Running Frontend format & lint ==="
echo ""
cd ../frontend
npm run format
npm run lint

#--- 4) 終了メッセージ ---
echo ""
echo "All done!"
echo ""