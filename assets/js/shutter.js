var shutter = document.querySelector('.shutter');
var camera = document.querySelector('.camera');
var images = [];

function snap() {
  shutter.classList.remove('open');
  setTimeout(function() {
    shutter.classList.add('open');
  },500);
}

camera.addEventListener('click', snap);