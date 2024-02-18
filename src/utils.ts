import os from 'os';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import figlet from 'figlet';
import cliConfig from './config';
import { exit } from 'process';
import levenshtein from 'js-levenshtein';

export const HOME = os.homedir();
export const DEFAULT_CONFIG_PATH = path.join(__dirname, '..', 'config.json');
export const CUSTOM_FILE_PATH = path.join(HOME, '.config/code-forge.json');
export const HAS_CUSTOM_CONFIG_FILE = fs.existsSync(CUSTOM_FILE_PATH);

export const DEFAULT_ARGUMENTS_SPLIT = '=';

type LanguageConfiguration = {
	commands: Record<string, string>;
	args: Record<string, string>;
};

type ConfigurationFile = {
	languages: Record<string, LanguageConfiguration>;
};

export function getConfiguration(useCustomConfigFile: boolean = HAS_CUSTOM_CONFIG_FILE): ConfigurationFile {
	const FILE_CONTENT = fs.readFileSync(useCustomConfigFile ? CUSTOM_FILE_PATH : DEFAULT_CONFIG_PATH, {
		encoding: 'utf8',
	});

	return JSON.parse(FILE_CONTENT);
}

// TODO: ADD TEST FUNCTION
export function createConfigurationFile(): void {
	const dotConfigPath = path.join(HOME, '.config/');

	try {
		const hasConfigFile = fs.existsSync(CUSTOM_FILE_PATH);

		if (hasConfigFile) {
			console.log('you already has a configuration file.');
			return;
		}

		const hasDotConfig = fs.existsSync(dotConfigPath);

		if (!hasDotConfig) {
			fs.mkdirSync(dotConfigPath, { recursive: true });
			console.log('creating your "~/.config/" directory');
		}

		fs.writeFileSync(CUSTOM_FILE_PATH, JSON.stringify(getConfiguration(), null, 2));

		console.log('your configuration file was created');
	} catch (error) {
		console.error(`error: failed to create configuration file.\n${error}`);
	}
}

export function removeConfigurationFile(): void {
	const hasConfigFile = fs.existsSync(CUSTOM_FILE_PATH);

	if (!hasConfigFile) {
		console.log('you do not have a configuration file');
		return;
	}

	fs.unlink(CUSTOM_FILE_PATH, (error) => {
		if (error) console.error(`error: failed to remove your configuration file.\n${error}`);
		else console.log('your configuration file was deleted');
	});
}

export function showTitle(): void {
	console.log(figlet.textSync(cliConfig.name));
}

// TODO: ADD TEST FUNCTION
export function getClosestString(input: string, data: string[]): string {
	let minDistance = levenshtein(input, data[0]);
	let minString = data[0];

	for (let index = 1; index < data.length; index++) {
		const string = data[index];
		const distance = levenshtein(input, string);

		if (distance < minDistance) {
			minDistance = distance;
			minString = string;
		}
	}

	return minString;
}

// TODO: ADD TEST FUNCTION
export function parseArrayToArguments(
	array: string[],
	splitMethod = DEFAULT_ARGUMENTS_SPLIT
): Record<string, string> {
	return Object.fromEntries(array.map((option) => option.split(splitMethod)));
}

export function getCommandWithArgs(command: string, args: Record<string, string>): string {
	const variableNames = Array.from(command.matchAll(/<(\w+)>/g), (match) => match[1]);

	// Check if each variable exists in the args object
	for (const variableName of variableNames) {
		if (!(variableName in args)) {
			console.error(`Missing argument: ${variableName}`);
			exit(1);
		}
	}

	// Replace variables in command with argument values
	return command.replace(/<(\w+)>/g, (_, key) => args[key]);
}

export function runCommandWithArgs(command: string): boolean {
	// Execute the command
	try {
		const result = execSync(command, { encoding: 'utf8' });

		console.log(result);

		return true;
	} catch (error) {
		return false;
	}
}
