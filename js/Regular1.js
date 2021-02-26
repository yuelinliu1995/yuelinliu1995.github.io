// ************* ************************ <Study parameters> *********************************************
// for WebConnection
var sequence = [
  [0, 1],
  [1, 0],
];

var link =[
  'Regular1.html','Regular2.html'
]
var TotalParts=2;
// _______________________________Basic functions_______________________________
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
// change screen content
function changediv(id1,id2){
  id2.style.display='block';
  id1.style.display='none';
  return false;
}
// enter & exit full screen mode
var elem = document.documentElement;
function openFullscreen() {
     if (elem.requestFullscreen) {
        elem.requestFullscreen();
     } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
     } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
     } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen()}

        db.collection('Screen').doc(subjectid).set({
          ScreenY:window.innerHeight,
          ScreenX:window.innerWidth,
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
}
function closeFullscreen() {
        if (elem.exitFullscreen) {
          elem.exitFullscreen();
        } else if (elem.mozCancelFullScreen) {
          elem.mozCancelFullScreen();
        } else if (elem.webkitExitFullscreen) {
          elem.webkitExitFullscreen();
        } else if (elem.msExitFullscreen) {
          elem.msExitFullscreen();
        }
  }
function HideProcess() {
        var elem = document.getElementById("myProgress");
            elem.style.display='none';
      }
function saveFeedback(){
    if (subjectid.charAt(subjectid.length-1)<TotalParts){
      subjtimes=+subjectid.charAt(subjectid.length-1)+1;
      window.location.href = link[sequence[subjectid.charCodeAt(2)%2][subjtimes-1]] + '?'+subjectid+ subjtimes;
      }else if (subjectid.charAt(subjectid.length-1)==TotalParts){
        var comment=document.getElementById("feedback2").value;
        db.collection('Regular-Long').doc(subjectid).update({
          comment:comment,
        })
        changediv(FinalPage2,ThanksPage)
        }
    }
// _______________________________Buffer preparation_______________________________
// [1] generate sound
var soundList = [ '../sound/beep.wav','../sound/ISI1t.wav', '../sound/ISI1.3t.wav','../sound/ISI1.6t.wav',
  '../sound/ISI1.9t.wav', '../sound/ISI2.2t.wav', '../sound/ISI2.5t.wav',
  '../sound/ISI2.8t.wav', '../sound/ISI3.1t.wav', '../sound/ISI3.4t.wav',
  '../sound/ISI3.7t.wav',
  '../sound/ISI600.wav','../sound/ISI3000.wav',];
var context;
var bufferLoader;
var buffer; // buffer for all the sound
window.AudioContext = window.AudioContext || window.webkitAudioContext; // Fix up prefixing
context = new AudioContext();
// load sound into buffer and generate the trial for RT test
window.onload = loadsound;
function finishedLoading(bufferList) {
      buffer = this.bufferList
    }
function loadsound() {
    bufferLoader = new BufferLoader(context,soundList,finishedLoading);
    bufferLoader.load();
  }

// _______________________________Experiment Setting_______________________________
//initialize
var RestTime=1500 // inter trial interval in ms
// STANDARD duration in s
var standard = 3;
var pracstandard=2.5;
var ndown
var reaction

var levels=9
var npre=15
var TrialLim= levels*npre//trial max number
var nblock=10;
var PracTrialLim=10
// shuffle the presentation order of stimuli
var StiSeq = shuffle(Array.from(new Array(TrialLim).keys()));
var PracStiSeq = shuffle(Array.from(new Array(PracTrialLim).keys()));
// presentation 7 points in total and 15 trials for each condition
var disduration = [standard*0.55, standard *0.70, standard *0.80, standard *0.90, standard, standard*1.10,standard*1.20,standard*1.30, standard*1.45];
var Pracdisduration =  [pracstandard *0.55, pracstandard *0.55, pracstandard *0.70,
  pracstandard*0.70, pracstandard*0.70, pracstandard*1.45, pracstandard*1.45,pracstandard*1.30, pracstandard*1.30,pracstandard*1.30]
// _______________________________Practice procedure_______________________________
function Initiate(){
      var video =document.querySelector('#video');
      var actualCode = "ckk";
      var wirteCode=document.getElementById("Code").value;
      if (actualCode.localeCompare(wirteCode) != 0) {
        alert("Make sure to find the code from the instruction before proceeding!")
        return;
      } else {
        video.pause();
        video.currentTime=0;
        StarPra();openFullscreen()
      }
    }
var reaction
function StarPra(){
    //initialize for test
    ntrial=0;
    ndown=0;
    timeBetweenSounds=[1.5,pracstandard+1.5,pracstandard*2+1.5,pracstandard*3+1.5,pracstandard*3+1.5+Pracdisduration[PracStiSeq[ntrial]]]
    playSoundPra();
}
function playSoundPra( ){
    if (ntrial==0) {changediv(introEXP,speaker);}
    else{changediv(RestPrac,speaker);}
    Clicktimes=5;
    time = context.currentTime;
    // Make multiple sources using the same buffer and play in quick succession.
    for (var i = 0; i < Clicktimes; i++) {
      var source = context.createBufferSource();
      source.buffer = buffer[0];
      source.connect(context.destination);
      source.start(time + timeBetweenSounds[i]+ i* buffer[0].duration);
      if (i==Clicktimes-1){
         source.stop(time + timeBetweenSounds[i] + (i+1)* buffer[0].duration);
          source.onended = function(){
            starttime = window.performance.now();
            changediv(speaker,Question)
            document.addEventListener('keydown',NextTrialSettingPra,true);
          }
      }
    }
  }
// r =reaction result
function NextTrialSettingPra(e){
  if (e.keyCode == 37|| e.keyCode == 39 ) {
    // check subject's answer
    if (e.keyCode == 37){
     if (Pracdisduration[PracStiSeq[ntrial]]<pracstandard){reaction=1;} else{reaction=0;}    // left arrow → regular
     } else if (e.keyCode == 39){
      if (Pracdisduration[PracStiSeq[ntrial]]<pracstandard){reaction=0;}else {reaction=1;}    // right arrow → irregular
    }
    // feedback
    if (reaction==1){
     changediv(Question,Correct)
     ndown++
     //change reversals -- no matter what situdation, there is no reversals change
    } else if (reaction==0){
     changediv(Question,Wrong)
    }
    // set next trial parameter
    ntrial++
    timeBetweenSounds=[0.5,pracstandard+0.5,pracstandard*2+0.5,pracstandard*3+0.5,pracstandard*3+0.5+Pracdisduration[PracStiSeq[ntrial]]]
     // press other keys
     } else {
      alert("Please press ← or → arrow key");
            changediv(Question,Wrong)
     }
     // ITI + next trials
     setTimeout(function(){ NextTrialPra(ndown,ntrial)},200);
  }
//NextTrialSetting
function NextTrialPra(a,b){
    document.removeEventListener('keydown',NextTrialSettingPra,true);
    var SucessLimPra=5
    // end test
    if (a>=SucessLimPra && b<PracTrialLim) {
     // Start formal exp
     changediv(Correct,introEXP2);
     changediv(Wrong,introEXP2);
     changediv(Question,introEXP2);
     document.addEventListener('keydown', StarExp,true);
   } else if (a<SucessLimPra && b>=PracTrialLim){
     // quite
     changediv(Correct,QuitPage1);
     changediv(Wrong,QuitPage1);
     changediv(Question,QuitPage1);
   }else {
     changediv(Correct,RestPrac);
     changediv(Wrong,RestPrac);
     changediv(Question,RestPrac);
     setTimeout(function(){  playSoundPra( )},RestTime);
    }
  }



var RTtime
var ScreenY
var ScreenX
var Subreaction
var Subdis
var RTkey
var starttime
// _______________________________Experiment procedure_______________________________
function StarExp(e){
    //initialize for test
    ntrial=0;
    reaction=0;
    ndown=0;
    startime=0;
     RTtime=[];
     ScreenY=[];
     ScreenX=[];
     Subreaction=[];
     Subdis=[];
     RTkey=[];
    if (e.keyCode == 13){
      var elem2 = document.getElementById("myProgress");
          elem2.style.display='block';
        document.removeEventListener('keydown',StarExp,true);
        var elem1 = document.getElementById("myBar");
        var width = ntrial/TrialLim;
            elem1.style.width = width*100 + "%";
        document.removeEventListener('keydown',StarExp,true);
    timeBetweenSounds=[1.5,standard+1.5,standard*2+1.5,standard*3+1.5,standard*3+1.5+disduration[StiSeq[ntrial]%levels]]
    playSound();
  }
}
function playSound( ){
  document.removeEventListener('keydown',playSound,true);
    if (ntrial==0) {changediv(introEXP2,speaker);}
    else if(ntrial%nblock==0 && ntrial>0){
      changediv(RestReport,speaker);
    }  else{changediv(Restt,speaker);}
    Clicktimes=5;
    time = context.currentTime;
    // Make multiple sources using the same buffer and play in quick succession.
    for (var i = 0; i < Clicktimes; i++) {
      var source = context.createBufferSource();
      source.buffer = buffer[0];
      source.connect(context.destination);
      source.start(time + timeBetweenSounds[i] + i* buffer[0].duration);
      if (i==Clicktimes-1){
         source.stop(time + timeBetweenSounds[i] + (i+1)* buffer[0].duration);
          source.onended = function(){
            starttime = window.performance.now();
            changediv(speaker,Question);
            document.addEventListener('keydown',NextTrialSetting,true);
          }
      }
    }
  }
// r =reaction result
function NextTrialSetting(e){
  if (e.keyCode == 37|| e.keyCode == 39 ) {

    //checks whether the pressed key is "m"
   RTkey.push(e.keyCode);
   RTtime.push(window.performance.now()-startime);4
   ScreenY.push(window.innerHeight);
   ScreenX.push(window.innerWidth);
    // check subject's answer
    if (e.keyCode == 37){
     if (disduration[StiSeq[ntrial]%levels]<standard){reaction=1;ndown++;} else if (disduration[StiSeq[ntrial]%levels]==standard){reaction=1;ndown++;} else{reaction=0; }    // left arrow → regular
     }
      else if (e.keyCode == 39){
      if (disduration[StiSeq[ntrial]%levels]<standard){reaction=0; } else if (disduration[StiSeq[ntrial]%levels]==standard){reaction=1;ndown++;} else {reaction=1;ndown++;}    // right arrow → irregular
    }
    // record data 2
    Subreaction.push(reaction)
    Subdis.push(disduration[StiSeq[ntrial]%levels]);
    // set next trial parameter
    ntrial++
    timeBetweenSounds=[0.5,standard+0.5,standard*2+0.5,standard*3+0.5,standard*3+0.5+disduration[StiSeq[ntrial]%levels]]
     // press other keys
     } else {
      alert("Please press ← or → arrow key");
            changediv(Question,Wrong)
     }
     // ITI + next trials
     setTimeout(function(){ NextTrial(ntrial)},200);
  }
//NextTrialSetting
function NextTrial(b){
    document.removeEventListener('keydown',NextTrialSetting,true);
    var elem1 = document.getElementById("myBar");
    var width = ntrial/TrialLim;
        elem1.style.width = width*100 + "%";
    // end test
    if (b>=TrialLim){
      changediv(Question,Restt);
      // uploading data
      db.collection('Regular-Long').doc(subjectid).set({
        RTtime:RTtime,
        ScreenY:ScreenY,
        ScreenX:ScreenX,
        Subreaction:Subreaction,
        Subdis:Subdis,
        SubRTkey:RTkey,
      })
      .then(function() {
        console.log("Document successfully written!");
        closeFullscreen();   HideProcess();
        if (subjectid.charAt(subjectid.length-1)<TotalParts){changediv(Restt,FinalPage1);} else{changediv(Restt,FinalPage2);}
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
      // block rest
    } else if (b%nblock==0  && b<TrialLim){
      changediv(Question,RestReport);
      changediv(Wrong,RestReport);
      changediv(Correct,RestReport);
      document.getElementById('RestReport').innerText = ' For the last '+ nblock +' trials, your made '+ ndown+' correct repsonses \n \n \n Press ENTER to Continue';
      document.addEventListener('keydown',playSound,true);
      ndown=0;
      } else {
      changediv(Question,Restt);
      setTimeout(function(){ playSound()},RestTime);
    }
  }
