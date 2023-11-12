FROM python:3.11

WORKDIR /

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 3100

ENTRYPOINT ["gunicorn", "app:app"]
