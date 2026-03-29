const salaryInput = document.getElementById("salary");
const rateFederal = document.getElementById("rateFederal");
const rateState = document.getElementById("rateState");
const rateSS = document.getElementById("rateSS");
const rateMedicare = document.getElementById("rateMedicare");
const calculateButton = document.getElementById("calculate");

const takeHomeEl = document.getElementById("takeHome");
const federalTaxEl = document.getElementById("federalTax");
const stateTaxEl = document.getElementById("stateTax");
const ssTaxEl = document.getElementById("ssTax");
const medicareTaxEl = document.getElementById("medicareTax");
const totalTaxEl = document.getElementById("totalTax");
const netAnnualEl = document.getElementById("netAnnual");
const netMonthlyEl = document.getElementById("netMonthly");
const effectiveRateEl = document.getElementById("effectiveRate");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function parseNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Math.max(0, value));
}

function calculate() {
  const salary = parseNumber(salaryInput.value);

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
}

calculateButton.addEventListener("click", calculate);
[salaryInput, rateFederal, rateState, rateSS, rateMedicare].forEach((input) => {
  input.addEventListener("input", calculate);
});

calculate();

