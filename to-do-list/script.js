document.addEventListener('DOMContentLoaded', () => {
  const todoInput = document.getElementById('todoInput');
  const addBtn = document.getElementById('addBtn');
  const todoList = document.querySelector('.todo-list');
  const emptyState = document.querySelector('.empty-state');

  // Load todos from localStorage
  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  function updateLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function renderTodos() {
    if (todos.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }

    todoList.innerHTML =
      todos.length === 0
        ? emptyState.outerHTML
        : todos
            .map(
              (todo, index) => `
            <li class="todo-item ${
              todo.completed ? 'completed' : ''
            }" data-index="${index}">
              <input type="checkbox" class="checkbox" ${
                todo.completed ? 'checked' : ''
              }>
              <span class="todo-text">${todo.text}</span>
              <button class="delete-btn">Delete</button>
            </li>
          `
            )
            .join('');
  }

  function addTodo(text) {
    if (text.trim()) {
      todos.push({ text, completed: false });
      updateLocalStorage();
      renderTodos();
      todoInput.value = '';
    }
  }

  function deleteTodo(index) {
    const todoItem = document.querySelector(`[data-index="${index}"]`);
    todoItem.classList.add('removing');

    todoItem.addEventListener('animationend', () => {
      todos.splice(index, 1);
      updateLocalStorage();
      renderTodos();
    });
  }

  function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    updateLocalStorage();
    renderTodos();
  }

  // Event Listeners
  addBtn.addEventListener('click', () => addTodo(todoInput.value));

  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo(todoInput.value);
    }
  });

  todoList.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;

    const index = parseInt(todoItem.dataset.index);

    if (e.target.classList.contains('delete-btn')) {
      deleteTodo(index);
    } else if (e.target.classList.contains('checkbox')) {
      toggleTodo(index);
    }
  });

  // Initial render
  renderTodos();
});
