# Stock Take Scanner

A phone-camera barcode scanner that writes straight to a Google Sheet. Built from two pieces:

- `index.html` — the scanning app staff open on their phones.
- `code.gs` — the Google Apps Script backend, bound to the Google Sheet.

The Sheet itself: https://docs.google.com/spreadsheets/d/1fpoOa8RrCmNCsB81mKCxr6O45neBC2tP4w963naqLiM/edit
- **Products** tab — your barcode-to-product reference list. Replace the 3 example rows with your real products (Barcode, Product Name, SKU, Price, Category).
- **Stock Take Log** tab — every scan lands here automatically: Timestamp, Barcode, Product Name, Quantity Counted, Counted By, Notes.

## 1. Deploy the backend (one-time, ~5 min)

1. Open the [Stock Take sheet](https://docs.google.com/spreadsheets/d/1fpoOa8RrCmNCsB81mKCxr6O45neBC2tP4w963naqLiM/edit).
2. **Extensions > Apps Script**.
3. Delete whatever is in the editor and paste in the contents of `code.gs`.
4. Click **Deploy > New deployment**.
5. Click the gear next to "Select type" and choose **Web app**.
6. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**, authorize the permissions it asks for (it's your own script touching your own sheet).
8. Copy the **Web app URL** it gives you (ends in `/exec`). You'll paste this into the app on each phone.

If you ever edit `code.gs` again, you need to **Deploy > Manage deployments > Edit (pencil) > New version > Deploy** for changes to take effect — saving the script alone isn't enough.

## 2. Host the scanner page

`index.html` needs to be served over HTTPS for the phone's camera to work (a local `file://` open won't allow camera access). Easiest free option:

- **GitHub Pages**: push this folder to a repo, enable Pages on it, done.
- **Netlify Drop**: drag the `stock-take-app` folder onto https://app.netlify.com/drop — instant HTTPS link, no account needed for a quick test.

## 3. Set up each phone

1. Open the hosted link on the phone.
2. It'll prompt for setup on first load: enter the staff member's name and paste the Apps Script URL from step 1.
3. Tap **Start scanning**, allow camera access.
4. Point at a barcode → it looks up the product, staff confirms/adjusts quantity → **Log it** → row appears in the Stock Take Log tab.

Settings are saved per device (localStorage), so this is only needed once per phone.

## Notes on this MVP

- The Products tab is the barcode reference list — for now it only has 3 example rows. Add your real catalog there (one row per barcode) so scans show the correct product name/price instead of "Unknown barcode."
- An unknown barcode still gets logged (with a blank name) so nothing is lost — it just won't show a product name until you add it to Products.
- Multiple staff can scan at the same time; each POST is an independent append to the sheet.
- Barcode formats supported: EAN-13, EAN-8, UPC-A, UPC-E, Code128, Code39, Codabar, ITF, QR.
