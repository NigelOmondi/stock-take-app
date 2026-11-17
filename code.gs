/**
 * Stock Take backend — bound to the "Stock Take" Google Sheet.
 * Deploy via Extensions > Apps Script > Deploy > New deployment > Web app.
 *   Execute as: Me
 *   Who has access: Anyone with the link
 * Then copy the deployment URL into the scanner app's Settings.
 */

function doGet(e) {
  var barcode = String((e.parameter && e.parameter.barcode) || '').trim();
  if (!barcode) return jsonOut({ error: 'missing barcode' });

  var product = findProduct(barcode);
  if (product) {
    return jsonOut({
      found: true,
      barcode: barcode,
      name: product.name,
      sku: product.sku,
      price: product.price,
      category: product.category
    });
  }
  return jsonOut({ found: false, barcode: barcode });
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var barcode = String(body.barcode || '').trim();
  var quantity = Number(body.quantity) || 0;
  var countedBy = String(body.countedBy || '').trim();
  var notes = String(body.notes || '').trim();

  if (!barcode) return jsonOut({ ok: false, error: 'missing barcode' });

  var product = findProduct(barcode);
  var name = product ? product.name : (body.name || '');

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var log = ss.getSheetByName('Stock Take Log');
  log.appendRow([new Date(), barcode, name, quantity, countedBy, notes]);

  return jsonOut({ ok: true, barcode: barcode, name: name });
}

function findProduct(barcode) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Products');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === barcode) {
      return {
        name: data[i][1],
        sku: data[i][2],
        price: data[i][3],
        category: data[i][4]
      };
    }
  }
  return null;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
