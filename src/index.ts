#! /usr/bin/env node

import { program } from 'commander';
import { HOME, getConfig, runCommandWithArgs, showTitle } from './utils';
import cliConfig from './config';
import path from 'path';

program.version(cliConfig.version).description(cliConfig.description);

showTitle();

program
	.command('create')
	.argument('<language>', 'Programming language')
	.option('-n, --name <name>', 'name of the project')
	.option('-mc, --move-complete --move-on-complete', 'change directory to project directory')
	.option(
		'-o, --options <options>',
		'add a custom options to the function. Custom options formatting: "key:value".\nYou can add ONE option at time, to add two (or more) options call this multiple times:\n$code-forge create next -n new-project -o optionOne:ValueOne -o optionTwo:ValueTwo',
		(value: string, previous: string[]) => previous.concat(value),
		[]
	)
	.action(handleCommandRun);

program.parse(process.argv);

const options = program.opts();

if (options.config) {
	console.log(getConfig());
}

function handleCommandRun(languageName: string, options: Record<string, string>) {
	const configuration = getConfig();

	const DATA = configuration.languages[languageName];

	if (DATA) {
		console.log(`Running "${languageName}" script with:`);

		options.dir = DATA.folder;

		// @ts-ignore
		const realOptions: string[] = options.options;

		const additionalOptions = realOptions.reduce((object: Record<string, string>, currentValue) => {
			const [key, value] = currentValue.split(':');
			object[key] = value;
			return object;
		}, {});

		const allOptions = { ...options, ...additionalOptions };
		delete allOptions.options;

		for (const key in allOptions) {
			let value = allOptions[key];
			console.log(`	${key}: ${value}`);
		}

		allOptions.dir = path.join(HOME, DATA.folder);

		// @ts-ignore
		const hasMoveOnComplete: boolean = allOptions.moveOnComplete !== undefined && allOptions.moveOnComplete;

		console.log(options);

		runCommandWithArgs(DATA.commands.createProject, allOptions, hasMoveOnComplete);
	} else {
		console.log('This command do not exists. Try creating it in the config folder.');
	}
}

if (!process.argv.slice(2).length) {
	program.outputHelp();
}
