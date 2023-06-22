'use strict';

// Scoping
function calcAge(birthYear) {
  const age = 2023 - birthYear;

  function printAge() {
    const output = `${firstName}, you are ${age}, born in ${birthYear}`;
    console.log(output);

    if (birthYear >= 1981 && birthYear <= 1996) {
      var millenial = true;
      // const firstName = 'Lam'; // this will be used for const str below because JS tries to lookup variables in current scope first
      const str = `Oh, and you are a millenial, ${firstName}`;
      console.log(str);

      function add(a, b) {
        return a + b;
      }

      // output = 'NEW OUTPUT'; since inner scope has access to outer scope, it can change variables of outer scope (assuming output is type let)
    }
    // console.log(str);    // outer scope can't access inner scope because const and let are block scope
    console.log(millenial); // outer scope can access inner scope because block scope does NOT applied to var
    // console.log(add(2, 3)); // function scope > block scope => can be called. However, under strict mode, functions are block scope.
  }

  printAge();
  return age;
}

const firstName = 'Hao';
calcAge(1996);

/**
 * firstName                --- global scope
 *   function calcAge       --- function scope #1
 *     const age
 *     function printAge    --- function scope #2
 *        const output
 *        var millenial     --- var belongs to the closest function scope
 *          if block        --- block scope
 *            const str
 *               function add
 */

// Hoisting
console.log(me); // undefined - hoisting with initial value of undefined
// console.log(myJob); // error: can't access b4 initialization (still in TDZ)
// console.log(year); // error: can't access b4 initialization (still in TDZ)

var me = 'Hao';
let myJob = 'student';
const year = 2001;

// Hoisting with Functions (strict mode - block scope)
console.log(addDeclaration(2, 3)); // 5 => function declaration: hoisted with initial value of actual function definition
// console.log(addExpression(2, 3)); // "error: can't access b4 initialization" => const is not hoisted, initial value is <uninitialzied>, still in TDZ
// console.log(addArrowFunctin(2, 3)); // "error: not a function" => var is hoisted with initial value of undefined => can't called a function on undefined
function addDeclaration(a, b) {
  return a + b;
}
const addExpression = function (a, b) {
  return a + b;
};
var addArrowFunctin = (a, b) => a + b;

// Example with var (not good to use)
if (!numProducts) deleteShoppingCart(); // all products will be deleted bc numProducts is a var, and a var is hoisted with initial value of unedfined, and undefined is a falsy value
var numProducts = 10;
function deleteShoppingCart() {
  // dangerous to use
  console.log('All products deleted!');
}

// this Keyword - refers to the object that is calling the function
// ex:
const hao = {
  year: 2001,
  calcAge: function () {
    console.log(this); // this = hao object, bc hao is the object that is calling calcAge() function
    console.log(2023 - this.year); // thus, we can take advantage of this keyword and use it
  },
};
hao.calcAge();
const cat = {
  year: 2002,
};
cat.calcAge = hao.calcAge; // copy over calcAge method, note that the method use "this" keyword
cat.calcAge(); // 21 - which is correct because this keyword will always be the object that is CALLING it, and in this case, the cat object
const f = hao.calcAge;
// f();  // error bc f() is just a regular function call, no parent => undefined this
// 1. regular function call - function does not attach to any object (no owner)
console.log(this); // window object
const calculateAge = function (birthYear) {
  console.log(2023 - birthYear);
  console.log(this); // undefined - in normal function call, this = window object, however, under strict mode, this = undefined
};
calculateAge(2001);
// 2. arrow function call
const calculateAgeArrow = birthYear => {
  console.log(2023 - birthYear);
  console.log(this); // window object - for arrow function, this = parent's this, and its parent is window
};
calculateAgeArrow(2001);

// Regular Functions vs Arrow Functions
const lth = {
  firstName: 'Hao',
  year: 2001,
  calcAge: function () {
    console.log(this);
    console.log(2023 - this.year);

    // const isGenZ = function () {
    //   console.log(this);  // undefined
    //   console.log(this.birthYear >= 2000);
    // };
    // isGenZ(); // error: this is a regular function call => this = object that is calling it, which is undefined bc regular function has no object attached to it (no owner)

    // Solution #1
    // const self = this;
    // const isGenZ = function () {
    //   console.log(self);
    //   console.log(self.birthYear >= 2000);
    // };
    // isGenZ();

    // Solution #2
    const isGenZ = () => {
      console.log(this); // arrow function inherits this keyword from parent, which is calcAge function. this key word of calcAge refers to the object that is calling it and lth calls calcAge() function, so this = lth object.
      console.log(this.birthYear >= 2000);
    };
    isGenZ();
  },
  greet1: () => {
    console.log(this); // window object, note that lth = {} is not a code block, just object literal(when we defined object). And arrow function inherits parent this keyword, and in this case the window object
    console.log(`Hey ${this.firstName}`); // undefined bc window does not have property firstName
  },
  greet2: function () {
    console.log(this); // regular function call, so this keyword refers to the object that is calling it, which is lth object
    console.log(`Hey ${this.firstName}`); // works since lth.firstName exists
  },
};
// lth.greet1(); // hey undefined
// lth.greet2(); // hey Hoa
lth.calcAge();

// Primitive vs Objects
let a = 1;
let b = a;
b = 3;
console.log(a, b); // 1 3
const obj1 = {
  age: 18,
  favNum: [1, 2, 3],
};
const obj2 = obj1;
obj2.age = 22;
console.log(obj1.age, obj2.age); // 22 22 => obj1 and obj2 referes to the same object via the heap addr(where obj lives) stored on callstack

const obj3 = Object.assign({}, obj1);
obj3.age = 30;
console.log(obj1.age, obj3.age); // 22 30 => works but only shallow copy, if we have object within object => won't work

console.log(obj1.favNum, obj3.favNum); // [1,2,3] [1,2,3]
obj3.favNum.push('4');
console.log(obj1.favNum, obj3.favNum); // [1,2,3,4] [1,2,3,4] - shallow copy only -> didn't work
