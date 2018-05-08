FROM ubuntu:bionic

ENV LANG=C.UTF-8

COPY bot/ /tmp/work/bot/
COPY setup.py /tmp/work/

RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get -y --no-install-recommends install dpkg-dev gcc git golang-go python3 python3-aiohttp python3-cffi python3-dev python3-pip python3-setuptools && \
    apt-get clean && \
    pip3 install -e git+https://github.com/ninchat/ninchat-python.git#egg=ninchat-python && \
    cd /tmp/work && \
    python3 setup.py install && \
    cd / && \
    rm -rf /tmp/work && \
    apt-get -y --purge autoremove dpkg-dev gcc git golang-go python3-dev python3-pip python3-setuptools

USER games

WORKDIR /var/lib/bot

ENTRYPOINT ["python3", "-m", "bot.main"]
