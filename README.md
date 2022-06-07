# Geec Web
![docker version badge](https://img.shields.io/docker/v/jlaperle/geec_web?color=blue&sort=semver)
![github workflow badge](https://img.shields.io/github/workflow/status/laperlej/geec_web/CI/master)


### Docker
```
docker pull laperlej/geec_web:latest
docker run -p 8000:8000 --rm -it geec_web
```

### Local Installation
```
pip install -r requirements.txt
```

### config
```
cd geec_web/settings
cp production.py local_settings.py
```
