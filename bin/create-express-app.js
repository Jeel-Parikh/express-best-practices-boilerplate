#! /usr/bin/env node

'use strict';

import path from 'path';
import util from 'node:util';
import fs from "fs"
import { exec } from 'node:child_process';

import packageJson from "../package.json" assert {type: "json"}


const execCommand = util.promisify(exec);

async function runCmd(command) {
    try {
        const { stdout, stderr } = await execCommand(command);
        console.log(stdout);
        console.error(stderr);
    }
    catch (err) {
        console.log('\x1b[31m', err, '\x1b[0m');
        process.exit(1);
    }
}


if (process.argv.length < 3) {
    console.log('\x1b[31m', 'You have to provide name to your app.');
    console.log('For example:');
    console.log('    npx bootstrap-express-app my-app', '\x1b[0m');
    process.exit(1);
}

const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = path.join(ownPath, folderName);
const repo = 'https://github.com/jeel-parikh1/nodejs-best-practices.git';

try {
    fs.mkdirSync(appPath);
} catch (err) {
    if (err.code === 'EEXIST') {
        console.log(
            '\x1b[31m',
            `The file ${folderName} already exist in the current directory, please give it another name.`,
            '\x1b[0m'
        );
    } else {
        console.log(err);
    }
    process.exit(1);
}

async function setup() {
    try {
        console.log('\x1b[33m', 'Downloading the project structure...', '\x1b[0m');
        await runCmd(`git clone --depth 1 ${repo} ${folderName}`);

        process.chdir(appPath);

        console.log('\x1b[34m', 'Installing dependencies...', '\x1b[0m');
        await runCmd('npm install');
        console.log();

        await runCmd('npx rimraf ./.git');

        fs.rmSync(path.join(appPath, 'bin'), { recursive: true });
        fs.unlinkSync(path.join(appPath, 'package.json'));

        buildPackageJson(packageJson, folderName);

        console.log(
            '\x1b[32m',
            'The installation is done, this is ready to use !',
            '\x1b[0m'
        );
        console.log();

        console.log('\x1b[34m', 'You can start by typing:');
        console.log(`    cd ${folderName}`);
        console.log(`    setup .env file refer .env.local for reference`);
        console.log('    npm start', '\x1b[0m');
        console.log();
        console.log('Check Readme.md for more information');
        console.log();
    } catch (error) {
        console.log(error);
    }
}

setup();

function buildPackageJson(packageJson, folderName) {
    const {
        bin,
        keywords,
        repository,
        contributors,
        homepage,
        ...newPackage
    } = packageJson;

    Object.assign(newPackage, {
        name: folderName,
        version: '1.0.0',
        description: '',
        author: '',
    });

    fs.writeFileSync(
        `${process.cwd()}/package.json`,
        JSON.stringify(newPackage, null, 2),
        'utf8'
    );
}