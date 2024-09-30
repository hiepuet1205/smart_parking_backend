FROM node:20-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /api

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./src ./src
COPY ./nest-cli.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./

RUN npm install
RUN npm install -g @nestjs/cli
# RUN \
#     if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#     elif [ -f package-lock.json ]; then npm ci; \
#     elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
#     else echo "Lockfile not found." && exit 1; \
#     fi

RUN npm run build

# ENV PORT 3000
# ENV PORT 9229

CMD ["node", "dist/main"]
