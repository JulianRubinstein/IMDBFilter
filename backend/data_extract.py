from bs4 import BeautifulSoup as bs
import requests

#Get movie info and place them in list. Function accepts movie genre and number of pages wanted.
def get_info(pages):
    movie_list = []
    for i in range(pages):
        index=50*i+1
        url = f"https://www.imdb.com/search/title/?title_type=movie&sort=num_votes,desc&start={index}&explore=title_type,genres&ref_=adv_prv"
        r=requests.get(url).content
        s=bs(r,"html.parser")
        movie_list=movie_list + s.find_all("div",{"class":"lister-item mode-advanced"})
    return movie_list

#Creates a list of movie dictionaries out of the scraped data listwhich contains the movie name, year, length and rating.
def make_list(movie_list):
    #Defining lists to send back, duplicates is a dictionary to check for movie duplicates in the list
    movie_dictionary_list=[]

    #For loop to fill movie_list
    for i in movie_list:
        try:
            name = i.find("h3",{"class":"lister-item-header"}).find("a").get_text()
        except:
            name = None
        try:
            year = int(i.find("span", {"class":"lister-item-year text-muted unbold"}).get_text().replace('(','').replace(')',''))
        except:
            year = None
        try:
            length = int(i.find("span",{"class":"runtime"}).get_text().split(' ')[0])
        except:
            length = None
        try:
            rating = float(i.find("strong").get_text())
        except:
            rating = None
        try:
            metascore = int(i.find("div", {"class":"inline-block ratings-metascore"}).get_text().split(' ')[0])
        except:
            metascore = None
        try:
            genre = str(i.find("span", {"class":"genre"}).get_text().split('\n')[1])
        except:
            genre = None

        movie = {"name":name, "year":year, "length":length, "rating":rating, "metascore":metascore, "genre":genre}
        movie_dictionary_list.append(movie)

    return movie_dictionary_list
