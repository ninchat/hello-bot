FROM ubuntu:bionic

ENV LANG=C.UTF-8

COPY bot.js package.json /tmp/work/

RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get -y --no-install-recommends install ca-certificates git nodejs npm && \
    apt-get clean && \
    cd /tmp/work && \
    npm install -g && \
    cd / && \
    rm -rf /tmp/npm-* /tmp/work

USER games

WORKDIR /var/lib/bot

ENTRYPOINT ["node", "/usr/local/lib/node_modules/hello-bot/bot.js"]
