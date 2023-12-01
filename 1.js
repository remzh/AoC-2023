// 2023: Day 1
// 11/30/2023

const rl = require('./rl-tools'); 

// First part
exports.silverStar = function(inpArr, inpStr) {
  let inp = inpArr;
  let c = 0;

  for (let i = 0; i < inp.length; i++) {
    let v = inp[i]
    v = v.match(/[0-9]/g);
    console.log(v);
    n = parseInt([v[0], v[v.length-1]].join(''));
    c += n
  }

  return c;
}; 

// Second part
exports.goldStar = function(inpArr, inpStr) {
  let inp = inpArr;
  let c = 0;

  for (let i = 0; i < inp.length; i++) {
    let v = inp[i]
    let mp = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    let f = v.match(/[0-9]|one|two|three|four|five|six|seven|eight|nine/g)[0];
    if (mp.indexOf(f) !== -1) f = mp.indexOf(f) + 1;

    let l = false, ct = 0
    while (l === false) {
      ct ++;
      let t = v.slice(v.length-ct);
      let tst = t.match((/[0-9]|one|two|three|four|five|six|seven|eight|nine/g));
      if (tst) {
        l = tst[0];
      }
    }
    if (mp.indexOf(l) !== -1) l = mp.indexOf(l) + 1;
    n = parseInt([f, l].join(''));

    // this code does not work as it fails to catch the fun and exciting edge case

    // v = v.match(/[0-9]|one|two|three|four|five|six|seven|eight|nine/g);
    // console.log(v);
    // let mp = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    // if (mp.indexOf(v[0]) !== -1) v[0] = mp.indexOf(v[0])+1
    // if (mp.indexOf(v[v.length - 1]) !== -1) v[v.length - 1] = mp.indexOf(v[v.length - 1])+1
    // n = parseInt([v[0], v[v.length-1]].join(''));
    c += n
  }

  return c;
}; 