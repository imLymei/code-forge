import os from 'os';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import figlet from 'figlet';
import cliConfig from './config';

export const HOME = os.homedir();
export const DEFAULT_CONFIG_PATH = path.join(__dirname, '..', 'config.json');
export const CUSTOM_FILE_PATH = path.join(HOME, '.config/code-forge.json');
export const HAS_CUSTOM_CONFIG_FILE = fs.existsSync(CUSTOM_FILE_PATH);

type LanguageConfiguration = {
	folder: string;
	commands: {
		createProject: string;
	};
};

type ConfigurationFile = {
	languages: Record<string, LanguageConfiguration>;
};

export function getConfig(): ConfigurationFile {
	const FILE_CONTENT = fs.readFileSync(HAS_CUSTOM_CONFIG_FILE ? CUSTOM_FILE_PATH : DEFAULT_CONFIG_PATH, {
		encoding: 'utf8',
	});

	return JSON.parse(FILE_CONTENT);
}

export function showTitle() {
	console.log(figlet.textSync(cliConfig.name));
}

export function runCommandWithArgs(
	command: string,
	args: Record<string, string>,
	moveOnComplete: boolean
): void {
	const variableNames = Array.from(command.matchAll(/<(\w+)>/g), (match) => match[1]);

	// Check if each variable exists in the args object
	for (const variableName of variableNames) {
		if (!(variableName in args)) {
			console.error(`Missing argument: ${variableName}`);
			return;
		}
	}

	// Replace variables in command with argument values
	const commandWithArgs = command.replace(/<(\w+)>/g, (_, key) => args[key]);

	// Execute the command
	exec(commandWithArgs, (error, stdout) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout:\n${stdout}`);
	});

	// TODO: FIX THIS FUCKING THING
	// if (moveOnComplete && args.dir && fs.existsSync(args.dir)) {
	// 	process.chdir(args.dir);
	// }
}
