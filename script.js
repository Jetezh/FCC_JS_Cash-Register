const cash = document.getElementById("cash");
const inputButton = document.getElementById("purchase-btn");
const changeDueMessage = document.getElementById("change-due");
const drawerChange = document.getElementById("unit");

let price = 19.5;

// amount of money on each unit
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

// value of currency per unit
let currencyUnits = [
    ["PENNY", .01],
    ["NICKEL", .05],
    ["DIME", .1],
    ["QUARTER", .25],
    ["ONE", 1],
    ["FIVE", 5],
    ["TEN", 10],
    ["TWENTY", 20],
    ["ONE HUNDRED", 100]
];

// amount of unit in the drawer
cid.forEach(([unit, amount], i) => {
    drawerChange.innerHTML += `
        <div class="amount-unit">${unit}: $<span id="${i}">${amount.toFixed(2)}</span></div>
    `;
});

// function for alert and message
const message = (status, changeMessage = "") => {
    changeDueMessage.style.display = "block";
    changeDueMessage.innerHTML = `Status: ${status}<br>${changeMessage}`;
};

// function to calculate total cid
const calculateTotalCid = (cid) => {
    return parseFloat(cid.reduce((sum, [_, amount]) => sum + amount, 0).toFixed(2));
};

const changeEval = () => {
    const cashValue = parseFloat(cash.value);
    if(isNaN(cashValue)) {
        alert("Input the right number");
        cash.value = "";
    }
    const changeDue = parseFloat((cashValue - price).toFixed(2));
    let totalCid = calculateTotalCid(cid);
    console.log(totalCid);
    if (cashValue < price) {
        window.alert("Customer does not have enough money to purchase the item");
        cash.value = "";
        return;
    } else if (cashValue === price) {
        message("No change due - customer paid with exact cash");
        cash.value = "";
        return;
    } else if (changeDue > totalCid) {
        message("INSUFFICIENT_FUNDS");
        cash.value = "";
        return;
    }

    let changeArr = [];
    let remainingChange = changeDue;

    for (let i = currencyUnits.length - 1; i >= 0; i--) {
        let unit = currencyUnits[i][0];
        let unitValue = currencyUnits[i][1];
        let amountUnitInDrawer = cid[i][1];

        if (unitValue <= remainingChange && amountUnitInDrawer > 0) {
            let amountFromUnit = 0;

            while (remainingChange >= unitValue && amountUnitInDrawer > 0) {
                remainingChange = parseFloat((remainingChange - unitValue).toFixed(2));
                amountUnitInDrawer = parseFloat((amountUnitInDrawer - unitValue).toFixed(2));
                amountFromUnit = parseFloat((amountFromUnit + unitValue).toFixed(2));

                let spanContent = document.getElementById(`${i}`);
                spanContent.textContent = `${amountUnitInDrawer.toFixed(2)}`;
            }

            if (amountFromUnit > 0) {
                changeArr.push([unit, amountFromUnit]);
            }
            cid[i][1] = amountUnitInDrawer; // Update the cid array
        }
    }

    remainingChange = parseFloat(remainingChange.toFixed(2));

    if (remainingChange > 0) {
        message("INSUFFICIENT_FUNDS");
        return;
    }

    totalCid = calculateTotalCid(cid); // Recalculate totalCid after change
    console.log(totalCid);
    let status = remainingChange === 0 && totalCid === 0 ? "CLOSED" : "OPEN";
    let changeMessage = changeArr.map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join("<br>");

    message(status, changeMessage);
    cash.value = "";
};

inputButton.addEventListener("click", changeEval);

cash.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        changeEval();
    }
});
