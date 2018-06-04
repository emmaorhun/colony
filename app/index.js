import Customer from './customer';

// Variable declaration and instantiation
let bacteria = 0;
let money = 10;
let increment = 0;
let interval;
let splitCount = 0;
let kombubotAcquired = false;
let customers = [new Customer('stand', 2, 100), new Customer('local', 100, 2000), new Customer('shopify', 1056, 15000)];

const cornerStores = ['Quickie', 'Circle K', 'Miss Tiggy Winkles', 'Canadian Tire', 'Headsail Studios'];
const clickRate = 300;

// Happens when user loads page
window.onload = function() {

  try {
    const loadedData = JSON.parse(localStorage.getItem('data'));

    // Restores user data and updates page
    if (typeof loadedData !== undefined) {
      bacteria = loadedData.totalBacteria;
      increment = loadedData.bacteriaIncrement;
      money = loadedData.cash;
      kombubotAcquired = loadedData.kombubot;
      customers = loadedData.customerArray;
      splitCount = loadedData.splitNum;
      updateNumbers();
      updateBoosters();
    }
  } catch (error) {
    console.error(error);
  }
};

// Updates information on page after info has been reloaded
function updateBoosters() {
  document.getElementById('stand').innerHTML = `Stand x${customers[0].count} <br> Next at: ${customers[0].milestone*((2*customers[0].count)+1)} bacteria`;
  document.getElementById('local').innerHTML = `Corner store x${customers[1].count} <br> Next at: ${customers[1].milestone*((2*customers[1].count)+1)} bacteria`;
  document.getElementById('shopify').innerHTML = `Shopify office x${customers[2].count} <br> Next at: ${customers[2].milestone*((2*customers[2].count)+1)} bacteria`;

  if (kombubotAcquired) {
    document.getElementById('robo').style.visibility = 'visible';
  } else {
    document.getElementById('robo').style.visibility = 'hidden';
  }
}

// Runs all update variable functions
function updateNumbers() {
  updateMoney();
  updateIncrementCount();
  updateBacteriaCount();
}

// Updates the money element on the site
function updateMoney() {
  const element = document.getElementById('money');
  element.innerHTML = `Cash: ${money}`;
}

// Updates the bacteria count element on site
function updateBacteriaCount() {
  const element = document.getElementById('numBacteria');
  element.innerHTML = `Bacteria count: ${bacteria}`;
}

// Updates increment element on site
function updateIncrementCount() {
  const element = document.getElementById('incrementCounter');
  element.innerHTML = `Bacteria per second: ${increment}`;
}

// Adds notification, of whatever was passed in, to the alert box
function addNotification(text) {
  const alerts = document.getElementById('alerts');
  const div = document.createElement('li');
  div.innerHTML = text;
  alerts.appendChild(div);

  // Autoscrolls to the bottom of the box so user always sees most recent notification
  const notifications = document.getElementById('notifications');
  notifications.scrollTop = notifications.scrollHeight;
}

// Goes through and adds all the money created by each booster to the overall cash
function sell() {
  let sum = 0;
  // Iterates through the customers array summing revenue
  customers.map((customer) => sum += customer.price * customer.count);
  money += sum;
}

// Enables and disables button depending on variants
function updateFeedButton() {
  if (money < increment) {
    document.getElementById('feed').disabled = true;
    document.getElementById('feed').classList.add('nohover');
    document.getElementById('feed').style.border = '2px solid #A33127';
    document.getElementById('feed').style.backgroundColor = '#F74A3B';
    document.getElementById('feed').style.color = '#A33127';
  } else {
    document.getElementById('feed').disabled = false;
    document.getElementById('feed').style = '';
    document.getElementById('feed').classList.remove('nohover');
  }
}

// Enables and disables button depending on variants
function updateSplitButton() {
  if (money < (splitCount + 1) * 100 || bacteria < 10 * increment || bacteria === 0) {
    document.getElementById('split').disabled = true;
    document.getElementById('split').classList.add('nohover');
    document.getElementById('split').style.border = '2px solid #A33127';
    document.getElementById('split').style.backgroundColor = '#F74A3B';
    document.getElementById('split').style.color = '#A33127';
  } else {
    document.getElementById('split').disabled = false;
    document.getElementById('split').style = '';
    document.getElementById('split').classList.remove('nohover');
  }
}

// Enables and disables button for each customer booster depending on variants
function updateCustomerButtons() {
  for (let i = 0; i < customers.length; i++) {
    if (bacteria > (customers[i].milestone*((2*customers[i].count)+1))) {
      document.getElementById(customers[i].id).disabled = false;
      document.getElementById(customers[i].id).classList.remove('nohover');
    } else {
      document.getElementById(customers[i].id).disabled = true;
      document.getElementById(customers[i].id).classList.add('nohover');
    }
  }
}

// Checks and updates if user has unlocked the bot
function updateKombubotButton() {
  if (kombubotAcquired === false && money > 1000) {
    document.getElementById('botton').disabled = false;
    document.getElementById('botton').classList.remove('nohover');
  }
}

// Updates all buttons
function updateButtons() {
  updateFeedButton();
  updateSplitButton();
  updateCustomerButtons();
  updateKombubotButton();
}

// The entire game loop
function autoIncrement() {
  clearInterval(interval);
  interval = setInterval(() => {
    bacteria += increment;
    // Update variables
    updateNumbers();
    // Update UI
    updateButtons();
    // Make money
    sell();
  }, clickRate);
}

// Cheat code to enter bacteria, money, and increment
export function setVariables(newBacteria, newMoney, newIncrement) {
  bacteria = newBacteria;
  money = newMoney;
  increment = newIncrement;
  addNotification('Are you cheating? Where are your morals?!');
  updateNumbers();
}

// Cheat to set bacteria only
export function setBacteria(amount) {
  bacteria = amount;
  updateBacteriaCount();
  console.log('Bacteria has been updated');
}

// Cheat to set money only
export function setMoney(amount) {
  money = amount;
  updateMoney();
  console.log('Money has been updated');
}

// Cheat to set increment only
export function setIncrement(amount) {
  increment = amount;
  updateIncrementCount();
  console.log('Increment has been updated');
}

document.getElementById('split').onclick = function() {
  increment *= 2;
  splitCount++;
  money -= 2 * splitCount;
  updateIncrementCount();
};

document.getElementById('feed').onclick = function() {
  increment++;
  money -= increment;
};

// Resets all variables and updates page to original state
document.getElementById('restart').onclick = function() {
  bacteria = 0;
  money = 10;
  increment = 0;
  kombubotAcquired = false;
  splitCount = 0;

  // Iterates through array setting count to 0
  customers.map((customer) => customer.count = 0);

  updateNumbers();
  updateBoosters();

  document.getElementById('tobi').style.visibility = 'hidden';

  const alerts = document.getElementById('alerts');
  alerts.innerHTML = "<li>So... You've decided to start a kombucha business...</li>";
};

// Purchase robot results in enabling image to be visible and a new notification
document.getElementById('botton').onclick = function() {
  document.getElementById('robo').style.visibility = 'visible';
  money -= 1000;

  document.getElementById('botton').disabled = true;
  document.getElementById('botton').classList.add('nohover');

  kombubotAcquired = true;

  addNotification("FYI... He doesn't do anything he's just here for moral support.");
};

// Purchases stand and updates variables
document.getElementById('stand').onclick = function() {
  customers[0].count++;
  bacteria -= customers[0].milestone;
  document.getElementById('stand').innerHTML = `Stand x${customers[0].count} <br> Next at:  ${customers[0].milestone*((2*customers[0].count)+1)} bacteria`;

  // Adds notification the first time button is clicked
  if (customers[0].count === 1) {
    addNotification('Wow, who would have thought that two grown men could make money off of a beverage stand.');
    addNotification('Two dollars a pop!');
  }
};

// Sell to local stores and update variables
document.getElementById('local').onclick = function() {
  customers[1].count++;
  bacteria -= customers[1].milestone;
  document.getElementById('local').innerHTML = `Corner store x${customers[1].count} <br> Next at:  ${customers[1].milestone*((2*customers[1].count)+1)} bacteria`;

  // Picks random corner store each time to display in notification box
  const store = cornerStores[Math.floor(Math.random() * cornerStores.length)];
  addNotification(`Wow... ${store} is impressed with your product!`);
};

// Sell to Shopify and unlock Tobi image and notification
document.getElementById('shopify').onclick = function() {
  document.getElementById('tobi').style.visibility = 'visible';
  customers[2].count++;
  document.getElementById('shopify').innerHTML = `Shopify office x${customers[2].count} <br> Next at:  ${customers[2].milestone*((2*customers[2].count)+1)} bacteria`;

  // Only occurs first time user is able to click the button
  if (customers[2].count === 1) {
    addNotification("I heard Tobi tried your 'booch and this was his reaction --> ʕ ͡° ͜ʖ ͡°ʔ");
    // Victory message!
    alert('WOW! You won! \nRock on and continue playing. \nPlease.');
  }
};

// Creates object literal to store readable data on users local storage
document.getElementById('save').onclick = function() {

  const data = {
    kombubot: kombubotAcquired,
    totalBacteria: bacteria,
    bacteriaIncrement: increment,
    cash: money,
    splitNum: splitCount,
    customerArray: customers,
  };

  try {
    localStorage.setItem('data', JSON.stringify(data));
    console.log(JSON.stringify(data));
  }

  // Throws error if information can't save
  catch (error) {
    console.error(error);
  }

};


autoIncrement();
