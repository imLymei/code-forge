import fs from 'fs';
import path from 'path';

export function getPackageVersion(): string {
	return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), { encoding: 'utf8' }))
		.version;
}

const cliConfig = {
	name: 'Code Forge',
	version: getPackageVersion(),
	description:
		'Code-Forge is a command-line interface (CLI) tool designed to simplify the execution of boilerplate scripts and command-line commands. With Code-Forge, users can easily create and delete sets of commands for different programming languages, as well as define preset arguments to be passed with those commands.',
};

export default cliConfig;
