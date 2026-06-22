
const { chromium } = require("playwright");

const getWithdrawDetails = async (websiteA) => {
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

    return { accountNumber, ifsc, name, amount }
}

const createBeneficiary = async (websiteB) => {
    try {

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

        // account details validation 

        await websiteB.locator(".ajs-ok").click();


        console.log("Account added");
    } catch (error) {
        console.log(error);

    }
}

const createPayment = async (websiteB) => {

    // const amountInput =  websiteB.locator("#txtAmount");
    // await amountInput.click();
    // await amountInput.clear()
    // await amountInput.fill(amount); 

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
}

(async () => {

    const browser = await chromium.connectOverCDP(
        "http://127.0.0.1:9222"
    );


    const context = browser.contexts()[0];

    const pages = context.pages();

    const websiteA = pages[0];
    const websiteB = pages[1];


    try {

        await websiteA.bringToFront();

        // for (let i = 0; i <= 50; i++) {



        // // while (true) {



        //     const count = await websiteA.locator(".details-notes-cmn-img").count();

        //     if (count === 0) {
        //         console.log("All withdrawals completed");
        //         break;
        //     }

        //     await websiteA.locator(".details-notes-cmn-img").nth(i).click();

        //     // get first account withdraw details.
        //     const { accountNumber, ifsc, name, amount } = await getWithdrawDetails(websiteA);
        //     console.log("account details : ", accountNumber, ifsc, name, amount);

        //     await websiteA.waitForTimeout(3000)

        //     await websiteA.locator(".btn-close").first().click()

        // }


        let rowIndex = 0;

        while (true) {


            const rows = websiteA.locator(".details-notes-cmn-img");

            const count = await rows.count();

            if (rowIndex >= count) {
                console.log("No more eligible rows");
                process.exit(1);
                break;
            }

            // await websiteA.locator(".details-notes-cmn-img").first().click();

            // // get first account withdraw details.
            // const { accountNumber, ifsc, name, amount } = await getWithdrawDetails(websiteA);
            // console.log("account details : ", accountNumber, ifsc, name, amount);

            await rows.nth(rowIndex).click();
            const { accountNumber, ifsc, name, amount } = await getWithdrawDetails(websiteA);
            console.log("account details :", accountNumber, ifsc, name, amount, rowIndex);

            if (amount < 1000 || amount > 10000) {
                console.log("Skipping");
                await websiteA.locator(".btn-close").first().click()
                rowIndex++;
                continue;
            }

            await websiteA.locator(".btn-close").first().click()

            await websiteA.getByTitle("Approve").nth(rowIndex).click()
            await websiteB.waitForTimeout(3000);

            // submit the utr number
            await websiteA.locator(
                'label:text("UTR Number")'
            ).locator('xpath=following-sibling::input[1]').fill("1234567890")

            // click on the submit button

            // cancel temp
            await websiteA.getByText("Cancel").first().click()

            rowIndex++

        }

    } catch (error) {
        console.log(error);
        process.exit(1);
    }

})();



//    // acccount details validation.


//             // const accountNumber = "5750838958";
//             // const ifsc = "KKBK0000173";
//             // const name = "Aditya Rawat";
//             // const amount = "1";

//             // switch to k1 
//             await websiteB.bringToFront();

//             const isAccountExist = async () => {

//                 const searchInput = websiteB.locator("#txtSearchF");

//                 await searchInput.click();

//                 // Clear previous search
//                 await searchInput.clear();

//                 await searchInput.pressSequentially(
//                     accountNumber,
//                     { delay: 50 }
//                 );

//                 // // Give search time to load results
//                 // await websiteB.waitForTimeout(2000);

//                 // const impsButton = websiteB.getByRole("button", {
//                 //     name: "IMPS"
//                 // });
//                 const impsButton = websiteB.getByRole("button", { name: "IMPS" });
//                 const exists = await impsButton.count();

//                 return exists > 0;
//             };

//             let beneficiaryExists = await isAccountExist();

//             if (!beneficiaryExists) {
//                 console.log("Beneficiary not found");

//                 // await createBeneficiary() // create beneficiary or create user account

//                 await websiteB.getByText("Add New").click();

//                 await websiteB
//                     .locator("#ContentPlaceHolder1_txtAddBAccountNo")
//                     .fill(accountNumber);

//                 await websiteB
//                     .locator("#ContentPlaceHolder1_txtAddBIFSC")
//                     .fill(ifsc);

//                 await websiteB
//                     .locator("#txtAddBName")
//                     .fill(name);

//                 await websiteB
//                     .locator("#ContentPlaceHolder1_btnAddBeneficiary")
//                     .click();

//                 // account details validation 

//                 await websiteB.locator(".ajs-ok").click();


//                 console.log("Account added");

//                 // Wait for beneficiary creation
//                 await websiteB.waitForTimeout(3000);

//                 // Search again
//                 beneficiaryExists = await isAccountExist();
//             }


//             if (beneficiaryExists) {
//                 console.log("Beneficiary exists");
//                 // await createPayment();

//                 // const amountInput =  websiteB.locator("#txtAmount");
//                 // await amountInput.click();
//                 // await amountInput.clear()
//                 // await amountInput.fill(amount); 

//                 await websiteB
//                     .locator("#txtAmount")
//                     .first()
//                     .fill(amount); // use your amount variable

//                 await websiteB
//                     .getByRole("button", {
//                         name: "IMPS"
//                     })
//                     .click();

//                 await websiteB.locator("#ContentPlaceHolder1_txtTPin").first().fill("6060"); // enter mpin


//                 await websiteB.getByText("CONFIRM").click()
//             } else {
//                 console.log("Beneficiary still not found after adding");
//             }

//             // submit utr 

//             console.log("payment successfull");
//             await websiteA.bringToFront()

//             await websiteA.locator(".btn-close").first().click()

//             await websiteA.getByTitle("Approve").first().click()
//             await websiteB.waitForTimeout(3000);


//             const utrInput = websiteB.locator(
//                 '//label[contains(text(),"UTR Number")]/following::input[1]'
//             );

//             await utrInput.fill("1234567890");