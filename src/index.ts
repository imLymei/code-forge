#! /usr/bin/env node

import { program } from 'commander';
import {
	HOME,
	getClosestString,
	getCommandWithArgs,
	getConfiguration,
	parseArrayToOptions,
	runCommandWithArgs,
	showTitle,
} from './utils';
import cliConfig from './config';
import path from 'path';

program.version(cliConfig.version).description(cliConfig.description);

showTitle();

program
	.command('run')
	.description(
		'run a language command from your configuration file. If you do not have a custom configuration file, the default will be used as a reference.\n'
	)
	.argument('<language>', 'Programming language')
	.argument('[command]', 'Programming language')
	.arguments('[options...]')
	.action(runLanguageScript);

program.parse(process.argv);

// const options = program.opts();

function runLanguageScript(languageName: string, commandName?: string, optionsArray?: string[]): void {
	const configuration = getConfiguration();
	const language = configuration.languages[languageName];

	if (!language) {
		const closestString = getClosestString(languageName, Object.keys(configuration.languages));

		console.error(`error: unknown language "${languageName}". Do you mean "${closestString}"?`);
		return;
	}

	if (!commandName) {
		console.log(`"${languageName}" commands:`);

		for (const key in language.commands) {
			console.log(`	${key}: ${language.commands[key]}`);
		}
		return;
	}

	const command: string = language.commands[commandName];

	if (!command) {
		const closestCommand = getClosestString(commandName, Object.keys(language.commands));

		console.error(`error: unknown command "${commandName}". Do you mean "${closestCommand}"?`);
		return;
	}

	if (!optionsArray?.length) {
		console.log(`"${languageName}" command "${commandName}": ${command}:`);

		return;
	}

	const options = parseArrayToOptions(optionsArray);

	runCommandWithArgs(getCommandWithArgs(command, options));
}

if (!process.argv.slice(2).length) {
	program.outputHelp();
}
