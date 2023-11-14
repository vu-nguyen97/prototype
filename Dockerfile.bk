FROM node:14-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm cache clean --force
RUN npm i
CMD ["npm", "run", "dev", "--", "--host"]
EXPOSE 5173