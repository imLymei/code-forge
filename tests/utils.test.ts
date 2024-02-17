import { describe, jest, expect, test } from '@jest/globals';
import { getCommandWithArgs, getConfiguration, runCommandWithArgs } from '../src/utils';

describe('configuration files', () => {
	test('get dynamic configuration file', () => {
		expect(getConfiguration()).toHaveProperty('languages');
	});

	test('get default configuration file', () => {
		expect(getConfiguration(false)).toHaveProperty('languages');
	});

	test('get custom configuration file', () => {
		expect(getConfiguration(true)).toHaveProperty('languages');
	});
});

describe('analise and run commands', () => {
	const TEST_COMMAND_TEMPLATE = 'echo "run build <name> <arg1> arg2 <arg3> <<arg4>>"';
	const TEST_GOOD_ARGUMENTS = { name: 'test', arg1: 'myArg1', arg3: 'myArgNumber3', arg4: 'ULTRA_HARD' };
	const TEST_BAD_ARGUMENTS = { name: 'test', arg3: 'myArgNumber3', arg4: 'ULTRA_HARD' };

	test('join commands template with good arguments', () => {
		expect(getCommandWithArgs(TEST_COMMAND_TEMPLATE, TEST_GOOD_ARGUMENTS)).toEqual(
			'echo "run build test myArg1 arg2 myArgNumber3 <ULTRA_HARD>"'
		);
	});

	test('join commands template with bad arguments', () => {
		// @ts-ignore
		const exitSpy = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {});

		getCommandWithArgs(TEST_COMMAND_TEMPLATE, TEST_BAD_ARGUMENTS);
		expect(exitSpy).toBeCalled();

		exitSpy.mockReset();
	});

	test('run good command', () => {
		expect(runCommandWithArgs('echo "teste"')).toBeTruthy();
	});

	test('run bad command', () => {
		expect(runCommandWithArgs('ech "teste"')).toBeFalsy();
	});
});
