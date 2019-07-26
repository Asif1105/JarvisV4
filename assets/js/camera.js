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
      snap();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }
  
  function createBlob(dataURL) {
      var BASE64_MARKER = ';base64,';
      if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
      }
      var parts = dataURL.split(BASE64_MARKER);
      var contentType = parts[0].split(':')[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;

      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
  }

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  function textToSpeech(text){
    if ('speechSynthesis' in window) {
      var msg = new SpeechSynthesisUtterance();
      var voices = window.speechSynthesis.getVoices();
      msg.voice = voices[8];
      msg.rate = 1;
      msg.pitch = 1;
      msg.text = text;

      msg.onend = function(e) {
        // console.log('Finished in ' + event.elapsedTime + ' seconds.');
      };
      speechSynthesis.speak(msg);
   }
  }
  
  function setData(response){
    const res = JSON.parse(response);
    const count = res.objects && res.objects.length;
    const objects = res.objects;
    if(count > 0) {
      var result = '';
      document.getElementById('object').innerHTML = '';
      for(let i=0;i<count;i++){
        result += objects[i]['object'] + ',';
      }
      result = result.charAt(result.length - 1) === ',' ? result.substr(0, result.length - 1) : result;
      document.getElementById('object').innerHTML = result;
      result ? textToSpeech('I found '+result) : textToSpeech("I don't find anything. Please let me suit up again");
    } 
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
    ajax.setRequestHeader("Content-Type", "application/octet-stream");
    ajax.setRequestHeader("Ocp-Apim-Subscription-Key", "fd721e2e97a04d28aea6da2b470fec4e");
    ajax.onreadystatechange = function() {
       setData(ajax.responseText);
    }
    ajax.send(imgUrl);
  }

  function snap() {
    var shutter = document.querySelector('.shutter');
    // $('#audio').play();
    shutter.classList.remove('open');
    setTimeout(function() {
      shutter.classList.add('open');
      takepicture();
    },500);
  }

  function takepicture() {
    var context = canvas.getContext('2d');
    // var link = document.getElementById('capturedImage');
    if (width) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      var data = canvas.toDataURL('image/jpeg', 1);
      photo.setAttribute('src', data);
      var blobData = createBlob(data);
      sendData(blobData);
      /*canvas.toBlob(function(blob){
          var capturedImage = URL.createObjectURL(blob);
          capturedImage = capturedImage.replace(/blob:/g,'');
          alert(data);
          sendData(data);
       },'image/jpeg', 1);*/
    } else {
      clearphoto();
    }
  }
  window.addEventListener('load', startup, false);
})();
