FROM node:20-alpine AS runner

WORKDIR /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY package.json  ./
COPY package-lock.json  ./

COPY . .

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 3000
CMD ["npm", "run","dev"]