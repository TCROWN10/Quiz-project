// Nav calculator functionality
const calculatorButton = document.getElementById("calculator-button");
const calculatorModal = document.getElementById("calculator-modal");
const display = document.getElementById("calculator-display");

let currentInput = "";

calculatorButton.addEventListener("click", () => {
  calculatorModal.classList.toggle("hidden");
});

document.querySelectorAll("#calculator-modal button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const value = e.target.textContent;

    if (value === "=") {
      try {
        display.value = eval(currentInput);
      } catch {
        display.value = "Error";
      }
      currentInput = "";
    } else if (value === "Del") {
      currentInput = "";
      display.value = "";
    } else {
      currentInput += value;
      display.value = currentInput;
    }
  });
});
