// 2023: Day 3
// 12/02/2023

const rl = require('./rl-tools'); 
// Important, commonly used functions
const range = rl.array.range; 
Array.prototype.sum = function() {
  return rl.array.sum(this);
}; 

function isNotSym(d, x, y, z) {
  if (d.match(/[0-9]/)) console.log(x+1, y+1, z, d)
  return (d !== '.' && !d.match(/[0-9]/))
}

function isGear(x) {
  return x === '*'
}

// First part
exports.silverStar = function(inpArr, inpStr) {
  let inp = inpArr;
  let c = 0;
  
  // for (let i = 1; i < 2; i++) {
  for (let i = 0; i < inp.length; i++) {
    let v = inp[i];
    // v = v.map(r => parseInt(r));
    let re = /[0-9]+/g;
    while ((match = re.exec(v)) !== null) {
      let adj = false;
      let ind = match.index, mtc = match[0];
      let rngl = Math.max(ind-1, 0);
      let rngh = Math.min(ind+mtc.length, v.length-1)
      // console.log(rngl, rngh)
      for (let x = rngl; x <= rngh; x++) {
        if (i-1 >= 0 && isNotSym(inp[i-1].slice(x, x+1), i-1, x, mtc)) {
          adj = true;
          break;
        }
        if (i+1 < inp.length && isNotSym(inp[i+1].slice(x, x+1))) {
          adj = true;
          break;
        }
        if ((ind > 0 && isNotSym(inp[i].slice(ind-1, ind))) || ((ind+mtc.length) < v.length && isNotSym(v.slice(ind+mtc.length, ind+mtc.length+1)))) {
          adj = true;
        }
      }
      if (adj) {
        c += parseInt(mtc);
        // console.log('m', mtc)
      } else {
        // console.log('nm', mtc)
      }
    }

    
  }

  return c;
}; 

// Second part
exports.goldStar = function(inpArr, inpStr) {
  let inp = inpArr;
  let c = 0;

  let sc = {};

  function ss(row, col, n) {
    if (!sc[`${row},${col}`] ) {
      sc[`${row},${col}`] = [n]
    } else {
      sc[`${row},${col}`].push(n)
    }
  }
  
  // for (let i = 1; i < 2; i++) {
  for (let i = 0; i < inp.length; i++) {
    let v = inp[i];
    // v = v.map(r => parseInt(r));
    let re = /[0-9]+/g;
    while ((match = re.exec(v)) !== null) {
      let adj = false;
      let ind = match.index, mtc = match[0];
      let rngl = Math.max(ind-1, 0);
      let rngh = Math.min(ind+mtc.length, v.length-1)
      // console.log(rngl, rngh)
      for (let x = rngl; x <= rngh; x++) {
        if (i-1 >= 0 && isGear(inp[i-1].slice(x, x+1), i-1, x, mtc)) {
          ss(i-1, x, parseInt(mtc))
          break;
        }
        if (i+1 < inp.length && isGear(inp[i+1].slice(x, x+1))) {
          ss(i+1, x, parseInt(mtc))
          break;
        }
        if ((ind > 0 && isGear(inp[i].slice(ind-1, ind)))) {
          ss(i, ind-1, parseInt(mtc))
          break;
        }
        if (((ind+mtc.length) < v.length && isGear(v.slice(ind+mtc.length, ind+mtc.length+1)))) {
          ss(i, ind+mtc.length, parseInt(mtc))
          break;
        }
      }
    }

    
  }

  for (let key of Object.keys(sc)) {
    // sc[key] = [...new Set(sc[key])]
    if (sc[key].length === 2) {
      // console.log(sc[key]);
      c += sc[key][0] * sc[key][1]
    }
  }
  // console.log(sc);
  return c
}; 