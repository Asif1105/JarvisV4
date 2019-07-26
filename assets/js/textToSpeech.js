$(function(){
  if ('speechSynthesis' in window) {
   function textToSpeech(text){
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
});
