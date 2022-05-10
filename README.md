# Django_base

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

### Usage
```
fab deploy_local
```
or 
```
fab deploy_prod
```
