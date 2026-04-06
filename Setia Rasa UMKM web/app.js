// =============================================
// KONFIGURASI - Ganti dengan URL Google Apps Script Anda
// =============================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsZifpqoPGLOaikOZZOyNHp3O2yC-8WyDv6itdOGYIeqCly6Tlt75kk8gyxeviQdlhMw/exec';

// =============================================
// DATA PRODUK
// Untuk ganti foto: isi field "img" dengan path file lokal atau URL gambar
// Contoh lokal : img: 'img/jenang-ketan.jpg'
// Contoh URL   : img: 'https://example.com/foto.jpg'
// Kosongkan    : img: ''  → akan tampil ikon emoji sebagai placeholder
// =============================================
const products = [
  {
    id: 1,
    name: 'Jenang Ketan',
    price: 20000,
    emoji: '🍮',
    desc: 'Jenang ketan legit berbahan beras ketan pilihan dengan gula merah asli.',
    img: '/jenang ketan.jpg'

  },
  {
    id: 2,
    name: 'Wajik Hijau',
    price: 20000,
    emoji: '🟩',
    desc: 'Wajik hijau pandan harum dengan tekstur kenyal dan manis alami.',
    img: '/wajik.png'
  },
  {
    id: 3,
    name: 'Madumongso',
    price: 30000,
    emoji: '🍬',
    desc: 'Madumongso tape ketan hitam manis asam, dibungkus daun jagung.',
    img: '/Madumongso.png'
  },
  {
    id: 4,
    name: 'Kembang Gula',
    price: 8000,
    emoji: '🌸',
    desc: 'Kembang gula tradisional warna-warni, manis dan menyenangkan.',
    img: '/Kembang gula.png'
  },
  {
    id: 5,
    name: 'Enting-Enting Geti',
    price: 7000,
    emoji: '🌰',
    desc: 'Enting-enting wijen renyah dengan rasa manis gurih yang khas.',
    img: '/geti.png'
  },
  {
    id: 6,
    name: 'Permen Tape',
    price: 15000,
    emoji: '🍭',
    desc: 'Permen tape singkong dengan cita rasa asam manis yang unik.',
    img: '/permen tape.png'
  },
  {
    id: 7,
    name: 'Brem',
    price: 12000,
    emoji: '🍫',
    desc: 'Brem padat khas Madiun, terbuat dari sari tape beras yang difermentasi.',
    img: '/Brem.png'
  },
  {
    id: 8,
    name: 'Sambel Pecel',
    price: 15000,
    emoji: '🌶️',
    desc: 'Sambel pecel kacang khas Jawa, pedas gurih cocok untuk berbagai lauk.',
    img: '/sambel pecel.png'
  }
];

// =============================================
// STATE KERANJANG
// =============================================
let cart = [];

// =============================================
// RENDER PRODUK
// =============================================
// =============================================
// RENDER PRODUK - Layout Portrait
// =============================================
function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = products.map(p => {
    const imgContent = p.img
      ? `<img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover group-hover:
      le-105 transition-transform duration-300"/>`
      : `<div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-coklat-100 to-coklat-200">
           <span class="text-6xl">${p.emoji}</span>
           <span class="text-xs text-coklat-400 mt-2">Foto belum diisi</span>
         </div>`;
    return `
    <div class="product-card bg-white rounded-2xl shadow-md overflow-hidden border border-coklat-100 group flex flex-col">
      <!-- Foto portrait: tinggi 72 (288px) -->
      <div class="overflow-hidden bg-coklat-100 h-72 flex-shrink-0">
        ${imgContent}
      </div>
      <!-- Info produk -->
      <div class="p-4 flex flex-col flex-1">
        <h4 class="font-bold text-coklat-700 text-base">${p.name}</h4>
        <p class="text-coklat-400 text-xs mt-1 mb-4 leading-relaxed flex-1">${p.desc}</p>
        <div class="flex items-center justify-between mt-auto">
          <span class="text-coklat-600 font-bold text-base">${formatRupiah(p.price)}</span>
          <button
            onclick="addToCart(${p.id})"
            class="bg-coklat-600 hover:bg-coklat-500 text-white px-3 py-2 rounded-full text-xs font-semibold transition flex items-center gap-1 shadow"
          >
            🛒 Tambah
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}


// =============================================
// KERANJANG
// =============================================
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`${product.name} ditambahkan ke keranjang 🛒`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Badge
  const badge = document.getElementById('cart-count');
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  // Cart items
  const cartItemsEl = document.getElementById('cart-items');
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="text-center text-coklat-300 py-12">
        <div class="text-5xl mb-3">🛒</div>
        <p class="text-sm">Keranjang masih kosong</p>
      </div>`;
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="bg-coklat-50 rounded-xl p-3 flex items-center gap-3">
        <div class="text-2xl">${item.emoji}</div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-coklat-700 text-sm truncate">${item.name}</p>
          <p class="text-coklat-400 text-xs">${formatRupiah(item.price)}</p>
        </div>
        <div class="flex items-center gap-1">
          <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 bg-coklat-200 hover:bg-coklat-300 rounded-full text-coklat-700 font-bold text-sm flex items-center justify-center">−</button>
          <span class="w-6 text-center text-sm font-bold text-coklat-700">${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 bg-coklat-600 hover:bg-coklat-500 rounded-full text-white font-bold text-sm flex items-center justify-center">+</button>
        </div>
        <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 text-lg ml-1">×</button>
      </div>
    `).join('');
  }

  document.getElementById('cart-total').textContent = formatRupiah(total);
}

function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  const isOpen = !sidebar.classList.contains('translate-x-full');
  if (isOpen) {
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
  } else {
    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
  }
}

// =============================================
// CHECKOUT
// =============================================
function openCheckout() {
  if (cart.length === 0) {
    showToast('Keranjang masih kosong!', 'error');
    return;
  }
  // Tutup cart sidebar
  document.getElementById('cart-sidebar').classList.add('translate-x-full');
  document.getElementById('cart-overlay').classList.add('hidden');

  // Isi ringkasan
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById('order-summary').innerHTML = cart.map(i =>
    `<div class="flex justify-between"><span>${i.name} x${i.qty}</span><span>${formatRupiah(i.price * i.qty)}</span></div>`
  ).join('');
  document.getElementById('order-total-display').textContent = formatRupiah(total);

  document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckout() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

function showPaymentInfo(type) {
  document.getElementById('info-bank').classList.add('hidden');
  document.getElementById('info-qris').classList.add('hidden');
  if (type === 'bank') document.getElementById('info-bank').classList.remove('hidden');
  if (type === 'qris') document.getElementById('info-qris').classList.remove('hidden');
}

// =============================================
// SUBMIT PESANAN → GOOGLE SPREADSHEET
// =============================================
async function submitOrder() {
  const nama = document.getElementById('nama').value.trim();
  const telepon = document.getElementById('telepon').value.trim();
  const email = document.getElementById('email').value.trim();
  const alamat = document.getElementById('alamat').value.trim();
  const kota = document.getElementById('kota').value.trim();
  const kodepos = document.getElementById('kodepos').value.trim();
  const catatan = document.getElementById('catatan').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked');

  // Validasi
  if (!nama || !telepon || !alamat || !kota) {
    showToast('Mohon lengkapi data yang wajib diisi (*)', 'error');
    return;
  }
  if (!payment) {
    showToast('Pilih metode pembayaran terlebih dahulu', 'error');
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemsText = cart.map(i => `${i.name} x${i.qty}`).join(', ');
  const timestamp = new Date().toLocaleString('id-ID');
  const orderId = 'SR-' + Date.now().toString().slice(-6);

  const orderData = {
    orderId,
    timestamp,
    nama,
    telepon,
    email,
    alamat: `${alamat}, ${kota}${kodepos ? ', ' + kodepos : ''}`,
    catatan,
    items: itemsText,
    total,
    payment: payment.value
  };

  // Tampilkan loading
  const btn = document.querySelector('#checkout-modal button[onclick="submitOrder()"]');
  btn.textContent = '⏳ Memproses...';
  btn.disabled = true;

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
  } catch (e) {
    // no-cors mode selalu throw, tapi data tetap terkirim
    console.log('Order sent (no-cors)');
  }

  // Reset & tampilkan sukses
  closeCheckout();
  document.getElementById('success-info').textContent =
    `ID Pesanan: ${orderId} · Pembayaran: ${payment.value === 'qris' ? 'QRIS' : 'Transfer Bank'}`;
  document.getElementById('success-modal').classList.remove('hidden');

  // Reset form & cart
  cart = [];
  updateCartUI();
  ['nama','telepon','email','alamat','kota','kodepos','catatan'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.querySelectorAll('input[name="payment"]').forEach(r => r.checked = false);
  document.getElementById('info-bank').classList.add('hidden');
  document.getElementById('info-qris').classList.add('hidden');
  btn.textContent = '✅ Konfirmasi Pesanan';
  btn.disabled = false;
}

function closeSuccess() {
  document.getElementById('success-modal').classList.add('hidden');
}

// =============================================
// UTILITIES
// =============================================
function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function showToast(message, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-lg transition-all ${
    type === 'error' ? 'bg-red-500' : 'bg-coklat-600'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// =============================================
// INIT
// =============================================
function bukaMenu() {
  const section = document.getElementById('menu');
  section.classList.remove('hidden');
  // animasi fade-in
  section.style.opacity = '0';
  section.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { section.style.opacity = '1'; }, 10);
  // scroll ke section menu
  setTimeout(() => { section.scrollIntoView({ behavior: 'smooth' }); }, 50);
}

renderProducts();
updateCartUI();
