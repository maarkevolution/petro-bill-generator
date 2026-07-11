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

function generateBillNumber(monthName = null) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = monthName || months[new Date().getMonth()];
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${month}-${random}-ORGNL`;
}

function generateTransactionID() {
  let id = String(Math.floor(1 + Math.random() * 9));
  for (let i = 0; i < 15; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return id;
}

function pad(num) {
  return String(num).padStart(2, "0");
}

function generateRandomTime() {
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);

  return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

function setDateAndRandomTime() {
  const now = new Date();

  document.getElementById("date").value =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  document.getElementById("time").value = generateRandomTime();
}

function formatDate(value) {
  if (!value) return "";
  const parts = value.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatRs(value) {
  const number = parseFloat(value) || 0;
  if (number === 0) return "RS.00.00";
  return `RS.${number.toFixed(2)}`;
}

function openBill(companyKey, updateUrl = true) {
  const company = companies[companyKey];
  if (!company) return;

  currentCompany = companyKey;
  localStorage.setItem("selectedCompany", companyKey);

  if (updateUrl) {
    history.replaceState(null, "", `${window.location.pathname}?brand=${companyKey}`);
  }

  document.getElementById("home").classList.add("hidden");
  document.getElementById("billing").classList.remove("hidden");

  document.getElementById("companyTitle").innerText = `${company.name} Bill Generator`;
  document.getElementById("pumpName").value = company.pump;
  document.getElementById("receiptLogo").src = company.logo;
  document.getElementById("receiptLogo").alt = `${company.name} logo`;

  document.getElementById("billNo").value = generateBillNumber();
  document.getElementById("transactionId").value = generateTransactionID();

  setDateAndRandomTime();
  updateBill();
}

function goHome() {
  localStorage.removeItem("selectedCompany");
  history.replaceState(null, "", window.location.pathname);

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

  document.getElementById("receiptPump").innerText =
    document.getElementById("pumpName").value.toUpperCase();

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

Preset  : ${formatRs(preset)}
Rate    : ${formatRs(rate)}
Sale    : ${formatRs(sale)}

Volume  : ${volume.toFixed(2)} ${fuel === "CNG" ? "Kg" : "L"}`;
}

async function makeCanvas() {
  const receipt = document.getElementById("receipt");

  return await html2canvas(receipt, {
    scale: 3,
    backgroundColor: "#ffffff",
    useCORS: true,
    scrollX: 0,
    scrollY: 0,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight
  });
}

async function downloadImage() {
  const canvas = await makeCanvas();

  const link = document.createElement("a");
  link.download = `${currentCompany}-petro-bill.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function downloadPDF() {
  const canvas = await makeCanvas();
  const imgData = canvas.toDataURL("image/png");

  const pdf = new window.jspdf.jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [57, 132]
  });

  pdf.addImage(imgData, "PNG", 0, 0, 57, 132);
  pdf.save(`${currentCompany}-petro-bill.pdf`);
}

document.querySelectorAll("input, select").forEach(field => {
  field.addEventListener("input", updateBill);
  field.addEventListener("change", updateBill);
});

renderHome();

const params = new URLSearchParams(window.location.search);
const brandFromUrl = params.get("brand");
const savedBrand = localStorage.getItem("selectedCompany");

if (brandFromUrl && companies[brandFromUrl]) {
  openBill(brandFromUrl, false);
} else if (savedBrand && companies[savedBrand]) {
  openBill(savedBrand, true);
} else {
  document.getElementById("billing").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}
