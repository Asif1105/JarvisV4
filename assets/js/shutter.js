var shutter = document.querySelector('.shutter');
var help = document.querySelector('.help');
var images = [];

function snap() {
  shutter.classList.remove('open');
  setTimeout(function() {
    shutter.classList.add('open');
  },500);
}

shutter.addEventListener('click', snap);


setTimeout(function() {
  help.parentNode.removeChild(help);
},5000);