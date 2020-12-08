function init(body){
    var url = "http://localhost:5000/movies"
    httpGetAsync(url, function(response){
                 var obj = JSON.parse(response)
                 console.log(obj)
                 fillMovies(obj['filtered_movies'])
                 })
}

function listener(){
  var form = document.querySelector('form')
  form.addEventListener('change', function() {
      init()
  })
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText)
    }
    var body = getInfo()
    xmlHttp.open("POST", theUrl, true)
    xmlHttp.setRequestHeader('Content-type', 'application/json');
    xmlHttp.send(JSON.stringify(body))
}

function fillMovies(obj){
    const table = document.getElementById("movies");

    var tableHeaderRowCount = 1;
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
}

    obj.forEach(movie => {
      let row = table.insertRow()
      let movieArr = [movie.name, movie.genre, movie.year, movie.length, movie.rating, movie.metascore]

      for (let i=0; i<6; i++){
      	row.insertCell(i).innerHTML = movieArr[i]
      }
    });
}

function getInfo(){
  name = document.getElementById('name').value
  genre = document.getElementById('genre').value
  year1 = document.getElementById('year1').value
  year2 = document.getElementById('year2').value
  length1 = document.getElementById('length1').value
  length2 = document.getElementById('length2').value
  rating1 = document.getElementById('rating1').value
  rating2 = document.getElementById('rating2').value
  metascore1 = document.getElementById('metascore1').value
  metascore2 = document.getElementById('metascore2').value
  var body = {"name":name, "genre":genre,
              "year1":year1, "year2":year2,
              "length1":length1, "length2":length2,
              "rating1":rating1, "rating2":rating2,
              "metascore1":metascore1, "metascore2":metascore2}
  return body
}

init()
listener()
