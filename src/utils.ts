import os from 'os';
import fs from 'fs';
import path from 'path';
import { exec, execSync } from 'child_process';

import figlet from 'figlet';
import cliConfig from './config';
import { exit } from 'process';

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

export function getConfig(useCustomConfigFile: boolean = HAS_CUSTOM_CONFIG_FILE): ConfigurationFile {
	const FILE_CONTENT = fs.readFileSync(useCustomConfigFile ? CUSTOM_FILE_PATH : DEFAULT_CONFIG_PATH, {
		encoding: 'utf8',
	});

	return JSON.parse(FILE_CONTENT);
}

export function showTitle(): void {
	console.log(figlet.textSync(cliConfig.name));
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
