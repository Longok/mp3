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

const songsApi = 'https://api-kaito-music.herokuapp.com/api/music/trending?_limit=30';
const songsApi2 = 'https://api-kaito-music.herokuapp.com/api/music/trending?_limit=30';

const playBtn = $('.play')
const iconPlayBtn = $('.control')
const nameSong = $('.title h3')
const nameSinger = $('.title p')
const image = $('.cd-thumb')
const audio = $('#audio')
const playList = $('.song')
const timeAt = $('.curentime')
const durationTime = $('.duration')
const progress = $('.progress')
const volumeBtn = $('#volume')
const nextBtn = $('.next')
const prevBtn = $('.prev')
const randomBtn = $('.random')
const repeatBtn = $('.repeat')

let indexSong = 0
let isPlaying = true
let isCdThumb = false
let isRepeat = false
let isRandom = false

 

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
    $('.song').innerHTML = htmls.join('');

    // lấy bài hát đầu tiên
    function firstSong(indexSong) {
      nameSong.innerHTML = `${datas[indexSong].name_music}`
      nameSinger.innerHTML = `${datas[indexSong].name_singer}`
      image.style.backgroundImage = `url('${datas[indexSong].image_music}')`
      audio.src = `${datas[indexSong].src_music}`
      audio.play();
    }
    firstSong(indexSong);

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
        firstSong(indexSong)
        play()
      }
    }

    // Next bài hát
    nextBtn.addEventListener('click', function() {
      if(isRandom) {
        randomSong()
        isPlaying = true;
        play()
      } else {
        nextSong()
        isPlaying = true;
        play()
        
      }
      audio.play()
    });
    function nextSong() {
      indexSong ++
      if(indexSong >= datas[indexSong].src_music.length) {
        indexSong = 0
      }
      firstSong(indexSong)
    }

    // Prev bài hát
    prevBtn.addEventListener('click', function() {
      if(isRandom) {
        randomSong()
        isPlaying = true;
        play()
      } else {
        prevSong()
        isPlaying = true;
        play()
      }
      audio.play()
    })
    function prevSong() {
      indexSong --
      if(indexSong <= 0 ) {
        indexSong = datas[indexSong].src_music.length -1
      }
      firstSong(indexSong)
    }

    // Random bài hát
    randomBtn.addEventListener('click', function() {
      if(isRandom) {
          isRandom = false;
          randomBtn.classList.remove('active')
      }else {
          isRandom = true;
          randomBtn.classList.add('active')
      }

    });
    function randomSong(){
      let newIndex
      do {
        newIndex = Math.floor(Math.random() *datas[indexSong].src_music.length)
      } while (newIndex === indexSong)
      indexSong = newIndex
      firstSong(indexSong)
    }

    // Repeat bài hát
    audio.addEventListener('ended', handleEndedSong);
    function handleEndedSong() {
      if(isRepeat) {
          isPlaying = true;
          play()
      } else {
          nextSong()
      }
    }

    repeatBtn.addEventListener('click', function() {
      if(isRepeat) {
        isRepeat = false;
        repeatBtn.classList.remove('active')
      }else {
        isRepeat = true;
        repeatBtn.classList.add('active')
      }
    });


    // Hiển thị thời gian
    function displayTimes() {
      const {duration, currentTime} = audio

      durationTime.textContent = formatTime(duration)

      if(!duration) {
        timeAt.textContent = "00:00"
      } else {
        timeAt.textContent = formatTime(currentTime)
      }

      progress.max = duration
      progress.value = currentTime

    }

    // Định dạng thời gian
    function formatTime(number) {
      const minutes = Math.floor(number / 60 );
      const seconds = Math.floor(number - minutes * 60);
      return `${minutes}:${seconds}`;     
    }
  
    displayTimes();
    setInterval(displayTimes, 500);
    
    // Tua bài hát
    progress.addEventListener('click', handleChangeProgess)
    function handleChangeProgess() {
      audio.currentTime = progress.value
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

        <div class="song-right">

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

