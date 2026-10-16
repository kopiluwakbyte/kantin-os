/**
 * ==============================================================================
 * KANTIN OS - GOOGLE APPS SCRIPT BACKEND
 * ==============================================================================
 * Script ini berfungsi sebagai REST API backend gratis berbasis Google Sheets.
 * 
 * CARA SETUP:
 * 1. Buka Google Sheets baru di https://sheets.new (Beri nama: "Database Kantin OS")
 * 2. Klik menu: Extensions (Ekstensi) -> Apps Script
 * 3. Hapus semua kode default, lalu Paste seluruh isi file ini
 * 4. Klik tombol "Deploy" (Terapkan) -> "New deployment" (Penerapan baru)
 * 5. Pilih icon Gear ⚙️ -> Web app
 * 6. Set pengaturan:
 *    - Description: "Kantin OS API v1"
 *    - Execute as: "Me" (Email Google Anda)
 *    - Who has access: "Anyone" (Siapa saja, bahkan anonim - PENTING agar web pembeli bisa akses tanpa login Google!)
 * 7. Klik "Deploy", izinkan hak akses (Authorize Access)
 * 8. Salin URL "Web app" yang dihasilkan (contoh: https://script.google.com/macros/s/AKfycby.../exec)
 * 9. Tempel URL tersebut ke file `app.js` pada variabel `GAS_API_URL`
 * ==============================================================================
 */

// 1. GET: Mengambil Data Menu dan Pengaturan QRIS
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    checkAndInitSheets(ss);

    // Ambil Pengaturan
    const sheetSettings = ss.getSheetByName("Pengaturan");
    const settingsData = sheetSettings.getDataRange().getValues();
    const settings = {
      canteen_name: settingsData[1] ? settingsData[1][0] : "Kantin OS",
      qris_account_name: settingsData[1] ? settingsData[1][1] : "KANTIN OS",
      qris_nmid: settingsData[1] ? settingsData[1][2] : "ID1023280909046",
      qris_image_url: settingsData[1] ? settingsData[1][3] : "qris.png"
    };

    // Ambil Menu Jajanan
    const sheetMenu = ss.getSheetByName("Menu");
    const menuRows = sheetMenu.getDataRange().getValues();
    const menu = [];

    // Baris 0 adalah Header (ID, Kategori, Nama Jajanan, Harga, Foto, Status)
    for (let i = 1; i < menuRows.length; i++) {
      const row = menuRows[i];
      if (row[0] || row[2]) { // Pastikan baris tidak kosong
        menu.push({
          id: String(row[0] || "item-" + i),
          category: String(row[1] || "Lainnya"),
          name: String(row[2]),
          price: Number(row[3]) || 0,
          image_url: String(row[4] || ""),
          is_available: String(row[5]).toLowerCase() === "tersedia" || String(row[5]).toLowerCase() === "true" || row[5] === true
        });
      }
    }

    const output = {
      status: "success",
      timestamp: new Date().toISOString(),
      settings: settings,
      menu: menu
    };

    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. POST: Menerima Catatan Transaksi Self-Checkout dari Pembeli
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    checkAndInitSheets(ss);
    const sheetOrders = ss.getSheetByName("Transaksi");

    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter;
      }
    } else {
      payload = e.parameter || {};
    }

    const now = new Date();
    const formattedDate = Utilities.formatDate(now, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    const orderNumber = payload.order_number || ("ORD-" + Utilities.formatDate(now, "Asia/Jakarta", "yyyyMMdd-HHmmss"));
    const buyerName = payload.buyer_name || "Anonim";
    const totalAmount = Number(payload.total_amount) || 0;
    const itemsText = payload.items_summary || (Array.isArray(payload.items) ? payload.items.map(it => it.name + " (" + it.quantity + "x)").join(", ") : "-");

    // Tambahkan baris baru ke Sheet "Transaksi"
    sheetOrders.appendRow([
      formattedDate,
      orderNumber,
      buyerName,
      itemsText,
      totalAmount,
      "QRIS",
      "LUNAS"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      order_number: orderNumber,
      message: "Transaksi berhasil dicatat ke Google Sheets"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 3. Helper: Inisialisasi Otomatis Sheet & Data Awal Jika Belum Ada
function checkAndInitSheets(ss) {
  let sheetMenu = ss.getSheetByName("Menu");
  let sheetOrders = ss.getSheetByName("Transaksi");
  let sheetSettings = ss.getSheetByName("Pengaturan");

  // Buat Sheet Pengaturan jika belum ada
  if (!sheetSettings) {
    sheetSettings = ss.insertSheet("Pengaturan");
    sheetSettings.appendRow(["Nama Kantin", "Nama Rekening QRIS", "NMID", "URL Gambar QRIS"]);
    sheetSettings.appendRow([
      "Kantin OS",
      "KANTIN OS",
      "ID1023280909046",
      "qris.png"
    ]);
    sheetSettings.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#e2e8f0");
  }

  // Buat Sheet Transaksi jika belum ada
  if (!sheetOrders) {
    sheetOrders = ss.insertSheet("Transaksi");
    sheetOrders.appendRow(["Waktu Transaksi", "No. Order", "Nama Pembeli", "Daftar Jajanan", "Total (Rp)", "Metode", "Status"]);
    sheetOrders.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#e2e8f0");
  }

  // Buat Sheet Menu jika belum ada
  if (!sheetMenu) {
    sheetMenu = ss.insertSheet("Menu");
    sheetMenu.appendRow(["ID", "Kategori", "Nama Jajanan", "Harga (Rp)", "URL Foto", "Status (Tersedia/Habis)"]);
    sheetMenu.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#e2e8f0");

    // Seed Data Jajanan Populer
    const initialSnacks = [
      ["item-1", "Keripik & Gurih", "Chitato Sapi Panggang 68g", 11500, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-2", "Keripik & Gurih", "Chitato Lite Rumput Laut 55g", 11000, "https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-3", "Keripik & Gurih", "Taro Net Seaweed 36g", 5500, "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-4", "Keripik & Gurih", "Qtela Singkong Balado 60g", 6500, "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-5", "Keripik & Gurih", "Kacang Garuda Rosta Bawang 70g", 8500, "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-6", "Biskuit & Cokelat", "Beng-Beng Original 25g", 3000, "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-7", "Biskuit & Cokelat", "Beng-Beng Maxx 32g", 4500, "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-8", "Biskuit & Cokelat", "Oreo Vanilla Roll 119g", 9500, "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-9", "Biskuit & Cokelat", "Pocky Chocolate 47g", 9000, "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-10", "Biskuit & Cokelat", "SilverQueen Chunky Bar 30g", 12000, "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-11", "Minuman Segar", "Teh Pucuk Harum 350ml", 4500, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-12", "Minuman Segar", "Ultra Milk Cokelat 250ml", 7000, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-13", "Minuman Segar", "Pocari Sweat 500ml", 8500, "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-14", "Minuman Segar", "Nescafe Original Can 240ml", 10500, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-15", "Minuman Segar", "Aqua Botol 600ml", 4000, "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-16", "Mie & Cepat", "Pop Mie Kuah Ayam Bawang 75g", 7000, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-17", "Mie & Cepat", "Pop Mie Goreng Pedes Gledek 75g", 7500, "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80", "Tersedia"],
      ["item-18", "Mie & Cepat", "Sosis Siap Makan So Nice Sapi", 2000, "https://images.unsplash.com/photo-1585325701165-351af916e581?w=400&auto=format&fit=crop&q=80", "Tersedia"]
    ];

    for (let j = 0; j < initialSnacks.length; j++) {
      sheetMenu.appendRow(initialSnacks[j]);
    }
  }
}
