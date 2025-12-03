FROM oven/bun:1

WORKDIR /usr/src/app

COPY package.json ./

RUN bun install

COPY . .

EXPOSE 3000
CMD ["bun", "run", "start"]