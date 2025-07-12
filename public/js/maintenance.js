document.addEventListener("DOMContentLoaded", async () => {
  const houseNumber = localStorage.getItem("houseNumber");
  const community = localStorage.getItem("community");

  const duesContainer = document.getElementById("duesContainer");
  const historyTable = document.querySelector("#historyTable tbody");
  const noMaintenance = document.getElementById("noMaintenance");

  // ✅ Load unpaid maintenance dues
  try {
   const duesRes = await fetch(`/api/maintenance/community/${community}`);
const duesData = await duesRes.json();

const userPaymentsRes = await fetch(`/api/payments/${houseNumber}`);
const userPaymentsData = await userPaymentsRes.json();
const paidNoticeIds = userPaymentsData.data.map(p => p.noticeId);

    if (duesData.success && duesData.data.length > 0) {
      duesData.data
  .filter(notice => !paidNoticeIds.includes(notice._id))
  .forEach((notice, idx) => {
    // show unpaid only 
        const div = document.createElement("div");
        div.className = "due-box";
        div.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <p><strong>${idx + 1}. ${notice.purpose}</strong> — ₹${notice.amount}</p>
            <button onclick="showPayUI('${notice._id}', '${notice.amount}', '${notice.purpose}')">📱 Pay</button>
          </div>
          <div id="payUI_${notice._id}" class="pay-ui" style="display: none; margin-top: 10px;">
            <img src="/images/upi.jpeg" alt="QR" style="max-width: 200px; border-radius: 8px;" />
            <br><br>
            <input type="text" id="tx_${notice._id}" placeholder="Enter Transaction ID" required />
            <button onclick="submitPayment('${notice._id}', '${notice.amount}', '${notice.purpose}')">✅ Submit Payment</button>
            <p id="status_${notice._id}" style="color: green;"></p>
          </div>
        `;
        duesContainer.appendChild(div);
      });
    } else {
      noMaintenance.style.display = "block";
    }
  } catch (err) {
    console.error("❌ Failed to load dues", err);
    noMaintenance.style.display = "block";
  }

  // ✅ Load payment history
  try {
    const histRes = await fetch(`/api/payments/${houseNumber}`);
    const histData = await histRes.json();

    if (histData.success) {
      histData.data.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>₹${p.amount}</td>
          <td>${p.transactionid}</td>
          <td>${p.purpose || "-"}</td>
          <td>${new Date(p.date).toLocaleString()}</td>
          <td><a href="${p.receiptPath}" target="_blank">🧾 View</a></td>
        `;
        historyTable.appendChild(tr);
      });
    }
  } catch (err) {
    console.error("❌ Failed to load history", err);
  }
});

// ✅ Show QR + TX input only for clicked notice
window.showPayUI = (noticeId) => {
  document.querySelectorAll(".pay-ui").forEach(el => el.style.display = "none");
  const target = document.getElementById(`payUI_${noticeId}`);
  if (target) target.style.display = "block";
};

// ✅ Submit payment
window.submitPayment = async (noticeId, amount, purpose) => {
  const houseNumber = localStorage.getItem("houseNumber");
  const community = localStorage.getItem("community");
  const txInput = document.getElementById(`tx_${noticeId}`);
  const statusP = document.getElementById(`status_${noticeId}`);
  const transactionid = txInput.value.trim();

  if (!transactionid) return alert("Enter transaction ID");

  try {
    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ houseNumber, amount, transactionid, noticeId, community, purpose })
    });

    const result = await res.json();

    if (result.success) {
      statusP.textContent = "✅ Payment recorded!";
      window.open(result.receipt, "_blank");
      setTimeout(() => location.reload(), 1000);
    } else {
      statusP.textContent = "❌ Payment failed.";
    }
  } catch (err) {
    console.error("❌ Error submitting payment", err);
    statusP.textContent = "❌ Network error.";
  }
};
