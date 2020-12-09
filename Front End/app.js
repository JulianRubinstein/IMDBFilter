var desc = 1;

function init(body){
    var url = "http://localhost/movies"
    httpGetAsync(url, body, function(response){
                 var obj = JSON.parse(response)
                 console.log(obj)
                 fillMovies(obj['filtered_movies'])
                 })
}

function listener(){
  var form = document.querySelector('form')
  form.addEventListener('change', function() {
    var body = getInfo()
    init(body)
  })

  var headSubjects = ["Name", "Genre", "Year", "Length", "Rating", "Metascore"]
  for (let i=0; i<headSubjects.length; i++){
    document.getElementById("head" + headSubjects[i]).addEventListener("click", function() {
      var body = getInfo()
      body['orderby'] = headSubjects[i]
      if (desc==1) {
        desc = 0
      } else {
        desc = 1
      }
      body['desc']=desc
      init(body)
    });
  }

  var elements = document.getElementsByClassName("movie")
  for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function(){
        console.log("hey")
        window.open([url], '_blank')
      });
  }
}

function httpGetAsync(theUrl, body, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText)
    }
    xmlHttp.open("POST", theUrl, true)
    xmlHttp.setRequestHeader('Content-type', 'application/json');
    xmlHttp.send(JSON.stringify(body))
}

function fillMovies(obj){
    var table = document.getElementById("movies");
    var tableHeaderRowCount = 1;
    var rowCount = table.rows.length;

    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }

    obj.forEach(movie => {
      let row = table.insertRow()
      let movieArr = [movie.name, movie.genre, movie.year, movie.length, movie.rating, movie.metascore]
      let query = String(movie.name).replaceAll(" ", "+")

      row.setAttribute("href", "https://www.google.com/search?q=" + query)
      row.setAttribute("class", "movie")

      for (let i=0; i<6; i++){
      	row.insertCell(i).innerHTML = movieArr[i]
      }
    });
}

function getInfo(){
  var body = {}
  var tableSubjects = ['name', 'genre', 'year1', 'year2', 'length1', 'length2', 'rating1', 'rating2', 'metascore1', 'metascore2']
  for (let i=0; i<tableSubjects.length; i++){
    body[tableSubjects[i]]=document.getElementById(tableSubjects[i]).value
  }
  return body
}

init({})
listener()
