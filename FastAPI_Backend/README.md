# How To Run

Install pipenv first
```bash
pip install --user pipenv
```

Install libraries in the pipenv
```bash
pipenv install
```

Run program using pipenv
```bash
pipenv run uvicorn app:app
```

# How To Host using Docker

Build local docker image
```bash
docker build -t singen-fastapi:lastest .
```

Login to the container registry
```bash
docker login singenfastapi.azurecr.io
```

Prefix image with your registry login URI
```bash
docker tag singen-fastapi singenfastapi.azurecr.io/singen-fastapi
```

Pushes the image
```bash
docker push singenfastapi.azurecr.io/singen-fastapi
```
