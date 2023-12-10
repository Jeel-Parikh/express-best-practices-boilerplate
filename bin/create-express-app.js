#! /usr/bin/env node

'use strict';

import path from 'path';
import util from 'node:util';
import fs from "fs"
import { exec } from 'node:child_process';

const execCommand = util.promisify(exec);

if (process.argv.length < 3) {
    console.log('\x1b[31m', 'You have to provide name to your app.');
    console.log('For example:');
    console.log('    npx bootstrap-express-app my-app', '\x1b[0m');
    process.exit(1);
}

const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = path.join(ownPath, folderName);
const repo = 'https://github.com/Jeel-Parikh/express-best-practices-boilerplate.git';

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

await setup();

async function runCmd(command) {
    try {
        const { stdout, stderr } = await execCommand(command);
        console.log("\n", stdout);
        if (stderr) {
            console.error(stderr);
        }
    }
    catch (err) {
        console.log('\x1b[31m', err, '\x1b[0m');
        process.exit(1);
    }
}

async function setup() {
    try {
        console.log('\n\x1b[33m', 'Creating the Express app...', '\x1b[0m');
        await runCmd(`git clone --depth 1 ${repo} ${folderName}`);
        process.chdir(appPath);

        const packageJson = JSON.parse(await fs.promises.readFile("package.json", "utf-8"))
        const env = await fs.promises.readFile(".env.local", "utf-8")

        const promises = []
        promises.push(fs.promises.rm(".git", { recursive: true }))
        promises.push(fs.promises.rm('bin', { recursive: true }))
        promises.push(fs.promises.unlink('package.json'))
        promises.push(fs.promises.unlink('package-lock.json'))
        promises.push(fs.promises.unlink('.env.local'))
        await Promise.all(promises)

        await buildPackageJson(packageJson, folderName);
        await buildEnv(env)

        console.log('\x1b[34m', 'Installing dependencies...', '\x1b[0m');
        await runCmd('npm install');
        console.log(
            '\x1b[32m',
            'The Installation is done.',
            '\x1b[0m'
        );

        console.log('\n\x1b[34m', 'Initializing git...', '\x1b[0m');
        await runCmd('git init');
        console.log(
            '\x1b[32m',
            'The Git initializing is done, this is ready to use!',
            '\x1b[0m'
        );

        console.log('\n\x1b[34m', 'You can start by typing:');
        console.log(`    cd ${folderName}`);
        console.log('    npm start', '\x1b[0m');
        console.log('\nCheck README.md for more information\n');
        console.log('\x1b[32m\x1b[3m', 'Happy Coding...', '\x1b[0m\n');
    } catch (error) {
        console.log(error);
    }
}



async function buildPackageJson(packageJson, folderName) {
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

    await createFile('package.json', JSON.stringify(newPackage, null, 2))
}

async function buildEnv(env) {
    await createFile('.env', env)
}

async function createFile(path, content, option = "utf8") {
    await fs.promises.writeFile(path, content, option)
}