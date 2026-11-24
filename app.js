(() => {
  const storageKey = 'cozy-planner-v1';
  const weekLabel = document.querySelector('#week-label');
  const weekStrip = document.querySelector('#week-strip');
  const selectedDateKicker = document.querySelector('#selected-date-kicker');
  const taskList = document.querySelector('#task-list');
  const taskForm = document.querySelector('#task-form');
  const taskTitleInput = document.querySelector('#task-title');
  const taskTimeInput = document.querySelector('#task-time');
  const formError = document.querySelector('#form-error');
  const storageStatus = document.querySelector('#storage-status');
  const previousWeekButton = document.querySelector('#previous-week');
  const nextWeekButton = document.querySelector('#next-week');
  const todayButton = document.querySelector('#today-button');

  const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
  const rangeFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' });

  let weekStart = getMonday(new Date());
  let selectedDate = startOfDay(new Date());
  let tasks = loadTasks();

  function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  function getMonday(date) {
    const monday = startOfDay(date);
    const daysSinceMonday = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - daysSinceMonday);
    return monday;
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  function isValidDateKey(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  function isValidTask(task) {
    return task && typeof task === 'object'
      && typeof task.id === 'string' && task.id.length > 0
      && typeof task.title === 'string' && task.title.trim().length > 0
      && isValidDateKey(task.date)
      && typeof task.time === 'string' && (task.time === '' || /^([01]\d|2[0-3]):[0-5]\d$/.test(task.time))
      && typeof task.completed === 'boolean'
      && typeof task.createdAt === 'string' && !Number.isNaN(Date.parse(task.createdAt));
  }

  function setStorageStatus(message) {
    storageStatus.textContent = message;
    storageStatus.hidden = !message;
  }

  function loadTasks() {
    try {
      const savedValue = window.localStorage.getItem(storageKey);
      if (savedValue === null) return [];
      const parsed = JSON.parse(savedValue);
      if (!Array.isArray(parsed) || !parsed.every(isValidTask)) {
        setStorageStatus('Saved planner data could not be read. You can keep using the planner; new changes will be saved when possible.');
        return [];
      }
      return parsed.map((task) => ({ ...task, title: task.title.trim() }));
    } catch (error) {
      setStorageStatus('Local storage is unavailable or unreadable. You can keep using the planner for now.');
      return [];
    }
  }

  function saveTasks() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(tasks));
      setStorageStatus('');
    } catch (error) {
      setStorageStatus('Could not save changes in this browser. Your current tasks remain available until you close or reload this page.');
    }
  }

  function getSelectedDayTasks() {
    return tasks
      .filter((task) => task.date === toDateKey(selectedDate))
      .sort((first, second) => {
        if (first.time && second.time) return first.time.localeCompare(second.time) || first.createdAt.localeCompare(second.createdAt);
        if (first.time) return -1;
        if (second.time) return 1;
        return first.createdAt.localeCompare(second.createdAt);
      });
  }

  function renderTasks() {
    taskList.replaceChildren();
    const selectedDayTasks = getSelectedDayTasks();
    if (selectedDayTasks.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'Nothing planned for this day yet. Add a little task below when you are ready.';
      taskList.append(emptyState);
      return;
    }

    for (const task of selectedDayTasks) {
      const item = document.createElement('div');
      item.className = task.completed ? 'task-item is-completed' : 'task-item';
      item.setAttribute('role', 'listitem');
      const completionButton = document.createElement('button');
      completionButton.type = 'button';
      completionButton.className = 'completion-toggle';
      completionButton.setAttribute('aria-pressed', String(task.completed));
      completionButton.setAttribute('aria-label', task.completed ? `Mark ${task.title} as not completed` : `Mark ${task.title} as completed`);
      completionButton.title = task.completed ? 'Mark as not completed' : 'Mark as completed';
      completionButton.textContent = task.completed ? 'x' : '';
      completionButton.addEventListener('click', () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      });

      const time = document.createElement('time');
      time.className = task.time ? 'task-time' : 'task-time is-unscheduled';
      if (task.time) {
        time.dateTime = task.time;
        time.textContent = task.time;
      } else {
        time.textContent = 'Anytime';
      }
      const title = document.createElement('span');
      title.className = 'task-title';
      title.textContent = task.title;

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'delete-task-button';
      deleteButton.textContent = 'x';
      deleteButton.setAttribute('aria-label', `Delete task: ${task.title}`);
      deleteButton.title = 'Delete task';
      deleteButton.addEventListener('click', () => {
        tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
        saveTasks();
        renderTasks();
        taskTitleInput.focus();
      });

      item.append(completionButton, time, title, deleteButton);
      taskList.append(item);
    }
  }

  function render() {
    const weekEnd = addDays(weekStart, 6);
    weekLabel.textContent = formatRange(weekStart, weekEnd);
    selectedDateKicker.textContent = fullDateFormatter.format(selectedDate).toLocaleUpperCase('en-US');
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
        formError.hidden = true;
        render();
      });
      weekStrip.append(button);
    }
    renderTasks();
  }

  function moveWeek(offset) {
    const weekdayOffset = (selectedDate.getDay() + 6) % 7;
    weekStart = addDays(weekStart, offset * 7);
    selectedDate = addDays(weekStart, weekdayOffset);
    render();
  }

  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = taskTitleInput.value.trim();
    if (!title) {
      formError.textContent = 'Please enter a task title.';
      formError.hidden = false;
      taskTitleInput.focus();
      return;
    }

    tasks.push({
      id: createTaskId(),
      title,
      date: toDateKey(selectedDate),
      time: taskTimeInput.value,
      completed: false,
      createdAt: new Date().toISOString()
    });
    saveTasks();
    taskForm.reset();
    formError.hidden = true;
    renderTasks();
    taskTitleInput.focus();
  });

  function createTaskId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  previousWeekButton.addEventListener('click', () => moveWeek(-1));
  nextWeekButton.addEventListener('click', () => moveWeek(1));
  todayButton.addEventListener('click', () => {
    const today = startOfDay(new Date());
    weekStart = getMonday(today);
    selectedDate = today;
    render();
  });

  render();
})();
