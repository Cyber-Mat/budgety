/********************* 
STEP A
1. Create modules
2. Set up event listeners
  a. To call a function(ctrlAddItem) with each event
3. ctrlAddItem will perform the following:
  a. Get items from input fields
  b. Create budget data structure(not a fxn of ctrlAddItem)
  c. Add items to budget data structure
    i.  Create new objects for each item(using fxn constructors)
    ii. Store items in inc/exp array
  d. Add items to UI list
    i.   Add items
    ii.  Clear fields
    iii. Set focus back to description field
  e. Calculate budget
  f. Display budget on UI
    i.  Clear field on page load
    ii. Display budget on user input

STEP B
1. Set up event listener(using event delegation)
  a. Add event listener to common parent element
  b. To call a function (ctrlDeleteItem) with each event
2. ctrlDeleteItem will perform the following:
  a. Identify and select event target
  b. Traverse the DOM to the parent element of item
  c. Delete item from data structure
  d. Delete item from UI list
  e. Recalculate budget
  f. Update budget on UI
*********************/
/*


****************************************************************************
****************************************************************************/
/*BUDGET MODULE*/

let budgetController = (function () {
  //////////////////////////////////////
  /*Function constructors*/
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

  //////////////////////////////////////
  /*Data structure*/
  let data = {
    allItems: {
      exp: [],
      inc: [],
    },

    totals: {
      exp: 0,
      inc: 0,
    },

    budget: 0,

    percentage: 0,
  };

  //////////////////////////////////////
  /*Private functions*/
  let calculateTotal = function (type) {
    let sum = 0;
    //Iterate through exp and inc arrays and sum all values
    data.allItems[type].forEach((item) => {
      sum += item.value;
    });

    //Add sum to data structure
    data.totals[type] = sum;
  };

  //////////////////////////////////////
  /*Public methods*/
  return {
    addItem: function (type, des, val) {
      let newItem, ID;

      //Set id based on array's last element's id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new items based on type(inc/exp)
      if (type === 'exp') {
        newItem = new Expenses(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      //Add to data structure
      data.allItems[type].push(newItem);

      //Return newItem
      return newItem;
    },

    deleteItem: function (type, id) {
      let idArr, index;

      //Create a new array with all IDs
      idArr = data.allItems[type].map(item => item.id);

      //Find the index of specific id to be deleted
      index = idArr.indexOf(id);

      //Delete the index from the id array if index of id is found
      if (index >= 0) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      let budget, percentage;

      //Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //Calculate  budget
      budget = data.totals.inc - data.totals.exp;
      data.budget = budget;

      //Calculate percentage and add to data structure
      if (data.totals.inc > 0) {
        percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        data.percentage = percentage;
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();
/*


****************************************************************************
****************************************************************************/
/*USER INTERFACE MODULE*/

let uiController = (function () {
  /*Private variables and functions*/
  let DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    itemContainer: '.container'
  };

  //////////////////////////////////////
  /* Public methods*/
  return {
    getDOMStrings: function () {
      return DOMStrings;
    },

    getInput: function () {
      let type, description, value;
      return {
        type: document.querySelector(DOMStrings.inputType).value, //value will be inc/exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      let html, newHtml, element;
      //Create html string with placeholder text
      if (type === 'exp') {
        element = document.querySelector(DOMStrings.expensesContainer);
        html =
          '<div class="item clearfix" id="exp-%id%"><div class = "item__description">%description%</div><div class = "right clearfix"><div class = "item__value">%value%</div><div class = "item__percentage">21%</div><div class = "item__delete"><button class = "item__delete--btn"><i class = "ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'inc') {
        element = document.querySelector(DOMStrings.incomeContainer);
        html =
          '<div class="item clearfix" id="inc-%id%"><div class = "item__description" >%description%</div><div class = "right clearfix"><div class = "item__value">%value%</div><div class = "item__delete"><button class = "item__delete--btn"><i class = "ion-ios-close-outline"></i></button ></div></div></div>';
      }

      //Replace placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //Insert new html code to html file
      element.insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function (selectorID) {
      //Select element based on id
      let el = document.getElementById(selectorID);

      //Traverse DOM to parent and delete element as a child
      el.parentNode.removeChild(el);

    },

    clearFields: function () {
      let fields, fieldArr;

      fields = document.querySelectorAll(
        //Returns a nodelist not an array
        DOMStrings.inputDescription + ', ' + DOMStrings.inputValue
      );

      //Convert nodelist to an array
      fieldArr = Array.prototype.slice.call(fields);

      //Iterate through the array to clear each field
      fieldArr.forEach((field) => {
        field.value = '';
      });

      //Set focus back to description
      fieldArr[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },
  };

  //////////////////////////////////////
})();
/*


****************************************************************************
****************************************************************************/
/* OVERALL APP  MODULE TO CONTROL BUDGET AND USER MODULES*/

let appController = (function (budgetCtrl, uiCtrl) {
  //////////////////////////////////////
  /*DOM Strings*/
  let DOM = uiCtrl.getDOMStrings();

  /////////////////////////////////////
  /*Function to calculate and update budget*/
  let updateBudget = function () {
    let budget;
    //Calculate budget
    budgetCtrl.calculateBudget();

    //Get budget
    budget = budgetCtrl.getBudget();

    //Display budget
    uiCtrl.displayBudget(budget);
  };

  //////////////////////////////////////
  /*Function expression to execute with each event*/
  let ctrlAddItem = function () {
    let input, newItem;

    /*a. Get user input*/
    input = uiCtrl.getInput();

    if (input.description && input.value) { //Execute if description and value are true
      /*b. Add input to data structure*/
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      /*c. Add input to UI list*/
      uiCtrl.addListItem(newItem, input.type);

      /*d. Clear fields*/
      uiCtrl.clearFields();

      /*e. Calculate budget*/
      updateBudget();
    }
  };

  let ctrlDeleteItem = function (e) {
    let itemID, splitID, type, ID;

    /*a. Select target element and traverse DOM*/

    //Get unique ID of item(inc-0/exp-0)
    itemID = (e.target.parentNode.parentNode.parentNode.parentNode.id);

    if (itemID) { //Split ID into composition parts(returns and array)
      splitID = itemID.split('-');

      //Store each part in a separate variable
      type = splitID[0];
      ID = parseInt(splitID[1]);
    };

    /*b. Delete item from data structure*/
    budgetCtrl.deleteItem(type, ID);

    /*c. Delete item from UI list*/
    uiCtrl.deleteListItem(itemID);

    /*d. Update budget*/
    updateBudget();


  };

  //////////////////////////////////////
  /*Event listeners*/
  let setUpEventListener = function () {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.itemContainer).addEventListener('click', ctrlDeleteItem);
  };

  //////////////////////////////////////
  /*Public Methods*/
  return {
    init: function () {
      console.log('App is up and running');
      setUpEventListener();

      //Clear budget fields
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
    },

    testing: function () {
      console.log(newItem);
    },
  };
})(budgetController, uiController);

appController.init();