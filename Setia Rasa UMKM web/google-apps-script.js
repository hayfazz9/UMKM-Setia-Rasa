// =============================================
// GOOGLE APPS SCRIPT - Salin kode ini ke Google Apps Script
// Cara setup: lihat README-SETUP.md
// =============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Buat header jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'ID Pesanan', 'Waktu', 'Nama', 'Telepon', 'Email',
        'Alamat', 'Catatan', 'Item Pesanan', 'Total (Rp)', 'Pembayaran', 'Status'
      ]);
      // Format header
      var headerRange = sheet.getRange(1, 1, 1, 11);
      headerRange.setBackground('#6B4226');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
    }

    // Parse data
    var data = JSON.parse(e.postData.contents);

    // Tambah baris pesanan
    sheet.appendRow([
      data.orderId,
      data.timestamp,
      data.nama,
      data.telepon,
      data.email || '-',
      data.alamat,
      data.catatan || '-',
      data.items,
      data.total,
      data.payment === 'qris' ? 'QRIS' : 'Transfer Bank',
      'Menunggu Pembayaran'
    ]);

    // Auto-resize kolom
    sheet.autoResizeColumns(1, 11);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Setia Rasa Order API is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
