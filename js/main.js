//API keys
// https://www.omdbapi.com/?i=tt3896198&apikey=845a81f1

// get all required elements
const searchWrapper = document.querySelector(".search-section");
const inputBox = document.querySelector(".search-section input");
const suggBox = document.querySelector(".autocom-box ul");
const autoCom = document.querySelector(".autocom-box");
const suggBoxItem = document.querySelector(".autocom-box ul li i");

let currentMovie = {};
// if user press any key and release
inputBox.onkeyup = (event)=>{filterMovies(event);} 
inputBox.onkeydown = (event)=>{filterMovies(event);}  
inputBox.addEventListener('focusout',(e)=> { if(e.relatedTarget === null ) { searchWrapper.classList.remove("active"); }});
autoCom.addEventListener('focusout',()=>{searchWrapper.classList.remove("active");})
inputBox.addEventListener('focusin',(e)=>{filterMovies(e);});

//show movies on search results
async function filterMovies(e){
         let userData = e.target.value.trim();
         if(userData){
            const searches = await fetch(`https://www.omdbapi.com/?s=${userData}&plot=full&apikey=845a81f1`);
            const data = await searches.json();
            console.log(data);
            if(data.Response==="True" ){
               suggBox.innerHTML = "";
               data.Search.forEach((data)=>{
                  showSuggestions(data);
               });         
            }
            else{
               suggBox.innerHTML = "<li>No Results Found</li>";
            }
        }
        else{
            searchWrapper.classList.remove("active");
        }  
}

// open details movie page 
function select(e,list){
   e.stopPropagation();
   inputBox.value = list.Title;
   searchWrapper.classList.remove("active");
   //add movie to session storage
   movieClicked(list);
   //open the movie details page with the imdbId
   window.open('../movie-detail.html?id='+list.imdbID,'_self'); 
}

// show snackbar 
function showSnackbar(text){
   const snackBar = document.getElementById("snackbar");
   snackBar.innerHTML = text;
   snackBar.className = "show";
   setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
}

// add and remove movie from the list
function favMovie(e,list){
   e.stopPropagation();
   const target = e.target || e.srcElement;
   if(!target.classList.contains('favoured')){
      target.classList.add('favoured');
      //add movie to the local storage
      const status = addMovieToFav(list);
      showSnackbar(status);
   }
   else{
      target.classList.remove('favoured');
      //remove from localdb movie to the local storage
      removeMovieFromFav(list.imdbID);
      showSnackbar("Removed from Favourites");
   }
}

function showSuggestions(list){
   if(list!==undefined){
      console.log(list);
      const li = document.createElement('li');
      let text = document.createTextNode(list.Title);
      const i = document.createElement('i');
      li.onclick = (e)=>select(e,list);
      i.onclick = (e)=>favMovie(e,list);
      i.className+="fa-solid fa-heart";
      li.appendChild(text);
      li.appendChild(i);
      suggBox.appendChild(li);
      searchWrapper.classList.add("active");
   }
   else{
      searchWrapper.classList.remove("active");
   }
}

// slideshow js
let slideIndex = 1;
function plusSlides(sl){
   showSlides(slideIndex += sl); 
}

function showSlides(n){
   const slides = document.getElementsByClassName("slides");
   if(n > slides.length){slideIndex=1;}
   if (n < 1) {slideIndex = slides.length}
   // console.log(slides);
   for(const sl of slides){
      sl.style.display="none";
   }
   slides[slideIndex-1].style.display = "block";
}

// favourite list 
//get Movies
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
//add movie to the localstorage
function addMovieToFav(mov){
   let movieStatus = "";
   let favMovieList=getMovies();
   const fav = favMovieList.find((movie)=>(mov.imdbID===movie.imdbID));
   if(fav === undefined){
      favMovieList.push(mov);
      localStorage.setItem('favMovieList',JSON.stringify(favMovieList));
      movieStatus = "Movie added to Favourite";
   }
   else{
      movieStatus = "Movie already Favourite";
   }
   return movieStatus;
}
// remove movie from the localstorage
function removeMovieFromFav(imdbID){
   let favMovieList=getMovies();
   // remove the clicked movie
   favMovieList.forEach(function(favmovie,index){
      if(favmovie.imdbID === imdbID){
         favMovieList.splice(index,1);  
      }
   });
   localStorage.setItem('favMovieList',JSON.stringify(favMovieList));
}
// store the clicked movie details
function movieClicked(list){
   sessionStorage.setItem('movieDetail',list.imdbID);       
}

// control the horizontal scroll

const element = document.querySelector('#theater .movies-container');

const leftScroll = document.querySelector('#theater .prev');
const rightScroll = document.querySelector('#theater .next'); 

leftScroll.onclick = function(){
   sideScroll(element,'left',10,150,10);
}

rightScroll.onclick = function(){
   sideScroll(element,'right',10,150,10);
}


const element1 = document.querySelector('#fan-favs .movies-container');

const favLeftScroll = document.querySelector('#fan-favs .prev');
const favRightScroll = document.querySelector('#fan-favs .next'); 

favLeftScroll.onclick = function(){
   sideScroll(element1,'left',10,150,10);
}

favRightScroll.onclick = function(){
   sideScroll(element1,'right',10,150,10);
}

function sideScroll(element,direction,speed,distance,step){
   scrollAmount = 0;
   var slideTimer = setInterval(function(){
       if(direction == 'left'){
           element.scrollLeft -= step;
       } else {
           element.scrollLeft += step;
       }
       scrollAmount += step;
       if(scrollAmount >= distance){
           window.clearInterval(slideTimer);
       }
   }, speed);
}