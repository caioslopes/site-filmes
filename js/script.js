/* SPA id */
const index = document.getElementById("content");

/* Token API TMDB - Coloque seu token aqui */
const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWE0NzQ5YmQ4MjQ0Y2I0MmFjNjIxNDNlMTljMDNiOSIsInN1YiI6IjY1MWRmNjBlMDcyMTY2MDBmZjM3ZjQzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CgEBcvgWia2DbrKkBCJYfu_jEdbgQdRkg5ADnNUinmg";

const site = {

    getContentAPI: async function(uri){
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            }
        }
        const response = await fetch(uri, options);
        const data = await response.json();
        return data;
    },

    getPageHome: async function (){
        const page = await fetch("./pages/home.html");
        const content = await page.text();
        index.innerHTML = content;

        /* Posição onde será "appendado" */
        const popularFilms = document.getElementById("popularFilms");
        const topRatedFilms = document.getElementById("topRatedFilms");
        const upcomingFilms = document.getElementById("upcomingFilms");

        /* Consulta na API de filmes */
        const popular = await site.getContentAPI("https://api.themoviedb.org/3/movie/popular?language=pt-BR");
        const topRated = await site.getContentAPI("https://api.themoviedb.org/3/movie/top_rated?language=pt-BR");
        const upcoming = await site.getContentAPI("https://api.themoviedb.org/3/movie/upcoming?language=pt-BR");

        site.rederizarCard(popular, popularFilms);
        site.rederizarCard(topRated, topRatedFilms);
        site.rederizarCard(upcoming, upcomingFilms);
        site.carouselCards("#lanc"); //Rendizar Carrossel
        site.carouselCards("#pop"); //Rendizar Carrossel
        site.carouselCards("#top"); //Rendizar Carrossel
    },

    getPageFilme: async function (id){
        const uri = `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`;
        const page = await fetch("./pages/filme.html");
        const content = await page.text();
        index.innerHTML = content;

        const rederizarDetails = async()=>{
            const data = await site.getContentAPI(uri);
            document.getElementById("box_image").style.backgroundImage = `linear-gradient(to bottom, rgb(79 79 79 / 52%), rgb(28 28 28 / 73%)), url('https://image.tmdb.org/t/p/w300${data.poster_path}')`;
            document.getElementById("image").src = "https://image.tmdb.org/t/p/w300"+data.poster_path;
            document.getElementById("title").innerText = data.title;
            document.getElementById("tagline").innerText = data.tagline;
            for(let i = 0; i < data.genres.length; i++){
                if(i == 0){
                    document.getElementById("genres").innerHTML += "<strong>Genêro: </strong>" + data.genres[i].name;
                }else{
                    document.getElementById("genres").innerHTML += ", " + data.genres[i].name;
                }
            }
            document.getElementById("id_film").innerHTML = "<strong>ID: </strong>" + data.id;
            document.getElementById("imdb_id").innerHTML = "<strong>IMDB_ID: </strong>" + data.imdb_id;
            for(let j = 0; j < data.production_companies.length; j++){
                if(j == 0){
                    document.getElementById("production_companies").innerHTML += "<strong>Produtora(s): </strong>" + data.production_companies[j].name;
                }else{
                    document.getElementById("production_companies").innerHTML += ", " + data.production_companies[j].name;
                }
            }
            document.getElementById("release_date").innerHTML = "<strong>Lançamento: </strong>" + data.release_date;
            document.getElementById("overview").innerHTML = "<strong>Sinopse: </strong>" + data.overview;
            document.getElementById("runtime").innerHTML = "<strong>Duração: </strong>" + data.runtime + " mins";
        }

        rederizarDetails();

        /* Posição onde será "appendado" */
        const similarFilms = document.getElementById("similarFilms");

        /* Consulta na API de filmes */
        const similar = await site.getContentAPI(`https://api.themoviedb.org/3/movie/${id}/similar?language=pt-BR`);

        site.rederizarCard(similar, similarFilms);
        site.carouselCards("#similar"); //Rendizar Carrossel
    },

    getPageSearch: async function(){
        const page = await fetch("./pages/search.html");
        const content = await page.text();
        index.innerHTML = content;

        const formInput = document.querySelector("#formSearch input");
        const query = formInput.value;

        const searchData = await site.getContentAPI(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=pt-BR&page=1`);

        const textSearch = document.getElementById("textSearch");
        const searchResult = document.getElementById("searchResult");

        if(query == ''){
            textSearch.innerHTML = "Pesquise alguma coisa :) ou " + "<a class='text-blue' onclick='site.getPageHome()'>Volte para a home</a>";
        }else{
            if(searchData.results.length == 0){
                textSearch.innerHTML = "Nenhum resultado encontrado :(, Pesquise outra coisa ou  " + "<a class='text-blue' onclick='site.getPageHome()'>Volte para a home</a>";
            }else{
                textSearch.innerHTML = "Resultado para pesquisa: " + query;
                site.rederizarCard(searchData, searchResult);
            }
        }
    },
    
    rederizarCard: async function(data, pos){
        /* Template card filmes */
        const template_card = document.getElementById("template_card");
        data.results.forEach(film => {
            if(film.poster_path){
                const div = template_card.content.cloneNode(true);
                div.querySelector(".image-card").src = "https://image.tmdb.org/t/p/w300"+film.poster_path;
                div.querySelector(".image-card").alt = film.title;
                div.querySelector(".cardFilm").addEventListener("click", ()=>{
                    site.getPageFilme(film.id);
                })
                pos.append(div);
            }
        });
    },

    carouselCards: function(id){
        var swiper = new Swiper(`${id} .carouselCards`, {
            slidesPerView: 2,
            spaceBetween: 10,
            pagination: {
                el: `${id} .swiper-pagination`,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: `${id} .swiper-button-next`,
                prevEl: `${id} .swiper-button-prev`,
              },
            breakpoints: {
                "@0.00": {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                "@0.75": {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
                "@1.00": {
                  slidesPerView: 6,
                  spaceBetween: 10,
                },
              },
        });
    }
}

/* Chamando a home */
site.getPageHome();