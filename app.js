const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdown options
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update exchange rate and perform conversion
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  
  // Fetch the latest currency rates
  const rates = await getCurrencyRates();
  if (!rates) {
    msg.innerText = "Error fetching exchange rates.";
    return;
  }

  let rateFrom = rates[fromCurr.value.toLowerCase()];
  let rateTo = rates[toCurr.value.toLowerCase()];

  if (rateFrom && rateTo) {
    const exchangeRate = rateTo / rateFrom; // Calculate exchange rate
    let finalAmount = amtVal * exchangeRate; // Convert the amount
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } else {
    msg.innerText = "Currency not found.";
  }
};

// Function to fetch currency rates
const getCurrencyRates = async () => {
  try {
    let response = await fetch(BASE_URL);
    let data = await response.json();
    return data.eur; // Return all currency rates
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Update flag based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener for button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Initial call to update exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
