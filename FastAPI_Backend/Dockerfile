FROM python:3.10

WORKDIR /

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN apt-get -y update

RUN apt-get install ffmpeg libsm6 libxext6  -y

COPY . .

EXPOSE 3100

ENTRYPOINT ["gunicorn", "app:app"]
