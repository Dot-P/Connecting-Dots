# PythonベースのDockerイメージ
FROM python:3.10

# 作業ディレクトリを /app に設定
WORKDIR /app

# 必要なパッケージをインストール
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# backend ディレクトリ全体を /app にコピー
COPY . /app

# FastAPI を起動
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
