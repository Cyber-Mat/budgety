let budgetController = (function () {

    let Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            expTotal: 0,
            incTotal: 0,
        }
    };


    return {
        addItem: function (type, des, val) {
            let newItem, ID;

            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create new item
            if (type === 'exp') {
                newItem = new Expenses(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            };

            //Push new item into data structure
            data.allItems[type].push(newItem);

            //Return new item
            return newItem;

        },
        testing: function () {
            console.log(data.allItems);

        }
    };


})();

let UIController = (function () {
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };


    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            };
        },
        addListItem: function (obj, type) {
            let html, newHtml, element;
            // Create HTML string with placeholder text

            if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class = "item clearfix" id = "expense-%id%"><div class = "item__description">%description%</div><div class = "right clearfix"></div><div class = "item__value">%value%</div><div class = "item__percentage">21%</div><div class = "item__delete"><button class = "item__delete--btn" ><i class = "ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class = "item clearfix" id = "income-%id%"><div class = "item__description">%description%</div><div class = "right clearfix"><div class = "item__value">%value%</div><div class = "item__delete"><button class = "item__delete--btn"><i class = "ion-ios-close-outline"></i></button></div></div></div>';
            };

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        getDOMstrings: function () {
            return DOMstrings;
        }

    };
})();

let appController = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    }

    let ctrlAddItem = function () {
        let input, newItem;

        //1. Get the field input data
        input = UICtrl.getInput();

        //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add the item to UI
        UICtrl.addListItem(newItem, input.type);

        //4. Calculate the budget
        //5. Display the budget on the UI
    }

    return {
        init: function () {
            console.log('I\'m up');
            setupEventListeners();
        }
    }


})(budgetController, UIController);

appController.init();