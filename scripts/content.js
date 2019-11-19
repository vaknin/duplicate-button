// Duplicate contract
async function duplicate(OriginContract){

    // Change value of element, and its children
    function copyValues(origin, target){

        return new Promise(async resolve => {

            // Copy the value
            target.value = origin.value;

            // Checkboxes
            if (origin.checked){
                target.click();
                target.checked = true;
            }
            else{
                target.checked = false;
            }
    
            // If the element has children - call this function on them as well
            if (target.children){
                for (let child of Array.from(target.children)){
    
                    let index = Array.from(target.children).indexOf(child);
                    await copyValues(Array.from(origin.children)[index], child);
                }
            }
            resolve();
        });
    }

    // Click on "create new contract"
    document.querySelector('.plus-sign-label').click();

    // Wait for the new contract page to load
    let feedID = document.querySelectorAll('.col-sm-3')[0].innerText.replace(/[^0-9]/g, '');
    while(feedID != '0'){
        await sleep(25);
        feedID = document.querySelectorAll('.col-sm-3')[0].innerText.replace(/[^0-9]/g, '');
    }
    
    // The new contract to change and create
    let NewContract = document.querySelector('.account-box.account-details');

    // Copy all values from the original contract
    await copyValues(OriginContract, NewContract);

    // Change contract name
    document.querySelector('[name="Account.AccountAlias"').value = OriginContract.querySelector('[name*="Account.AccountAlias"').value + ' Clone';
}

// Add new buttons to all contracts
function addButtons(contract){

    // Create the button
    let button = contract.querySelector('input[type="button"').cloneNode();
    button.style.marginTop = '10px';
    button.value = 'Duplicate';
    button.addEventListener('click', async () => {
        
        // Await for the popup to show
        while(document.querySelectorAll('.modal-dialog').length != 3){
            await sleep(10);         
        }
        
        // Click Cancel
        document.querySelectorAll('.modal-dialog')[0].querySelectorAll('input')[1].click();

        // Copy all of the values from the original contract to the new one
        duplicate(contract.cloneNode(true));
    });

    // Add the button
    contract.querySelector('input[type="button"').parentElement.appendChild(button);
}

//Sleep [ms] seconds
async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

// On the backoffice website
if (document.URL.includes('worldtravelink.com')){

    setInterval(() => {

        // Check for opened contracts
        if (document.querySelectorAll('.account-box.account-details').length > 0){

            let contracts = document.querySelectorAll('.account-box.account-details');

            // Loop through all contracts
            for (let contract of contracts){

                let buttons = Array.from(contract.querySelectorAll('input[type="button"]'));
                let duplicateButtonExists = buttons.map(btn => btn = btn.value).includes('Duplicate');

                // Add duplicate button
                if (!duplicateButtonExists){
                    addButtons(contract);
                }
            }
        }
    }, 250);
}