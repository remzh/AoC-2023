// AoC Base
// (C) 2022 Ryan Zhang
const VERSION = '2.3.1'

require('dotenv').config(); 

const YEAR = process.env.AOC_YEAR;
const fetch = require('node-fetch'); 

const fs = require('fs'); 
const path = require('path'); 
const colors = require('colors'); 
const cheerio = require('cheerio'); 


const flags = {
  benchmark: process.argv.indexOf('-b') !== -1,
  silenceLog: process.argv.indexOf('-q') !== -1,
  testInputOnly: process.argv.indexOf('-t') !== -1,
  help: process.argv.indexOf('-?') !== -1 || process.argv.indexOf('--help') !== -1,
}

if (flags.help) {
  console.log(`Usage: node base.js [DAY] [OPTION...]\nbase.js is a custom helper script for Advent of Code.\n\nWith no DAY, or when DAY is 0, program will default to current day.\n\nOptions:\n\t-b\t\tBenchmarking mode, adds performance timers to code execution\n\t-q\t\tQuiet mode, supresses all console.log calls within a particular day's script\n\t-t\t\tTest input only, runs day's script only against test input\n\t-?, --help\tHelp, shows this help message`);
  process.exit(0);
}

let benchmarkTimes = []; 

const log = console.log;

log(`[Advent of Code]`.green.bold + ` v${VERSION}`.green); 

if (flags.silenceLog) {
  console.log(`[WARN] -q flag passed, silencing logs`.yellow);
  console.log = () => {};
}
if (flags.testInputOnly) {
  console.log(`[WARN] -t flag passed, only running test inputs`.yellow);
}

function printBenchmark(str, i) {
  let times = benchmarkTimes[i]; 
  log(`${str} ${(times[0]*1000 + times[1]/1e6).toFixed(4).magenta} ${'ms'.magenta}`); 
}

function trim(string) {
  // trim only removes one leading and/or trailing newline, as standard .trim() breaks certain inputs (i.e., AoC 2022 day 5)
  if (typeof string !== 'string') {
    console.log(`[WARN] trim() was given a non-string input:`.yellow, string);
    return '';
  }
  if(string.slice(0, 1) === '\n') {
    string = string.slice(1);
  } 
  if (string.slice(string.length - 1) === '\n') {
    string = string.slice(0, string.length - 1);
  }
  return string;
}

let pnum = process.argv[2] ? parseInt(process.argv[2]) : 0; 

if (pnum === 0) {
  let day = new Date(Date.now() + (7500000)).getDate(); 
  log(`Day "0" provided, using today's day (${day})`.cyan)
  pnum = day;
}

log(`Running Day ${pnum}:`.cyan); 

if (!fs.existsSync(`${pnum}.js`)) {
  console.error(`Error: Script ${pnum}.js not found`.red)
  process.exit(1); 
}

if (!fs.existsSync(path.join('inputs', `${pnum}.txt`))) {
  console.info(`Input file ${pnum}.txt not found, attempting to download...`.yellow); 
  fetchInput(pnum); 
} else {
  let input = fs.readFileSync(path.join('inputs', `${pnum}.txt`), 'utf-8'); 
  runCode(pnum, input); 
}

async function fetchInput(day) {
  log(`Fetching... (https://adventofcode.com/${YEAR}/day/${day}/input)`)
  let resp = await fetch(`https://adventofcode.com/${YEAR}/day/${day}/input`, {
    "headers": {
      "cache-control": "max-age=0",
      "cookie": `session=${process.env.AOC_COOKIE}`,
      "user-agent": `${process.env.AOC_UA}`
    },
    "body": null,
    "method": "GET"
  }).then(res => {
    if (res.status !== 200) {
      console.error(`Error: Failed to fetch input for day ${pnum} (status code ${res.status})`.red); 
      process.exit(1); 
    }
    return res; 
  }); 
  let text = await resp.text(); 
  log(`Done, success!`); 
  fs.writeFileSync(path.join('inputs', `${day}.txt`), text, 'utf-8'); 
  runCode(day, text); 
}

async function fetchTestInput(day) {
  debugger;
  log(`Fetching... (https://adventofcode.com/${YEAR}/day/${day})`)
  let resp = await fetch(`https://adventofcode.com/${YEAR}/day/${day}`, {
    "headers": {
      "cache-control": "max-age=0",
      "cookie": `session=${process.env.AOC_COOKIE}`,
      "user-agent": `${process.env.AOC_UA}`
    },
    "body": null,
    "method": "GET"
  }).then(res => {
    if (res.status !== 200) {
      console.error(`Error: Failed to fetch test cases for day ${pnum} (status code ${res.status})`.red); 
      process.exit(1); 
    }
    return res; 
  }); 
  let text = await resp.text(); 
  log('Done, success!'); 

  let $ = cheerio.load(text); 
  let p1 = $('article.day-desc').first(), p2 = false; 
  if ($('article.day-desc').length >= 2) {
    p2 = $('article.day-desc').last(); 
  } 
  let codeBlocks1 = cheerio.load(p1.html())('code'); 
  let sampleInput = '<failed to find>';

  try {
    // Attempt to intelligently find the correct sample input code block
    let allCodeBlocks = cheerio.load(p1.html())('pre code').toArray().map(r => r.children[0].data);
    let exampleInd = p1.html().toLowerCase().indexOf('for example');

    if (exampleInd === -1) {
      // Fallback if "for example" doesn't exist
      sampleInput = allCodeBlocks[0];
    } else {
      // Look for the keyword "for example", and take the first code block after that keyword
      let codeBlockInds = allCodeBlocks.map(r => p1.html().indexOf(r));
      let mostLikelyCodeBlock = codeBlockInds.findIndex(r => r > exampleInd);
      if (mostLikelyCodeBlock !== -1) {
        sampleInput = allCodeBlocks[mostLikelyCodeBlock];
      } else {
        // Fallback if "for example" exists but is positioned after all code blocks
        sampleInput = allCodeBlocks[0];
      }
    }

  } catch (err) {
    // Fallback: Set first code block as the sample input
    sampleInput = cheerio.load(p1.html())('pre code').first().text();
  }
  let testOutput1 = codeBlocks1.last().text(); 
  let testOutput2 = false; 

  if (p2) {
    testOutput2 = cheerio.load(p2.html())('code').last().text(); 
  }

  return {
    input: trim(sampleInput), 
    answers: [testOutput1, testOutput2]
  }
}

async function getTestInput(day, type, force=false) {
  let data; 
  if (!fs.existsSync(path.join('inputs', `${day}t.txt`)) || force) {
    data = await fetchTestInput(day); 
    fs.writeFileSync(path.join('inputs', `${day}t.txt`), `${data.answers[0]};${data.answers[1]?data.answers[1]:'<n/a>'}\n${data.input}`, 'utf-8'); 
  } else {
    let rawData = fs.readFileSync(path.join('inputs', `${day}t.txt`), 'utf-8'); 

    if (rawData.length === 0) {
      // Force refresh if file is empty
      return getTestInput(day, type, true); 
    }

    let fl = rawData.slice(0, rawData.indexOf('\n')); // first line
    data = {
      input: trim(rawData.slice(rawData.indexOf('\n') + 1)), 
      answers: fl.split(';')
    }; 
    if (data.answers[1] === '<n/a>') {
      if (type === 1) {
        data = await fetchTestInput(day); 
        fs.writeFileSync(path.join('inputs', `${day}t.txt`), `${data.answers[0]};${data.answers[1]?data.answers[1]:'<n/a>'}\n${rawData.slice(rawData.indexOf('\n')+1)}`, 'utf-8'); 
      } else {
        data.answers[1] = false; 
      }
    }
  }
  return data; 
}

async function runCode(day, input) {
  input = trim(input); // Remove whitespace if there is any

  let inputArr = input.split('\n'); 
  let inputArr2 = [...inputArr]; 

  log(`Input loaded: ${input.length} chars, ${inputArr.length} lines`);
  let firstLine = input.slice(0, input.indexOf('\n')); 
  log(`First line: ${firstLine.length < 512 ? firstLine.yellow : (firstLine.slice(0, 512) + '...').yellow} ${`(${firstLine.length} char(s))`.green}`); 

  let script = require(`./${day}.js`); 
  log(`<Task 1>`.cyan.underline); 
  
  let silver = null;
  if (!flags.testInputOnly) {
    if (flags.benchmark) benchmarkTimes[0] = process.hrtime(); 
    silver = script.silverStar(inputArr, input); 
    if (flags.benchmark) benchmarkTimes[0] = process.hrtime(benchmarkTimes[0]); 
  }

  let testInput = await getTestInput(day, 0); 

  if (typeof silver === 'string' || typeof silver === 'number' || flags.testInputOnly) {
    let testOutput = script.silverStar(testInput.input.split('\n'), testInput.input); 

    log(`${'Output:'.cyan} ${(typeof silver === 'string' || typeof silver === 'number') ? silver.toString().magenta : 'null'}`); 

    if (typeof testOutput?.toString !== 'undefined' && testOutput.toString() === testInput.answers[0]) {
      log(`${'[OK]'.green} ${'Test Case Passed'.cyan} ${`Expected and Got ${testOutput}`}`);
    } else {
      log(`${'[!!]'.red} ${'Test Case Failed'.cyan} ${`Expected: ${testInput.answers[0]}, Got: ${testOutput}`.red}`);
    }
  } else {
    log(`${'Output:'.cyan} ${(typeof silver === 'string' || typeof silver === 'number') ? silver.toString().magenta : 'null'}`); 
    log(`${'[OK]'.yellow} ${'Test Case Skipped'.cyan} (No Output)`);
  }
  
  log(`<Task 2>`.cyan.underline); 
  
  let gold = null;
  if (!flags.testInputOnly) {
    if (flags.benchmark) benchmarkTimes[1] = process.hrtime(); 
    gold = script.goldStar(inputArr2, input); 
    if (flags.benchmark) benchmarkTimes[1] = process.hrtime(benchmarkTimes[1]); 
  }

  if (typeof gold === 'string' || typeof gold === 'number' || flags.testInputOnly) {
    if(testInput.answers[1] === false) {
      testInput = await getTestInput(day, 1); 
    }
    let testOutput = script.goldStar(testInput.input.split('\n'), testInput.input);
    
    log(`${'Output:'.cyan} ${(typeof gold === 'string' || typeof gold === 'number') ? gold.toString().magenta : 'null'}`); 

    if (typeof testOutput?.toString !== 'undefined' && testOutput.toString() === testInput.answers[1]) {
      log(`${'[OK]'.green} ${'Test Case Passed'.cyan} ${`Expected and Got ${testOutput}`}`);
    } else {
      log(`${'[!!]'.red} ${'Test Case Failed'.cyan} ${`Expected: ${testInput.answers[1]}, Got: ${testOutput}`.red}`);
    }
  } else {
    log(`${'Output:'.cyan} ${(typeof gold === 'string' || typeof gold === 'number') ? gold.toString().magenta : 'null'}`); 
    log(`${'[OK]'.yellow} ${'Test Case Skipped'.cyan} (No Output)`);
  }

  if (flags.benchmark) {
    log('\n[Benchmark]'.yellow);
    printBenchmark('Part 1 (Silver)', 0);
    printBenchmark('Part 2 (Gold)  ', 1);
    benchmarkTimes[2] = [benchmarkTimes[0][0] + benchmarkTimes[1][0], benchmarkTimes[0][1] + benchmarkTimes[1][1]];
    printBenchmark('Total Time     '.cyan, 2);
  }
}