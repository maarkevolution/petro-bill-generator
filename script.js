let currentCompany = "HP";

const densities = {
  PETROL: 752.6,
  DIESEL: 835.0,
  CNG: 620.0
};

function generateBillNumber() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[new Date().getMonth()];
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${month}-${random}-ORGNL`;
}

function generateTransactionID() {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000);
}

function pad(num) {
  return String(num).padStart(2, "0");
}

function setDateTime() {
  const now = new Date();

  document.getElementById("date").value =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  document.getElementById("time").value =
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function formatDate(value) {
  const parts = value.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function openBill(company) {
  currentCompany = company;

  document.getElementById("home").classList.add("hidden");
  document.getElementById("billing").classList.remove("hidden");
  document.getElementById("companyTitle").innerText = `${company} Bill Generator`;

  if (company === "HP") {
    document.getElementById("pumpName").value = "MILLENIUM AHMEDABAD GOTA";
  } else {
    document.getElementById("pumpName").value = company.toUpperCase() + " FUEL STATION";
  }

  document.getElementById("billNo").value = generateBillNumber();
  document.getElementById("transactionId").value = generateTransactionID();

  setDateTime();
  updateBill();
}

function goHome() {
  document.getElementById("billing").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}

function updateBill() {
  const fuel = document.getElementById("fuelType").value;
  const rate = parseFloat(document.getElementById("rate").value) || 0;
  const sale = parseFloat(document.getElementById("sale").value) || 0;
  const volume = rate > 0 ? sale / rate : 0;

  document.getElementById("density").value = densities[fuel].toFixed(1);
  document.getElementById("volume").value = volume.toFixed(2);

  const pumpName = document.getElementById("pumpName").value.toUpperCase();
  document.getElementById("receiptPump").innerText = pumpName;

  const text =
`Bill No : ${document.getElementById("billNo").value}
Trns.ID : ${document.getElementById("transactionId").value}
Atnd.ID : ${document.getElementById("attendantId").value}
Receipt : ${document.getElementById("receiptType").value}
Vehi.No : ${document.getElementById("vehicleNo").value}
Mob.No  : ${document.getElementById("mobileNo").value}

Date    : ${formatDate(document.getElementById("date").value)}
Time    : ${document.getElementById("time").value}

FP. ID  : ${document.getElementById("fpId").value}
Nozl No : ${document.getElementById("nozzleNo").value}

Fuel    : ${fuel}

Density : ${densities[fuel].toFixed(1)} Kg/m3

Preset  : RS.${parseFloat(document.getElementById("preset").value || 0).toFixed(2)}
Rate    : RS.${rate.toFixed(2)}
Sale    : RS.${sale.toFixed(2)}

Volume  : ${volume.toFixed(2)} ${fuel === "CNG" ? "Kg" : "L"}`;

  document.getElementById("receiptText").innerText = text;
}

async function downloadPDF() {
  const receipt = document.getElementById("receipt");

  const canvas = await html2canvas(receipt, {
    scale: 4,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [57, 132]
  });

  pdf.addImage(imgData, "PNG", 0, 0, 57, 132);
  pdf.save("petro-bill.pdf");
}

setInterval(() => {
  if (!document.getElementById("billing").classList.contains("hidden")) {
    const now = new Date();
    document.getElementById("time").value =
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    updateBill();
  }
}, 1000);
