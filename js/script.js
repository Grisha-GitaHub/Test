'use strict';

// === Аутентификация через Cookies ===

// Установить cookie
function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

// Получить cookie
function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Удалить cookie
function deleteCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Проверка авторизации
function isLoggedIn() {
  return getCookie('user_email') !== null;
}

// Получить текущего пользователя
function getCurrentUser() {
  const email = getCookie('user_email');
  const name = getCookie('user_name');
  return email ? { email, name: name || email.split('@')[0] } : null;
}

// Выход
function logout() {
  deleteCookie('user_email');
  deleteCookie('user_name');
  window.location.href = 'form-authorization.html';
}

// Регистрация пользователя
function register(email, password) {
  // Проверяем, есть ли уже такой пользователь
  const users = getUsers();
  if (users[email]) {
    return { success: false, message: 'Пользователь с таким e-mail уже существует' };
  }
  
  // Сохраняем пользователя
  users[email] = { password, name: email.split('@')[0] };
  localStorage.setItem('users', JSON.stringify(users));
  
  // Автоматически авторизуем
  setCookie('user_email', email, 7);
  setCookie('user_name', users[email].name, 7);
  
  return { success: true };
}

// Авторизация пользователя
function login(email, password) {
  const users = getUsers();
  
  if (!users[email]) {
    return { success: false, message: 'Пользователь не найден' };
  }
  
  if (users[email].password !== password) {
    return { success: false, message: 'Неверный пароль' };
  }
  
  setCookie('user_email', email, 7);
  setCookie('user_name', users[email].name, 7);
  
  return { success: true };
}

// Получить всех пользователей из localStorage
function getUsers() {
  const usersStr = localStorage.getItem('users');
  return usersStr ? JSON.parse(usersStr) : {};
}

// === Обработка форм ===

// Обработка формы регистрации
const registerForm = document.querySelector('.form[action="index.html"]');
if (registerForm && window.location.pathname.includes('register.html')) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('[name="email"]').value.trim();
    const password = this.querySelector('[name="password"]').value;
    
    if (!email || !password) {
      alert('Заполните все поля');
      return;
    }
    
    const result = register(email, password);
    
    if (result.success) {
      window.location.href = 'index.html';
    } else {
      alert(result.message);
    }
  });
}

// Обработка формы авторизации
const authForm = document.querySelector('.form[action="index.html"]');
if (authForm && window.location.pathname.includes('form-authorization.html')) {
  authForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('[name="email"]').value.trim();
    const password = this.querySelector('[name="password"]').value;
    
    if (!email || !password) {
      alert('Заполните все поля');
      return;
    }
    
    const result = login(email, password);
    
    if (result.success) {
      window.location.href = 'index.html';
    } else {
      alert(result.message);
    }
  });
}

// === Обновление интерфейса ===

// Обновление шапки на index.html
function updateHeader() {
  const userMenu = document.querySelector('.user-menu');
  const sideItem = document.querySelector('.main-header__side-item.button--transparent');
  
  if (isLoggedIn()) {
    const user = getCurrentUser();
    
    // Если на главной странице - показываем меню пользователя
    if (userMenu) {
      const nameElement = userMenu.querySelector('p');
      if (nameElement && user.name) {
        nameElement.textContent = user.name;
      }
      
      // Удаляем старые обработчики и добавляем новый
      const logoutLink = userMenu.querySelector('a');
      if (logoutLink) {
        logoutLink.onclick = function(e) {
          e.preventDefault();
          logout();
        };
      }
    }
    
    // Скрываем кнопку "Войти" если она есть
    if (sideItem && sideItem.textContent === 'Войти') {
      sideItem.style.display = 'none';
    }
  } else {
    // Если не авторизован - скрываем меню пользователя
    if (userMenu) {
      userMenu.style.display = 'none';
    }
  }
}

// Запускаем обновление при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  updateHeader();
});

// Перенаправление если не авторизован
function requireAuth() {
  if (!isLoggedIn() && !window.location.pathname.includes('register.html') && !window.location.pathname.includes('form-authorization.html')) {
    window.location.href = 'form-authorization.html';
  }
}

// Проверяем авторизацию на защищенных страницах
if (!window.location.pathname.includes('register.html') && !window.location.pathname.includes('form-authorization.html')) {
  // Можно включить requireAuth() если нужна защита страниц
}

var $checkbox = document.getElementsByClassName('show_completed');

if ($checkbox.length) {
  $checkbox[0].addEventListener('change', function (event) {
    var is_checked = +event.target.checked;

    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set('show_completed', is_checked);

    window.location = '/index.php?' + searchParams.toString();
  });
}

var $taskCheckboxes = document.getElementsByClassName('tasks');

if ($taskCheckboxes.length) {

  $taskCheckboxes[0].addEventListener('change', function (event) {
    if (event.target.classList.contains('task__checkbox')) {
      var el = event.target;

      var is_checked = +el.checked;
      var task_id = el.getAttribute('value');

      var url = '/index.php?task_id=' + task_id + '&check=' + is_checked;
      window.location = url;
    }
  });
}

flatpickr('#date', {
  enableTime: false,
  dateFormat: "Y-m-d",
  locale: "ru"
});
