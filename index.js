
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

    await websiteA.locator(".details-notes-cmn-img").nth(1).click();
    // const rows = websiteA.locator(".details-notes-cmn-img");

    // const count = await rows.count();
    // console.log("row count ", count);
    


    const accountNumber = await websiteA.locator(
        'p:text("Account Number :-")'
    ).locator('xpath=following-sibling::p[1]')
        .textContent();
    const ifsc = await websiteA.locator(
        'p:text("IFSC")'
    ).locator('xpath=following-sibling::p[1]')
        .textContent();
    const name = await websiteA.locator(
        'p:text("Holder Name :-")'
    ).locator('xpath=following-sibling::p[1]')
        .textContent();
    const amount = await websiteA.locator(
        'p:text("Amount :-")'
    ).locator('xpath=following-sibling::p[1]')
        .textContent();
    // const accountNumber = "5750838958";
    // const ifsc = "KKBK0000173";
    // const name = "Aditya Rawat";
    // const amount = "1";

    console.log(accountNumber, ifsc, name, amount);
    // switch to k1 
    await websiteB.bringToFront();

    // await websiteB.locator("#txtSearchF").click();

    // await websiteB.locator("#txtSearchF").pressSequentially(
    //     accountNumber,
    //     { delay: 50 }
    // );

    const isAccountExist = async () => {

        const searchInput = websiteB.locator("#txtSearchF");

        await searchInput.click();

        // Clear previous search
        await searchInput.clear();

        await searchInput.pressSequentially(
            accountNumber,
            { delay: 50 }
        );

        // // Give search time to load results
        // await websiteB.waitForTimeout(2000);

        // const impsButton = websiteB.getByRole("button", {
        //     name: "IMPS"
        // });
        const impsButton = websiteB.getByRole("button", { name: "IMPS" });
        const exists = await impsButton.count();

        return exists > 0;
    };

    let beneficiaryExists = await isAccountExist();

    if (!beneficiaryExists) {

        console.log("Beneficiary not found");

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

        console.log("Account added");

        // Wait for beneficiary creation
        await websiteB.waitForTimeout(3000);

        // Search again
        beneficiaryExists = await isAccountExist();
    }

    if (beneficiaryExists) {

        // const amountInput =  websiteB.locator("#txtAmount");
        // await amountInput.click();
        // await amountInput.clear()
        // await amountInput.fill(amount); 

        console.log("Beneficiary exists");

        await websiteB
            .locator("#txtAmount")
            .first()
            .fill(amount); // use your amount variable

        await websiteB
            .getByRole("button", {
                name: "IMPS"
            })
            .click();

        await websiteB.locator("#ContentPlaceHolder1_txtTPin").first().fill("6014"); // enter mpin
        await websiteB.getByText("CONFIRM").click()


    } else {
        console.log(
            "Beneficiary still not found after adding"
        );

    }

    console.log("payment successfull");
    await websiteA.bringToFront()

    await websiteA.locator(".btn-close").first().click()

    await websiteA.getByTitle("Approve").first().click()
    await websiteB.waitForTimeout(3000);


    const utrInput = websiteB.locator(
        '//label[contains(text(),"UTR Number")]/following::input[1]'
    );

    await utrInput.fill("1234567890");

})();