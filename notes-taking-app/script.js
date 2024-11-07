// State Management
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = null;
let currentCategory = 'all';
let currentSort = 'newest';
let searchTerm = '';

// DOM Elements
const noteModal = document.getElementById('noteModal');
const notesGrid = document.getElementById('notesGrid');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeSidebarBtn = document.getElementById('closeSidebar');
const newNoteBtn = document.getElementById('newNoteBtn');
const saveNoteBtn = document.getElementById('saveNote');
const deleteNoteBtn = document.getElementById('deleteNote');
const closeModalBtn = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');
const sortBtn = document.getElementById('sortBtn');
const themeToggle = document.getElementById('themeToggle');
const categoryBtns = document.querySelectorAll('.category-btn');
const tagsContainer = document.getElementById('tagsContainer');

// Initialize theme
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Event Listeners
menuBtn.addEventListener('click', toggleSidebar);
closeSidebarBtn.addEventListener('click', toggleSidebar);
newNoteBtn.addEventListener('click', openNewNoteModal);
saveNoteBtn.addEventListener('click', saveNote);
deleteNoteBtn.addEventListener('click', deleteNote);
closeModalBtn.addEventListener('click', closeNoteModal);
searchInput.addEventListener('input', handleSearch);
sortBtn.addEventListener('click', toggleSort);
themeToggle.addEventListener('click', toggleTheme);
categoryBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentCategory = btn.dataset.category;
    updateCategoryButtons();
    renderNotes();
  });
});

// Note Management Functions
function openNewNoteModal() {
  currentNoteId = null;
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('noteCategory').value = 'personal';
  document.getElementById('noteTags').value = '';
  document.getElementById('lastEdited').textContent = '';
  deleteNoteBtn.classList.add('hidden');
  noteModal.classList.remove('hidden');
  noteModal.classList.add('flex');
}

function openEditNoteModal(noteId) {
  const note = notes.find((n) => n.id === noteId);
  if (!note) return;

  currentNoteId = noteId;
  document.getElementById('noteTitle').value = note.title;
  document.getElementById('noteContent').value = note.content;
  document.getElementById('noteCategory').value = note.category;
  document.getElementById('noteTags').value = note.tags.join(', ');
  document.getElementById(
    'lastEdited'
  ).textContent = `Last edited: ${formatDate(note.lastEdited)}`;
  deleteNoteBtn.classList.remove('hidden');
  noteModal.classList.remove('hidden');
  noteModal.classList.add('flex');
}

function closeNoteModal() {
  noteModal.classList.remove('flex');
  noteModal.classList.add('hidden');
  currentNoteId = null;
}

function saveNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  const category = document.getElementById('noteCategory').value;
  const tags = document
    .getElementById('noteTags')
    .value.split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  if (!title || !content) {
    alert('Please fill in both title and content');
    return;
  }

  const timestamp = new Date().toISOString();
  const note = {
    id: currentNoteId || Date.now().toString(),
    title,
    content,
    category,
    tags,
    created: currentNoteId
      ? notes.find((n) => n.id === currentNoteId).created
      : timestamp,
    lastEdited: timestamp,
  };

  if (currentNoteId) {
    const index = notes.findIndex((n) => n.id === currentNoteId);
    notes[index] = note;
  } else {
    notes.unshift(note);
  }

  localStorage.setItem('notes', JSON.stringify(notes));
  closeNoteModal();
  renderNotes();
  updateTagsDisplay();
}

function deleteNote() {
  if (!currentNoteId) return;

  if (confirm('Are you sure you want to delete this note?')) {
    notes = notes.filter((note) => note.id !== currentNoteId);
    localStorage.setItem('notes', JSON.stringify(notes));
    closeNoteModal();
    renderNotes();
    updateTagsDisplay();
  }
}

// UI Functions
function toggleSidebar() {
  sidebar.classList.toggle('-translate-x-full');
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.theme = isDark ? 'dark' : 'light';
  themeToggle.innerHTML = isDark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

function toggleSort() {
  currentSort = currentSort === 'newest' ? 'oldest' : 'newest';
  sortBtn.innerHTML =
    currentSort === 'newest'
      ? '<i class="fas fa-sort-amount-down"></i>'
      : '<i class="fas fa-sort-amount-up"></i>';
  renderNotes();
}

function handleSearch(e) {
  searchTerm = e.target.value.toLowerCase();
  renderNotes();
}

function updateCategoryButtons() {
  categoryBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === currentCategory);
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getAllTags() {
  const tags = new Set();
  notes.forEach((note) => {
    note.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
}

function updateTagsDisplay() {
  const tags = getAllTags();
  tagsContainer.innerHTML = tags
    .map(
      (tag) => `
        <span class="tag cursor-pointer" onclick="filterByTag('${tag}')">
            ${tag}
        </span>
    `
    )
    .join('');
}

function filterByTag(tag) {
  searchTerm = tag;
  searchInput.value = tag;
  renderNotes();
}

function renderNotes() {
  let filteredNotes = notes;

  // Filter by category
  if (currentCategory !== 'all') {
    filteredNotes = filteredNotes.filter(
      (note) => note.category === currentCategory
    );
  }

  // Filter by search term
  if (searchTerm) {
    filteredNotes = filteredNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Sort notes
  filteredNotes.sort((a, b) => {
    const dateA = new Date(a.lastEdited);
    const dateB = new Date(b.lastEdited);
    return currentSort === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Render to DOM
  notesGrid.innerHTML = filteredNotes
    .map(
      (note) => `
        <div class="note-card shadow-md" onclick="openEditNoteModal('${
          note.id
        }')">
            <h3 class="text-lg font-semibold mb-2">${note.title}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">${
              note.content
            }</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${note.tags
                  .map(
                    (tag) => `
                    <span class="tag text-xs" onclick="event.stopPropagation(); filterByTag('${tag}')">
                        ${tag}
                    </span>
                `
                  )
                  .join('')}
            </div>
            <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>${note.category}</span>
                <span>${formatDate(note.lastEdited)}</span>
            </div>
        </div>
    `
    )
    .join('');
}

// Initialize the app
renderNotes();
updateTagsDisplay();
