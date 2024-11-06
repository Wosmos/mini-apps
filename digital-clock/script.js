function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const meridiem = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;

  // Update hours
  document.querySelector('.hours').children[0].textContent = Math.floor(
    hours / 10
  );
  document.querySelector('.hours').children[1].textContent = hours % 10;

  // Update minutes
  document.querySelector('.minutes').children[0].textContent = Math.floor(
    minutes / 10
  );
  document.querySelector('.minutes').children[1].textContent = minutes % 10;

  // Update seconds
  document.querySelector('.seconds').children[0].textContent = Math.floor(
    seconds / 10
  );
  document.querySelector('.seconds').children[1].textContent = seconds % 10;

  // Update meridiem
  document.querySelector('.meridiem').textContent = meridiem;

  // Update date
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const dateString = now.toLocaleDateString(undefined, options);
  document.querySelector('.date-display').textContent = dateString;
}

// Update immediately and then every second
updateClock();
setInterval(updateClock, 1000);

// Add animation class to digits on change
const digits = document.querySelectorAll('.digit');
digits.forEach((digit) => {
  let lastValue = digit.textContent;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        if (digit.textContent !== lastValue) {
          digit.style.animation = 'none';
          digit.offsetHeight; // Trigger reflow
          digit.style.animation = null;
          lastValue = digit.textContent;
        }
      }
    });
  });
  observer.observe(digit, {
    characterData: true,
    childList: true,
    subtree: true,
  });
});
