let budgetController = (function () {
    let a = 23;

    let add = function (x) {
        return x + a;
    }

    return {
        publicTest: function (y) {
            return add(y);
        }
    }
})();

let userController = (function () {

    }

)();

let controller = (function (budgetCtrl, userCtrl) {

        let z = budgetCtrl.publicTest(5);

        return {
            anotherPublic: function () {
                console.log(z);
            }
        }

    }

)(budgetController, userController);