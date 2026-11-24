(() => {
  const weekLabel = document.querySelector('#week-label');
  const weekStrip = document.querySelector('#week-strip');
  const selectedDateKicker = document.querySelector('#selected-date-kicker');
  const previousWeekButton = document.querySelector('#previous-week');
  const nextWeekButton = document.querySelector('#next-week');
  const todayButton = document.querySelector('#today-button');

  const weekdayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const fullDateFormatter = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const monthFormatter = new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' });
  const rangeFormatter = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short' });

  let weekStart = getMonday(new Date());
  let selectedDate = new Date();
  selectedDate.setHours(0, 0, 0, 0);

  function getMonday(date) {
    const monday = new Date(date);
    monday.setHours(0, 0, 0, 0);
    const daysSinceMonday = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - daysSinceMonday);
    return monday;
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function sameDate(first, second) {
    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth()
      && first.getDate() === second.getDate();
  }

  function formatRange(start, end) {
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      const monthYear = monthFormatter.format(start);
      return `${start.getDate()} – ${end.getDate()} ${monthYear}`;
    }
    return `${rangeFormatter.format(start)} – ${rangeFormatter.format(end)} ${end.getFullYear()}`;
  }

  function render() {
    const weekEnd = addDays(weekStart, 6);
    weekLabel.textContent = formatRange(weekStart, weekEnd);
    selectedDateKicker.textContent = fullDateFormatter.format(selectedDate).toLocaleUpperCase('vi-VN');
    weekStrip.replaceChildren();

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = addDays(weekStart, dayIndex);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'day-button';
      button.setAttribute('aria-pressed', String(sameDate(date, selectedDate)));
      button.setAttribute('aria-label', fullDateFormatter.format(date));
      if (sameDate(date, new Date())) button.classList.add('is-today');

      const weekday = document.createElement('span');
      weekday.className = 'weekday';
      weekday.textContent = weekdayNames[dayIndex];
      const number = document.createElement('span');
      number.className = 'day-number';
      number.textContent = String(date.getDate());
      button.append(weekday, number);

      if (sameDate(date, new Date())) {
        const todayTag = document.createElement('span');
        todayTag.className = 'today-tag';
        todayTag.textContent = 'TODAY';
        todayTag.setAttribute('aria-hidden', 'true');
        button.append(todayTag);
      }

      button.addEventListener('click', () => {
        selectedDate = date;
        render();
      });
      weekStrip.append(button);
    }
  }

  function moveWeek(offset) {
    const weekdayOffset = (selectedDate.getDay() + 6) % 7;
    weekStart = addDays(weekStart, offset * 7);
    selectedDate = addDays(weekStart, weekdayOffset);
    render();
  }

  previousWeekButton.addEventListener('click', () => moveWeek(-1));
  nextWeekButton.addEventListener('click', () => moveWeek(1));
  todayButton.addEventListener('click', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    weekStart = getMonday(today);
    selectedDate = today;
    render();
  });

  render();
})();
