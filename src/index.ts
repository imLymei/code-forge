#! /usr/bin/env node

import figlet from 'figlet';
import { Command } from 'commander';

const program = new Command().version('1.0.0').description('Yet Another CLI').parse(process.argv);

const options = program.opts();

console.log(figlet.textSync('Dir Manager'));
