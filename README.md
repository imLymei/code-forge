![linux test](https://github.com/imLymei/code-forge/actions/workflows/linux-test.yml/badge.svg) ![windows test](https://github.com/imLymei/code-forge/actions/workflows/windows-test.yml/badge.svg) ![macos test](https://github.com/imLymei/code-forge/actions/workflows/macos-test.yml/badge.svg) ![npm](https://github.com/imLymei/code-forge/actions/workflows/publish.yml/badge.svg)

# Code Forge CLI

**Code Forge** is a _command-line interface_ (CLI) tool designed to **simplify** the execution of **boilerplate scripts and command-line commands**. With Code Forge, users can easily create and delete sets of commands for different programming languages, as well as define preset arguments to be passed with those commands.

## Installation

To install Code Forge globally, run the following command:

```bash
npm install -g @lymei/code-forge
```

## Configuration File

The configuration file for Code Forge, named `code-forge.json`, allows users to define languages, their associated commands, and preset arguments. Below is an example template for the configuration file:

```json
{
	"languages": {
		"next": {
			"commands": {
				"create": "npx create-next-app@latest <dir>/<name> --ts --tailwind --eslint --app --src-dir --import-alias \"@/*\""
			},
			"args": {
				"dir": "C:\\Users\\Username\\Documents\\Projects\\Next.js"
			}
		},
		"customLanguage": {
			"commands": {
				"run": "run customLanguage <dir>/<name> <value>",
				"create": "npx create-my-app@latest <dir>/<name><optionOne><optionTwo>"
			},
			"args": {
				"dir": "C:/my/custom/language/directory",
				"optionOne": " --option-one",
				"optionTwo": " --option-two"
			}
		}
	}
}
```

## Usage

### Running Commands

To run a language command from your configuration file, use the following command:

```bash
code-forge run <language> <command> [arguments...]
```

> Code Forge have 3 default alias: `code-forge`, `cforge` and `coge`

Replace <language> with the name of the programming language, <command> with the specific command to execute, and [arguments...] with any additional arguments required by the command.

> If you have already set up a preset argument, you do NOT need to provide it. If you do provide it, only the latest argument will be applied

If you want to view all available commands for a specific language, omit the <command> parameter:

```bash
code-forge run <language>
```

You can do the same to see the template of a single command:

```bash
code-forge run <language> <command>
```

### Configuration Management

To manage your custom configuration file, you can use the config command:

```bash
code-forge config [options]
```

Available options include:

| Command      | description                                          |
| ------------ | ---------------------------------------------------- |
| -c, --create | Create your custom configuration file.               |
| -r, --remove | Remove your custom configuration file.               |
| -d, --dir    | Show the directory of the custom configuration file. |

### Example

Below is an example usage of Code Forge to create a new Next.js project using the predefined configuration:

```bash
code-forge run next create my-next-project
```

This command will execute the create command for Next.js, with the specified project name my-next-project, applying the preset arguments defined in the configuration file.

For more information and additional usage examples, please refer to the documentation or run code-forge --help.

---

Note: Make sure to replace placeholders such as `<language>`, `<command>`, `<name>`, `<dir>`, `<optionsOne>`, and `<optionTwo>` with actual values according to your project's needs.
