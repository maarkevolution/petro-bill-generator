const companies = {
  hp: {
    name: "HP Petrol Pump",
    pump: "MILLENIUM AHMEDABAD GOTA",
    logo: "logos/hp.png.webp"
  },
  indianoil: {
    name: "Indian Oil",
    pump: "INDIAN OIL FUEL STATION",
    logo: "logos/indianoil.png.webp"
  },
  bpcl: {
    name: "Bharat Petroleum",
    pump: "BHARAT PETROLEUM DEALER",
    logo: "logos/Bharat_Petroleum_logo.svg.webp"
  },
  shell: {
    name: "Shell",
    pump: "SHELL FUEL STATION",
    logo: "logos/Shell.png.png"
  },
  nayara: {
    name: "Nayara",
    pump: "NAYARA PETROLEUM OUTLET",
    logo: "logos/Nayara.png.jpg"
  },
  reliance: {
    name: "Reliance",
    pump: "RELIANCE FUEL PLAZA",
    logo: "logos/jio.svg"
  }
};

const densities = {
  PETROL: 752.6,
  DIESEL: 835.0,
  CNG: 620.0
};

let currentCompany = "hp";

function renderHome() {
  const grid = document.getElementById("companyGrid");
  grid.innerHTML = "";

  Object.keys(companies).forEach(key => {
    const company = companies[key];

    grid.innerHTML += `
      <button class="company-card" onclick="openBill('${key}')">
        <img src="${company.logo}" alt="${company.name}">
        <strong>${company.name}</strong>
      </button>
    `;
  });
}

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
  if (!value) return "";
  const parts = value.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function openBill(companyKey) {
  currentCompany = companyKey;
  const company = companies[companyKey];

  document.getElementById("home").classList.add("hidden");
  document.getElementById("billing").classList.remove("hidden");

  document.getElementById("companyTitle").innerText = company.name + " Bill Generator";
  document.getElementById("pumpName").value = company.pump;
  document.getElementById("receiptLogo").src = company.logo;

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
  const preset = parseFloat(document.getElementById("preset").value) || 0;
  const volume = rate > 0 ? sale / rate : 0;

  document.getElementById("density").value = densities[fuel].toFixed(1);
  document.getElementById("volume").value = volume.toFixed(2);

  const pumpName = document.getElementById("pumpName").value.toUpperCase();
  document.getElementById("receiptPump").innerText = pumpName;

  document.getElementById("receiptText").innerText =
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

Preset  : RS.${preset.toFixed(2)}
Rate    : RS.${rate.toFixed(2)}
Sale    : RS.${sale.toFixed(2)}

Volume  : ${volume.toFixed(2)} ${fuel === "CNG" ? "Kg" : "L"}`;
}

async function downloadImage() {
  const receipt = document.getElementById("receipt");

  const canvas = await html2canvas(receipt, {
    scale: 4,
    backgroundColor: "#ffffff"
  });

  const link = document.createElement("a");
  link.download = `${currentCompany}-petro-bill.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
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
  pdf.save(`${currentCompany}-petro-bill.pdf`);
}

setInterval(() => {
  if (!document.getElementById("billing").classList.contains("hidden")) {
    const now = new Date();
    document.getElementById("time").value =
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    updateBill();
  }
}, 1000);

renderHome();

const params = new URLSearchParams(window.location.search);
const brand = params.get("brand");
if (brand && companies[brand]) {
  openBill(brand);
}
