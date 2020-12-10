from flask import Flask, render_template, request
from flask_restful import Api, Resource
from flask_cors import CORS
import requests
import json
import time

import database as dtbs

def get_params(data):
    #Getting data from form
    name = "'%" + str(data.get("name", "")) + "%'"
    genre = "'%" + str(data.get("genre", "")) + "%'"
    year1 = int(data.get('year1', 1900))
    year2 = int(data.get('year2', 2020))
    length1 = int(data.get('length1', 0))
    length2 = int(data.get('length2', 1000))
    rating1 = int(data.get('rating1', 0))
    rating2 = int(data.get('rating2', 10))
    metascore1 = int(data.get('metascore1', 0))
    metascore2 = int(data.get('metascore2', 100))
    orderby = data.get('orderby', None)
    desc = data.get('desc', 1)

    #Tupling the data
    years = (year1,year2)
    lengths = (length1,length2)
    ratings = (rating1,rating2)
    metascores = (metascore1,metascore2)

    return (name, genre, years, lengths, ratings, metascores, orderby, desc)

app = Flask(__name__)
cors = CORS(app)
api = Api(app)

class Movies(Resource):
    def post(self):
        data = request.get_json()
        params = get_params(data)
        filtered_movies = dtbs.extract_data(*params)
        return {"filtered_movies":filtered_movies,
                "status_code":200,
                "headers":{
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }}

api.add_resource(Movies, "/movies")

if __name__ == "__main__":
    app.run(host = "0.0.0.0", port=80, debug=True)
