import { describe, expect, test } from '@jest/globals';
import { getCommandWithArgs, getConfig } from './utils';

describe('configuration files', () => {
	test('get dynamic configuration file', () => {
		expect(getConfig()).toHaveProperty('languages');
	});

	test('get default configuration file', () => {
		expect(getConfig(false)).toHaveProperty('languages');
	});

	test('get custom configuration file', () => {
		expect(getConfig(true)).toHaveProperty('languages');
	});
});

describe('analise and run commands', () => {
	const TEST_COMMAND_TEMPLATE = 'npm run build <name> <arg1> arg2 <arg3> <<arg4>>';
	const TEST_ARGUMENTS = { name: 'test', arg1: 'myArg1', arg3: 'myArgNumber3', arg4: 'ULTRA_HARD' };

	test('join commands template with arguments', () => {
		expect(getCommandWithArgs(TEST_COMMAND_TEMPLATE, TEST_ARGUMENTS)).toEqual(
			'npm run build test myArg1 arg2 myArgNumber3 <ULTRA_HARD>'
		);
	});
});
