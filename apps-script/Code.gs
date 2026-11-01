/**
 * Mishnat Yosef Ra'anana — signup form backend.
 * Deploy this as a Web App (see ../README.md) and paste the resulting URL
 * into SHEETS_WEB_APP_URL in index.html.
 *
 * Expects a spreadsheet with a sheet named "Signups" whose first row is:
 * Timestamp | Full Name | Phone | Interest Level | WhatsApp Consent | Language
 */

var SHEET_NAME = "Signups";
var HEADERS = ["Timestamp", "Full Name", "Phone", "Interest Level", "WhatsApp Consent", "Language"];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (!data.fullName || !data.phone || !data.interestLevel) {
      return jsonResponse_({ result: "error", message: "Missing required fields" });
    }

    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      String(data.fullName).substring(0, 200),
      String(data.phone).substring(0, 50),
      String(data.interestLevel).substring(0, 50),
      data.consent ? "Yes" : "No",
      String(data.lang || "")
    ]);

    var count = sheet.getLastRow() - 1;
    return jsonResponse_({ result: "success", count: count });
  } catch (err) {
    return jsonResponse_({ result: "error", message: err.message });
  }
}

function doGet(e) {
  try {
    var action = e.parameter.action;
    if (action === "count") {
      var sheet = getSheet_();
      var count = Math.max(0, sheet.getLastRow() - 1);
      return jsonResponse_({ count: count });
    }
    return jsonResponse_({ result: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse_({ result: "error", message: err.message });
  }
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
