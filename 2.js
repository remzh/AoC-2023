// 2023: Day 2
// 12/01/2023

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
  // let inp = inpArr.join('\n').split('\n\n').map(r=>r.split('\n')); // [['a','b'],['c','d'],...]
  // let inp = inpArr.join('\n').split('\n\n').map(r=>r.split('\n').map(r=>parseInt(r))); // [[1,2,3],[4,5,6],...]
  let c = 0;

  // let m = new Map();
  // let s = new Set();
  
  let m = {
    'red': 12,
    'green': 13,
    'blue': 14
  }
  for (let i = 0; i < inp.length; i++) {
    let v = inp[i];
    v = v.slice(v.indexOf(':')+1).trim().split(';').map(r => r.trim().split(', '));
    // console.log(v);
    // for (let aset of v) {
    let good = true;
    for (let j = 0; j < v.length; j++) {
      let aset = v[j];
      aset = aset.map(r => r.split(' '));
      // console.log(j+1, aset);
      for (let item of aset) {
        if (parseInt(item[0]) <= m[item[1]]) {
          continue;
        } else {
          good = false;
          break;
        }
      }
    }
    if (good) {
      c += (i+1);
      console.log(i+1)
    }
    // v = v.map(r => parseInt(r));

    
  }

  return c;
}; 

// Second part
exports.goldStar = function(inpArr, inpStr) {
  let inp = inpArr;
  // let inp = inpArr.map(r => parseInt(r)); // [1,2,3]
  // let inp = inpArr.join('\n').split('\n\n')
  // let inp = inpArr.join('\n').split('\n\n').map(r=>r.split('\n')); // [['a','b'],['c','d'],...]
  // let inp = inpArr.join('\n').split('\n\n').map(r=>r.split('\n').map(r=>parseInt(r))); // [[1,2,3],[4,5,6],...]
  let c = 0;

  // let m = new Map();
  // let s = new Set();
  
  for (let i = 0; i < inp.length; i++) {
    let m = {
      'red': 0,
      'green': 0,
      'blue': 0
    }

    let v = inp[i];
    v = v.slice(v.indexOf(':')+1).trim().split(';').map(r => r.trim().split(', '));
    // console.log(v);
    // for (let aset of v) {
    let good = true;
    for (let j = 0; j < v.length; j++) {
      let aset = v[j];
      aset = aset.map(r => r.split(' '));
      // console.log(j+1, aset);
      for (let item of aset) {
        if (parseInt(item[0]) <= m[item[1]]) {
          continue;
        } else {
          m[item[1]] = parseInt(item[0]);
        }
      }
    }
    c += (m.red * m.blue * m.green)
    // v = v.map(r => parseInt(r));

    
  }

  return c;
}; 