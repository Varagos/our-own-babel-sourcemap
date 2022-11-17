require('ts-node').register();
import { create, register } from 'ts-node';
import { spawn } from 'child_process';
import { PassThrough, finished } from 'stream';

const passThrough = new PassThrough();

console.log('Hello, world!');

// const service = create({
//   logError: true,
//   tsTrace: (str) => {
//     console.log('collected Error::', str);
//   },
// });
const service = register({
  logError: true,
  tsTrace: (str) => {
    console.log('collected Error::', str);
  },
});

// const child = spawn('pwd');
const child = spawn('yarn', ['ts-node', 'src/ts-node/index.ts']);

child.on('exit', function (code, signal) {
  console.log('child process exited with ' + `code ${code} and signal ${signal}`);
});

let processOutput: Buffer | undefined = undefined;
child.stderr.pipe(passThrough);
child.stderr.on('data', function (data) {
  console.error('Error received::');
  // console.log(typeof data);
  // console.error(`child stderr:\n${data}`);
  if (processOutput) {
    processOutput = Buffer.concat([processOutput, data]);
  } else {
    processOutput = data;
  }
});

child.on('close', function (code) {
  console.log('closing code: ' + code);

  const stringError = processOutput?.toString();

  if (code === 1) {
    console.log('Error received::');
    console.error(stringError);
    const errorLines = stringError?.split('\n');
    console.log(JSON.parse(stringError!.trim()));
    console.log('Finished');
  }
  // const error = JSON.parse(stringError || '{}');

  // Convert buffer to error object
});
