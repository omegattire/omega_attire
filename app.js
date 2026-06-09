/* ============================================================
   OMEGA ATTIRE – app.js
   Handles: nav, dark mode, stats counter, reviews, gallery,
   form validation, upload preview, FAQ, lightbox, toast
   ============================================================ */

// ── SUPABASE CONFIG ────────────────────────────────────────────
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// ── SAMPLE DATA (used until Supabase is connected) ─────────────
const SAMPLE_REVIEWS = [
  {
    id: 1, name: 'Arjun Sharma', city: 'Chennai', rating: 5,
    product: 'Custom Printed T-Shirt',
    text: 'Absolutely blown away by the quality! Ordered 10 custom tees for our college fest and every single one came out perfect. The print is crisp, colours are vibrant, and the fabric is super soft. Delivery was on time too!',
    date: '2025-11-14', verified: true, approved: true,
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80']
  },
  {
    id: 2, name: 'Priya Nair', city: 'Kochi', rating: 5,
    product: 'Couple T-Shirts',
    text: 'Ordered couple tees for our anniversary and they turned out gorgeous! The design I sent was printed exactly as I wanted. The packaging was neat and the delivery was faster than expected. Highly recommend Omega Attire!',
    date: '2025-11-10', verified: true, approved: true,
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&q=80']
  },
  {
    id: 3, name: 'Rahul Verma', city: 'Mumbai', rating: 5,
    product: 'Team / Bulk Order',
    text: 'Placed a bulk order of 50 tees for our startup team. The quality is consistent across all pieces, pricing is fair, and the team at Omega was super responsive to all my queries. Will definitely order again!',
    date: '2025-11-05', verified: true, approved: true,
    images: []
  },
  {
    id: 4, name: 'Sneha Reddy', city: 'Hyderabad', rating: 4,
    product: 'Oversized T-Shirt',
    text: 'Love the oversized fit and the print quality is amazing. Slight delay in delivery but the customer support kept me updated throughout. Overall a great experience and I will order more!',
    date: '2025-10-28', verified: true, approved: true,
    images: ['https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&q=80']
  },
  {
    id: 5, name: 'Karthik M', city: 'Bangalore', rating: 5,
    product: 'Round Neck T-Shirt',
    text: 'Third time ordering from Omega Attire and they never disappoint. The fabric quality keeps getting better. My friends always ask where I got my tees from. Best custom printing service in India!',
    date: '2025-10-20', verified: true, approved: true,
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&q=80']
  },
  {
    id: 6, name: 'Divya Pillai', city: 'Trivandrum', rating: 5,
    product: 'Polo T-Shirt',
    text: 'Ordered polo tees for our office team of 25. Everyone loved them! The embroidery on the logo was precise and the polo fabric is premium quality. Will definitely come back for the next batch.',
    date: '2025-10-15', verified: true, approved: true,
    images: []
  }
];

const SAMPLE_GALLERY = [
  { src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80', name: 'Arjun S.', city: 'Chennai' },
  { src: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80', name: 'Priya N.', city: 'Kochi' },
  { src: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&q=80', name: 'Sneha R.', city: 'Hyderabad' },
  { src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80', name: 'Karthik M.', city: 'Bangalore' },
  { src: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80', name: 'Ananya K.', city: 'Pune' },
  { src: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&q=80', name: 'Vikram T.', city: 'Delhi' },
  { src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80', name: 'Meera J.', city: 'Kolkata' },
  { src: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80', name: 'Rohit S.', city: 'Ahmedabad' },
];

// ── UTILITIES ──────────────────────────────────────────────────
function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function avatarColor(name) {
  const colors = ['#E61919','#0d47a1','#2e7d32','#6a1b9a','#e65100','#00695c'];
  let h = 0; for (let c of name) h = (h * 31 + c.charCodeAt(0)) % colors.length;
  return colors[h];
}
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── NAVBAR ─────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 40));
if (hamburger) hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// ── DARK MODE ──────────────────────────────────────────────────
const darkToggle = document.getElementById('darkToggle');
const prefersDark = localStorage.getItem('omega-dark') === '1';
if (prefersDark) document.body.classList.add('dark');
if (darkToggle) {
  darkToggle.textContent = document.body.classList.contains('dark') ? '☀' : '☽';
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('omega-dark', isDark ? '1' : '0');
    darkToggle.textContent = isDark ? '☀' : '☽';
  });
}

// ── SCROLL REVEAL ──────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));
}

// ── STATS COUNTER ──────────────────────────────────────────────
function animateCount(el, target, isDecimal = false, suffix = '') {
  let start = 0; const duration = 1800;
  const step = ts => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    const val = isDecimal ? (ease * target).toFixed(1) : Math.floor(ease * target);
    el.textContent = val + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCount(document.getElementById('stat-reviews'), 528);
      animateCount(document.getElementById('stat-rating'), 4.8, true);
      animateCount(document.getElementById('stat-customers'), 1200, false, '+');
      animateCount(document.getElementById('stat-satisfaction'), 97, false, '%');
      statsObs.disconnect();
    }
  }, { threshold: 0.3 });
  statsObs.observe(statsSection);
}

// ── RENDER REVIEW CARD ─────────────────────────────────────────
function renderReviewCard(r) {
  const imgs = (r.images || []).slice(0, 3).map(src =>
    `<img src="${src}" class="review-img" alt="Customer photo" loading="lazy" onclick="openLightbox('${src}')">`
  ).join('');
  return `
    <div class="review-card reveal">
      <div class="review-top">
        <div class="review-author">
          <div class="review-avatar" style="background:${avatarColor(r.name)}">${initials(r.name)}</div>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="review-city">📍 ${r.city}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div class="review-stars">${stars(r.rating)}</div>
          ${r.verified ? '<div class="verified-badge">✓ Verified</div>' : ''}
        </div>
      </div>
      <div class="review-text">"${r.text}"</div>
      <div class="review-product">🛍 ${r.product}</div>
      <div class="review-date">${formatDate(r.date)}</div>
      ${imgs ? `<div class="review-images">${imgs}</div>` : ''}
      <button class="review-share" onclick="shareReview('${r.name}', ${r.rating})">🔗 Share</button>
    </div>`;
}

// ── FEATURED REVIEWS (homepage) ────────────────────────────────
const featuredContainer = document.getElementById('featuredReviews');
if (featuredContainer) {
  const featured = SAMPLE_REVIEWS.filter(r => r.rating === 5).slice(0, 3);
  featuredContainer.innerHTML = featured.map(renderReviewCard).join('');
  // trigger reveal after render
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }, 100);
}

// ── GALLERY (homepage preview) ─────────────────────────────────
const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
  galleryGrid.innerHTML = SAMPLE_GALLERY.slice(0, 8).map(g => `
    <div class="gallery-item" onclick="openLightbox('${g.src}')">
      <img src="${g.src}" alt="${g.name}" loading="lazy">
      <div class="gallery-overlay">
        <div class="gallery-overlay-text">${g.name} · ${g.city}</div>
      </div>
    </div>`).join('');
}

// ── REVIEWS PAGE ───────────────────────────────────────────────
const allReviewsContainer = document.getElementById('allReviews');
if (allReviewsContainer) {
  let currentPage = 1;
  const perPage = 6;
  let filtered = [...SAMPLE_REVIEWS];

  function renderReviewsPage() {
    const start = (currentPage - 1) * perPage;
    const slice = filtered.slice(start, start + perPage);
    allReviewsContainer.innerHTML = slice.length
      ? slice.map(renderReviewCard).join('')
      : '<p style="text-align:center;color:var(--grey-3);padding:40px">No reviews found.</p>';
    renderPagination();
    window.scrollTo({ top: 200, behavior: 'smooth' });
    // Re-observe reveal
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
      });
    }, 100);
  }

  function renderPagination() {
    const total = Math.ceil(filtered.length / perPage);
    const pag = document.getElementById('pagination');
    if (!pag) return;
    pag.innerHTML = '';
    for (let i = 1; i <= total; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.onclick = () => { currentPage = i; renderReviewsPage(); };
      pag.appendChild(btn);
    }
  }

  const searchInput = document.getElementById('searchReviews');
  const ratingFilter = document.getElementById('ratingFilter');
  const sortSelect = document.getElementById('sortSelect');

  function applyFilters() {
    const q = searchInput?.value.toLowerCase() || '';
    const rating = parseInt(ratingFilter?.value) || 0;
    const sort = sortSelect?.value || 'latest';
    filtered = SAMPLE_REVIEWS
      .filter(r => r.approved)
      .filter(r => !q || r.text.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
      .filter(r => !rating || r.rating === rating)
      .sort((a, b) => sort === 'latest'
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date));
    currentPage = 1;
    renderReviewsPage();
  }

  searchInput?.addEventListener('input', applyFilters);
  ratingFilter?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);
  renderReviewsPage();
}

// ── GALLERY PAGE ───────────────────────────────────────────────
const fullGallery = document.getElementById('fullGallery');
if (fullGallery) {
  fullGallery.innerHTML = SAMPLE_GALLERY.map(g => `
    <div class="gallery-item" onclick="openLightbox('${g.src}')">
      <img src="${g.src}" alt="${g.name}" loading="lazy">
      <div class="gallery-overlay">
        <div class="gallery-overlay-text">${g.name} · ${g.city}</div>
      </div>
    </div>`).join('');
}

// ── STAR INPUT ────────────────────────────────────────────────
const starInput = document.getElementById('starInput');
const ratingVal = document.getElementById('ratingVal');
const starLabel = document.getElementById('starLabel');
const starLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];
if (starInput) {
  const starEls = starInput.querySelectorAll('.star');
  starEls.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const v = +star.dataset.val;
      starEls.forEach(s => s.classList.toggle('active', +s.dataset.val <= v));
      if (starLabel) starLabel.textContent = starLabels[v];
    });
    star.addEventListener('click', () => {
      const v = +star.dataset.val;
      ratingVal.value = v;
      starEls.forEach(s => s.classList.toggle('active', +s.dataset.val <= v));
      starEls.forEach(s => s.dataset.selected = +s.dataset.val <= v);
      if (starLabel) starLabel.textContent = starLabels[v] + ' (' + v + '/5)';
    });
  });
  starInput.addEventListener('mouseleave', () => {
    const v = +ratingVal.value;
    starEls.forEach(s => s.classList.toggle('active', +s.dataset.val <= v));
    if (starLabel) starLabel.textContent = v ? starLabels[v] + ' (' + v + '/5)' : 'Select rating';
  });
}

// ── PHOTO UPLOAD ──────────────────────────────────────────────
const uploadZone = document.getElementById('uploadZone');
const photoInput = document.getElementById('photoInput');
const photoPreviews = document.getElementById('photoPreviews');
let selectedFiles = [];

if (uploadZone) {
  uploadZone.addEventListener('click', () => photoInput.click());
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault(); uploadZone.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files));
  });
  photoInput.addEventListener('change', () => handleFiles(Array.from(photoInput.files)));
}

function handleFiles(files) {
  const allowed = files.filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
  const photoErr = document.getElementById('photoErr');
  if (files.length !== allowed.length && photoErr) photoErr.textContent = 'Some files were skipped (not an image or >5MB).';
  selectedFiles = [...selectedFiles, ...allowed].slice(0, 5);
  renderPreviews();
}

function renderPreviews() {
  if (!photoPreviews) return;
  photoPreviews.innerHTML = selectedFiles.map((f, i) => {
    const url = URL.createObjectURL(f);
    return `<div style="position:relative;display:inline-block">
      <img src="${url}" class="preview-thumb" alt="preview">
      <button class="preview-remove" onclick="removePhoto(${i})">✕</button>
    </div>`;
  }).join('');
}
window.removePhoto = (i) => { selectedFiles.splice(i, 1); renderPreviews(); };

// ── TEXTAREA CHAR COUNT ───────────────────────────────────────
const reviewTA = document.getElementById('review');
const charCount = document.getElementById('charCount');
if (reviewTA) {
  reviewTA.addEventListener('input', () => {
    if (charCount) charCount.textContent = reviewTA.value.length;
    if (reviewTA.value.length > 500) reviewTA.value = reviewTA.value.slice(0, 500);
  });
}

// ── FORM VALIDATION & SUBMIT ──────────────────────────────────
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const city = document.getElementById('city');
    const product = document.getElementById('product');
    const review = document.getElementById('review');
    const nameErr = document.getElementById('nameErr');
    const cityErr = document.getElementById('cityErr');
    const productErr = document.getElementById('productErr');
    const reviewErr = document.getElementById('reviewErr');
    const ratingErr = document.getElementById('ratingErr');

    nameErr.textContent = ''; cityErr.textContent = '';
    productErr.textContent = ''; reviewErr.textContent = ''; ratingErr.textContent = '';

    if (!name.value.trim()) { nameErr.textContent = 'Please enter your name.'; valid = false; }
    if (!city.value.trim()) { cityErr.textContent = 'Please enter your city.'; valid = false; }
    if (!ratingVal.value) { ratingErr.textContent = 'Please select a star rating.'; valid = false; }
    if (!product.value) { productErr.textContent = 'Please select a product type.'; valid = false; }
    if (review.value.trim().length < 20) { reviewErr.textContent = 'Review must be at least 20 characters.'; valid = false; }
    if (!valid) return;

    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const formSuccess = document.getElementById('formSuccess');

    submitText.hidden = true; submitSpinner.hidden = false;
    submitBtn.disabled = true;

    try {
      // Try Supabase submit if configured
      if (SUPABASE_URL !== 'https://YOUR_PROJECT.supabase.co') {
        await submitToSupabase({ name: name.value, city: city.value, rating: ratingVal.value, product: product.value, text: review.value });
      } else {
        // Demo mode – simulate delay
        await new Promise(r => setTimeout(r, 1400));
      }
      formSuccess.hidden = false;
      reviewForm.reset();
      selectedFiles = []; renderPreviews();
      if (starLabel) starLabel.textContent = 'Select rating';
      starInput?.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    } catch (err) {
      showToast('❌ Submission failed. Please try again.');
    } finally {
      submitText.hidden = false; submitSpinner.hidden = true; submitBtn.disabled = false;
    }
  });
}

// ── SUPABASE SUBMIT ───────────────────────────────────────────
async function submitToSupabase(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ ...data, approved: false, verified: false, created_at: new Date().toISOString() })
  });
  if (!res.ok) throw new Error('Supabase error');
}

// ── FAQ ACCORDION ─────────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── CONTACT FORM ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll reply within 24 hours.');
    contactForm.reset();
  });
}

// ── LIGHTBOX ──────────────────────────────────────────────────
let lightbox = null;
window.openLightbox = (src) => {
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `<button class="lightbox-close" onclick="closeLightbox()">✕</button><img src="" alt="Preview">`;
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.body.appendChild(lightbox);
  }
  lightbox.querySelector('img').src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeLightbox = () => {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
};
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── SHARE REVIEW ──────────────────────────────────────────────
window.shareReview = (name, rating) => {
  const text = `Check out ${name}'s ${rating}★ review for Omega Attire custom T-shirts! #OmegaAttire`;
  if (navigator.share) {
    navigator.share({ title: 'Omega Attire Review', text, url: window.location.href });
  } else {
    navigator.clipboard.writeText(text + ' ' + window.location.href);
    showToast('🔗 Link copied to clipboard!');
  }
};

// ── ADMIN AUTH ────────────────────────────────────────────────
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', e => {
    e.preventDefault();
    const pw = document.getElementById('adminPassword').value;
    const err = document.getElementById('loginErr');
    // In production, replace with real Supabase Auth
    if (pw === 'omega@admin2025') {
      sessionStorage.setItem('omega-admin', '1');
      document.getElementById('adminLogin').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'grid';
      loadAdminDashboard();
    } else {
      err.textContent = 'Incorrect password.';
    }
  });
}

// Check if already logged in
if (document.getElementById('adminDashboard')) {
  if (sessionStorage.getItem('omega-admin') === '1') {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'grid';
    loadAdminDashboard();
  }
}

// Admin logout
window.adminLogout = () => {
  sessionStorage.removeItem('omega-admin');
  document.getElementById('adminLogin').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
};

// ── ADMIN DASHBOARD ───────────────────────────────────────────
function loadAdminDashboard() {
  // Stats
  const pending = SAMPLE_REVIEWS.filter(r => !r.approved).length;
  document.getElementById('adTotal') && (document.getElementById('adTotal').textContent = SAMPLE_REVIEWS.length);
  document.getElementById('adPending') && (document.getElementById('adPending').textContent = pending);
  document.getElementById('adApproved') && (document.getElementById('adApproved').textContent = SAMPLE_REVIEWS.filter(r => r.approved).length);

  // Table
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE_REVIEWS.map(r => `
    <tr id="row-${r.id}">
      <td><strong>${r.name}</strong><br><small>${r.city}</small></td>
      <td style="color:#f5a623">${stars(r.rating)}</td>
      <td style="max-width:220px;font-size:.85rem">${r.text.slice(0, 80)}…</td>
      <td><span style="font-size:.8rem">${r.product}</span></td>
      <td><span class="status-badge ${r.approved ? 'status-approved' : 'status-pending'}">${r.approved ? 'Approved' : 'Pending'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn action-approve" onclick="adminAction(${r.id},'approve')">✓</button>
          <button class="action-btn action-reject" onclick="adminAction(${r.id},'reject')">✗</button>
          <button class="action-btn action-delete" onclick="adminAction(${r.id},'delete')">🗑</button>
        </div>
      </td>
    </tr>`).join('');
}

window.adminAction = (id, action) => {
  const row = document.getElementById('row-' + id);
  if (action === 'delete') { row?.remove(); showToast('🗑 Review deleted.'); return; }
  const badge = row?.querySelector('.status-badge');
  if (badge) {
    badge.className = 'status-badge ' + (action === 'approve' ? 'status-approved' : 'status-rejected');
    badge.textContent = action === 'approve' ? 'Approved' : 'Rejected';
  }
  showToast(action === 'approve' ? '✅ Review approved.' : '❌ Review rejected.');
};
