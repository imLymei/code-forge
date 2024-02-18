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
		'Code Forge is a command-line tool for effortlessly creating new projects in any language. Customize commands in a config file to streamline React, Next.js, Rust, Python, and more, all within your preferred directories. Simplify project setup and accelerate development with Code Forge.',
};

export default cliConfig;
