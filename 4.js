// 2023: Day 4
// 12/XX/2023

const rl = require('./rl-tools'); 
// Important, commonly used functions
const range = rl.array.range; 
Array.prototype.sum = function() {
  return rl.array.sum(this);
}; 

// First part
exports.silverStar = function(inpArr, inpStr) {
  let inp = inpArr;
  let c = 0;
  
  for (let i = 0; i < inp.length; i++) {
    let v = inp[i];
    v = v.split('|');
    v[0] = v[0].slice(v[0].indexOf(':')+2).split(' ').map(r => parseInt(r));
    v[1] = v[1].split(' ').map(r => parseInt(r));

    let d = 0;
    for (let n of v[1]) {
      if (v[0].indexOf(n) !== -1) {
        d++
      }
    }
    if (d > 0) c += 2**(d-1)
  }

  return c;
}; 

// Second part
exports.goldStar = function(inpArr, inpStr) {
  let inp = inpArr;
  let c = 0;

  let ss = rl.array.new(inp.length, 1);
  
  for (let i = 0; i < inp.length; i++) {
    let v = inp[i];
    v = v.split('|');
    v[0] = v[0].slice(v[0].indexOf(':')+2).split(' ').map(r => parseInt(r));
    v[1] = v[1].split(' ').map(r => parseInt(r));

    let d = 0;
    for (let n of v[1]) {
      if (v[0].indexOf(n) !== -1) {
        d++
      }
    }
    if (d > 0) {
      for (let n = i+1; n < i+1+d; n++) {
        if(ss[n]) ss[n] += ss[i]
      }
    }
  }

  return ss.sum();
}; 