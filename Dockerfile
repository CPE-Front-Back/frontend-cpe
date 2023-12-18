FROM node:20.04

WORKDIR /frontendCpe

COPY . /frontendCpe

ENV NODE_ENV = production

RUN yarn global add serve

RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "run", "serve"]