# Stage 1: Build the frontend
FROM node:22 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the frontend with http-server
FROM node:22

WORKDIR /app

RUN npm install -g http-server

COPY --from=build /app/dist /app/dist

EXPOSE 8090

CMD ["npx", "http-server", "dist", "-p", "8090", "--proxy", "http://localhost:8090?"]
