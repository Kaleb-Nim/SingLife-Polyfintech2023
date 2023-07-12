PDF_FILE_PATH = './pdfs/'

# Extract only the valid .pdf links from url.csv ( HY )
import pandas as pd

df = pd.read_csv('./data/URL.csv')
print(f'Number of links: {len(df)}')
# Remove rows with empty url
df = df[df['url'].notna()]
# Extract only the .pdf links
df = df[df['url'].str.contains('.pdf')]

domain = "https://singlife.com/"
# Filter out links that are not from singlife.com
df = df[df['url'].str.contains(domain)]

print(f'Number of .pdf links: {len(df)}')
print(f'Number of unique .pdf links: {len(df["url"].unique())}')

df.to_csv('./data/URL_cleaned.csv', index=False)

# Download the .pdf files ( HY )
import requests
import os
import time
import pandas as pd

def download_pdf(url, folder):
    response = requests.get(url)
    filename = os.path.join(folder, url.split("/")[-1])
    with open(filename, "wb") as f:
        f.write(response.content)
    print(f"Downloaded: {filename}")

def download_pdf_urls(urls, folder):
    if not os.path.exists(folder):
        os.makedirs(folder)
    for url in urls:
        if url.endswith(".pdf"):
            download_pdf(url, folder)

# Example usage:
pdf_urls = []
for url in df['url']:
    pdf_urls.append(url)

download_pdf_urls(pdf_urls, PDF_FILE_PATH)