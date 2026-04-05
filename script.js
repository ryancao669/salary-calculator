const salaryInput = document.getElementById("salary");
const hourlyRateInput = document.getElementById("hourlyRate");
const hoursPerWeekInput = document.getElementById("hoursPerWeek");
const weeksPerYearInput = document.getElementById("weeksPerYear");
const annualGroup = document.getElementById("annualGroup");
const hourlyGroup = document.getElementById("hourlyGroup");
const annualizedNote = document.getElementById("annualizedNote");
const modeButtons = document.querySelectorAll(".chip");
const calculateButton = document.getElementById("calculate");

const rateFederal = document.getElementById("rateFederal");
const rateState = document.getElementById("rateState");
const rateSS = document.getElementById("rateSS");
const rateMedicare = document.getElementById("rateMedicare");

const takeHomeEl = document.getElementById("takeHome");
const federalTaxEl = document.getElementById("federalTax");
const stateTaxEl = document.getElementById("stateTax");
const ssTaxEl = document.getElementById("ssTax");
const medicareTaxEl = document.getElementById("medicareTax");
const totalTaxEl = document.getElementById("totalTax");
const netAnnualEl = document.getElementById("netAnnual");
const netMonthlyEl = document.getElementById("netMonthly");
const effectiveRateEl = document.getElementById("effectiveRate");

const barFederal = document.getElementById("barFederal");
const barState = document.getElementById("barState");
const barSS = document.getElementById("barSS");
const barMedicare = document.getElementById("barMedicare");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

let mode = "annual";

function parseNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Math.max(0, value));
}

function setBarWidths(taxes, totalTax) {
  if (totalTax <= 0) {
    barFederal.style.width = "0%";
    barState.style.width = "0%";
    barSS.style.width = "0%";
    barMedicare.style.width = "0%";
    return;
  }

  barFederal.style.width = `${(taxes.federal / totalTax) * 100}%`;
  barState.style.width = `${(taxes.state / totalTax) * 100}%`;
  barSS.style.width = `${(taxes.ss / totalTax) * 100}%`;
  barMedicare.style.width = `${(taxes.medicare / totalTax) * 100}%`;
}

function getAnnualSalary() {
  if (mode === "annual") {
    return parseNumber(salaryInput.value);
  }

  const hourly = parseNumber(hourlyRateInput.value);
  const hours = parseNumber(hoursPerWeekInput.value);
  const weeks = parseNumber(weeksPerYearInput.value);
  const annualized = hourly * hours * weeks;
  annualizedNote.textContent = `Annualized salary: ${formatCurrency(annualized)}`;
  return annualized;
}

function calculate() {
  const salary = getAnnualSalary();

  const rates = {
    federal: parseNumber(rateFederal.value) / 100,
    state: parseNumber(rateState.value) / 100,
    ss: parseNumber(rateSS.value) / 100,
    medicare: parseNumber(rateMedicare.value) / 100,
  };

  const taxes = {
    federal: salary * rates.federal,
    state: salary * rates.state,
    ss: salary * rates.ss,
    medicare: salary * rates.medicare,
  };

  const totalTax = taxes.federal + taxes.state + taxes.ss + taxes.medicare;
  const takeHome = Math.max(0, salary - totalTax);
  const monthly = takeHome / 12;
  const effectiveRate = salary > 0 ? (totalTax / salary) * 100 : 0;

  takeHomeEl.textContent = formatCurrency(takeHome);
  federalTaxEl.textContent = formatCurrency(taxes.federal);
  stateTaxEl.textContent = formatCurrency(taxes.state);
  ssTaxEl.textContent = formatCurrency(taxes.ss);
  medicareTaxEl.textContent = formatCurrency(taxes.medicare);
  totalTaxEl.textContent = formatCurrency(totalTax);
  netAnnualEl.textContent = formatCurrency(takeHome);
  netMonthlyEl.textContent = formatCurrency(monthly);
  effectiveRateEl.textContent = `${effectiveRate.toFixed(1)}%`;

  setBarWidths(taxes, totalTax);
}

function setMode(nextMode) {
  mode = nextMode;
  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });

  if (mode === "annual") {
    annualGroup.classList.remove("hidden");
    hourlyGroup.classList.add("hidden");
  } else {
    hourlyGroup.classList.remove("hidden");
    annualGroup.classList.add("hidden");
  }

  calculate();
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

[
  salaryInput,
  hourlyRateInput,
  hoursPerWeekInput,
  weeksPerYearInput,
  rateFederal,
  rateState,
  rateSS,
  rateMedicare,
].forEach((input) => {
  input.addEventListener("input", calculate);
});

calculateButton.addEventListener("click", calculate);

setMode("annual");
calculate();
