# Node.js 18 ベースイメージ
FROM node:18

# 作業ディレクトリ
WORKDIR /app

# 依存関係のインストール
COPY package.json package-lock.json ./
RUN npm install

# アプリコードをコピー
COPY . .

# Vite 開発サーバーの起動
CMD ["npm", "run", "dev"]
