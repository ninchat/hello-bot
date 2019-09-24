```
$ docker build -t hello-bot .

$ cat env
BOT_IDENTITY_JSON={"type":"email","name":"INSERT-EMAIL-HERE","auth":"INSERT-PASSWORD-HERE"}

$ docker run --env-file=env --restart=on-failure hello-bot
```
