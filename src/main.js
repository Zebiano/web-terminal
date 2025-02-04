/* --- Variables --- */
let userInput, pwInput, terminalOutput, scrollingElement, pwLogin, pwTerminal, actualTerminal;
let requiresPassword = true // Change this to 'false' if no password is required, or change this dynamically to ask for password input
const password = 'pw'
const maxCommandHistory = 100
const commandHistory = ['']
let commandHistoryIndex = 0

// List of commands
const commands = {
  help: { text: `You don't need any help.` },
  clear: { command: () => { hideById(pwLogin); terminalOutput.innerHTML = '' } },
};

/* --- Functions --- */
// Check if password is correct
function checkPassword(input) {
  // Variables
  let output = `<div class="terminal-line"><span class="success">guest@enigma</span>'s password: ${input}</div>`;

  // Check password
  if (input !== password) {
    output += `<div class="terminal-line">Access denied.</div>`;
    terminalOutput.innerHTML = `${terminalOutput.innerHTML}<div class="terminal-line">${output}</div>`;
  } else {
    requiresPassword = false
    hideById(pwTerminal)
    showById(actualTerminal)
    output += `<div class="terminal-line">Welcome, guest!</div>`;
    terminalOutput.innerHTML = `${terminalOutput.innerHTML}<div class="terminal-line">${output}</div>`;
  }
}

// Execute command
function executeCommand(input) {
  // Variables
  input = input.toLowerCase();
  let output = `<div class="terminal-line"><span class="success">guest@enigma</span><span class="directory">:$ </span>${input}</div>`;

  // Check if command does not exist
  if (!commands.hasOwnProperty(input)) {
    output += `<div class="terminal-line">Command '${input}' not found.<span class="output"></span></div>`;
  } else {
    if (commands[input].hasOwnProperty('text')) output += `<div class="output">${commands[input].text}</div>`;
    else if (commands[input].hasOwnProperty('command')) {
      commands[input].command()
      return
    }
  }

  terminalOutput.innerHTML = `${terminalOutput.innerHTML}<div class="terminal-line">${output}</div>`;
};

// Scroll to the bottom of the terminal
function scrollToBottom() {
  scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

// Show an element by ID
function showById(element) {
  element.style.display = 'block'
}

// Hide an element by ID
function hideById(element) {
  element.style.display = 'none'
}

/* --- Listeners --- */
// Listen to backspace and arrow presses
document.addEventListener("keydown", (event) => {
  if (event.code === 'Backspace') {
    if (requiresPassword) pwInput.innerHTML = pwInput.innerHTML.slice(0, pwInput.innerHTML.length - 1)
    else userInput.innerHTML = userInput.innerHTML.slice(0, userInput.innerHTML.length - 1)
  } else if (event.code === 'ArrowUp') {
    if (commandHistoryIndex === commandHistory.length) commandHistoryIndex -= 2
    else if (commandHistoryIndex !== 0) commandHistoryIndex--
    userInput.innerHTML = commandHistory[commandHistoryIndex]
  } else if (event.code === 'ArrowDown') {
    if (commandHistoryIndex < commandHistory.length - 1) commandHistoryIndex++
    userInput.innerHTML = commandHistory[commandHistoryIndex]
  }
});

// Listen to key presses
document.addEventListener("keypress", (event) => {
  // Check if necessary to handle password logic
  if (requiresPassword) {
    const input = pwInput.innerHTML;
    if (event.key === "Enter") {
      checkPassword(input)
      pwInput.innerHTML = "";
    } else pwInput.innerHTML = input + event.key;
  } else {
    const input = userInput.innerHTML;
    if (event.key === "Enter") {
      // Check for empty input
      if (input.length === 0) return

      // Add to command history array
      if (commandHistory.length <= maxCommandHistory) {
        commandHistory.splice(commandHistory.length - 1, 0, input)
      } else {
        commandHistory.shift()
        commandHistory.push(input)
      }
      commandHistoryIndex = commandHistory.length

      // Execute command
      executeCommand(input)
      userInput.innerHTML = "";
    } else userInput.innerHTML = input + event.key;
  }

  scrollToBottom()
});

// Load terminal when DOM content is ready
document.addEventListener("DOMContentLoaded", () => {
  // Get by IDs
  userInput = document.getElementById("userInput");
  pwInput = document.getElementById("pwInput");
  terminalOutput = document.getElementById("terminalOutput");
  terminalOutput = document.getElementById("terminalOutput");
  pwLogin = document.getElementById("pwLogin");
  pwTerminal = document.getElementById("pwTerminal");
  actualTerminal = document.getElementById("actualTerminal");

  if (!requiresPassword) {
    hideById(pwLogin)
    hideById(pwTerminal)
    showById(actualTerminal)
  }

  // Other
  document.getElementById("dummyKeyboard").focus();
  scrollingElement = (document.scrollingElement || document.body);
});
