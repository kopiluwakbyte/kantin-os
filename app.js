/**
 * ==============================================================================
 * KANTIN OS - CLIENT-SIDE APPLICATION JAVASCRIPT
 * ==============================================================================
 */

// 1. KONFIGURASI GOOGLE APPS SCRIPT
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbze2Whu6N85OxECd5JqNIfFjlJkseUthDvoqEFRhRQqI0rzTJMfGx1o2S2lTIs488WC/exec";

// 2. DATA JAJANAN DEFAULT (FALLBACK / INITIAL SEED)
const DEFAULT_MENU = [
  { id: "item-1", category: "Keripik & Gurih", name: "Chitato Sapi Panggang 68g", price: 11500, image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-2", category: "Keripik & Gurih", name: "Chitato Lite Rumput Laut 55g", price: 11000, image_url: "https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-3", category: "Keripik & Gurih", name: "Taro Net Seaweed 36g", price: 5500, image_url: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-4", category: "Keripik & Gurih", name: "Qtela Singkong Balado 60g", price: 6500, image_url: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-5", category: "Keripik & Gurih", name: "Kacang Garuda Rosta Bawang 70g", price: 8500, image_url: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&auto=format&fit=crop&q=80", is_available: true },
  
  { id: "item-6", category: "Biskuit & Cokelat", name: "Beng-Beng Original 25g", price: 3000, image_url: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-7", category: "Biskuit & Cokelat", name: "Beng-Beng Maxx 32g", price: 4500, image_url: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-8", category: "Biskuit & Cokelat", name: "Oreo Vanilla Roll 119g", price: 9500, image_url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-9", category: "Biskuit & Cokelat", name: "Pocky Chocolate 47g", price: 9000, image_url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-10", category: "Biskuit & Cokelat", name: "SilverQueen Chunky Bar 30g", price: 12000, image_url: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80", is_available: true },

  { id: "item-11", category: "Minuman Segar", name: "Teh Pucuk Harum 350ml", price: 4500, image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-12", category: "Minuman Segar", name: "Ultra Milk Cokelat 250ml", price: 7000, image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-13", category: "Minuman Segar", name: "Pocari Sweat 500ml", price: 8500, image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-14", category: "Minuman Segar", name: "Nescafe Original Can 240ml", price: 10500, image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-15", category: "Minuman Segar", name: "Aqua Botol 600ml", price: 4000, image_url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop&q=80", is_available: true },

  { id: "item-16", category: "Mie & Cepat", name: "Pop Mie Kuah Ayam Bawang 75g", price: 7000, image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-17", category: "Mie & Cepat", name: "Pop Mie Goreng Pedes Gledek 75g", price: 7500, image_url: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80", is_available: true },
  { id: "item-18", category: "Mie & Cepat", name: "Sosis Siap Makan So Nice Sapi", price: 2000, image_url: "https://images.unsplash.com/photo-1585325701165-351af916e581?w=400&auto=format&fit=crop&q=80", is_available: true }
];

const DEFAULT_SETTINGS = {
  canteen_name: "Kantin OS",
  qris_account_name: "KANTIN OS",
  qris_nmid: "ID1023280909046",
  qris_image_url: "qris.png"
};

// 3. STATE APLIKASI
let allItems = [...DEFAULT_MENU];
let canteenSettings = { ...DEFAULT_SETTINGS };
let cart = []; // Array of { item, quantity }
let selectedCategory = "";
let searchQuery = "";

// 4. FORMAT RUPIAH
function formatRupiah(num) {
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
}

// 5. INISIALISASI INSTAN (0 DETIK) & BACKGROUND SYNC
function initApp() {
  // A. Load saved buyer name
  const savedName = localStorage.getItem("kantin_buyer_name");
  if (savedName) {
    const input = document.getElementById("buyerNameInput");
    if (input) input.value = savedName;
  }

  // B. INSTANT RENDER: Tampilkan dari cache localStorage atau default menu seketika (0 ms)
  const cachedMenu = localStorage.getItem("kantin_cached_menu");
  const cachedSettings = localStorage.getItem("kantin_cached_settings");

  if (cachedMenu) {
    try {
      const parsed = JSON.parse(cachedMenu);
      if (Array.isArray(parsed) && parsed.length > 0) {
        allItems = parsed;
      }
    } catch (e) {}
  }

  if (cachedSettings) {
    try {
      canteenSettings = { ...canteenSettings, ...JSON.parse(cachedSettings) };
    } catch (e) {}
  }

  // Tampilkan antarmuka langsung tanpa loading (0 delay!)
  setupEventListeners();
  renderCategories();
  renderItems();
  updateSettingsUI();

  // C. BACKGROUND SYNC (Non-blocking): Ambil data terbaru di latar belakang
  syncDataFromGoogleSheets();
}

async function syncDataFromGoogleSheets() {
  if (!GAS_API_URL || !GAS_API_URL.startsWith("http")) return;

  try {
    const res = await fetch(GAS_API_URL);
    const data = await res.json();
    if (data.status === "success" && Array.isArray(data.menu) && data.menu.length > 0) {
      allItems = data.menu;
      if (data.settings) {
        canteenSettings = { ...canteenSettings, ...data.settings };
        localStorage.setItem("kantin_cached_settings", JSON.stringify(canteenSettings));
        updateSettingsUI();
      }

      // Perbarui cache browser untuk kunjungan berikutnya
      localStorage.setItem("kantin_cached_menu", JSON.stringify(allItems));

      // Refresh tampilan dengan data terbaru dari Google Sheets
      renderCategories();
      renderItems();
    }
  } catch (err) {
    console.warn("Sinkronisasi latar belakang menggunakan cache lokal:", err);
  }
}

function updateSettingsUI() {
  document.getElementById("merchantName").textContent = canteenSettings.qris_account_name;
  document.getElementById("qrisNmid").textContent = "NMID: " + canteenSettings.qris_nmid;
  document.getElementById("qrisImage").src = canteenSettings.qris_image_url || "sample-qris.svg";
}

// 6. RENDER KATEGORI
function renderCategories() {
  const categories = ["Semua Jajanan", ...new Set(allItems.map(i => i.category))];
  const bar = document.getElementById("categoryBar");
  bar.innerHTML = "";

  categories.forEach(cat => {
    const isAll = cat === "Semua Jajanan";
    const isActive = isAll ? selectedCategory === "" : selectedCategory === cat;
    const count = isAll ? allItems.length : allItems.filter(i => i.category === cat).length;

    const btn = document.createElement("button");
    btn.className = `cat-pill ${isActive ? "active" : ""}`;
    btn.innerHTML = `<span>${cat}</span> <span style="opacity:0.6;font-size:11px;">(${count})</span>`;
    btn.onclick = () => {
      selectedCategory = isAll ? "" : cat;
      renderCategories();
      renderItems();
    };
    bar.appendChild(btn);
  });
}

// 7. RENDER ITEM JAJANAN DENGAN INSTANT SEARCH
function renderItems() {
  const grid = document.getElementById("itemsGrid");
  const resultInfo = document.getElementById("resultsInfo");
  const q = searchQuery.trim().toLowerCase();

  const filtered = allItems.filter(item => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (q) {
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      return matchName || matchCat;
    }
    return true;
  });

  resultInfo.textContent = `Menampilkan ${filtered.length} jajanan`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div style="font-size:32px;">🔍</div>
        <h3>Jajanan Tidak Ditemukan</h3>
        <p>Tidak ada snack yang cocok dengan pencarian "${searchQuery}".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const inCart = cart.find(c => c.item.id === item.id);
    const qty = inCart ? inCart.quantity : 0;

    let actionBtnHtml = "";
    if (!item.is_available) {
      actionBtnHtml = `<span style="font-size:11px;font-weight:700;color:var(--slate-400);">Kosong</span>`;
    } else if (qty > 0) {
      actionBtnHtml = `
        <div class="stepper">
          <button class="step-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span class="step-qty">${qty}</span>
          <button class="step-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
      `;
    } else {
      actionBtnHtml = `
        <button class="btn-select" onclick="addToCart('${item.id}')">+ Pilih</button>
      `;
    }

    return `
      <div class="item-card">
        <div>
          <div class="item-img-wrap">
            <img class="item-img" src="${item.image_url || 'sample-qris.svg'}" alt="${item.name}" loading="lazy" />
            <span class="stock-tag ${item.is_available ? 'available' : 'empty'}">
              ${item.is_available ? 'Tersedia' : 'Stok Habis'}
            </span>
          </div>
          <h4 class="item-name">${item.name}</h4>
        </div>
        <div class="item-card-bottom">
          <div>
            <span class="price-label">Harga</span>
            <div class="item-price">${formatRupiah(item.price)}</div>
          </div>
          <div>${actionBtnHtml}</div>
        </div>
      </div>
    `;
  }).join("");
}

// 8. LOGIKA KERANJANG BELANJA
function addToCart(itemId) {
  const item = allItems.find(i => i.id === itemId);
  if (!item || !item.is_available) return;

  const existing = cart.find(c => c.item.id === itemId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ item, quantity: 1 });
  }

  updateCartState();
  renderItems();
}

function updateCartQty(itemId, delta) {
  const existing = cart.find(c => c.item.id === itemId);
  if (!existing) return;

  existing.quantity += delta;
  if (existing.quantity <= 0) {
    cart = cart.filter(c => c.item.id !== itemId);
  }

  updateCartState();
  renderItems();
}

function updateCartState() {
  const totalQty = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalAmount = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);

  // Badge Header
  const badge = document.getElementById("navCartCount");
  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? "inline-flex" : "none";

  // Floating Bar
  const floatingBar = document.getElementById("floatingBar");
  if (totalQty > 0) {
    floatingBar.classList.add("active");
    document.getElementById("floatingQty").textContent = `${totalQty} item`;
    document.getElementById("floatingTotal").textContent = formatRupiah(totalAmount);
  } else {
    floatingBar.classList.remove("active");
  }

  renderCartDrawer();
}

function renderCartDrawer() {
  const list = document.getElementById("cartList");
  const totalAmount = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  const totalQty = cart.reduce((sum, c) => sum + c.quantity, 0);

  document.getElementById("drawerItemCount").textContent = `${totalQty} item`;
  document.getElementById("drawerTotal").textContent = formatRupiah(totalAmount);

  if (cart.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;padding:40px 10px;color:var(--slate-400);">
        <div style="font-size:36px;margin-bottom:8px;">🛒</div>
        <p style="font-weight:700;color:var(--slate-700);">Keranjang Masih Kosong</p>
        <p style="font-size:12px;margin-top:4px;">Pilih snack di atas untuk menghitung total dan bayar via QRIS</p>
      </div>
    `;
    return;
  }

  list.innerHTML = cart.map(ci => `
    <div class="cart-item">
      <img class="cart-item-img" src="${ci.item.image_url || 'sample-qris.svg'}" alt="${ci.item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-title">${ci.item.name}</div>
        <div class="cart-item-price">${formatRupiah(ci.item.price)} × ${ci.quantity}</div>
      </div>
      <div class="stepper">
        <button class="step-btn" onclick="updateCartQty('${ci.item.id}', -1)">-</button>
        <span class="step-qty">${ci.quantity}</span>
        <button class="step-btn" onclick="updateCartQty('${ci.item.id}', 1)">+</button>
      </div>
    </div>
  `).join("");
}

// 9. MODAL & CHECKOUT CONTROL
function openCart() {
  document.getElementById("modalOverlay").classList.add("active");
  document.getElementById("cartDrawer").classList.add("active");
}

function closeCart() {
  document.getElementById("modalOverlay").classList.remove("active");
  document.getElementById("cartDrawer").classList.remove("active");
}

function openQrisModal() {
  closeCart();
  const totalAmount = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  document.getElementById("qrisTotalVal").textContent = formatRupiah(totalAmount);
  
  document.getElementById("modalOverlay").classList.add("active");
  document.getElementById("qrisModal").classList.add("active");
  document.getElementById("qrisStepPay").style.display = "block";
  document.getElementById("qrisStepSuccess").style.display = "none";
}

function closeQrisModal() {
  document.getElementById("modalOverlay").classList.remove("active");
  document.getElementById("qrisModal").classList.remove("active");
}

function copyNominal() {
  const totalAmount = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  navigator.clipboard.writeText(totalAmount.toString());
  const btn = document.getElementById("btnCopy");
  const originalText = btn.innerHTML;
  btn.innerHTML = `<span>✓ Tersalin!</span>`;
  setTimeout(() => { btn.innerHTML = originalText; }, 1800);
}

// 10. SUBMIT PEMBAYARAN KE GOOGLE APPS SCRIPT
async function submitPayment() {
  const nameInput = document.getElementById("buyerNameInput");
  const buyerName = nameInput.value.trim();
  if (!buyerName) {
    alert("Silakan masukkan Nama Anda!");
    nameInput.focus();
    return;
  }

  // Auto-remember name via localStorage (Zero-login convenience)
  localStorage.setItem("kantin_buyer_name", buyerName);

  const totalAmount = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  const now = new Date();
  const orderNumber = "ORD-" + now.toISOString().slice(0, 10).replace(/-/g, '') + "-" + Math.floor(100 + Math.random() * 900);

  const btn = document.getElementById("btnConfirmPay");
  btn.disabled = true;
  btn.textContent = "Mencatat transaksi...";

  const payload = {
    order_number: orderNumber,
    buyer_name: buyerName,
    total_amount: totalAmount,
    items: cart.map(c => ({ id: c.item.id, name: c.item.name, quantity: c.quantity, price: c.item.price }))
  };

  // Kirim data ke Google Sheets jika URL tersedia
  if (GAS_API_URL && GAS_API_URL.startsWith("http")) {
    try {
      await fetch(GAS_API_URL, {
        method: "POST",
        mode: "no-cors", // Standard untuk Google Apps Script Web App
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Gagal sinkron Google Sheets, transaksi dicatat lokal:", err);
    }
  }

  // Tampilkan Bukti & Konfeti
  document.getElementById("qrisStepPay").style.display = "none";
  document.getElementById("qrisStepSuccess").style.display = "block";
  document.getElementById("rcptOrderNo").textContent = orderNumber;
  document.getElementById("rcptBuyerName").textContent = buyerName;
  document.getElementById("rcptTotal").textContent = formatRupiah(totalAmount);

  if (window.confetti) {
    window.confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  }

  // Reset Cart
  cart = [];
  updateCartState();
  renderItems();
  btn.disabled = false;
  btn.textContent = "Saya Sudah Transfer QRIS";
}

// 11. EVENT LISTENERS
function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("searchClear");

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    clearBtn.classList.toggle("visible", searchQuery.length > 0);
    renderItems();
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearBtn.classList.remove("visible");
    searchInput.focus();
    renderItems();
  });
}

function quickSearch(keyword) {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = keyword;
  searchQuery = keyword;
  document.getElementById("searchClear").classList.add("visible");
  renderItems();
  window.scrollTo({ top: 120, behavior: "smooth" });
}

// Jalankan saat DOM siap
document.addEventListener("DOMContentLoaded", initApp);
