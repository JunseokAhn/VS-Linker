// JavaScript ES6 Import & CommonJS Require 테스트

// ES6 Import - 상대 경로
import { formatDate, formatTime } from './utils.js';
import config from './config.js';

// CommonJS Require - 상대 경로
const utils = require('./utils.js');
const appConfig = require('./config.js');

function main() {
    console.log('Application started');
    console.log('Config:', config);
    console.log('Current time:', formatTime(new Date()));
    console.log('Current date:', formatDate(new Date()));
}

main();
