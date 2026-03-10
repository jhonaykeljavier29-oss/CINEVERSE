const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

process.env.CHROME_BIN = puppeteer.executablePath();

const child = spawn('npx', ['ng', 'test', '--watch=false'], { stdio: 'inherit', shell: true });
child.on('exit', code => process.exit(code));
