```
$ docker build -t hello-bot .

$ cat env
BOT_IDENTITY_JSON={"type":"email","name":"INSERT-EMAIL-HERE","auth":"INSERT-PASSWORD-HERE"}

$ docker run -it --rm --env-file=env hello-bot
```
