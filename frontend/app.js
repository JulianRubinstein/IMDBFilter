var desc = 1;

function init(body){
    var url = "https://imdb--backend.herokuapp.com/movies"
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

  form.addEventListener('keypress', function (press) {
    if (press.key === 'Enter') {
      var body = getInfo()
      init(body)
      }
  });

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
}

function httpGetAsync(theUrl, body, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText)
    }
    xmlHttp.open("POST", theUrl, true)
    xmlHttp.setRequestHeader('Content-type', 'application/json')
    xmlHttp.send(JSON.stringify(body))
}

function fillMovies(obj){
    var table = document.getElementById("movies")
    var tableHeaderRowCount = 1
    var rowCount = table.rows.length

    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }

    obj.forEach(movie => {
      let row = table.insertRow()
      let movieArr = [movie.name, movie.genre, movie.year, movie.length, movie.rating, movie.metascore]

      for (let i=0; i<6; i++){
      	let cell = row.insertCell(i)
        if (i == 0) {
          let aTag = document.createElement('a')
          let query = String(movieArr[i]).replaceAll(" ", "+")
          aTag.innerText = movieArr[i]
          aTag.setAttribute("href", "https://www.google.com/search?q=" + query)
          aTag.setAttribute("target", "_blank")
          cell.appendChild(aTag)
        }
        else{
          cell.innerHTML = movieArr[i]
        }
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

function destroyLoader () { Destroy (document.getElementsByClassName("loader"), 1); }

init(getInfo())
listener()
destroyLoader()
