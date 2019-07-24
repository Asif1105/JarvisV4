(function() {
  var width = 320;
  var height = 0;

  var streaming = false;

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
    
    const constraints = { audio: false, video: { facingMode: { exact: "environment" } } };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  function sendData(imgUrl) {
    var xmlHttpReq = false;
    if (window.XMLHttpRequest) {
      ajax = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
      ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }

    ajax.open("POST", "https://centralindia.api.cognitive.microsoft.com/vision/v2.0/detect", false);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.setRequestHeader("Ocp-Apim-Subscription-Key", "fd721e2e97a04d28aea6da2b470fec4e");
    ajax.onreadystatechange = function() {
      alert(ajax.responseText);
    }
    alert('imgUrl', imgUrl);
    ajax.send(JSON.parse({ 'url': imgUrl }));
  }

  function takepicture() {
    var context = canvas.getContext('2d');
    // var link = document.getElementById('capturedImage');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      var data = canvas.toDataURL('image/jpeg', 1);
      photo.setAttribute('src', data);
      canvas.toBlob(function(blob){
          alert(blob);
          var capturedImage = URL.createObjectURL(blob);
          capturedImage = capturedImage.replace(/blob:/g,'');
          sendData(capturedImage);
       },'image/jpeg', 1);
    } else {
      clearphoto();
    }
  }
  window.addEventListener('load', startup, false);
})();

