const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const MaintenanceNotice = require("../models/MaintenanceNotice");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// POST: Submit payment
router.post("/pay", async (req, res) => {
  const { houseNumber, amount, transactionid, noticeId, community, purpose } = req.body;

  if (!houseNumber || !amount || !transactionid || !noticeId || !community || !purpose) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const newPayment = new Payment({
      houseNumber,
      amount,
      transactionid,
      community,
      noticeId,
      purpose,
      date: new Date()
    });
    await newPayment.save();

    // ✅ Generate receipt PDF
    const receiptFolder = path.join(__dirname, "../public/receipts");
    if (!fs.existsSync(receiptFolder)) fs.mkdirSync(receiptFolder, { recursive: true });

    const receiptFilePath = path.join(receiptFolder, `${newPayment._id}.pdf`);
    const receiptURL = `/receipts/${newPayment._id}.pdf`;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(receiptFilePath));

    doc.fontSize(18).text("🏡 Maintenance Payment Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleString()}`);
    doc.text(`House Number: ${houseNumber}`);
    doc.text(`Community: ${community}`);
    doc.text(`Purpose: ${purpose}`);
    doc.text(`Amount Paid: ₹${amount}`);
    doc.text(`Transaction ID: ${transactionid}`);
    doc.end();

    // ✅ Save receipt path
    newPayment.receiptPath = receiptURL;
    await newPayment.save();

    // ✅ Delete maintenance notice
    //await MaintenanceNotice.findByIdAndDelete(noticeId);

    res.json({ success: true, message: "✅ Payment recorded", receipt: receiptURL });
  } catch (err) {
    console.error("❌ Error in payment route:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: Payment history
router.get("/payments/:houseNumber", async (req, res) => {
  try {
    const payments = await Payment.find({ houseNumber: req.params.houseNumber }).sort({ date: -1 });
    res.json({ success: true, data: payments });
  } catch (err) {
    console.error("❌ Payment fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
