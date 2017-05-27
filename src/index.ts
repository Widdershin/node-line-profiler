const falafel = require('falafel');
const vm = require('vm');
const chalk = require('chalk');
const fs = require('fs');
const cardinal = require('cardinal');
const stripAnsi = require('strip-ansi');

const source = fs.readFileSync(process.argv[2], 'utf-8');

const types = [
  'BinaryExpression',
  'CallExpression',
  'UpdateExpression',
  'PropertyExpression',
  'ObjectExpression',
  'Literal'
]

const output = falafel(source, function (node: any) {
  const line = (source.slice(0, node.start).match(/\n/g) || []).length;
  if (types.indexOf(node.type) !== -1) {
    node.update(`time(() => { return ${node.source()} }, ${line})`);
  } else if (node.type === 'FunctionDeclaration') {
    const functionName = node.id.name;

    node.update(`const ${functionName} = time(() => { return ${node.source()} }, ${line})`);
  } else {
    /*    node.update(`
// ${node.type}
${node.source()}
`)*/
  }

  if (node.type === 'Program') {
    node.update(`
const now = require('performance-now');

function time (f, line) {
 const start = now();
 const result = f();
 const end = now();
 recordRun(line, end - start)

 return result;
}

${node.source()}
`);
  }

  //node.update(`${node.type}(${node.source()})`);
});

type Runs = {[key: string]: number[]}
const runs: Runs = {};

function recordRun (line: number, time: number) {
  if (!runs[line]) {
    runs[line] = [time]
  } else {
    runs[line] = runs[line].concat(time);
  }
}

function add (a: number, b: number): number {
  return a + b;
}

function sum (arr: number[]): number {
  return arr.reduce(add, 0);
}

vm.runInNewContext(output, {...global, require, recordRun, exports});

function padRight (val: any, n: number, c: string) {
  let str = val.toString();

  while (str.length < n) {
    str += c;
  }

  return str;
}

const highlightedSource = cardinal.highlight(source, {linenos: true})

highlightedSource.split('\n').forEach((line: string, index: number) => {
  const hits = runs[index] || [];
  const totalTime = sum(hits);
  let color = null;

  if (totalTime > 50) {
    color = 'yellow';
  }

  if (totalTime > 150) {
    color = 'red';
  }

  if (color) {
    line = stripAnsi(line);
    line = chalk[color](line);
  }

  console.log(`${padRight(hits.length > 0 ? hits.length : '', 6, ' ')} ${padRight(totalTime > 0 ? totalTime.toFixed(2) : '', 8, ' ')} ${line}`);
});
