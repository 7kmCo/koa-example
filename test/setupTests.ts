// To do anything asynchronous, we need to set up a test environemnt
// They don't seem to play nicely with TypeScript though - likely need to compile
// https://jestjs.io/docs/en/configuration.html#testenvironment-string
import * as dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();

// If debugging in VSCode, set the timeout to
const timeoutDebug = 60 * 60 * 1000; // one hour
const timeoutRegular = 5000; // 5 seconds
const timeout = process.env.NODE_ENV === 'test.ts' ? timeoutDebug : timeoutRegular;

jest.setTimeout(timeout);
if (jasmine && typeof jasmine.DEFAULT_TIMEOUT_INTERVAL !== 'undefined') {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
}
