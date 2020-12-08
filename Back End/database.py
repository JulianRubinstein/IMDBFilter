import sqlite3 as sq
import data_extract as dx

#A decorator to connect to a database
def connect_database(func):
    def function_wrapper(*args, **kwargs):
        connection = sq.connect('data.db')
        cursor = connection.cursor()
        ret_data = func(cursor, *args, **kwargs)
        connection.commit()
        connection.close()
        return ret_data
    return function_wrapper

#Create a single table within the database, which corresponds to one genre
@connect_database
def create_database(cursor, movie_dictionary_list):

    create_table = f"""CREATE TABLE IF NOT EXISTS movie_table
                    (name text, length int, year int, rating real, metascore real, genre text)"""
    cursor.execute(create_table)

    for i in range(len(movie_dictionary_list)):
        cursor.execute(f'INSERT INTO movie_table VALUES (?,?,?,?,?,?)',
                       [movie_dictionary_list[i]["name"],
                        movie_dictionary_list[i]["length"],
                        movie_dictionary_list[i]["year"],
                        movie_dictionary_list[i]["rating"],
                        movie_dictionary_list[i]["metascore"],
                        movie_dictionary_list[i]["genre"]])

#Delete a single table from the database
@connect_database
def delete_database(cursor):
    delete_table = f"DROP TABLE IF EXISTS movie_table"
    cursor.execute(delete_table)

#Extract a table from the database with given filters
@connect_database
def extract_data(cursor, name, genre, years, lengths, ratings, metascores, orderby, desc):
    #Defining list to send back
    filtered_movies = []


    fetch_data = f"""SELECT *
                     FROM movie_table
                     WHERE
                     YEAR >= {years[0]} AND YEAR <= {years[1]}
                     AND LENGTH >= {lengths[0]} AND LENGTH <= {lengths[1]}
                     AND RATING >= {ratings[0]} AND RATING <= {ratings[1]}
                     AND METASCORE >= {metascores[0]} AND METASCORE <= {metascores[1]}
                     AND GENRE LIKE {genre}
                     AND NAME LIKE {name}"""

    if orderby:
        fetch_data += f""" ORDER BY {orderby}"""
        if desc == 1:
            fetch_data += """ DESC"""

    cursor.execute(fetch_data)
    result = cursor.fetchall()

    #Filling the list
    for item in result:
        filtered_movie={"name":item[0],"length":item[1],'year':item[2],'rating':item[3],'metascore':item[4], 'genre':item[5]}
        filtered_movies.append(filtered_movie)

    return filtered_movies

#Create all tables within the database
def refresh_data(pages=199):
    delete_database()
    movie_list = dx.get_info(pages)
    movie_dictionary_list=dx.make_list(movie_list)
    create_database(movie_dictionary_list)
