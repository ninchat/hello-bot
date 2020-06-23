FROM node:14
COPY bot.js package.json /home/node/app/
WORKDIR /home/node/app
RUN chown -R node .
USER node
RUN npm install
ENTRYPOINT ["node", "bot.js"]
