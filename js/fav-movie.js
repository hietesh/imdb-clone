const movie = document.querySelector('.fav-movies .container');

document.addEventListener('DOMContentLoaded',setMovies());

function getMovies(){
    let movies;
    if(localStorage.getItem('favMovieList')===null){
       movies = []; 
    }
    else{
       movies =JSON.parse(localStorage.getItem('favMovieList'));
    }
    return movies;
}

function setMovies(){
    const getFavourites = getMovies();
    if(getFavourites.length > 0){
        getFavourites.forEach((movies)=>{
            console.log(movies);
            movie.innerHTML += `<div class="item">
                  <figure><img src='${movies.Poster}' alt=${movies.Title}/></figure>
                  <div class="desc">
                      <h2>
                        <a href="javascript:void(0);" onclick=movieClicked('${movies.imdbID}')>
                           ${movies.Title}
                        </a>
                      </h2>
                      <p>Type: ${movies.Type}</p>
                      <p>Year: ${movies.Year}</p>
                      <button class="remove-btn" onclick="removeMovieFromFav(this,'${movies.imdbID}')">Remove From Favourites</button>
                  </div>
            </div>`;
        });
    }
    else{
        movie.innerHTML+= `<h3>You have not favourited any movie yet</h3>`
    }
}


function movieClicked(id){
   sessionStorage.setItem('movieDetail',id);
   window.open('../movie-detail.html?id='+id,'_self'); 
}

function removeMovieFromFav(e,imdbID){
    let favMovieList=getMovies();
    // remove the clicked movie
    favMovieList.forEach(function(favmovie,index){
       if(favmovie.imdbID === imdbID){
          favMovieList.splice(index,1);  
       }
    });
    localStorage.setItem('favMovieList',JSON.stringify(favMovieList));
    showSnackbar("Movie Removed",3000);
    console.log(e.parentElement.parentElement.remove());
 }

 function showSnackbar(text,timing){
    const snackBar = document.getElementById("snackbar");
    snackBar.innerHTML = text;
    snackBar.className = "show";
    setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, timing);
  }