FROM node:latest

WORKDIR /app

COPY package*.json ./

# Install Prisma globally
RUN npm i -g prisma

# Copy Prisma schema and generate Prisma client
COPY prisma/ ./prisma/
RUN prisma generate

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
