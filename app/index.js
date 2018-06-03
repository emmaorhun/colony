import Customer from './customer.js'

let bacteria = 0;
let money = 10;
let increment = 0;
let clickRate = 300;
let interval;
let splitCount = 0;
let kombubotAcquired = false;
let cornerStores = ["Quickie", "Circle K", "Miss Tiggy Winkles", "Canadian Tire", "Headsail Studios"]

let customers = [new Customer("stand", 2, 100), new Customer("local", 100, 1000), new Customer("shopify", 1056, 10000)];

window.onload = function(){
  console.log("Loading game...");

  try{
    const loadedData = JSON.parse(localStorage.getItem("data"));
    console.log(loadedData);

    if(typeof loadedData.totalBacteria !== "undefined" && typeof loadedData.bacteriaIncrement !== "undefined") {
      bacteria = loadedData.totalBacteria;
      increment = loadedData.bacteriaIncrement;
      money = loadedData.cash;
      kombubotAcquired = loadedData.kombubot;
      customers = loadedData.customerArray;
      updateNumbers();
      updatePage();
    }
  }

  catch(error) {
    console.error(error);
  }
}

function updatePage(){
  document.getElementById("stand").innerHTML = "Stand x"+customers[0].count;
  document.getElementById("local").innerHTML = "Corner store x"+customers[1].count;
  document.getElementById("shopify").innerHTML = "Shopify office x"+customers[2].count;

  if(kombubotAcquired) document.getElementById("robo").style.visibility = "visible";
  else document.getElementById("robo").style.visibility = "hidden";
}

function updateNumbers(){
  updateMoney();
  updateIncrementCount();
  updateBacteriaCount();
}

function updateMoney(){
  let e = document.getElementById('money');
  e.innerHTML = `Cash: ${money}`;
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

function sell(){
  let sum = 0;
  customers.map(customer => sum += customer.price * customer.count);
  money += sum;
}

function updateFeedButton(){
  if(money < increment){
    document.getElementById("feed").disabled = true;
    document.getElementById("feed").classList.add("nohover");
    document.getElementById("feed").style.border = "2px solid #A33127"
    document.getElementById("feed").style.backgroundColor = "#F74A3B";
    document.getElementById("feed").style.color = "#A33127"
  } else {
    document.getElementById("feed").disabled = false;
    document.getElementById("feed").style = "";
    document.getElementById("feed").classList.remove("nohover");
  }
}

function updateSplitButton(){
  if(money < (splitCount+1)*100|| bacteria < 10*increment || bacteria == 0){
    document.getElementById("split").disabled = true;
    document.getElementById("split").classList.add("nohover");
    document.getElementById("split").style.border = "2px solid #A33127"
    document.getElementById("split").style.backgroundColor = "#F74A3B";
    document.getElementById("split").style.color = "#A33127"
  } else {
    document.getElementById("split").disabled = false;
    document.getElementById("split").style = "";
    document.getElementById("split").classList.remove("nohover");
  }
}

function updateCustomerButtons(){
  for(let i = 0; i < customers.length; i++){
    if(bacteria > customers[i].milestone){
      document.getElementById(customers[i].id).disabled = false;
      document.getElementById(customers[i].id).classList.remove("nohover");
    } else {
      document.getElementById(customers[i].id).disabled = true;
      document.getElementById(customers[i].id).classList.add("nohover");
    }
  }
}

function updateKombubotButton(){
  if(kombubotAcquired == false && money > 1000){
    document.getElementById("botton").disabled = false;
    document.getElementById("botton").classList.remove("nohover");
  }
}
function updateButtons(){
  updateFeedButton();
  updateSplitButton();
  updateCustomerButtons();
  updateKombubotButton();
}

function autoIncrement(){
  clearInterval(interval);
  interval = setInterval(function() {
    bacteria += increment;
    updateButtons();
    updateNumbers();
    sell();
  }, clickRate);
}

export function setVariables(newBacteria, newMoney, newIncrement){
  bacteria = newBacteria;
  money = newMoney;
  increment = newIncrement;
  addNotification("Are you cheating? Where are your morals?!");
  updateNumbers();
}

export function setBacteria(amount){
  bacteria = amount;
  updateBacteriaCount();
  console.log("Bacteria has been updated");
}

export function setMoney(amount){
  money = amount;
  updateMoney();
  console.log("Money has been updated");
}

export function setIncrement(amount){
  increment = amount;
  updateIncrementCount();
  console.log("Increment has been updated");
}

export function restart(){
  bacteria = 0;
  money = 10;
  increment = 0;
  kombubotAcquired = false;
  splitCount = 0;
  customers.map(customer => customer.count = 0);

  updateNumbers();
  updatePage();

  document.getElementById("tobi").style.visibility = "hidden";
  alerts.innerHTML = "<li>So... You've decided to start a kombucha business...</li>";
}

document.getElementById("split").onclick = function(){
  increment *= 2;
  money -= 2*splitCount;
  splitCount;
  updateIncrementCount();
}

document.getElementById("feed").onclick = function() {
  increment++;
  money -= increment;
}

document.getElementById("botton").onclick = function() {
  document.getElementById("robo").style.visibility = "visible";
  money -= 1000;

  document.getElementById("botton").disabled = true;
  document.getElementById("botton").classList.add("nohover");

  kombubotAcquired = true;

  addNotification("FYI... He doesn't do anything he's just here for moral support.");
}

document.getElementById("stand").onclick = function() {
  customers[0].count++;
  bacteria -= customers[0].milestone;
  document.getElementById("stand").innerHTML = "Stand x"+customers[0].count;
  if(customers[0].count === 1) {
    addNotification("Wow, who would have thought that two grown men could make money off of a beverage stand.");
    addNotification("Two dollars a pop!");
  }
}

document.getElementById("local").onclick = function() {
  customers[1].count++;
  bacteria -= customers[1].milestone;
  document.getElementById("local").innerHTML = "Corner store x"+customers[1].count;
  let store = cornerStores[Math.floor(Math.random()*cornerStores.length)]
  addNotification(`Wow... ${store} is impressed with your product!`);
}

document.getElementById("shopify").onclick = function() {
  document.getElementById("tobi").style.visibility = "visible";
  customers[2].count++;
  document.getElementById("shopify").innerHTML = "Shopify office x"+customers[2].count;

  if(customers[2].count === 1) {
    addNotification("I heard Tobi tried your 'booch and this was his reaction --> ʕ ͡° ͜ʖ ͡°ʔ");
    alert("WOW! You won! \nRock on and continue playing. \nPlease.");
  }
}

document.getElementById("save").onclick = function(){ save(); }

function save(){

  console.log("Attempting save...");

  let data = {
    kombubot: kombubotAcquired,
    totalBacteria: bacteria,
    bacteriaIncrement: increment,
    cash: money,
    customerArray: customers
  }

  try {
    localStorage.setItem("data", JSON.stringify(data));
    console.log(JSON.stringify(data));
  }
  catch(error) { console.error(error); }
}

autoIncrement();
