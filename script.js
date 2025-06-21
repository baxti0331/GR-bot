const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const scoreEl = document.getElementById('score');
const shopSection = document.getElementById('shopSection');
const toggleShopBtn = document.querySelector('.toggle-shop-btn');
const items = document.querySelectorAll('.item');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let score = Number(localStorage.getItem('score')) || 0;
let boughtItems = JSON.parse(localStorage.getItem('boughtItems')) || [];

function saveData() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('score', score);
  localStorage.setItem('boughtItems', JSON.stringify(boughtItems));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.setAttribute('aria-pressed', task.completed);

    const spanText = document.createElement('span');
    spanText.textContent = task.text;
    spanText.className = 'task-text';

    const stars = document.createElement('span');
    stars.className = 'stars';
    stars.textContent = '⭐'.repeat(task.completed ? 1 : 0);

    li.appendChild(spanText);
    li.appendChild(stars);

    li.addEventListener('click', () => toggleTask(idx));
    li.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTask(idx);
      }
    });

    taskList.appendChild(li);
  });
  scoreEl.textContent = score;
}

function toggleTask(index) {
  if (!tasks[index].completed) {
    tasks[index].completed = true;
    score += 1;
  } else {
    tasks[index].completed = false;
    score -= 1;
  }
  if(score < 0) score = 0;
  saveData();
  renderTasks();
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const newTask = taskInput.value.trim();
  if(newTask) {
    tasks.push({ text: newTask, completed: false });
    taskInput.value = '';
    saveData();
    renderTasks();
  }
});

// Магазин

function updateShop() {
  items.forEach(item => {
    const id = item.dataset.id;
    const cost = Number(item.dataset.cost);
    const isBought = boughtItems.includes(id);
    item.classList.toggle('bought', isBought);
    item.setAttribute('aria-pressed', isBought);
    item.style.pointerEvents = isBought ? 'none' : 'auto';
    item.querySelector('.cost').textContent = isBought ? 'Куплено' : `${cost} ⭐`;
  });
}

function buyItem(id, cost) {
  if (score >= cost && !boughtItems.includes(id)) {
    score -= cost;
    boughtItems.push(id);
    saveData();
    renderTasks();
    updateShop();
    alert(`Вы купили ${id}!`);
  } else if (boughtItems.includes(id)) {
    alert('Этот предмет уже куплен.');
  } else {
    alert('Недостаточно очков для покупки.');
  }
}

items.forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.id;
    const cost = Number(item.dataset.cost);
    buyItem(id, cost);
  });
  item.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const id = item.dataset.id;
      const cost = Number(item.dataset.cost);
      buyItem(id, cost);
    }
  });
});

toggleShopBtn.addEventListener('click', () => {
  const isHidden = shopSection.hasAttribute('hidden');
  if (isHidden) {
    shopSection.removeAttribute('hidden');
    toggleShopBtn.setAttribute('aria-expanded', 'true');
    toggleShopBtn.textContent = 'Закрыть магазин ❌';
  } else {
    shopSection.setAttribute('hidden', '');
    toggleShopBtn.setAttribute('aria-expanded', 'false');
    toggleShopBtn.textContent = 'Магазин 🎁';
  }
});

// Инициализация
function init() {
  renderTasks();
  updateShop();
}

init();
