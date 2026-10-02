from bs4 import BeautifulSoup
import requests

def get_image(id, title):
    ''' Scrapes the MAL page to grab the image using ID and title.
        If image is not found, returns a generic not found image
        '''
    try:
        artwork_scraping_url =  "https://myanimelist.net/anime/"
        result = requests.get(f"{artwork_scraping_url}{id}", timeout=5)
        soup = BeautifulSoup(result.content, features="html.parser")
        img = list(soup.find_all(True, {"alt": title, "class": "ac"}))[0]["data-src"] 
        return img
    except Exception as e:
        not_found_img = "https://i.ibb.co/fHnD0Qx/notfound.png"
        print(f"Error: {e}")
        print("img not found, falling back on default image")
        return not_found_img

def is_inappropriate_genre(res):
    ''' Checks if artwork should be blurred based on genre of anime 
        (some inappropriate genres) '''
    if res != None and ("Hentai" in res[6] or "Ecchi" in res[6] or "Harem" in res[6] or "Yaoi" in res[6] or "Yuri" in res[6]):
        return True
