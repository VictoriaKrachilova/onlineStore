FROM node:22.2.0-alpine

# Рабочая директория
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# ENV для dev
ENV NODE_ENV=development

EXPOSE 4554

# Для локальной разработки с авто-ребилдом
CMD ["npm", "run", "dev"]



#docker build -t backend-dev .