
// ************************************* <Study parameters> *********************************************

var subject = {
  id: null,
  age:null,
  Gender:null,
  hand:null,
  language:null,
  music:null,
  comments: null,
  fps:null,
}





// ************* ************************ <Initiate + basic func> *********************************************
// change screen content
function changediv(id1,id2){
  id2.style.display='block';
  id1.style.display='none';
  return false;
}


// get monitor refresh rate
var t=[];
function animate(now) {

    t.unshift(now);
    if (t.length > 10) {
        var t0 = t.pop();
        var fps = Math.floor(1000 * 10 / (now - t0));
        subject.fps=fps;
    }

    AnimeID=window.requestAnimationFrame(animate);
};
//function for drainage
function drainage(){
    subject.id=document.getElementById("subjID").value;
   if (subject.id ) {
        changediv(Drainage,intro);
        var t = [];
        window.requestAnimationFrame(animate);
     } else {
      alert("Please fill out the information!");
   }
  }
//collect basic info
function basicinfo(){
  window.cancelAnimationFrame(AnimeID)
  subject.age=document.getElementById("age").value;
  subject.Gender=document.getElementById("gender").value;
  subject.hand=document.getElementById("hand").value;
  subject.language=document.getElementById("language").value;
  subject.music=document.getElementById("musicexp").value;
  Auditest=document.getElementById("auditest").value;
  if (!subject.Gender || !subject.age || !subject.hand || !subject.language || !subject.music || !Auditest) {
    alert("Please fill out your basic information!");
    return;
  } else if(Auditest!=2){
    alert("Please adjust your computer audio system and listen carefully!")
  }
  else {
    // create document for subject
    db.collection("Subinfo").doc(subject.id).set({
    subject:subject,
    browser:isChrome,
    })
    .then(function() {
      console.log("Document successfully written!");
      localStorage.setItem("subjectid",subject.id);
      subject.times=1;
      window.location.href = link[sequence[subject.id.charCodeAt(2)%TotalParts][subject.times-1]] + '?'+subject.id+ subject.times;
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }
}

// *****************************************************************************************************
// test participates‘ browser
window.onload = Testbrowser();
  var isChrome;
function Testbrowser (){
  isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  if (!isChrome){
  alert("Please use Chorme. Or you have to return your study!" );

  }
}
