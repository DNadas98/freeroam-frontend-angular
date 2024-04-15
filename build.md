### Build and push to DockerHub
```Bash
docker login
```
```Bash
docker build -f Dockerfile -t dnadas98/priv:freeroam_frontend_angular . && \
docker push dnadas98/priv:freeroam_frontend_angular
```
