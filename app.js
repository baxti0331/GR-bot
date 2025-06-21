// === Инициализация данных и элементов ===
let balance = Number(localStorage.getItem('balance')) || 100;
let giftsOwned = JSON.parse(localStorage.getItem('giftsOwned')) || [];

const gifts = [
  { id: 'gift-stars', name: 'Подарок со звёздами', price: 15, icon: 'https://img.icons8.com/emoji/48/gift-emoji.png', description: 'Веселый подарок со звёздами.' },
  { id: 'gift-bronze', name: 'Бронзовый подарок', price: 25, icon: 'https://img.icons8.com/color/48/gift.png', description: 'Красивый бронзовый подарок.' },
  { id: 'gift-silver', name: 'Серебряный подарок', price: 50, icon: 'https://img.icons8.com/office/48/gift.png', description: 'Элегантный серебряный подарок.' },
  { id: 'gift-gold', name: 'Золотой подарок', price: 100, icon: 'https://img.icons8.com/fluency/48/gift.png', description: 'Роскошный золотой подарок.' },
  { id: 'gift-super', name: 'Супер-подарок', price: 150, icon: 'https://img.icons8.com/external-flat-juicy-fish/48/external-gift-valentines-flat-flat-juicy-fish.png', description: 'Самый ценный подарок!' },
];

// DOM-элементы
const balanceElem = document.getElementById('balance');
const shopSection = document.getElementById('content-shop');
const giftsSection = document.getElementById('content-gifts');

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalCloseBtn = document.getElementById('modal-close');

const tabShop = document.getElementById('tab-shop');
const tabGifts = document.getElementById('tab-gifts');
const contentShop = document.getElementById('content-shop');
const contentGifts = document.getElementById('content-gifts');

// === Функции логики ===

// Обновить баланс и сохранить
function updateBalance() {
  balanceElem.textContent = `${balance} ⭐`;
  balanceElem.classList.add('animate-pulse');
  setTimeout(() => balanceElem.classList.remove('animate-pulse'), 600);
  localStorage.setItem('balance', balance);
}

// Отрисовать магазин
function renderShop() {
  shopSection.innerHTML = '';
  gifts.forEach(gift => {
    const card = document.createElement('div');
    card.className = 'gift-card bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow select-none focus:outline-none';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${gift.name}, цена ${gift.price} звезд`);
    card.innerHTML = `
      <img src="${gift.icon}" alt="Иконка ${gift.name}" class="mx-auto mb-2 w-12 h-12" />
      <h3 class="font-medium text-lg mb-1">${gift.name}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${gift.description}</p>
      <p class="text-purple-700 font-semibold text-xl">${gift.price} ⭐</p>
    `;
    card.onclick = () => openGift(gift);
    card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') openGift(gift); };
    shopSection.appendChild(card);
  });
}

// Отрисовать купленные подарки
function renderGiftsOwned() {
  giftsSection.innerHTML = '';
  if (!giftsOwned.length) {
    giftsSection.innerHTML = `
      <p class="mb-4 text-xl font-medium">Здесь пока нет подарков 🎁</p>
      <img src="https://img.icons8.com/ios/100/8b5cf6/gift--v1.png" alt="Подарок" class="opacity-50 mx-auto" />
    `;
    return;
  }
  const list = document.createElement('ul');
  list.className = 'space-y-4 text-left';
  giftsOwned.forEach(gift => {
    const item = document.createElement('li');
    item.className = 'flex items-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow';
    item.innerHTML = `
      <img src="${gift.icon}" alt="${gift.name}" class="w-10 h-10 mr-4" />
      <div>
        <p class="font-medium">${gift.name}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">${gift.description}</p>
      </div>
    `;
    list.appendChild(item);
  });
  giftsSection.appendChild(list);
}

// Купить подарок (логика)
function openGift(gift) {
  if (balance < gift.price) {
    showModal('💔 Недостаточно звёзд', `У тебя всего ${balance} ⭐\nНе хватает до ${gift.price}.`);
    return;
  }

  balance -= gift.price;
  updateBalance();

  giftsOwned.push(gift);
  localStorage.setItem('giftsOwned', JSON.stringify(giftsOwned));
  renderGiftsOwned();

  const prizes = ["🎉 У тебя появилось +10 ⭐!", "🎁 Дополнительный подарочек!", "✨ Красивый стикер!", "🌟 Подписка 1 мес!"];
  const result = prizes[Math.floor(Math.random() * prizes.length)];

  showModal('Вы купили: ' + gift.name, result);
}

// Показать модалку
function showModal(title, text) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.classList.remove('hidden');
  setTimeout(() => {
    modalContent.classList.remove('opacity-0', 'scale-90');
    modalContent.classList.add('opacity-100', 'scale-100');
  }, 10);
}

// Закрыть модалку
function closeModal() {
  modalContent.classList.remove('opacity-100', 'scale-100');
  modalContent.classList.add('opacity-0', 'scale-90');
  setTimeout(() => modal.classList.add('hidden'), 250);
}

// Логика табов
function activateTab(tabBtn, contentPanel) {
  [tabShop, tabGifts].forEach(el => {
    el.classList.remove('active-tab');
    el.setAttribute('aria-selected', 'false');
    el.tabIndex = -1;
  });
  [contentShop, contentGifts].forEach(sec => {
    sec.hidden = true;
  });

  tabBtn.classList.add('active-tab');
  tabBtn.setAttribute('aria-selected', 'true');
  tabBtn.tabIndex = 0;
  contentPanel.hidden = false;
}

tabShop.addEventListener('click', () => activateTab(tabShop, contentShop));
tabGifts.addEventListener('click', () => activateTab(tabGifts, contentGifts));

// Закрытие модалки при клике вне и ESC
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
modalCloseBtn.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

// === Инициализация ===
function init() {
  updateBalance();
  renderShop();
  renderGiftsOwned();
}

init();
