async function isAccountExist(
    websiteB,
    accountNumber
) {

    const searchInput = websiteB.locator("#txtSearchF");

    await searchInput.click();

    await searchInput.clear();

    await searchInput.pressSequentially(
        accountNumber,
        { delay: 50 }
    );

    await websiteB.waitForTimeout(2000);

    const impsButton = websiteB.getByRole("button", {
        name: "IMPS"
    });

    return (await impsButton.count()) > 0;
}

async function addBeneficiary(
    websiteB,
    accountNumber,
    ifsc,
    name
) {

    await websiteB.getByText("Add New").click();

    await websiteB
        .locator("#ContentPlaceHolder1_txtAddBAccountNo")
        .fill(accountNumber);

    await websiteB
        .locator("#ContentPlaceHolder1_txtAddBIFSC")
        .fill(ifsc);

    await websiteB
        .locator("#txtAddBName")
        .fill(name);

    await websiteB
        .locator("#ContentPlaceHolder1_btnAddBeneficiary")
        .click();

    await websiteB.locator(".ajs-ok").click();

    await websiteB.waitForTimeout(3000);
}

const { chromium } = require("playwright");

(async () => {

    const browser = await chromium.connectOverCDP(
        "http://127.0.0.1:9222"
    );


    const context = browser.contexts()[0];

    const pages = context.pages();

    const websiteA = pages[0];
    const websiteB = pages[1];

    await websiteA.bringToFront();

    await websiteA.locator(".details-notes-cmn-img").first().click();

})();