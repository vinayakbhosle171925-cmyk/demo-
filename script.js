// Minimal interactivity: mobile nav toggle and client-side filtering for the demo cards.
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  navToggle?.addEventListener('click', () => {
    if (!nav) return;
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.gap = '10px';
  });

  const search = document.getElementById('search');
  const sector = document.getElementById('sector');
  const aiRisk = document.getElementById('aiRisk');
  const salary = document.getElementById('salary');
  const cards = [...document.querySelectorAll('.card')];

  function applyFilters() {
    const q = search.value.trim().toLowerCase();
    const s = sector.value;
    const a = aiRisk.value;
    const sal = salary.value;

    cards.forEach(card => {
      const title = card.dataset.title?.toLowerCase() || '';
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
});
