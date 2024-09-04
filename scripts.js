const dropList = document.querySelectorAll(".drop-list select");
const getButton = document.querySelector("form button.exchange");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const exchangeRateTxt = document.querySelector(".exchange-rate");
const exchangeIcon = document.querySelector(".drop-list .icon");

const apikey = "42dea45b803aa2169efd132b";

const populateCurrencyOptions = () => {
  dropList.forEach((select, index) => {
    Object.entries(country_list).forEach(([country, code]) => {
      const isSelected =
        (index === 0 && country === "USD") ||
        (index === 1 && country === "TRY");
      const optionTag = `<option value="${country}" ${
        isSelected ? "selected" : ""
      }>${country}</option>`;
      select.insertAdjacentHTML("beforeend", optionTag);
    });

    select.addEventListener("change", (e) => loadFlag(e.target));
  });
};

const loadFlag = (element) => {
  const countryCode = country_list[element.value];
  const imgTag = element.parentElement.querySelector("img");
  imgTag.src = `https://flagpedia.net/data/flags/h160/${countryCode.toLowerCase()}.png`;
};

const swapCurrencies = () => {
  const tempValue = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempValue;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
};

const validateAmount = (amount) => {
  return amount === "" || amount === "0" || Number(amount) < 0 ? "1" : amount;
};

const getExchangeRate = async () => {
  const amount = document.querySelector(".amount input").value;
  const amountVal = validateAmount(amount);

  exchangeRateTxt.innerHTML = "Getting exchange rate...";
  exchangeRateTxt.style.color = "#fff";

  const url = `https://v6.exchangerate-api.com/v6/${apikey}/latest/${fromCurrency.value}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch exchange rate");

    const result = await response.json();
    const exchangeRate = result.conversion_rates[toCurrency.value];
    const convertedAmount = (amountVal * exchangeRate).toFixed(2);

    exchangeRateTxt.innerHTML = `${amountVal} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
  } catch (error) {
    exchangeRateTxt.style.color = "red";
    exchangeRateTxt.innerHTML = "Something went wrong!";
  }
};

window.addEventListener("load", () => {
  populateCurrencyOptions();
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

exchangeIcon.addEventListener("click", swapCurrencies);
