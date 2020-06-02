let budgetController = (function () {})();

let userController = (function () {
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };


    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            };
        },

        getDOMstrings: function () {
            return DOMstrings;
        }

    };
})();

let appController = (function (budgetCtrl, userCtrl) {

    let DOM = userCtrl.getDOMstrings();

    let ctrlAddItem = function () {
        //1. Get the field input data

        let input = userCtrl.getInput();
        console.log(input);


        //2. Add the item to the budget controller
        //3. Add the item to UI
        //4. Calculate the budget
        //5. Display the budget on the UI
    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (e) {
        if (e.keyCode === 13 || e.which === 13) {
            ctrlAddItem();
        }
    });
})(budgetController, userController);