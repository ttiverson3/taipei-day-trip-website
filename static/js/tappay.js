TPDirect.setupSDK(20468, "app_4I1CzKijPHmGkioL7zeWNvAyOUzNDdQBxUSZq6MHmhYMVOtPEzgvoxTXDA4B", "sandbox")

var fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'CVV'
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})



TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        submitButton.removeAttribute('disabled');
        submitButton.style.backgroundColor = "#489";
    } else {
        // Disable submit Button to get prime.
        submitButton.setAttribute('disabled', true);
        submitButton.style.backgroundColor = "#666";
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    const cardNumber = document.getElementById("card-number");
    const cardDate = document.getElementById("card-expiration-date");
    const cardCCV = document.getElementById("card-ccv");
    const checkNum = document.getElementById("check-num");
    const checkDate = document.getElementById("check-date");
    const checkCCV = document.getElementById("check-ccv");
    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
        cardNumber.style.border = "1px solid red";
        checkNum.style.display = "none";
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
        cardNumber.style.border = "1px solid green";
        checkNum.style.display = "inline-block";
    } else {
        // setNumberFormGroupToNormal()
        cardNumber.style.border = "1px solid orange";
        checkNum.style.display = "none";
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
        cardDate.style.border = "1px solid red";
        checkDate.style.display = "none";
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
        cardDate.style.border = "1px solid green";
        checkDate.style.display = "inline-block";
    } else {
        // setNumberFormGroupToNormal()
        cardDate.style.border = "1px solid orange";
        checkDate.style.display = "none";
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
        cardCCV.style.border = "1px solid red";
        checkCCV.style.display = "none";
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
        cardCCV.style.border = "1px solid green";
        checkCCV.style.display = "inline-block";
    } else {
        // setNumberFormGroupToNormal()
        cardCCV.style.border = "1px solid orange";
        checkCCV.style.display = "none";
    }
})