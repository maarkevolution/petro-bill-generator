// ================================
// Petro Bill Generator
// ================================

// Random Bill Number
function generateBillNumber() {

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const month = months[new Date().getMonth()];

    const random = Math.floor(10000 + Math.random() * 90000);

    return month + "-" + random + "-ORGNL";

}

// Random Transaction ID
function generateTransactionID(){

    return Math.floor(1000000000000000 + Math.random()*9000000000000000);

}

// Fill values automatically
window.onload = function(){

    const bill = document.getElementById("billNo");
    const transaction = document.getElementById("transactionId");

    if(bill){
        bill.value = generateBillNumber();
    }

    if(transaction){
        transaction.value = generateTransactionID();
    }

}
// Current Date & Time

const today = new Date();

const date = document.getElementById("date");
const time = document.getElementById("time");

if(date){

    date.value = today.toISOString().split("T")[0];

}

if(time){

    time.value = today.toTimeString().slice(0,5);

}
