// slide
  var swiper = new Swiper(".slide", {
    loop: true,
    spaceBetween: 20,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1020: {
        slidesPerView: 3,
      },
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },   
});  


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const songsApi = 'https://api-kaito-music.herokuapp.com/music/trending?_limit=30';
const songsApi2 = 'https://api-kaito-music.herokuapp.com/music/trending?_limit=30';

const playBtn = $('.play')
const iconPlayBtn = $('.control')
const nameSong = $('.title h3')
const nameSinger = $('.title p')
const image = $('.cd-thumb')
const audio = $('#audio')
const playList = $('.choose-today--list')



let isPlaying = true
let indexSong = 0
let isCdThumb = false




fetch(songsApi)
  .then(function(response){
    return response.json();
  })
  .then(function(songs){
    var datas = songs.data
    var htmls = datas.map(function (song, index) {        
      return `
      <div class="item"data-index="${index}">
        <div class="image">
          <img src="${song.image_music}" alt="">
          <div class="icon">                        
            <i class="far fa-heart"></i>                                              
            <i class="fas fa-play"></i>                       
            <i class="fas fa-ellipsis-h"></i>                      
          </div>
        </div>
        <div class="content">
          <h4>${song.name_music}</h4>
          <p>${song.name_singer}</p>        
        </div>
      </div>`  

    });
    $('.choose-today--list').innerHTML = htmls.join('');

    // lấy bài hát đầu tiên
    function firstSong() {
      nameSong.innerHTML = `${datas[indexSong].name_music}`
      nameSinger.innerHTML = `${datas[indexSong].name_singer}`
      image.style.backgroundImage = `url('${datas[indexSong].image_music}')`
      audio.src = `${datas[indexSong].src_music}`
      audio.play();
    }
    firstSong();

    // play nhạc
    playBtn.addEventListener('click', play);
    function play() {
      if(isPlaying) {
        audio.play()
        iconPlayBtn.classList.add('playing')
        isPlaying = false;
        imageThumb(!isCdThumb)
      } else {
        audio.pause()
        iconPlayBtn.classList.remove('playing')
        image.classList.remove('spin')
        isPlaying = true;
      }
    }

    function imageThumb(isCdThumb) {
        isCdThumb ? image.classList.add('spin') : image.classList.remove('spin')
    }
    imageThumb(isCdThumb)

    // bấm vào playlist
    playList.onclick = function (e) {
      const songNode = e.target.closest('.item')
      // console.log(songNode.dataset.index)
      
      if(songNode) {
        indexSong = Number(songNode.dataset.index)
        // console.log(indexSong)
        firstSong()
        play()
      }
    }




  });

  








fetch(songsApi2)
.then(function(response){
  return response.json();
})
.then(function(songs){
  var datas = songs.data
  var htmls = datas.map(function (song) {        
    return `
      <li class="item">

        <div class="song">

          <div class="image">
            <img src="${song.image_music}" alt="">
          </div>
          <div class="title">
            <h5>${song.name_music}</h5>
            <p>${song.name_singer}</p>   
          </div>
          
        </div>

        <div class="icon">
          <div class="icon-play">
            <i class="fas fa-play"></i> 
          </div>
          <div class="icon-heart">
              <i class="far fa-heart"></i> 
          </div>
          
          <div class="icon-setting">
              <i class="fas fa-ellipsis-h"></i>
          </div> 
        </div>

      </li>`  
  });
  $('.sidebar-list--item ul').innerHTML = htmls.join('');
});

