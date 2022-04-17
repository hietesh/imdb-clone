//get fetch the imdb ID for the movie details from the query string
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const value = params.id;
console.log(value);




// get the plot movies on DOM load
document.addEventListener("DOMContentLoaded", getMoviePlots());

// show the movie details page
const movDetails= document.querySelector('.movie-details'); 
const movieID =sessionStorage.getItem('movieDetail');

if(value===null || value!==movieID){
  movDetails.innerHTML="<div class='container' style='text-align:center'><h1>Error 404</h1> <p>The page does not exist</p></div>";
  showSnackbar("This is an Invalid Request , Redirecting to Home.....",3000);
  setTimeout(function(){window.open('../index.html'); },3000);
}


async function getMoviePlots(){
  try{
    const searches = await fetch(`https://www.omdbapi.com/?i=${value}&plot=full&apikey=845a81f1`);
    const data = await searches.json();
    if(data.Response==="True" ){
       setMovieDetails(data);
    }
  }
  catch(e){
    console.log(e);
  } 
}

function setMovieDetails(data){
    console.log(data);
    if(movieID===value){
      movDetails.innerHTML = `<div class="flex container">
              <img src="${data.Poster}" alt="${data.Title}" />
              <div class="movie-desc">
                  <h1>${data.Title}</h1>
                  <p>${data.Plot}</p>
                  <p><strong>Rating:</strong> ${data.imdbRating}</p>
                  <p><strong>Country:</strong> ${data.Country}</p>
                  <p><strong>Language:</strong> ${data.Language}</p>
                  <p><strong>Genre:</strong> ${data.Genre}</p>
                  <button class="fav-button">Add to Favourites</button>
              </div>
      </div>`;
      bindClick(data);
    }
    else{
      movDetails.innerHTML="<div class='container' style='text-align:center'><h1>Error 404</h1> <p>The page does not exist</p></div>";
      showSnackbar("This is an Invalid Request , Redirecting to Home.....",3000);
      setTimeout(function(){window.open('../index.html'); },3000);
    }
}


function bindClick(data){
  document.querySelector('.fav-button').addEventListener('click',function(){
    //add it to the favourite section
    let favMovieList;
    if(localStorage.getItem('favMovieList')===null){
      favMovieList = []; 
    }
    else{
      favMovieList =JSON.parse(localStorage.getItem('favMovieList'));
    }
    const fav = favMovieList.find((movie)=>(data.imdbID===movie.imdbID));
    if(fav===undefined){
      favMovieList.push(data);
      localStorage.setItem('favMovieList',JSON.stringify(favMovieList));
      showSnackbar("Movie added to favourites",3000);
    }
    else{
      showSnackbar("Movie already added to Favourites",3000);
    }
});
}

// show snackbar 
function showSnackbar(text,timing){
  const snackBar = document.getElementById("snackbar");
  snackBar.innerHTML = text;
  snackBar.className = "show";
  setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, timing);
}

