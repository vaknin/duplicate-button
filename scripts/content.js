/*

# Main Flow

If the website the user is on is Travolutionary's B2B engine, the program will scan the webpage periodically,
and once it finds a feed, it'll add the "Duplicate" button to the feed, using the 'addButtons' function.
Inside this function, a button will be added to the feed's HTML element, with an onclick eventlistener of the "duplicate" function.
The 'duplicate' function receives as parameter the original feed(that was pressed), it presses the "create new contract" button, and then copies all the values
from the original(presses) contract, to the new(empty) contract.

*/

// Duplicate contract
async function duplicate(OriginContract){

    // Change value of element, and its children
    function copyValues(origin, target){

        // Copy the value
        target.value = origin.value;

        // Checkboxes
        if (origin.checked){
            target.checked = true;
        }
        else{
            target.checked = false;
        }

        // If the element has children - call this function on them as well
        if (target.children){
            for (let child of Array.from(target.children)){

                let index = Array.from(target.children).indexOf(child);
                copyValues(Array.from(origin.children)[index], child);
            }
        }
    }

    // Click on "create new contract"
    document.querySelector('.plus-sign-label').click();

    // Wait for the new contract page to load
    while(true){
        await sleep(50);
        let newContract = document.querySelector('.account-box.account-details');
        if(newContract && newContract.querySelectorAll('.col-sm-3')[0] && newContract.querySelectorAll('.col-sm-3')[0].innerText.replace(/[^0-9]/g, '') == '0'){
            break;
        }
    }
    
    // The new contract to change and create
    let NewContract = document.querySelector('.account-box.account-details');

    // Copy all values from the original contract
    copyValues(OriginContract, NewContract);

    // Change contract name to the original one + 'clone'
    document.querySelector('[name="Account.AccountAlias"').value = OriginContract.querySelector('[name*="Account.AccountAlias"').value + ' Clone';
}

// Add new buttons to all contracts
function addButtons(contract){

    // Create the button
    let button = document.createElement('input');
    button.type = 'button';
    button.classList.add('k-button', 'blue', 'full-width');
    button.style.marginTop = '10px';
    button.value = 'Duplicate';

    // Button onclick -> duplicate
    button.addEventListener('click', () => {
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

            // No need to add the button in the contract creation screen
            let feedID = contracts[0].querySelectorAll('.col-sm-3')[0].innerText.replace(/[^0-9]/g, '');
            if (feedID == '0' || feedID == ''){
                return;
            }

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