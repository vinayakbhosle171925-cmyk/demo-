document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle (unchanged)
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  navToggle?.addEventListener('click', () => {
    if (!nav) return;
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.gap = '10px';
  });

  // Controls
  const search = document.getElementById('search');
  const sector = document.getElementById('sector');
  const aiRisk = document.getElementById('aiRisk');
  const salary = document.getElementById('salary');
  const cardsContainer = document.getElementById('cards');

  let careers = [];

  function formatSalary(s) {
    if (s === '100+') return '$100k+';
    if (s === '50-100') return '$50k–$100k';
    if (s === '0-50') return 'Under $50k';
    return s;
  }
  function capitalize(s) { return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }

  async function loadCareers() {
    try {
      const res = await fetch('careers.json');
      careers = await res.json();
      renderCards(careers);
    } catch (err) {
      console.error('Failed to load careers.json', err);
      cardsContainer.innerHTML = '<div class="muted">Failed to load career data.</div>';
    }
  }

  function renderCards(list) {
    cardsContainer.innerHTML = '';
    list.forEach(c => {
      const card = document.createElement('article');
      card.className = 'card';
      card.dataset.title = c.title || '';
      card.dataset.sector = c.sector || '';
      card.dataset.airisk = c.ai_vulnerability || '';
      card.dataset.salary = c.salary_range || '';

      card.innerHTML = `
        <h3>${c.title}</h3>
        <p class="meta">Sector: ${c.sector} · Salary: ${formatSalary(c.salary_range)}</p>
        <p class="score">AI Vulnerability: ${capitalize(c.ai_vulnerability)} · FCI: ${c.fci_score}</p>
        <a class="card-link" href="career.html?id=${encodeURIComponent(c.id)}">View details →</a>
      `;
      cardsContainer.appendChild(card);
    });
    applyFilters(); // apply current filters after rendering
  }

  function applyFilters() {
    const q = (search.value || '').trim().toLowerCase();
    const s = sector.value;
    const a = aiRisk.value;
    const sal = salary.value;

    const cards = [...cardsContainer.querySelectorAll('.card')];
    cards.forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const cardSector = card.dataset.sector || '';
      const cardRisk = card.dataset.airisk || '';
      const cardSalary = card.dataset.salary || '';

      let visible = true;
      if (q && !title.includes(q)) visible = false;
      if (s && cardSector !== s) visible = false;
      if (a) {
        if (a === 'low' && cardRisk !== 'low') visible = false;
        if (a === 'medium' && cardRisk !== 'medium') visible = false;
        if (a === 'high' && cardRisk !== 'high') visible = false;
      }
      if (sal) {
        if (sal === '0-50' && cardSalary !== '0-50') visible = false;
        if (sal === '50-100' && cardSalary !== '50-100') visible = false;
        if (sal === '100+' && cardSalary !== '100+') visible = false;
      }

      card.style.display = visible ? '' : 'none';
    });
  }

  [search, sector, aiRisk, salary].forEach(el => {
    el?.addEventListener('input', applyFilters);
    el?.addEventListener('change', applyFilters);
  });

  // Initial load
  loadCareers();
});
