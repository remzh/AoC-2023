exports.array = {
  /**
   * Creates and returns a filled array
   * @param {integer} size - size of array to create
   * @param {*} val - what to fill the array with
   * @returns {array}
   */
  new: (size=1, val) => {
    return new Array(size).fill(val); 
    // return Array.from({length: size}, () => val);
  }, 
  /**
   * Returns the sum of all numbers in an array (or nested array). Ignores non-numerical values.
   * @param {array} input 
   * @returns number
   */
  sum: function (input) {
    input = input.flat(Infinity); // Flatten array
    return input.reduce((a, c) => {
      if (typeof c === 'number') return a + c; 
      return a; 
    }, 0); 
  },
  /**
   * Returns the product of all numbers in an array (or nested array). Ignores non-numerical values.
   * @param {array} input 
   * @returns number
   */
  product: function (input) {
    input = input.flat(Infinity); // Flatten array
    return input.reduce((a, c) => {
      if (typeof c === 'number') return a * c; 
      return a; 
    }, 1); 
  },
  /**
   * Returns a range of integers from [start, end). Can go backwards. 
   * @param {number} start - starting value
   * @param {number} end - ending value
   * @param {boolean} inclusive=false - whether to include the end value or not 
   */ 
  range: function (start, end, inclusive=false) {
    let flip = false; 
    if (start === end) {
      return inclusive ? [start] : []; 
    } else if (start > end) {
      flip = true; 
      let t = end; 
      end = start + 1; 
      start = t + 1; 
    }
    let out = []; 
    if (inclusive) flip ? start -- : end ++; 
    for (let i = start; i < end; i++) {
      out.push(i); 
    }
    return flip ? out.reverse() : out; 
  }, 
  /**
   * Returns a NEW 2d array that's the transposed version of the original. 
   * @param {array} input - 2d array of values
   */
  transpose: (input) => {
    let dup = [...input]; 
    let out = []; 
    for (let i = 0; i < dup.length; i++) {
      for (let j = 0; j < dup[i].length; j++) {
        if (!out[j]) out[j] = []; 
        out[j][i] = dup[i][j]; 
      }
    }
    return out; 
  }, 
  /**
   * Returns a new array listing all values shared between both input arrays, that is, the intersection of inp1 and inp2. 
   * Does not modify either input array. 
   * @param {array} inp1 - first array
   * @param {array} inp2 - second array
   * @returns {array}
   */
  duplicates: (inp1, inp2) => {
    return inp1.concat(inp2).filter((e, i, a) => a.indexOf(e) !== i); 
  }, 
  /**
   * Returns the difference between inp1 and inp2, that is, an array with every elemnt in inp1 that is NOT in inp2. 
   * @param {array} inp1 - first array
   * @param {array} inp2 - second array
   * @returns {array}
   */
  diff: (inp1, inp2) => {
    return inp1.filter((e) => inp2.indexOf(e) === -1); 
  }
}

exports.string = {
  /**
   * Counts how many times (substr) occurs in (input)
   * @param {string} input - input string
   * @param {string} substr - what string to look for
   * @returns {number}
   */
  count: (input, substr) => {
    let res = 0, nextInd = input.indexOf(substr); 
    while (nextInd !== -1) {
      res ++; 
      input = input.slice(nextInd + substr.length); 
      nextInd = input.indexOf(substr);
    }
    return res; 
  }, 
  /**
   * Removes leading spaces, trailing spaces, and extra spaces (2+) from a string
   * @param {string} input - input string
   * @returns {string}
   */
  fullTrim: (input) => {
    input = input.replace(/\ \ +/g, ' '); 
    return input.trim(); 
  }
}

exports.number = {
  /**
   * Checks whether a given input is prime
   * @param {integer} n - integer to test
   * @returns {boolean}
   */
  isPrime: (n) => {
    let sn = Math.floor(Math.sqrt(n)); 
    for(let i = 2; i <= sn; i++) {
      if(n % i === 0) return false;
    }
    return n > 1;
  }
}

exports.Node = class Node {
  
}