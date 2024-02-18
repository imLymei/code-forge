#! /usr/bin/env node

import { OptionValues, program } from 'commander';
import {
	CUSTOM_FILE_PATH,
	DEFAULT_ARGUMENTS_SPLIT,
	HOME,
	createConfigurationFile,
	getClosestString,
	getCommandWithArgs,
	getConfiguration,
	parseArrayToArguments,
	removeConfigurationFile,
	runCommandWithArgs,
	showTitle,
} from './utils';
import cliConfig from './config';

program.version(cliConfig.version).description(cliConfig.description);

program
	.command('run')
	.description(
		'run a language command from your configuration file. If you do not have a custom configuration file, the default will be used as a reference.\n'
	)
	.argument('<language>', 'Programming language')
	.argument('[command]', 'Programming language')
	.arguments('[arguments...]')
	.action(runLanguageScript);

program
	.command('config')
	.option('-c, --create', 'create your custom configuration file')
	.option('-r, --remove', 'remove your custom configuration file')
	.option('-d, --dir', 'show the custom configuration file directory')
	.action(runConfigCommand);

program.parse(process.argv);

function runLanguageScript(languageName: string, commandName?: string, argumentArray: string[] = []): void {
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

	const defaultArgs: string[] = [];

	for (const key in language.args) {
		const value = language.args[key];

		defaultArgs.push(`${key}${DEFAULT_ARGUMENTS_SPLIT}${value}`);
	}

	const args = parseArrayToArguments([...defaultArgs, ...argumentArray]);

	runCommandWithArgs(getCommandWithArgs(command, args));
}

function runConfigCommand(options: OptionValues) {
	if (options.create) {
		createConfigurationFile();
	}

	if (options.remove) {
		removeConfigurationFile();
	}

	if (options.dir) {
		console.log(CUSTOM_FILE_PATH);
	}
}

if (!process.argv.slice(2).length) {
	program.outputHelp();
}
