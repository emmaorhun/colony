
let bacteria = 0;
let increment = 0;
let clickRate = 1000;
let interval;

window.onload = function(){
  console.log("Loading game...");

  try{
    const loadedData = JSON.parse(localStorage.getItem("data"));
    console.log(loadedData);

    if(typeof loadedData.totalBacteria !== "undefined" && typeof loadedData.bacteriaIncrement !== "undefined") {
      bacteria = loadedData.totalBacteria;
      increment = loadedData.bacteriaIncrement;
      updateBacteriaCount();
      updateIncrementCount();
    }
  }

  catch(error) {
    console.error(error);
  }
}

function updateBacteriaCount(){
  let e = document.getElementById('numBacteria');
  e.innerHTML = `Bacteria count: ${bacteria}`;
}

function updateIncrementCount(){
  let e = document.getElementById('incrementCounter');
  e.innerHTML = `Bacteria per second: ${increment}`;
}

function addNotification(text){
  let alerts = document.getElementById('alerts');
  let div = document.createElement("li");
  div.innerHTML = text;
  alerts.appendChild(div);

  notifications.scrollTop = notifications.scrollHeight;
}


function updateButtons(){
  if(bacteria > 100){
    document.getElementById("split").disabled = false;
    document.getElementById("split").classList.remove("nohover");
  }
}

function autoIncrement(){
  clearInterval(interval);
  interval = setInterval(function() {
        bacteria += increment;
        updateBacteriaCount();
        getNotifications();
        updateButtons();
    }, clickRate);
}

function getNotifications(){
  if (bacteria > 15)  addNotification("Oh... Something is happening...");
}

export function setBacteria(amount){
  bacteria = amount;
  updateBacteriaCount();
  console.log("Bacteria has been updated")
}

export function setIncrement(amount){
  increment = amount;
  updateIncrementCount();
  console.log("Increment has been updated")
}

export function restart(){
  setIncrement(0);
  setBacteria(0);
  alerts.innerHTML = "So... You've decided to start a kombucha business...";
}

document.getElementById("split").onclick = function(){
  increment *= 2;
  updateIncrementCount();
}

document.getElementById("add").onclick = function() {
  bacteria++;
  getNotifications();
  updateBacteriaCount();
}

document.getElementById("feed").onclick = function() {
  increment++;
  updateIncrementCount();
}

document.getElementById("save").onclick = function(){ save(); }

function save(){
  console.log("Attempting save...");
  let data = {
    totalBacteria: bacteria,
    bacteriaIncrement: increment
  }

  try {
    localStorage.setItem("data", JSON.stringify(data));
    console.log(JSON.stringify(data));
  }
  catch(error) { console.error(error); }
}

autoIncrement();
