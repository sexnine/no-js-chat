FROM node:23-alpine as build

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . /app

RUN pnpm build

FROM node:23-alpine

WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 9274

CMD ["node", "build/index.js"]
