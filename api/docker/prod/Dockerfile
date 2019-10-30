FROM node:12-alpine

COPY docker/prod/ecosystem.json /dist/ecosystem.json
COPY docker/prod/start.sh /dist/start.sh
ADD . /src

WORKDIR /src

RUN yarn install
RUN yarn test
RUN yarn compile
RUN yarn install --production --force

RUN mv /src/bin /dist/bin \
    && mv /src/node_modules /dist/node_modules \
    && mv /src/package.json /dist/package.json \
    && ls /dist -al

# Cria uma segunda imagem mais leve com os arquivos compilados
FROM node:12-alpine

EXPOSE 3000

COPY --from=0 /dist /var/www

RUN npm install -g pm2

WORKDIR /var/www

CMD sh start.sh