/* ----------------------------------------------------
   GLOBAL STATE & GLASSWARE DEFINITIONS
   ---------------------------------------------------- */
const state = {
  cocktails: [],
  favorites: JSON.parse(localStorage.getItem('mixology_favorites')) || [],
  barIngredients: JSON.parse(localStorage.getItem('mixology_bar_ingredients')) || [],
  currentCocktail: null,
  servings: 1,
  activeView: 'explore',
  activeFilter: 'all',
  searchQuery: ''
};

// 16 Glassware styles coordinates, capacity, and rim anchor positions for garnishes
const glasswareSpecs = {
  'Martiniglas': {
    cavity: 'M 50 50 L 150 50 L 100 115 Z',
    body: 'M 46 48 L 154 48 L 100 118 Z M 100 118 L 100 175 M 65 175 L 135 175',
    highlight: 'M 52 52 L 98 105 L 94 105 L 48 52 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2,
    yMin: 50,
    yMax: 115,
    rimLeft: 50,
    rimRight: 150,
    rimY: 50
  },
  'Rocks-Glas': {
    cavity: 'M 62 60 L 138 60 L 134 150 L 66 150 Z',
    body: 'M 58 55 L 142 55 L 138 160 L 62 160 Z M 62 150 L 138 150 L 138 160 L 62 160 Z',
    highlight: 'M 65 65 L 72 65 L 75 145 L 68 145 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2.5,
    yMin: 60,
    yMax: 150,
    rimLeft: 62,
    rimRight: 138,
    rimY: 60
  },
  'Coupeglas': {
    cavity: 'M 50 60 C 50 115, 150 115, 150 60 Z',
    body: 'M 46 58 C 46 120, 154 120, 154 58 M 100 118 L 100 175 M 65 175 L 135 175',
    highlight: 'M 54 62 C 54 95, 78 112, 100 113 C 85 108, 65 92, 65 62 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2,
    yMin: 60,
    yMax: 115,
    rimLeft: 50,
    rimRight: 150,
    rimY: 60
  },
  'Highball-Glas': {
    cavity: 'M 68 45 L 132 45 L 130 155 L 70 155 Z',
    body: 'M 64 40 L 136 40 L 134 165 L 66 165 Z M 66 155 L 134 155 L 134 165 L 66 165 Z',
    highlight: 'M 71 50 L 78 50 L 80 150 L 73 150 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2.5,
    yMin: 45,
    yMax: 155,
    rimLeft: 68,
    rimRight: 132,
    rimY: 45
  },
  'Collins-Glas': {
    cavity: 'M 72 35 L 128 35 L 126 155 L 74 155 Z',
    body: 'M 68 30 L 132 30 L 130 165 L 70 165 Z M 70 155 L 130 155 L 130 165 L 70 165 Z',
    highlight: 'M 75 40 L 81 40 L 83 150 L 77 150 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2.5,
    yMin: 35,
    yMax: 155,
    rimLeft: 72,
    rimRight: 128,
    rimY: 35
  },
  'Hurricaneglas': {
    cavity: 'M 72 45 C 55 90, 50 110, 75 125 C 85 130, 115 130, 125 125 C 150 110, 145 90, 128 45 Z',
    body: 'M 68 42 C 50 88, 46 112, 73 128 C 83 133, 117 133, 127 128 C 154 112, 150 88, 132 42 Z M 100 130 L 100 165 M 75 165 L 125 165',
    highlight: 'M 76 50 C 65 88, 60 102, 80 118 C 73 110, 68 95, 76 50 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2,
    yMin: 45,
    yMax: 128,
    rimLeft: 72,
    rimRight: 128,
    rimY: 45
  },
  'Kupferbecher': {
    cavity: 'M 60 65 C 60 65, 55 145, 65 145 L 135 145 C 145 145, 140 65, 140 65 Z',
    body: 'M 56 60 C 56 60, 51 150, 65 150 L 135 150 C 149 150, 144 60, 144 60 Z M 58 75 C 30 75, 30 135, 58 135 C 40 135, 40 75, 58 75 Z',
    highlight: 'M 62 68 C 62 68, 57 142, 67 142 L 75 142 C 67 142, 68 68, 68 68 Z',
    fill: 'url(/#copper-metallic)',
    stroke: 'none',
    strokeWidth: 0,
    yMin: 65,
    yMax: 145,
    rimLeft: 60,
    rimRight: 140,
    rimY: 65
  },
  'Tiki-Becher': {
    cavity: 'M 70 45 L 130 45 L 126 155 L 74 155 Z',
    body: 'M 66 40 L 134 40 L 130 162 L 70 162 Z',
    highlight: 'M 72 48 L 78 48 L 80 152 L 74 152 Z',
    fill: 'url(/#tiki-ceramic)',
    stroke: 'none',
    strokeWidth: 0,
    yMin: 45,
    yMax: 155,
    rimLeft: 70,
    rimRight: 130,
    rimY: 45,
    isTiki: true
  },
  'Tiki-Glas': {
    cavity: 'M 70 45 L 130 45 L 126 155 L 74 155 Z',
    body: 'M 66 40 L 134 40 L 130 162 L 70 162 Z',
    highlight: 'M 72 48 L 78 48 L 80 152 L 74 152 Z',
    fill: 'url(/#tiki-ceramic)',
    stroke: 'none',
    strokeWidth: 0,
    yMin: 45,
    yMax: 155,
    rimLeft: 70,
    rimRight: 130,
    rimY: 45,
    isTiki: true
  },
  'Weinglas': {
    cavity: 'M 65 50 C 65 50, 60 125, 100 132 C 140 125, 135 50, 135 50 Z',
    body: 'M 61 48 C 61 48, 56 128, 100 135 C 144 128, 139 48, 139 48 M 100 135 L 100 175 M 70 175 L 130 175',
    highlight: 'M 69 52 C 69 52, 64 112, 100 118 C 85 114, 75 90, 75 52 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2,
    yMin: 50,
    yMax: 132,
    rimLeft: 65,
    rimRight: 135,
    rimY: 50
  },
  'Champagnerflötenglas': {
    cavity: 'M 80 40 L 120 40 C 120 40, 120 115, 100 125 C 80 115, 80 40, 80 40 Z',
    body: 'M 77 38 L 123 38 C 123 38, 123 118, 100 128 C 77 118, 77 38, 77 38 M 100 128 L 100 178 M 70 178 L 130 178',
    highlight: 'M 83 42 C 83 42, 83 102, 100 110 C 90 102, 88 70, 88 42 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2,
    yMin: 40,
    yMax: 125,
    rimLeft: 80,
    rimRight: 120,
    rimY: 40
  },
  'Champagnerglas': {
    cavity: 'M 50 60 C 50 115, 150 115, 150 60 Z',
    body: 'M 46 58 C 46 120, 154 120, 154 58 M 100 118 L 100 175 M 65 175 L 135 175',
    highlight: 'M 54 62 C 54 95, 78 112, 100 113 C 85 108, 65 92, 65 62 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2,
    yMin: 60,
    yMax: 115,
    rimLeft: 50,
    rimRight: 150,
    rimY: 60
  },
  'hitzefestes Glas': {
    cavity: 'M 70 50 L 130 50 L 125 145 L 75 145 Z',
    body: 'M 66 45 L 134 45 L 129 155 L 71 155 Z M 71 145 L 129 145 L 129 155 L 71 155 Z M 130 75 C 150 75, 150 125, 130 125',
    highlight: 'M 73 53 L 80 53 L 82 142 L 75 142 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2.2,
    yMin: 50,
    yMax: 145,
    rimLeft: 70,
    rimRight: 130,
    rimY: 50
  },
  'Tiki-Bowl': {
    cavity: 'M 45 75 C 45 135, 155 135, 155 75 Z',
    body: 'M 41 72 C 41 140, 159 140, 159 72 M 75 136 L 65 155 L 135 155 L 125 136',
    highlight: 'M 49 78 C 49 110, 85 132, 100 133 C 80 128, 62 112, 62 78 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2.5,
    yMin: 75,
    yMax: 135,
    rimLeft: 45,
    rimRight: 155,
    rimY: 75
  },
  'Shotglas': {
    cavity: 'M 78 70 L 122 70 L 118 150 L 82 150 Z',
    body: 'M 74 65 L 126 65 L 122 160 L 78 160 Z M 78 150 L 122 150 L 122 160 L 78 160 Z',
    highlight: 'M 80 73 L 86 73 L 87 145 L 81 145 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2.5,
    yMin: 70,
    yMax: 150,
    rimLeft: 78,
    rimRight: 122,
    rimY: 70
  },
  'kleines Glas': {
    cavity: 'M 75 70 L 125 70 L 120 150 L 80 150 Z',
    body: 'M 71 65 L 129 65 L 124 158 L 76 158 Z M 76 150 L 124 150 L 124 158 L 76 158 Z',
    highlight: 'M 78 73 L 84 73 L 85 145 L 79 145 Z',
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 2.5,
    yMin: 70,
    yMax: 150,
    rimLeft: 75,
    rimRight: 125,
    rimY: 70
  }
};

/* ----------------------------------------------------
   COLOR PALETTE MAPPING FOR INGREDIENTS
   ---------------------------------------------------- */
function getIngredientColor(name) {
  name = name.toLowerCase();
  
  if (name.includes("aperol")) return "rgba(255, 95, 31, 0.85)";
  if (name.includes("campari")) return "rgba(224, 16, 16, 0.85)";
  if (name.includes("blue cura")) return "rgba(0, 140, 255, 0.85)";
  if (name.includes("espresso") || name.includes("kaffee") || name.includes("coffee")) return "rgba(45, 26, 12, 0.96)";
  if (name.includes("sahne") || name.includes("cream") || name.includes("baileys") || name.includes("kokos") || name.includes("coconut cream") || name.includes("milch") || name.includes("egg white") || name.includes("eiweiß")) return "rgba(245, 242, 232, 0.95)";
  if (name.includes("limette") || name.includes("lime") || name.includes("zitrone") || name.includes("lemon")) return "rgba(210, 235, 110, 0.8)";
  if (name.includes("cranberry") || name.includes("grenadine") || name.includes("kirsch") || name.includes("cassis") || name.includes("rot") || name.includes("wermut sweet") || name.includes("vermouth sweet") || name.includes("rosso") || name.includes("angostura")) return "rgba(186, 12, 47, 0.85)";
  if (name.includes("orange") || name.includes("ananas") || name.includes("pineapple") || name.includes("passionsfrucht") || name.includes("passion") || name.includes("maracuja") || name.includes("bananen") || name.includes("ginger beer") || name.includes("ginger ale")) return "rgba(244, 164, 32, 0.9)";
  if (name.includes("champagner") || name.includes("prosecco") || name.includes("sekt") || name.includes("wein") || name.includes("wine") || name.includes("cider")) return "rgba(247, 233, 175, 0.65)";
  if (name.includes("cola")) return "rgba(74, 46, 36, 0.92)";
  if (name.includes("whisky") || name.includes("whiskey") || name.includes("bourbon") || name.includes("rye") || name.includes("scotch") || name.includes("cognac") || name.includes("brandy") || name.includes("amaretto") || name.includes("drambuie") || name.includes("rum dark") || name.includes("aged rum") || name.includes("gold rum") || name.includes("rum (braun)") || name.includes("brauner rum")) return "rgba(184, 115, 51, 0.85)";
  if (name.includes("midori")) return "rgba(57, 255, 20, 0.85)";
  if (name.includes("minz") || name.includes("basil") || name.includes("waldmeister")) return "rgba(60, 165, 110, 0.7)";
  
  // Default values for standard spirits or clear mixers
  if (name.includes("vodka") || name.includes("wodka") || name.includes("gin") || name.includes("rum") || name.includes("tequila") || name.includes("mezcal") || name.includes("triple sec") || name.includes("cointreau") || name.includes("sirup") || name.includes("zucker") || name.includes("soda") || name.includes("tonic") || name.includes("wasser") || name.includes("water") || name.includes("wermut dry") || name.includes("vermouth dry")) {
    return "rgba(240, 245, 255, 0.25)";
  }
  
  // Fallback hash color for anything unique
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let h = Math.abs(hash % 360);
  return `hsla(${h}, 65%, 45%, 0.75)`;
}

/* ----------------------------------------------------
   PWA SERVICE WORKER REGISTRATION
   ---------------------------------------------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('ServiceWorker registered successfully.', reg.scope))
      .catch(err => console.log('ServiceWorker registration failed: ', err));
  });
}

/* ----------------------------------------------------
   APPLICATION BOOTSTRAP
   ---------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadData();
  setupUIEventListeners();
  setupRouter();
  setupSwipeToDismiss();
  checkIOSPWA();
});

/* Theme switcher initialization */
function initTheme() {
  const savedTheme = localStorage.getItem('mixology_theme') || 'dark';
  state.theme = savedTheme;
  document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('mixology_theme', state.theme);
  document.body.className = state.theme === 'dark' ? 'dark-theme' : 'light-theme';
  
  // Smoothly update matching meta theme colors
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', state.theme === 'dark' ? '#0F0F10' : '#FAF7F2');
  }
}

/* Load cocktails.json data */
async function loadData() {
  try {
    const response = await fetch('cocktails.json');
    const data = await response.json();
    state.cocktails = data.cocktails;
    
    // Check local storage sync and build indexes
    buildBarChecklist();
    renderExplore();
    renderSearch();
    renderFavorites();
    
    // Set daily cocktail
    setDailyCocktail();
    
    // Handle loading details if URL has hash with id
    handleInitialRouting();
  } catch (error) {
    console.error('Failed to load cocktail data:', error);
    alert('Fehler beim Laden der Cocktails. Bitte lade die Seite neu.');
  }
}

/* ----------------------------------------------------
   ROUTING & VIEW HANDLERS
   ---------------------------------------------------- */
function setupRouter() {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '#explore';
    handleViewSwitch(hash);
  });
}

function handleInitialRouting() {
  const hash = window.location.hash || '#explore';
  handleViewSwitch(hash);
}

function handleViewSwitch(hash) {
  // Handle detailed recipe routing, format: #cocktail-porn-star-martini
  if (hash.startsWith('#cocktail-')) {
    const cocktailId = hash.replace('#cocktail-', '');
    const cocktail = state.cocktails.find(c => c.id === cocktailId);
    if (cocktail) {
      showCocktailDetail(cocktail);
    }
    return;
  }

  // Close recipe drawer if switching to a primary view on mobile
  if (window.innerWidth < 1024) {
    closeRecipeDrawer();
  }

  const cleanHash = hash.replace('#', '');
  const views = ['explore', 'search', 'bar', 'favorites'];
  
  if (views.includes(cleanHash)) {
    state.activeView = cleanHash;
    
    // Toggle active view in DOM
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });
    const activeViewEl = document.getElementById(`view-${cleanHash}`);
    if (activeViewEl) activeViewEl.classList.add('active');
    
    // Toggle active tab bar items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === cleanHash) {
        item.classList.add('active');
      }
    });

    // Refresh view states
    if (cleanHash === 'favorites') {
      renderFavorites();
    } else if (cleanHash === 'bar') {
      updateMixableRecipes();
    }
  }
}

/* ----------------------------------------------------
   EXPLORE VIEW POPULATION
   ---------------------------------------------------- */
function renderExplore() {
  // Greeting based on time
  const greetingEl = document.getElementById('welcome-greeting');
  const hour = new Date().getHours();
  let greeting = 'Guten Tag';
  if (hour < 5) greeting = 'Gute Nacht';
  else if (hour < 11) greeting = 'Guten Morgen';
  else if (hour < 18) greeting = 'Guten Tag';
  else greeting = 'Guten Abend';
  if (greetingEl) greetingEl.textContent = greeting;

  // Categories render
  const categoriesScroll = document.getElementById('categories-scroll');
  if (categoriesScroll) {
    const categories = Array.from(new Set(state.cocktails.map(c => c.category)));
    
    const categoryEmojis = {
      'Martini': '🍸', 'Gin': '🌿', 'Whisky': '🥃', 'Tequila': '🍊', 'Sour': '🍋', 
      'Rum': '🍹', 'Mezcal/Agave': '🌵', 'Longdrink': '🥤', 'Vodka': '🥂', 
      'Aperitif': '🍷', 'Kaffee': '☕', 'Tiki': '🗿', 'Tequila/Mezcal': '🌵', 'Sonstige': '🏺'
    };

    categoriesScroll.innerHTML = categories.map(cat => `
      <div class="category-card" onclick="filterByCategory('${cat}')">
        <span class="category-icon">${categoryEmojis[cat] || '🍹'}</span>
        <span class="category-name">${cat}</span>
      </div>
    `).join('');
  }

  // Render Top 10 popular slider
  const classicsScroll = document.getElementById('top-classics-scroll');
  if (classicsScroll) {
    const topClassics = state.cocktails.filter(c => c.rank <= 10).sort((a, b) => a.rank - b.rank);
    classicsScroll.innerHTML = topClassics.map(c => `
      <div class="classic-card" onclick="window.location.hash='#cocktail-${c.id}'">
        <span class="classic-card-rank">${c.rank}</span>
        <div class="classic-card-visual">
          ${getMinimalSVG(c)}
        </div>
        <span class="classic-card-name">${c.name}</span>
      </div>
    `).join('');
  }

  // Render All 100
  const allGrid = document.getElementById('explore-all-grid');
  if (allGrid) {
    renderCocktailGrid(allGrid, state.cocktails);
  }
}

function setDailyCocktail() {
  // Use today's date to seed a daily drink
  const today = new Date().toDateString();
  let seed = 0;
  for (let i = 0; i < today.length; i++) {
    seed += today.charCodeAt(i);
  }
  const index = seed % state.cocktails.length;
  const dailyCocktail = state.cocktails[index];
  
  if (dailyCocktail) {
    const heroName = document.getElementById('hero-cocktail-name');
    const heroCat = document.getElementById('hero-cocktail-category');
    const heroVol = document.getElementById('hero-cocktail-volume');
    const heroGlass = document.getElementById('hero-cocktail-glass');
    const heroVisual = document.getElementById('hero-cocktail-visual');
    const heroCard = document.getElementById('cocktail-of-the-day-card');
    
    if (heroName) heroName.textContent = dailyCocktail.name;
    if (heroCat) heroCat.textContent = dailyCocktail.category;
    if (heroVol) heroVol.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> ${dailyCocktail.total_volume.approx_ml} ml`;
    if (heroGlass) heroGlass.textContent = dailyCocktail.glassware[0] || 'Coupeglas';
    if (heroVisual) heroVisual.innerHTML = getMinimalSVG(dailyCocktail);
    if (heroCard) {
      heroCard.onclick = () => window.location.hash = `#cocktail-${dailyCocktail.id}`;
    }
  }
}

function filterByCategory(category) {
  state.activeFilter = 'all';
  state.searchQuery = category;
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = category;
  
  // Toggle clear button
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) clearBtn.classList.remove('hidden');

  // Activate pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.remove('active');
    if (pill.getAttribute('data-filter') === 'all') pill.classList.add('active');
  });

  renderSearch();
  window.location.hash = '#search';
}

/* Render standard card grid */
function renderCocktailGrid(containerEl, cocktailsList) {
  containerEl.innerHTML = cocktailsList.map(c => {
    const isFav = state.favorites.includes(c.id);
    return `
      <div class="cocktail-grid-card" onclick="window.location.hash='#cocktail-${c.id}'">
        <div class="cocktail-grid-header">
          <span class="cocktail-grid-rank">#${c.rank}</span>
          <span class="fav-dot ${isFav ? 'active' : ''}" onclick="toggleFavoriteInline(event, '${c.id}')">♥</span>
        </div>
        <div class="cocktail-grid-visual">
          ${getMinimalSVG(c)}
        </div>
        <div class="cocktail-grid-info">
          <h4 class="cocktail-grid-name">${c.name}</h4>
          <p class="cocktail-grid-category">${c.category}</p>
        </div>
      </div>
    `;
  }).join('');
}

function toggleFavoriteInline(event, id) {
  event.stopPropagation();
  const idx = state.favorites.indexOf(id);
  if (idx > -1) {
    state.favorites.splice(idx, 1);
    event.target.classList.remove('active');
  } else {
    state.favorites.push(id);
    event.target.classList.add('active');
  }
  localStorage.setItem('mixology_favorites', JSON.stringify(state.favorites));
  renderFavorites();
  
  // Re-sync Explore grid in case of active state matches
  const gridCards = document.querySelectorAll('.cocktail-grid-card');
  gridCards.forEach(card => {
    if (card.onclick && card.onclick.toString().includes(id)) {
      const dot = card.querySelector('.fav-dot');
      if (dot) {
        if (state.favorites.includes(id)) dot.classList.add('active');
        else dot.classList.remove('active');
      }
    }
  });
}

/* ----------------------------------------------------
   SEARCH CONTROLLER
   ---------------------------------------------------- */
function renderSearch() {
  const query = state.searchQuery.toLowerCase().trim();
  const filter = state.activeFilter;
  
  let results = state.cocktails.filter(c => {
    // 1. Text match (Name, Category, Glassware, or search_text fields)
    const matchesText = !query || 
      c.name.toLowerCase().includes(query) || 
      c.category.toLowerCase().includes(query) || 
      (c.glassware && c.glassware.some(g => g.toLowerCase().includes(query))) ||
      (c.search_text && c.search_text.toLowerCase().includes(query));
      
    // 2. Pill matches
    let matchesFilter = true;
    if (filter === 'non-alcoholic') {
      matchesFilter = false; // The database shows "contains_alcohol: true" globally, but we check warnings/notes/recipe category if there are mocktails
    } else if (filter === 'shake') {
      matchesFilter = c.method_tags.includes('shake');
    } else if (filter === 'stir') {
      matchesFilter = c.method_tags.includes('stir');
    } else if (filter === 'build') {
      matchesFilter = c.method_tags.includes('build');
    }
    
    return matchesText && matchesFilter;
  });

  const grid = document.getElementById('search-results-grid');
  const emptyState = document.getElementById('search-empty-state');
  
  if (grid) {
    if (results.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      renderCocktailGrid(grid, results);
    }
  }
}

/* ----------------------------------------------------
   MY BAR-SCHRANK CONTROLLER
   ---------------------------------------------------- */
function buildBarChecklist() {
  // Extract all unique ingredients from cocktails
  const ingredientsMap = new Map();
  state.cocktails.forEach(c => {
    c.ingredients.forEach(i => {
      // Clean name for grouping (trim extra descriptions, capitalize)
      const cleanName = i.name.split(' (')[0].split(', ')[0].split(' - ')[0].trim();
      const id = cleanName.toLowerCase();
      
      // Let's filter out garnishes and side servings from key ingredients checklist to keep list short
      if (i.role === 'garnish' || i.role === 'side_serving') return;
      
      if (!ingredientsMap.has(id)) {
        ingredientsMap.set(id, {
          id: id,
          name: cleanName,
          category: guessIngredientCategory(cleanName)
        });
      }
    });
  });

  // Group by category
  const categories = {
    'Spirituosen & Liköre': [],
    'Fruchtsäfte & Sirupe': [],
    'Filler & Mixer': [],
    'Kräuter, Obst & Sonstiges': []
  };

  Array.from(ingredientsMap.values()).forEach(ing => {
    categories[ing.category].push(ing);
  });

  const checklistContainer = document.getElementById('ingredients-checklist-container');
  if (checklistContainer) {
    checklistContainer.innerHTML = Object.entries(categories).map(([catName, list]) => {
      if (list.length === 0) return '';
      
      // Sort alphabetically
      list.sort((a, b) => a.name.localeCompare(b.name));
      
      return `
        <div class="bar-category-group" id="group-${catName.replace(/\s/g, '')}">
          <div class="bar-category-header" onclick="toggleBarCategory(this)">
            <div class="bar-category-title-info">
              <span class="bar-category-title">${catName}</span>
              <span class="bar-category-selected-tag" id="counter-${catName.replace(/\s/g, '')}">0</span>
            </div>
            <span class="bar-category-arrow">▼</span>
          </div>
          <div class="bar-category-list">
            ${list.map(ing => {
              const isChecked = state.barIngredients.includes(ing.id);
              return `
                <div class="checkbox-item ${isChecked ? 'checked' : ''}" data-id="${ing.id}" onclick="toggleIngredientCheck(this)">
                  <div class="checkbox-box">
                    <span class="checkbox-checkmark">✓</span>
                  </div>
                  <span class="checkbox-label">${ing.name}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
    
    updateBarCounters();
  }
}

function guessIngredientCategory(name) {
  name = name.toLowerCase();
  
  const alcoholKeywords = [
    'vodka', 'wodka', 'gin', 'rum', 'tequila', 'mezcal', 'liqueur', 'likör', 'whiskey', 
    'whisky', 'bourbon', 'rye', 'scotch', 'cognac', 'brandy', 'amaretto', 'vermouth', 
    'wermut', 'triple sec', 'cointreau', 'grand marnier', 'passoa', 'baileys', 'kahlua', 
    'galliano', 'chambord', 'pernod', 'absinth', 'campari', 'aperol', 'pisco', 'falernum', 
    'cynar', 'lillet', 'drambuie', 'chartreuse', 'suze', 'maraschino', 'cachaca', 'cachaça'
  ];
  const juiceSyrupKeywords = [
    'saft', 'juice', 'sirup', 'syrup', 'püree', 'puree', 'grenadine', 'agave'
  ];
  const mixerKeywords = [
    'cola', 'soda', 'tonic', 'ginger beer', 'ginger ale', 'prosecco', 'champagner', 
    'sekt', 'wein', 'wine', 'sprite', 'limonade', 'wasser', 'water'
  ];
  
  if (alcoholKeywords.some(kw => name.includes(kw))) {
    return 'Spirituosen & Liköre';
  }
  if (juiceSyrupKeywords.some(kw => name.includes(kw))) {
    return 'Fruchtsäfte & Sirupe';
  }
  if (mixerKeywords.some(kw => name.includes(kw))) {
    return 'Filler & Mixer';
  }
  return 'Kräuter, Obst & Sonstiges';
}

function toggleBarCategory(headerEl) {
  const group = headerEl.parentElement;
  group.classList.toggle('collapsed');
}

function toggleIngredientCheck(itemEl) {
  const id = itemEl.getAttribute('data-id');
  const idx = state.barIngredients.indexOf(id);
  
  if (idx > -1) {
    state.barIngredients.splice(idx, 1);
    itemEl.classList.remove('checked');
  } else {
    state.barIngredients.push(id);
    itemEl.classList.add('checked');
  }
  
  localStorage.setItem('mixology_bar_ingredients', JSON.stringify(state.barIngredients));
  
  updateBarCounters();
  updateMixableRecipes();
}

function updateBarCounters() {
  // Update total count
  const totalCountEl = document.getElementById('bar-selected-count');
  if (totalCountEl) totalCountEl.textContent = state.barIngredients.length;

  // Update categories count
  document.querySelectorAll('.bar-category-group').forEach(group => {
    const checkedCount = group.querySelectorAll('.checkbox-item.checked').length;
    const counterId = group.querySelector('.bar-category-selected-tag').id;
    const counterEl = document.getElementById(counterId);
    if (counterEl) counterEl.textContent = checkedCount;
  });
}

function updateMixableRecipes() {
  const barIngredientsSet = new Set(state.barIngredients);
  const perfectMatches = [];
  const almostMatches = [];

  state.cocktails.forEach(c => {
    // Collect non-optional liquid/base ingredients
    const requiredIngredients = c.ingredients.filter(i => !i.optional && i.role === 'ingredient');
    
    if (requiredIngredients.length === 0) return;

    let missingList = [];
    requiredIngredients.forEach(i => {
      // Map to id format used in checklist
      const cleanName = i.name.split(' (')[0].split(', ')[0].split(' - ')[0].trim().toLowerCase();
      
      // Check if this required ingredient is NOT in the user's inventory
      if (!barIngredientsSet.has(cleanName)) {
        missingList.push(i.name);
      }
    });

    if (missingList.length === 0) {
      perfectMatches.push(c);
    } else if (missingList.length === 1) {
      almostMatches.push({
        cocktail: c,
        missing: missingList[0]
      });
    }
  });

  // Render Perfect Grid
  const perfectGrid = document.getElementById('bar-perfect-grid');
  const perfectEmpty = document.getElementById('bar-perfect-empty');
  if (perfectGrid) {
    if (perfectMatches.length === 0) {
      perfectGrid.innerHTML = '';
      perfectEmpty.classList.remove('hidden');
    } else {
      perfectEmpty.classList.add('hidden');
      renderCocktailGrid(perfectGrid, perfectMatches);
    }
  }

  // Render Almost Grid (showing missing ingredient as warning)
  const almostGrid = document.getElementById('bar-almost-grid');
  const almostEmpty = document.getElementById('bar-almost-empty');
  if (almostGrid) {
    if (almostMatches.length === 0) {
      almostGrid.innerHTML = '';
      almostEmpty.classList.remove('hidden');
    } else {
      almostEmpty.classList.add('hidden');
      
      almostGrid.innerHTML = almostMatches.map(({cocktail, missing}) => {
        const isFav = state.favorites.includes(cocktail.id);
        return `
          <div class="cocktail-grid-card" onclick="window.location.hash='#cocktail-${cocktail.id}'">
            <div class="cocktail-grid-header">
              <span class="cocktail-grid-rank">#${cocktail.rank}</span>
              <span class="fav-dot ${isFav ? 'active' : ''}" onclick="toggleFavoriteInline(event, '${cocktail.id}')">♥</span>
            </div>
            <div class="cocktail-grid-visual">
              ${getMinimalSVG(cocktail)}
            </div>
            <div class="cocktail-grid-info">
              <h4 class="cocktail-grid-name">${cocktail.name}</h4>
              <p class="cocktail-grid-category">${cocktail.category}</p>
              <span class="missing-ingredients-tag">Fehlt: ${missing}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Update tabs header count
  const recipesCountEl = document.getElementById('bar-mixable-count');
  if (recipesCountEl) recipesCountEl.textContent = perfectMatches.length + almostMatches.length;
}

/* Filter bar items checklist by text search */
function filterInventory(text) {
  const query = text.toLowerCase().trim();
  document.querySelectorAll('.checkbox-item').forEach(item => {
    const label = item.querySelector('.checkbox-label').textContent.toLowerCase();
    if (label.includes(query)) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });

  // Hide empty groups
  document.querySelectorAll('.bar-category-group').forEach(group => {
    const visibleChecks = group.querySelectorAll('.checkbox-item:not(.hidden)').length;
    if (visibleChecks === 0 && query !== '') {
      group.classList.add('hidden');
    } else {
      group.classList.remove('hidden');
    }
  });
}

/* ----------------------------------------------------
   FAVORITES VIEW CONTROLLER
   ---------------------------------------------------- */
function renderFavorites() {
  const grid = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('favorites-empty-state');
  const favList = state.cocktails.filter(c => state.favorites.includes(c.id));
  
  if (grid) {
    if (favList.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      renderCocktailGrid(grid, favList);
    }
  }
}

/* ----------------------------------------------------
   RECIPE DRAWER - DETAILS POPUP
   ---------------------------------------------------- */
function showCocktailDetail(cocktail) {
  state.currentCocktail = cocktail;
  state.servings = 1;
  
  // Set UI elements
  document.getElementById('detail-name').textContent = cocktail.name;
  document.getElementById('detail-rank').textContent = `#${cocktail.rank}`;
  document.getElementById('detail-category').textContent = cocktail.category;
  document.getElementById('detail-spec-volume').textContent = cocktail.total_volume.text.split(' ')[0] + ' ml';
  document.getElementById('detail-spec-glass').textContent = cocktail.glassware[0] || 'Coupeglas';
  document.getElementById('detail-spec-method').textContent = cocktail.method_tags[0] === 'shake' ? 'Shaken' : cocktail.method_tags[0] === 'stir' ? 'Gerührt' : 'Im Glas';
  
  // Favorite state sync
  const favBtn = document.getElementById('detail-fav-btn');
  if (favBtn) {
    const isFav = state.favorites.includes(cocktail.id);
    if (isFav) {
      favBtn.classList.add('active');
      favBtn.querySelector('.btn-text').textContent = 'Favorisiert';
    } else {
      favBtn.classList.remove('active');
      favBtn.querySelector('.btn-text').textContent = 'Favorisieren';
    }
  }

  // Warnings / Notes
  const noteBox = document.getElementById('detail-notes-container');
  if (noteBox) {
    if (cocktail.recipe_note) {
      noteBox.textContent = cocktail.recipe_note;
      noteBox.classList.remove('hidden');
    } else {
      noteBox.classList.add('hidden');
    }
  }

  // Reset portion display and range slider
  document.getElementById('detail-servings-count').textContent = '1';
  document.getElementById('servings-range-slider').value = 1;

  // Render checklist ingredients
  renderDetailIngredients();

  // Render preparation steps
  const stepsContainer = document.getElementById('detail-preparation-steps');
  if (stepsContainer) {
    // Split text by sentence/instructions
    const steps = cocktail.preparation.split('. ').map(s => s.trim()).filter(s => s.length > 0);
    stepsContainer.innerHTML = steps.map((step, idx) => `
      <div class="step-card" onclick="toggleStepDone(this)">
        <span class="step-number">${idx + 1}</span>
        <span class="step-text">${step}${step.endsWith('.') ? '' : '.'}</span>
      </div>
    `).join('');
  }

  // Draw full animated Glassware SVG
  drawGlasswareSVG(cocktail);

  // Hide desktop placeholder & show recipe details content area
  const placeholder = document.getElementById('detail-placeholder');
  const contentArea = document.getElementById('detail-content-area');
  if (placeholder) placeholder.classList.add('hidden');
  if (contentArea) contentArea.classList.remove('hidden');

  // Open the drawer overlay
  const drawer = document.getElementById('recipe-drawer');
  drawer.classList.add('active');
}

function closeRecipeDrawer() {
  const drawer = document.getElementById('recipe-drawer');
  if (drawer) {
    drawer.classList.remove('active');
    // Clear URL hash to prevent detail view loop
    if (window.location.hash.startsWith('#cocktail-')) {
      window.location.hash = '#' + state.activeView;
    }
  }

  // Restore desktop placeholder & hide recipe details content area
  const placeholder = document.getElementById('detail-placeholder');
  const contentArea = document.getElementById('detail-content-area');
  if (placeholder) placeholder.classList.remove('hidden');
  if (contentArea) contentArea.classList.add('hidden');
}

function toggleStepDone(cardEl) {
  cardEl.classList.toggle('done');
}

function toggleFavoriteDetail() {
  if (!state.currentCocktail) return;
  const id = state.currentCocktail.id;
  const favBtn = document.getElementById('detail-fav-btn');
  const idx = state.favorites.indexOf(id);
  
  if (idx > -1) {
    state.favorites.splice(idx, 1);
    favBtn.classList.remove('active');
    favBtn.querySelector('.btn-text').textContent = 'Favorisieren';
  } else {
    state.favorites.push(id);
    favBtn.classList.add('active');
    favBtn.querySelector('.btn-text').textContent = 'Favorisiert';
  }
  localStorage.setItem('mixology_favorites', JSON.stringify(state.favorites));
  renderFavorites();
  renderExplore();
}

function shareCocktail() {
  if (!state.currentCocktail) return;
  const c = state.currentCocktail;
  const ingredientsText = c.ingredients.map(i => `- ${i.amount.text !== '—' ? i.amount.text + ' ' : ''}${i.name}`).join('\n');
  const text = `🍸 Probier mal diesen Cocktail aus: ${c.name} (Top 100 Rang #${c.rank})!\n\nZutaten:\n${ingredientsText}\n\nZubereitung:\n${c.preparation}\n\nApp gehostet auf Mixology. PWA-Cocktail-Bar.`;
  
  if (navigator.share) {
    navigator.share({
      title: c.name,
      text: text,
      url: window.location.href
    }).catch(err => console.log('Sharing failed', err));
  } else {
    // Copy to clipboard fallback
    navigator.clipboard.writeText(text).then(() => {
      alert('Rezept in Zwischenablage kopiert! Verschicke es an deine Freunde.');
    });
  }
}

/* ----------------------------------------------------
   SERVINGS CONTROLLER
   ---------------------------------------------------- */
function changeServings(delta) {
  let val = state.servings + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  
  state.servings = val;
  document.getElementById('detail-servings-count').textContent = val;
  document.getElementById('servings-range-slider').value = val;
  
  renderDetailIngredients();
}

function handleServingsSlider(val) {
  state.servings = parseInt(val);
  document.getElementById('detail-servings-count').textContent = val;
  renderDetailIngredients();
}

function renderDetailIngredients() {
  const listContainer = document.getElementById('detail-ingredients-list');
  if (listContainer && state.currentCocktail) {
    listContainer.innerHTML = state.currentCocktail.ingredients.map(i => {
      const formattedAmount = getFormattedAmount(i.amount, state.servings);
      return `
        <li class="ingredient-item" onclick="toggleIngredientCross(this)">
          <div class="ingredient-checkbox">
            <span class="ingredient-checkmark">✓</span>
          </div>
          <div class="ingredient-details">
            <span class="ingredient-name">${i.name}</span>
            <span class="ingredient-amount">${formattedAmount}</span>
          </div>
        </li>
      `;
    }).join('');
  }
}

function toggleIngredientCross(itemEl) {
  itemEl.classList.toggle('crossed');
}

function getFormattedAmount(amount, servings) {
  if (!amount || amount.text === '—') return '';
  if (amount.value !== null && amount.value !== undefined) {
    const scaledVal = amount.value * servings;
    const displayVal = Number(scaledVal.toFixed(1)).toString();
    if (amount.unit) {
      return `${displayVal} ${amount.unit}`;
    }
    return displayVal;
  }
  return amount.text; // Fallback to raw text description
}

/* ----------------------------------------------------
   DYNAMIC SVG GLASSWARE VISUALIZER
   ---------------------------------------------------- */
function getGradColors(colorStr) {
  if (colorStr.startsWith('rgba')) {
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1.0;
      
      const rDark = Math.max(0, Math.floor(r * 0.82));
      const gDark = Math.max(0, Math.floor(g * 0.82));
      const bDark = Math.max(0, Math.floor(b * 0.82));
      
      const rLight = Math.min(255, Math.floor(r * 1.15 + 10));
      const gLight = Math.min(255, Math.floor(g * 1.15 + 10));
      const bLight = Math.min(255, Math.floor(b * 1.15 + 10));
      const aLight = Math.min(1.0, a * 0.9);
      
      return {
        bottom: `rgba(${rDark}, ${gDark}, ${bDark}, ${a})`,
        top: `rgba(${rLight}, ${gLight}, ${bLight}, ${aLight})`
      };
    }
  }
  return { bottom: colorStr, top: colorStr };
}

function getGarnishSVG(cocktail, spec) {
  let garnishHtml = '';
  const garnishes = cocktail.ingredients.filter(i => i.role === 'garnish');
  
  const hasSaltRim = cocktail.ingredients.some(i => {
    const name = i.name.toLowerCase();
    return name.includes("salz") && (name.includes("rand") || name.includes("rim"));
  });
  const hasSugarRim = cocktail.ingredients.some(i => {
    const name = i.name.toLowerCase();
    return name.includes("zucker") && (name.includes("rand") || name.includes("rim"));
  });

  if (hasSaltRim || hasSugarRim) {
    const rimColor = hasSaltRim ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 248, 220, 0.85)';
    const dashPattern = hasSaltRim ? '1.5 2.5' : '2.0 3.0';
    garnishHtml += `
      <!-- Coating Rim (Salt/Sugar) -->
      <path d="M ${spec.rimLeft - 2} ${spec.rimY} Q 100 ${spec.rimY + 4} ${spec.rimRight + 2} ${spec.rimY}" 
            fill="none" 
            stroke="${rimColor}" 
            stroke-width="2.5" 
            stroke-dasharray="${dashPattern}" 
            stroke-linecap="round" 
            opacity="0.95" />
    `;
  }

  garnishes.forEach(g => {
    const name = g.name.toLowerCase();
    
    // 1. Lemon, Lime, or Orange slice/wheel on rim
    if (name.includes("zitrone") || name.includes("lemon") || name.includes("limette") || name.includes("lime") || name.includes("orange")) {
      const isLime = name.includes("limette") || name.includes("lime");
      const isOrange = name.includes("orange");
      
      const outerColor = isLime ? '#2d6a4f' : isOrange ? '#e76f51' : '#f9844a';
      const citrusColor = isLime ? '#52b788' : isOrange ? '#f4a261' : '#f9c74f';
      
      let wedgesHtml = '';
      for (let i = 0; i < 8; i++) {
        const rot = i * 45;
        wedgesHtml += `<path d="M 0 0 L 13.5 -1.2 A 14 14 0 0 0 10.4 -8.8 Z" fill="${citrusColor}" transform="rotate(${rot})" opacity="0.95"/>`;
      }

      garnishHtml += `
        <!-- Citrus wheel on rim with 3D segment detail -->
        <g transform="translate(${spec.rimRight - 10}, ${spec.rimY - 12}) rotate(25)">
          <circle cx="0" cy="0" r="19" fill="${outerColor}" />
          <circle cx="0" cy="0" r="17.5" fill="rgba(255, 255, 255, 0.95)" />
          <circle cx="0" cy="0" r="15.5" fill="${citrusColor}" />
          ${wedgesHtml}
          <!-- Rind slice cutout to look perched on the glass -->
          <rect x="-1" y="10" width="2" height="10" fill="rgba(255,255,255,0.8)" transform="rotate(-25)"/>
          <circle cx="0" cy="0" r="2.5" fill="rgba(255, 255, 255, 0.95)" />
        </g>
      `;
    }
    
    // 2. Cherry (Kirsche)
    else if (name.includes("kirsche") || name.includes("cherry")) {
      garnishHtml += `
        <!-- Luxury Cocktail Cherry perched on the rim -->
        <g transform="translate(${spec.rimRight + 4}, ${spec.rimY - 4})">
          <!-- Stem -->
          <path d="M 0 0 Q -8 -22 -20 -13" fill="none" stroke="#4a3b32" stroke-width="1.8" stroke-linecap="round"/>
          <!-- Shadow -->
          <circle cx="0" cy="0" r="8" fill="rgba(0,0,0,0.15)" transform="translate(1, 1)"/>
          <!-- Cherry Body -->
          <circle cx="0" cy="0" r="8" fill="url(#cherry-grad)"/>
          <!-- 3D Gloss Highlight -->
          <circle cx="-2.5" cy="-2.5" r="2.2" fill="#ffffff" opacity="0.75" />
          <circle cx="2" cy="2" r="1" fill="#ffffff" opacity="0.25" />
        </g>
      `;
    }
    
    // 3. Olives on pick (Olive)
    else if (name.includes("olive")) {
      const x1 = spec.rimLeft + 12;
      const y1 = spec.rimY - 12;
      const x2 = spec.rimRight - 20;
      const y2 = spec.yMax - 8;
      const dx = x2 - x1;
      const dy = y2 - y1;
      
      // Olive 1 center
      const ox1 = x1 + dx * 0.4;
      const oy1 = y1 + dy * 0.4;
      // Olive 2 center
      const ox2 = x1 + dx * 0.65;
      const oy2 = y1 + dy * 0.65;

      garnishHtml += `
        <!-- Olives on a premium metal pick -->
        <g>
          <!-- Pick Needle -->
          <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c5a059" stroke-width="1.8" stroke-linecap="round"/>
          <!-- Pick Decorative Top Ring -->
          <circle cx="${x1 - 1.5}" cy="${y1 - 1.5}" r="3.5" fill="none" stroke="#c5a059" stroke-width="1.5"/>
          
          <!-- Olive 1 (with red stuffed pimento) -->
          <g transform="rotate(35, ${ox1}, ${oy1})">
            <ellipse cx="${ox1}" cy="${oy1}" rx="7.5" ry="10" fill="#6b705c" stroke="#555a42" stroke-width="0.5"/>
            <!-- Stuffed Pimento front core -->
            <ellipse cx="${ox1}" cy="${oy1 - 6}" rx="2.5" ry="1.8" fill="#bc4749"/>
            <!-- Highlight -->
            <ellipse cx="${ox1 - 2.5}" cy="${oy1}" rx="1.5" ry="3" fill="#ffffff" opacity="0.3"/>
          </g>
          
          <!-- Olive 2 (with red stuffed pimento) -->
          <g transform="rotate(35, ${ox2}, ${oy2})">
            <ellipse cx="${ox2}" cy="${oy2}" rx="7.5" ry="10" fill="#6b705c" stroke="#555a42" stroke-width="0.5"/>
            <ellipse cx="${ox2}" cy="${oy2 - 6}" rx="2.5" ry="1.8" fill="#bc4749"/>
            <ellipse cx="${ox2 - 2.5}" cy="${oy2}" rx="1.5" ry="3" fill="#ffffff" opacity="0.3"/>
          </g>
        </g>
      `;
    }
    
    // 4. Mint sprig (Minze / Basilikum)
    else if (name.includes("minz") || name.includes("basil") || name.includes("minzezweig") || name.includes("minzeblatt")) {
      const isBasil = name.includes("basil");
      const leafColor1 = isBasil ? '#4f772d' : '#31572c';
      const leafColor2 = isBasil ? '#90a955' : '#4f772d';
      const strokeColor = '#132a13';
      
      garnishHtml += `
        <!-- High-fidelity Mint Bouquet on rim -->
        <g transform="translate(${spec.rimLeft + 12}, ${spec.rimY - 8})">
          <!-- Leaf 1 (Left, angled down) -->
          <g transform="rotate(-30, 0, 0)">
            <path d="M 0 0 C -12 -8, -20 -4, -24 6 C -18 14, -8 10, 0 0 Z" fill="${leafColor1}" stroke="${strokeColor}" stroke-width="0.8"/>
            <path d="M 0 0 Q -12 1 -24 6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
          </g>
          <!-- Leaf 2 (Right, angled up) -->
          <g transform="rotate(40, 0, 0)">
            <path d="M 0 0 C 12 -8, 20 -4, 24 6 C 18 14, 8 10, 0 0 Z" fill="${leafColor2}" stroke="${strokeColor}" stroke-width="0.8"/>
            <path d="M 0 0 Q 12 1 24 6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
          </g>
          <!-- Leaf 3 (Center vertical, smaller) -->
          <g transform="rotate(5, 0, 0)">
            <path d="M 0 0 C -6 -12, -4 -20, 4 -24 C 10 -18, 8 -8, 0 0 Z" fill="#90a955" stroke="${strokeColor}" stroke-width="0.8"/>
            <path d="M 0 0 Q 1 -12 4 -24" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
          </g>
        </g>
      `;
    }

    // 5. Orange peel twist (Zeste)
    else if (name.includes("zeste") || name.includes("peel") || name.includes("schale")) {
      const isOrange = name.includes("orange");
      const twistColor = isOrange ? '#e76f51' : '#f9c74f';
      const twistInner = isOrange ? '#f4a261' : '#ffe3e0';
      
      garnishHtml += `
        <!-- High-fidelity 3D Citrus Twist ribbon hanging over rim -->
        <g>
          <!-- Back layer of the twist (inside glass) -->
          <path d="M ${spec.rimRight - 16} ${spec.rimY - 4} Q ${spec.rimRight - 12} ${spec.rimY - 14} ${spec.rimRight - 4} ${spec.rimY - 12}" fill="none" stroke="${twistColor}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M ${spec.rimRight - 16} ${spec.rimY - 4} Q ${spec.rimRight - 12} ${spec.rimY - 14} ${spec.rimRight - 4} ${spec.rimY - 12}" fill="none" stroke="${twistInner}" stroke-width="1.8" stroke-linecap="round"/>
          <!-- Front layer of the twist (hanging over outside) -->
          <path d="M ${spec.rimRight - 4} ${spec.rimY - 12} C ${spec.rimRight + 8} ${spec.rimY - 8}, ${spec.rimRight + 12} ${spec.rimY + 8}, ${spec.rimRight + 2} ${spec.rimY + 16} C ${spec.rimRight - 6} ${spec.rimY + 22}, ${spec.rimRight - 2} ${spec.rimY + 30}, ${spec.rimRight + 4} ${spec.rimY + 32}" 
                fill="none" 
                stroke="${twistColor}" 
                stroke-width="4.5" 
                stroke-linecap="round"/>
          <path d="M ${spec.rimRight - 4} ${spec.rimY - 12} C ${spec.rimRight + 8} ${spec.rimY - 8}, ${spec.rimRight + 12} ${spec.rimY + 8}, ${spec.rimRight + 2} ${spec.rimY + 16} C ${spec.rimRight - 6} ${spec.rimY + 22}, ${spec.rimRight - 2} ${spec.rimY + 30}, ${spec.rimRight + 4} ${spec.rimY + 32}" 
                fill="none" 
                stroke="${twistInner}" 
                stroke-width="1.8" 
                stroke-linecap="round"/>
        </g>
      `;
    }
  });

  return garnishHtml;
}

function getMinimalSVG(cocktail) {
  const glassName = cocktail.glassware[0] || 'Coupeglas';
  const spec = glasswareSpecs[glassName] || glasswareSpecs['Coupeglas'];
  
  // Extract liquid colors
  const liquidIngredients = cocktail.ingredients.filter(i => i.role === 'ingredient' && i.amount.value_ml > 0);
  const mainColor = liquidIngredients.length > 0 ? getIngredientColor(liquidIngredients[0].name) : 'rgba(212, 175, 55, 0.4)';
  const colors = getGradColors(mainColor);
  
  // Generate a random ID suffix to ensure uniqueness in the DOM
  const rand = Math.random().toString(36).substr(2, 5);
  const uniqueId = `glass-mini-clip-${cocktail.id}-${rand}`;
  const gradId = `glass-mini-grad-${cocktail.id}-${rand}`;
  
  // Check if it has ice and straw
  const hasIce = ['Rocks-Glas', 'Highball-Glas', 'Collins-Glas', 'Kupferbecher', 'Tiki-Becher', 'Tiki-Glas', 'hitzefestes Glas'].includes(glassName);
  const hasStraw = ['Highball-Glas', 'Collins-Glas', 'Kupferbecher', 'Tiki-Becher', 'Tiki-Glas'].includes(glassName);
  
  let iceHtml = '';
  if (hasIce) {
    const cavityHeight = spec.yMax - spec.yMin;
    const yMid = spec.yMin + cavityHeight * 0.5;
    const yLow = spec.yMin + cavityHeight * 0.75;
    iceHtml = `
      <rect x="76" y="${yLow - 12}" width="24" height="24" rx="4" ry="4" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.3)" stroke-width="0.8" transform="rotate(15, 88, ${yLow})"/>
      <rect x="94" y="${yMid - 10}" width="20" height="20" rx="4" ry="4" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.3)" stroke-width="0.8" transform="rotate(-25, 104, ${yMid})"/>
    `;
  }
  
  let strawHtml = '';
  if (hasStraw) {
    const strawTopX = spec.rimRight - 10;
    const strawTopY = spec.rimY - 30;
    const strawBotX = spec.rimLeft + 20;
    const strawBotY = spec.yMax - 10;
    strawHtml = `
      <line x1="${strawBotX}" y1="${strawBotY}" x2="${strawTopX}" y2="${strawTopY}" stroke="var(--accent-color)" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="${strawBotX}" y1="${strawBotY}" x2="${strawTopX}" y2="${strawTopY}" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="3 4" stroke-linecap="round" opacity="0.8"/>
    `;
  }
  
  let highlightHtml = '';
  if (spec.highlight) {
    highlightHtml = `<path d="${spec.highlight}" fill="rgba(255, 255, 255, 0.08)" pointer-events="none" />`;
  }

  const garnishHtml = getGarnishSVG(cocktail, spec);
  
  return `
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <clipPath id="${uniqueId}">
          <path d="${spec.cavity}"/>
        </clipPath>
        <linearGradient id="${gradId}" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="${colors.bottom}" />
          <stop offset="100%" stop-color="${colors.top}" />
        </linearGradient>
        <radialGradient id="cherry-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ff4d6d" />
          <stop offset="40%" stop-color="#c1121f" />
          <stop offset="100%" stop-color="#780000" />
        </radialGradient>
      </defs>
      <!-- Cavity liquid mockup with absolute origin-relative clip path to bypass hash routing bug -->
      <g clip-path="url(/#${uniqueId})">
        <rect x="0" y="0" width="200" height="200" fill="rgba(255,255,255,0.03)"/>
        <rect x="0" y="${spec.yMin + (spec.yMax - spec.yMin)*0.25}" width="200" height="200" fill="url(/#${gradId})"/>
        ${iceHtml}
      </g>
      ${strawHtml}
      <!-- Glass outline -->
      <path d="${spec.cavity}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2"/>
      ${highlightHtml}
      <path d="${spec.body}" fill="${spec.fill}" stroke="${spec.stroke}" stroke-width="${spec.strokeWidth}"/>
      ${garnishHtml}
    </svg>
  `;
}

function drawGlasswareSVG(cocktail) {
  const container = document.getElementById('detail-glassware-display');
  if (!container) return;

  const glassName = cocktail.glassware[0] || 'Coupeglas';
  const spec = glasswareSpecs[glassName] || glasswareSpecs['Coupeglas'];
  
  // 1. Calculate liquid ingredients and ratios
  const liquids = cocktail.ingredients.filter(i => {
    return i.role === 'ingredient' && i.amount.value_ml !== null && i.amount.value_ml !== undefined;
  });

  const totalVolume = liquids.reduce((sum, current) => sum + (current.amount.value_ml || 0), 0);
  
  let layersHtml = '';
  let sparklesHtml = '';
  let gradientsDef = '';
  const rand = Math.random().toString(36).substr(2, 5);
  
  // 2. Set up layers if the drink contains liquids
  if (totalVolume > 0) {
    const cavityHeight = spec.yMax - spec.yMin;
    const liquidTotalHeight = cavityHeight * 0.85; // liquid fills 85% of cavity height
    
    let currentY = spec.yMax;
    
    liquids.forEach((liq, idx) => {
      const volRatio = (liq.amount.value_ml || 0) / totalVolume;
      const layerHeight = liquidTotalHeight * volRatio;
      
      const layerY = currentY - layerHeight;
      const color = getIngredientColor(liq.name);
      const colors = getGradColors(color);
      const layerGradId = `glass-layer-grad-${cocktail.id}-${rand}-${idx}`;
      
      gradientsDef += `
        <linearGradient id="${layerGradId}" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="${colors.bottom}" />
          <stop offset="100%" stop-color="${colors.top}" />
        </linearGradient>
      `;

      layersHtml += `
        <rect class="liquid-layer" 
              x="0" 
              y="${currentY}" 
              width="200" 
              height="0" 
              fill="url(/#${layerGradId})"
              data-target-y="${layerY}" 
              data-target-height="${layerHeight}"/>
      `;
      
      currentY = layerY;
    });

    // Check for fizzness
    const isFizzy = cocktail.ingredients.some(i => {
      const name = i.name.toLowerCase();
      return name.includes("soda") || name.includes("tonic") || name.includes("prosecco") || 
             name.includes("champagner") || name.includes("ginger beer") || name.includes("sekt") ||
             name.includes("cola") || name.includes("fizz") || name.includes("spritz");
    });

    if (isFizzy) {
      const bY = spec.yMax;
      sparklesHtml = `
        <!-- Fizzy Bubbles starting near bottom -->
        <circle class="sparkle" cx="82" cy="${bY - 15}" r="1.5" />
        <circle class="sparkle" cx="118" cy="${bY - 25}" r="2.2" />
        <circle class="sparkle" cx="100" cy="${bY - 20}" r="1.8" />
        <circle class="sparkle" cx="90" cy="${bY - 35}" r="2" />
        <circle class="sparkle" cx="110" cy="${bY - 10}" r="1.2" />
        <circle class="sparkle" cx="76" cy="${bY - 30}" r="1.6" />
        <circle class="sparkle" cx="124" cy="${bY - 18}" r="1.8" />
      `;
    }
  }

  // 3. Render Garnishes
  const garnishHtml = getGarnishSVG(cocktail, spec);

  // 4. Determine ice, straw, and custom highlight overlays
  let iceCubesHtml = '';
  const hasIce = ['Rocks-Glas', 'Highball-Glas', 'Collins-Glas', 'Kupferbecher', 'Tiki-Becher', 'Tiki-Glas', 'hitzefestes Glas'].includes(glassName);
  
  if (hasIce && totalVolume > 0) {
    const cavityHeight = spec.yMax - spec.yMin;
    const yMid = spec.yMin + cavityHeight * 0.5;
    const yLow = spec.yMin + cavityHeight * 0.75;
    const yHigh = spec.yMin + cavityHeight * 0.28;
    
    iceCubesHtml = `
      <!-- Luxury Floating Ice Cubes -->
      <g opacity="0.85">
        <rect x="74" y="${yLow - 15}" width="32" height="32" rx="6" ry="6" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" transform="rotate(15, 90, ${yLow})"/>
        <rect x="94" y="${yMid - 14}" width="28" height="28" rx="5" ry="5" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" transform="rotate(-25, 108, ${yMid})"/>
        <rect x="68" y="${yHigh - 10}" width="26" height="26" rx="5" ry="5" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.2" transform="rotate(40, 81, ${yHigh})"/>
      </g>
    `;
  }

  let strawHtml = '';
  const hasStraw = ['Highball-Glas', 'Collins-Glas', 'Kupferbecher', 'Tiki-Becher', 'Tiki-Glas'].includes(glassName);
  
  if (hasStraw) {
    const strawTopX = spec.rimRight - 10;
    const strawTopY = spec.rimY - 45;
    const strawBotX = spec.rimLeft + 20;
    const strawBotY = spec.yMax - 10;
    
    strawHtml = `
      <!-- Premium Paper Straw -->
      <g>
        <line x1="${strawBotX}" y1="${strawBotY}" x2="${strawTopX}" y2="${strawTopY}" stroke="var(--accent-color)" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="${strawBotX}" y1="${strawBotY}" x2="${strawTopX}" y2="${strawTopY}" stroke="#ffffff" stroke-width="4.5" stroke-dasharray="4 6" stroke-linecap="round" opacity="0.8"/>
      </g>
    `;
  }

  let highlightHtml = '';
  if (spec.highlight) {
    highlightHtml = `<path d="${spec.highlight}" fill="rgba(255, 255, 255, 0.12)" pointer-events="none" />`;
  }

  // 5. Assemble the whole SVG code
  const isTiki = spec.isTiki;
  const detailClipId = `detail-glass-clip-${cocktail.id}`;

  let svgCode = `
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <!-- Clip path to mask the stacked liquid layers with absolute path prefix -->
        <clipPath id="${detailClipId}">
          <path d="${spec.cavity}"/>
        </clipPath>
        <radialGradient id="cherry-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ff4d6d" />
          <stop offset="40%" stop-color="#c1121f" />
          <stop offset="100%" stop-color="#780000" />
        </radialGradient>
        ${gradientsDef}
      </defs>

      <!-- Liquid Cavity Box with absolute clip-path path to bypass hash routing bug -->
      <g clip-path="url(/#${detailClipId})">
        <!-- Inside cavity dark background shadow -->
        <rect x="0" y="0" width="200" height="200" fill="var(--liquid-mask-color)"/>
        
        <!-- Stacked ingredients liquid layers -->
        ${layersHtml}
        
        <!-- Ice cubes inside liquid -->
        ${iceCubesHtml}
        
        <!-- Sparkles/fizzy bubbles -->
        ${sparklesHtml}
      </g>
      
      <!-- Premium Straw -->
      ${strawHtml}
      
      <!-- Shiny highlights inside glass bowl using absolute global gradient -->
      <path d="${spec.cavity}" fill="url(/#shine-overlay)" opacity="0.8"/>
      
      <!-- Custom glossy highlight paths -->
      ${highlightHtml}

      <!-- Inner glass cavity stroke outline -->
      <path d="${spec.cavity}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="2" />

      <!-- Glass outer structure (mug, handle, stem, base) -->
      <path d="${spec.body}" fill="${spec.fill}" stroke="${spec.stroke}" stroke-width="${spec.strokeWidth}" stroke-linejoin="round" />
  `;

  // Draw Tiki Face carvings if Tiki style
  if (isTiki) {
    svgCode += `
      <!-- Tiki Head Carvings -->
      <g fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="3" stroke-linecap="round" opacity="0.6">
        <!-- Eyes -->
        <path d="M 80 75 Q 85 70 90 75 Q 85 80 80 75" />
        <path d="M 110 75 Q 115 70 120 75 Q 115 80 110 75" />
        <!-- Nose -->
        <path d="M 100 75 L 100 100 L 95 105 L 105 105" />
        <!-- Mouth -->
        <path d="M 85 125 Q 100 135 115 125 Q 100 115 85 125 Z" fill="rgba(0,0,0,0.15)"/>
        <!-- Face contours -->
        <path d="M 72 60 C 72 60 76 90 76 105" />
        <path d="M 128 60 C 128 60 124 90 124 105" />
      </g>
    `;
  }

  // Inject garnishes
  svgCode += `${garnishHtml}</svg>`;
  
  container.innerHTML = svgCode;

  // 5. Trigger CSS liquid filling animation after short delay
  setTimeout(() => {
    container.querySelectorAll('.liquid-layer').forEach(layer => {
      const targetY = layer.getAttribute('data-target-y');
      const targetHeight = layer.getAttribute('data-target-height');
      
      layer.setAttribute('y', targetY);
      layer.setAttribute('height', targetHeight);
    });
  }, 60);
}

/* ----------------------------------------------------
   UI EVENT LISTENERS & SETUP
   ---------------------------------------------------- */
function setupUIEventListeners() {
  // Theme Toggle click
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Search input listeners
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear-btn');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (e.target.value.length > 0) {
        searchClear.classList.remove('hidden');
      } else {
        searchClear.classList.add('hidden');
      }
      renderSearch();
    });

    searchInput.addEventListener('search', (e) => {
      state.searchQuery = e.target.value;
      renderSearch();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClear.classList.add('hidden');
      renderSearch();
    });
  }

  // Search filter pills toggle
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.activeFilter = e.target.getAttribute('data-filter');
      renderSearch();
    });
  });

  // Drawer buttons listeners
  const favBtn = document.getElementById('detail-fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', toggleFavoriteDetail);
  }

  const shareBtn = document.getElementById('detail-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', shareShareOrCopy);
  }

  const closeDrawerBtn = document.getElementById('drawer-close-btn');
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeRecipeDrawer);
  }

  const backdrop = document.getElementById('drawer-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeRecipeDrawer);
  }

  // Servings controls
  const decBtn = document.getElementById('servings-dec-btn');
  const incBtn = document.getElementById('servings-inc-btn');
  const rangeSlider = document.getElementById('servings-range-slider');

  if (decBtn) decBtn.addEventListener('click', () => changeServings(-1));
  if (incBtn) incBtn.addEventListener('click', () => changeServings(1));
  if (rangeSlider) {
    rangeSlider.addEventListener('input', (e) => handleServingsSlider(e.target.value));
  }

  // Bar inventory search
  const barSearchInput = document.getElementById('inventory-search');
  if (barSearchInput) {
    barSearchInput.addEventListener('input', (e) => filterInventory(e.target.value));
  }

  // Bar tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabTarget = e.target.getAttribute('data-tab');
      
      // Update tab buttons state
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      // Update tab content panels state
      document.querySelectorAll('.tab-content').forEach(panel => panel.classList.remove('active'));
      document.getElementById(`bar-tab-${tabTarget}`).classList.add('active');
    });
  });

  // PWA banner close
  const pwaClose = document.getElementById('pwa-close-btn');
  if (pwaClose) {
    pwaClose.addEventListener('click', () => {
      document.getElementById('pwa-install-banner').classList.add('hidden');
    });
  }

  // Randomizer - Mixology Roulette button click
  const rouletteBtn = document.getElementById('roulette-btn');
  if (rouletteBtn) {
    rouletteBtn.addEventListener('click', triggerRandomCocktail);
  }
}

function shareShareOrCopy() {
  shareCocktail();
}

/* ----------------------------------------------------
   SWIPE GESTURE TO CLOSE RECIPE SHEET
   ---------------------------------------------------- */
function setupSwipeToDismiss() {
  const sheet = document.querySelector('.drawer-sheet');
  const overlay = document.getElementById('recipe-drawer');
  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  sheet.addEventListener('touchstart', (e) => {
    // Only allow swipe gesture on top handle or header zone
    const target = e.target;
    if (target.classList.contains('drawer-handle') || target.closest('.drawer-visual-section')) {
      startY = e.touches[0].clientY;
      isDragging = true;
      sheet.style.transition = 'none';
    }
  }, { passive: true });

  sheet.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    // Only allow pulling down (positive values)
    if (diff > 0) {
      sheet.style.transform = `translateY(${diff}px)`;
      // Fade out background backdrop slightly during pull
      const opacity = 1 - (diff / (window.innerHeight * 0.95));
      overlay.style.opacity = Math.max(opacity, 0.2);
    }
  }, { passive: true });

  sheet.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    sheet.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    overlay.style.transition = 'opacity 0.3s ease';
    
    const diff = currentY - startY;
    const threshold = window.innerHeight * 0.22; // 22% height pull to dismiss
    
    if (diff > threshold) {
      closeRecipeDrawer();
    } else {
      // Bounce back to open state
      sheet.style.transform = 'translateY(0)';
      overlay.style.opacity = 1;
    }
    // Clean transition styles so CSS styles take over
    setTimeout(() => {
      sheet.style.transition = '';
      overlay.style.transition = '';
    }, 300);
  });
}

/* ----------------------------------------------------
   IOS DETECTOR & INSTALL INSTRUCTIONS PROMPT
   ---------------------------------------------------- */
function checkIOSPWA() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.navigator.standalone === true;
  
  if (isIOS && !isStandalone) {
    const installBanner = document.getElementById('pwa-install-banner');
    // Show banner after 8 seconds of engagement
    setTimeout(() => {
      if (installBanner && state.activeView === 'explore') {
        installBanner.classList.remove('hidden');
      }
    }, 8000);
  }
}

/* Shaker randomizer logic */
function triggerRandomCocktail() {
  const shakerOverlay = document.getElementById('shaker-overlay');
  if (!shakerOverlay) return;

  // Show shaker overlay
  shakerOverlay.classList.remove('hidden');

  // Wait 1.3 seconds for shaking animation to run
  setTimeout(() => {
    if (state.cocktails.length === 0) return;
    const randomIndex = Math.floor(Math.random() * state.cocktails.length);
    const randomCocktail = state.cocktails[randomIndex];

    // Hide shaker
    shakerOverlay.classList.add('hidden');

    // Route to the random cocktail
    window.location.hash = `#cocktail-${randomCocktail.id}`;
  }, 1300);
}
