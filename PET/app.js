document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("transition-screen").style.display = "none";
    document.getElementById("content-container").style.display = "flex";
  }, 2000); // 2 seconds delay for transition
});

function refreshPage() {
  location.reload();
}

function goToAddExpense() {
  window.open('add-expense.html', '_blank'); // Adjust to the actual path of your "Add Expense" page
}

// Initialize variables
let totalBudget = 0;
let remainingBudget = 0;
const expenses = [];
let alertThreshold = 0;

// Function to update the total budget
function updateBudget() {
  const budgetInput = document.getElementById('total-budget');
  totalBudget = parseFloat(budgetInput.value) || 0;
  remainingBudget = totalBudget - expenses.reduce((sum, expense) => sum + expense.amount, 0);
  updateUI();
}

// Function to add an expense
function addExpense() {
  const expenseNameInput = document.getElementById('expense-name');
  const expenseAmountInput = document.getElementById('expense-amount');

  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = parseFloat(expenseAmountInput.value);

  if (expenseName !== '' && !isNaN(expenseAmount) && expenseAmount > 0) {
    const expenseDate = new Date().toLocaleString('en-IN'); // Get the current date and time
    expenses.push({ name: expenseName, amount: expenseAmount, date: expenseDate });
    remainingBudget -= expenseAmount;
    updateUI();
    expenseNameInput.value = ''; // Reset input fields
    expenseAmountInput.value = '';

    // Check if remaining budget is below the alert threshold
    if (remainingBudget <= alertThreshold) {
      Swal.fire({
        title: 'Budget Alert',
        text: `Your remaining budget is below the set threshold of ₹${alertThreshold.toFixed(2)}.`,
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal-popup', // Add your custom class for styling
          title: 'swal-title',
          confirmButton: 'swal-button'
        }
      });
    }
  } else {
    Swal.fire({
      title: 'Error',
      text: 'Please enter both a valid item name and amount.',
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-button'
      }
    });
  }
}

// Function to set alert threshold
function setAlertThreshold() {
  const thresholdInput = document.getElementById('alert-threshold');
  alertThreshold = parseFloat(thresholdInput.value) || 0;
  Swal.fire({
    title: 'Alert threshold set',
    text: `Alert threshold set to ₹${alertThreshold.toFixed(2)}.`,
    icon: 'success',
    confirmButtonText: 'OK',
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
      confirmButton: 'swal-button'
    }
  });
}

// Function to update the UI
function updateUI() {
  // Update Remaining Budget
  const remainingBudgetElement = document.getElementById('remaining-budget');
  remainingBudgetElement.textContent = remainingBudget.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  // Update Expense List
  const expenseListElement = document.getElementById('expense-list');
  expenseListElement.innerHTML = expenses
    .map(
      (expense, index) => `
      <div class="expense-box" data-index="${index}">
        <span>${expense.name}</span>
        <span>${expense.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
        <span>${expense.date}</span>
        <button onclick="deleteExpense(${index})">Delete</button>
      </div>
    `
    )
    .join('');
}

// Function to delete an expense
function deleteExpense(index) {
  // Adjust remaining budget
  remainingBudget += expenses[index].amount;
  // Remove the expense from array
  expenses.splice(index, 1);
  updateUI();
}

// Initialize the UI
updateUI();
