// Component-based architecture
class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    return '';
  }
}

class ProjectCard extends Component {
  render() {
    const {
      title,
      description,
      icon,
      category,
      link,
      difficulty,
      timeToComplete,
    } = this.props;
    return `
     <div class="project-card" data-category="${category}">
                        <i class="project-icon ${icon}"></i>
                        <h2 class="project-title">${title}</h2>
                        <p class="project-description">${description}</p>
                        <a href="${link}" class="project-link">
                            Try it out
                            <i class="fas fa-arrow-right"></i>
                        </a>
                        <div class="project-stats">
                            <span class="stat">
                                <i class="fas fa-signal"></i>
                                ${difficulty}
                            </span>
                            <span class="stat">
                                <i class="fas fa-clock"></i>
                                ${timeToComplete}
                            </span>
                        </div>
                    </div>
                `;
  }
}

// ProjectsGrid Component
class ProjectsGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [
        {
          title: 'Calculator',
          description:
            'A sleek calculator with advanced operations and calculation history.',
          icon: 'fas fa-calculator',
          category: 'tools',
          link: 'calculator/index.html',
          difficulty: 'Beginner',
          timeToComplete: '~2 hours',
        },
        {
          title: 'Todo List',
          description:
            'Feature-rich task manager with categories and priority levels.',
          icon: 'fas fa-list-check',
          category: 'apps',
          link: 'to-do-list/index.html',
          difficulty: 'Intermediate',
          timeToComplete: '~3 hours',
        },
        {
          title: 'Digital Clock',
          description:
            'Multi-functional clock with timer, stopwatch, and world time zones.',
          icon: 'fas fa-clock',
          category: 'tools',
          link: 'digital-clock/index.html',
          difficulty: 'Beginner',
          timeToComplete: '~2 hours',
        },
        {
          title: 'Weather App',
          description:
            'Real-time weather updates with detailed forecasts and beautiful animations.',
          icon: 'fas fa-cloud-sun',
          category: 'apps',
          link: 'weather-app/index.html',
          difficulty: 'Intermediate',
          timeToComplete: '~4 hours',
        },
        {
          title: 'Form Validator',
          description:
            'Advanced form validation with real-time feedback and password strength meter.',
          icon: 'fas fa-check-circle',
          category: 'tools',
          link: 'form-validator/index.html',
          difficulty: 'Intermediate',
          timeToComplete: '~3 hours',
        },
        {
          title: 'Memory Game',
          description:
            'Test your memory with this beautifully animated card matching game.',
          icon: 'fas fa-gamepad',
          category: 'games',
          link: 'memory-card-game/index.html',
          difficulty: 'Intermediate',
          timeToComplete: '~4 hours',
        },
        // {
        //   title: 'Quiz App',
        //   description:
        //     'Interactive quiz platform with multiple categories and difficulty levels.',
        //   icon: 'fas fa-question-circle',
        //   category: 'games',
        //   link: 'quiz-app/index.html',
        //   difficulty: 'Advanced',
        //   timeToComplete: '~5 hours',
        // },
        // {
        //   title: 'Color Palette',
        //   description:
        //     'Generate and explore beautiful color combinations with export options.',
        //   icon: 'fas fa-palette',
        //   category: 'tools',
        //   link: 'colors.html',
        //   difficulty: 'Intermediate',
        //   timeToComplete: '~3 hours',
        // },
        // {
        //   title: 'Notes App',
        //   description:
        //     'Rich text editor with tags, categories, and cloud sync capabilities.',
        //   icon: 'fas fa-sticky-note',
        //   category: 'apps',
        //   link: 'notes.html',
        //   difficulty: 'Advanced',
        //   timeToComplete: '~6 hours',
        // },
        // {
        //   title: 'Image Gallery',
        //   description:
        //     'Dynamic image gallery with filters, search, and lightbox preview.',
        //   icon: 'fas fa-images',
        //   category: 'apps',
        //   link: 'gallery.html',
        //   difficulty: 'Advanced',
        //   timeToComplete: '~5 hours',
        // },
      ],
      filter: 'all',
      searchQuery: '',
    };
  }

  filterProjects() {
    return this.state.projects.filter((project) => {
      const matchesFilter =
        this.state.filter === 'all' || project.category === this.state.filter;
      const matchesSearch =
        project.title
          .toLowerCase()
          .includes(this.state.searchQuery.toLowerCase()) ||
        project.description
          .toLowerCase()
          .includes(this.state.searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  render() {
    const filteredProjects = this.filterProjects();
    const grid = document.querySelector('.projects-grid');
    grid.innerHTML = '';

    filteredProjects.forEach((project, index) => {
      const card = new ProjectCard(project);
      const div = document.createElement('div');
      div.innerHTML = card.render();
      div.style.opacity = '0';
      div.style.transform = 'translateY(20px)';
      grid.appendChild(div.firstElementChild);

      // Staggered animation
      setTimeout(() => {
        const element = grid.children[index];
        element.style.transition = 'all 0.5s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
}

// Initialize components and add event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Remove loading overlay
  setTimeout(() => {
    const loader = document.querySelector('.loading-overlay');
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 1000);

  // Initialize projects grid
  const projectsGrid = new ProjectsGrid();
  projectsGrid.render();

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  themeToggle.addEventListener('click', () => {
    document.body.dataset.theme =
      document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
  });

  // Filter buttons

  // Search functionality
  const searchInput = document.querySelector('.search-input');
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      projectsGrid.setState({ searchQuery: e.target.value });
    }, 300);
  });

  // Navbar scroll effect
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });

  // Add hover effect to project cards
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        const xPercent = (x / rect.width - 0.5) * 20;
        const yPercent = (y / rect.height - 0.5) * 20;
        card.style.transform = `perspective(1000px) rotateY(${xPercent}deg) rotateX(${-yPercent}deg) translateZ(10px)`;
      } else {
        card.style.transform = 'none';
      }
    });
  });
});
