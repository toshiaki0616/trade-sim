import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime

def scrape_naphtha_price():
    url = "https://www.daikeikagaku.co.jp/"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    response = requests.get(url, headers=headers)
    response.encoding = "utf-8"
    soup = BeautifulSoup(response.text, "html.parser")
    
    text = soup.get_text()
    
    # ナフサ価格（例: $ 612）
    naphtha_match = re.search(r'\$\s*([\d,]+)', text)
    naphtha_price = naphtha_match.group(0).strip() if naphtha_match else "取得失敗"
    
    # 為替レート（例: 154.98 円/$）
    forex_match = re.search(r'([\d.]+)\s*円/\$', text)
    forex_rate = forex_match.group(0).strip() if forex_match else "取得失敗"
    
    # 国産ナフサ価格指標（例: 67,919 円/kl）
    domestic_match = re.search(r'([\d,]+)\s*円/kl', text)
    domestic_price = domestic_match.group(0).strip() if domestic_match else "取得失敗"
    
    # 基準日（例: 2026.02.20 現在）
    date_match = re.search(r'(\d{4}\.\d{2}\.\d{2})\s*現在', text)
    date_str = date_match.group(0).strip() if date_match else "取得失敗"
    
    result = {
        "取得日時": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "基準日": date_str,
        "ナフサ価格": naphtha_price,
        "為替レート": forex_rate,
        "国産ナフサ価格指標": domestic_price,
    }
    
    return result

if __name__ == "__main__":
    data = scrape_naphtha_price()
    for key, value in data.items():
        print(f"{key}: {value}")
