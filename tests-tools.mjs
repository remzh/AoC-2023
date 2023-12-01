import rl from './rl-tools.js'; 
import colors from 'colors';
import { strict as assert } from 'assert';

let passed = 0, total = 0; 
function test(func, args, expected) {
  try {
    assert.deepEqual(func(...args), expected);
    passed ++; 
  } catch (err) {
    console.error(`[!] Function "${func.name}" failed assertion.`.red);
    console.error(err); 
  }
  total ++; 
}

// Array tests
test(rl.array.new, [5, 0], [0, 0, 0, 0, 0]); 
test(rl.array.new, [4, 'a'], ['a', 'a', 'a', 'a']); 

test(rl.array.sum, [[1, 2, 'aaa', 3, 4, 'b', 5, 'c']], 15); 
test(rl.array.sum, [[1, 2, ['aaa', 3, [4, 'b']], 5, [['c']]]], 15);

test(rl.array.range, [0, 5], [0, 1, 2, 3, 4]); 
test(rl.array.range, [6, 3, true], [6, 5, 4, 3]); 
test(rl.array.range, [6, 3, false], [6, 5, 4]); 

test(rl.array.transpose, [[[1, 2], [3, 4], [5, 6]]], [[1, 3, 5], [2, 4, 6]]); 
test(rl.array.transpose, [[[1, 2, 3, 4], [5, 6], [7]]], [[1, 5, 7], [2, 6], [3], [4]]); 

test(rl.array.duplicates, [[0, 1, 2, 3], [2, 3, 4, 5]], [2, 3]); 
test(rl.array.duplicates, [[0, 3, 1, 2, 5], [2, 3, 5, 6, 1]], [2, 3, 5, 1]); 

test(rl.array.diff, [[0, 1, 2, 3], [2, 3, 4, 5]], [0, 1]); 

// Number tests
test(rl.number.isPrime, [97], true); 
test(rl.number.isPrime, [169], false); 

// String tests
test(rl.string.count, ['hello world', 'l'], 3); 
test(rl.string.count, ['aaaaaabaaab', 'aa'], 4); 

test(rl.string.fullTrim, ['   1  2    3       4 5 '], '1 2 3 4 5'); 
test(rl.string.fullTrim, ['1      2 3.4 5.6 78   9'], '1 2 3.4 5.6 78 9'); 

// Node v16.6.0+ (replace all, negative indexing)
try {
  assert.equal('Hello World!'.at(-1), '!'); 
  assert.equal('Hello World!'.replaceAll('l', ''), 'Heo Word!'); 
  passed += 2; total += 2; 
} catch (err) {
  console.error(err); 
}

console.log(`Passed ${passed}/${total} tests.`); 