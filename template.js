// Day #

const rl = require('./rl-tools'); 
// Important, commonly used functions
const range = rl.array.range; 
Array.prototype.sum = function() {
  return rl.array.sum(this);
}; 

// First part
exports.silverStar = function(inpArr, inpStr) {
  let inp = inpArr;
  // let inp = inpArr.map(r => parseInt(r)); // [1,2,3]
  // let inp = inpArr.join('\n').split('\n\n')
  // let inp = inpArr.join('\n').split('\n\n').map(r=>r.split('\n').map(r=>parseInt(r))); // [[1,2,3],[4,5,6],...]
  let c = 0;

  // let m = new Map();
  // let s = new Set();
  // let o = {};
  // let a = [];
  
  for (let i = 0; i < inp.length; i++) {
    let v = inp[i];
    // v = v.map(r => parseInt(r));

      
  }

  return c;
}; 

// Second part
exports.goldStar = function(inpArr, inpStr) {
  
}; 