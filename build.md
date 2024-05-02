### Build and push to DockerHub
```Bash
docker login
```
```Bash
docker build -f Dockerfile -t dnadas98/freeroam:frontend_angular . && \
docker push dnadas98/freeroam:frontend_angular
```
