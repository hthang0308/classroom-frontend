const path = require('path');
const tsConfigPath = path.resolve(__dirname, 'tsconfig.json');

module.exports = {
	"root": true,
	"env": {
		"browser": true,
		"node": true,
		"es2021": true
	},
	"parser": "@typescript-eslint/parser",
	"plugins": ["@typescript-eslint", "react-prefer-function-component", "absolute-imports-only"],
	"ignorePatterns": ["uno.config.ts", ".eslintrc.js", "config/*.js", "vite.config.js", "public/*.js"],
	"extends": [
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:react/recommended",
		"plugin:jsx-a11y/recommended",
		"plugin:unicorn/recommended",
		"plugin:react-prefer-function-component/recommended",
		"airbnb",

		"airbnb-typescript",
		"airbnb/hooks",
		"padding-spacing"
	],
	"rules": {
		// "no-mixed-spaces-and-tabs": "off",
		"max-len": [
			"error",
			{
				"code": 120,
				"ignoreStrings": true,
			}
		],
		"linebreak-style": 0,
		"no-dupe-else-if": "error",
		"no-promise-executor-return": "error",
		"no-unreachable-loop": "error",
		"no-useless-backreference": "error",
		"require-atomic-updates": "error",
		"default-case-last": "error",
		"grouped-accessor-pairs": "error",
		"no-constructor-return": "error",
		"no-implicit-coercion": "error",
		"prefer-regex-literals": "error",
		"capitalized-comments": "error",
		"no-continue": "off",
		// "unicorn/prevent-abbreviations": [
		// 	"error",
		// 	{
		// 		"replacements": {
		// 			"props": {
		// 				"properties": false
		// 			},
		// 			"params": {
		// 				"parameters": false
		// 			},
		// 			"param": {
		// 				"parameter": false
		// 			},
		// 			"ref": {
		// 				"reference": false
		// 			}
		// 		}
		// 	}
		// ],
		"unicorn/prevent-abbreviations": 0,
		"no-restricted-syntax": [
			"error",
			{
				"selector": "ForInStatement",
				"message": "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array."
			},
			{
				"selector": "LabeledStatement",
				"message": "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
			},
			{
				"selector": "WithStatement",
				"message": "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
			}
		],
		"no-void": "off",
		"function-paren-newline": ["error", "consistent"],
		"object-curly-newline": [
			"error",
			{
				"ObjectExpression": { "multiline": true, "minProperties": 3 },
				"ObjectPattern": { "multiline": true, "minProperties": 3 },
				"ImportDeclaration": { "multiline": true, "minProperties": 3 },
				"ExportDeclaration": "always"
			}
		],
		"unicorn/no-abusive-eslint-disable": "off",
		"@typescript-eslint/no-unsafe-assignment": "warn",
		"@typescript-eslint/no-type-alias": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/prefer-enum-initializers": "off",
		"@typescript-eslint/prefer-readonly-parameter-types": "off",
		"@typescript-eslint/prefer-regexp-exec": "off",
		"@typescript-eslint/no-magic-numbers": [
			"off",
			{
				"ignoreEnums": true,
				"ignore": [0],
				"enforceConst": true,
				"detectObjects": true
			}
		],
		"unicorn/empty-brace-spaces": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/init-declarations": "off",
		"@typescript-eslint/no-confusing-void-expression": [
			"error",
			{ "ignoreArrowShorthand": true }
		],
		"@typescript-eslint/non-nullable-type-assertion-style": "off",
		"@typescript-eslint/strict-boolean-expressions": "off",
		"@typescript-eslint/no-implicit-any-catch": "off",
		"@typescript-eslint/member-ordering": "off",
		"@typescript-eslint/prefer-includes": "off",
		"@typescript-eslint/no-restricted-imports": "off",
		"@typescript-eslint/type-annotation-spacing": "error",

		// jsx-a11y
		"jsx-a11y/label-has-associated-control": "warn",
		"jsx-a11y/no-static-element-interactions": "warn",
		"jsx-a11y/click-events-have-key-events": "warn",
		"jsx-a11y/anchor-is-valid": "warn",

		"no-tabs": "off",
		"@typescript-eslint/indent": ["error", 2, {
			"SwitchCase": 1,
			"VariableDeclarator": "first",
			"MemberExpression": 1,
			"flatTernaryExpressions": false
		}],
		// import
		"import/no-deprecated": "error",
		"import/order": [
			"error",
			{
				"groups": [
					"external",
					"builtin",
					"internal",
					"parent",
					"sibling",
					"index"
				],
				"newlines-between": "always-and-inside-groups",
				"alphabetize": {
					"order": "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
					"caseInsensitive": true /* ignore case. Options: [true, false] */
				}
			}
		],
		"import/no-extraneous-dependencies": [
			"error",
			{
				"devDependencies": [
					"vite.config.ts",
					"src/setupTests.ts",
					"src/testUtils.tsx",
					"src/mocks/**",
					"**/__tests__/*.{ts,tsx}"
				]
			}
		],

		"react-hooks/exhaustive-deps": "warn",
		"react/prop-types": "warn",
		"react/jsx-uses-react": "off",
		"react/react-in-jsx-scope": "off",
		"react/jsx-first-prop-new-line": ["error", "multiline"],
		"react/jsx-max-props-per-line": ["error", { "when": "multiline" }],
		"react/jsx-props-no-spreading": 0,
		"react/no-did-update-set-state": "off",
		"react/no-find-dom-node": "off",
		"react/no-is-mounted": "off",
		"react/no-redundant-should-component-update": "off",
		"react/no-render-return-value": "off",
		"react/no-string-refs": "off",
		"react/no-this-in-sfc": "off",
		"react/no-will-update-set-state": "off",
		"react/prefer-es6-class": "off",
		"react/no-unused-state": "off",
		"react/prefer-stateless-function": "off",
		"react/require-render-return": "off",
		"react/sort-comp": "off",
		"react/state-in-constructor": "off",
		"react/static-property-placement": "off",
		"react/require-default-props": ['warn', {
			"functions": "defaultArguments"
		}],
		"react/jsx-tag-spacing": [
			"error", {
				"beforeSelfClosing": "always",
				"beforeClosing": "never"
			}
		],

		"react/boolean-prop-naming": [
			"error",
			{
				"validateNested": true
			}
		],
		"react/function-component-definition": [
			"error",
			{
				"namedComponents": [
					"function-declaration",
					"function-expression",
					"arrow-function"
				]
			}
		],
		"react/no-unstable-nested-components": "error",
		// "react/jsx-handler-names": [
		// 	"warn",
		// 	{
		// 		"eventHandlerPrefix": "on",
		// 		"eventHandlerPropPrefix": "on",
		// 		"checkLocalVariables": true,
		// 		"checkInlineFunction": true
		// 	}
		// ],
		"react/jsx-key": "error",
		"react/jsx-no-bind": [
			"error",
			{
				"ignoreRefs": false,
				"allowArrowFunctions": true,
				"allowFunctions": true,
				"allowBind": false,
				"ignoreDOMComponents": false
			}
		],
		"react/jsx-no-constructed-context-values": "error",
		"react/jsx-no-script-url": "error",
		"react/jsx-no-useless-fragment": "warn",

		"unicorn/no-null": "off",
		"unicorn/no-array-for-each": "off",
		"unicorn/no-array-reduce": "off",
		"unicorn/no-useless-undefined": "warn",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_"
			}
		],
		"unicorn/filename-case": [
			"error",
			{
				"cases": {
					"camelCase": true,
					"pascalCase": true
				},
				"ignore": [".d.ts$"]
			}
		],
		"unicorn/no-nested-ternary": ["error"],
		// "absolute-imports-only/only-absolute-imports": ["error", {
		//   "jsOnly": false,
		//   "minLevel": 1,
		// }],
		"unicorn/consistent-function-scoping": 0,
		"import/extensions": [
			"error",
			"ignorePackages",
			{
				"": "never",
				"js": "never",
				"jsx": "never",
				"ts": "never",
				"tsx": "never"
			}
		],
		"react/no-array-index-key": 0,
		"unicorn/numeric-separators-style": 0,
		"no-underscore-dangle": 0,
	},
	"settings": {
		"react": {
			"version": "detect"
		},
		"absolute-imports-only": {
			project: tsConfigPath,
		},
	},
	"overrides": [
		{
			"files": ["src/**/*.ts?(x)"],
			"parserOptions": {
				"project": ["./tsconfig.json"]
			}
		},
		{
			"files": ["vite.config.ts"],
			"parserOptions": {
				"project": ["./tsconfig.node.json"]
			}
		},
		{
			"files": ["**/__tests__/**/*.ts?(x)"],
			"extends": ["plugin:testing-library/react"],
			"rules": {
				"testing-library/no-await-sync-events": [
					"error",
					{
						"eventModules": ["fire-event"]
					}
				],
				"testing-library/no-manual-cleanup": "error",
				"testing-library/prefer-explicit-assert": "error",
				"testing-library/prefer-user-event": "error",
				"testing-library/prefer-wait-for": "error"
			}
		}
	]
}

