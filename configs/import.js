import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';


export default {
	plugins: {
		import: importPlugin,
		'unused-imports': unusedImports,
		'no-relative-import-paths': noRelativeImportPaths,
	},
	settings: {
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: './tsconfig.json',
			},
			node: true,
		},
	},
	rules: {
		// Import rules
		'import/no-unresolved': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/extensions': 'off',
		'import/prefer-default-export': 'off',
		'import/no-cycle': 'off',
		'import/order': [
			'error',
			{
				groups: [['builtin', 'external', 'internal']],
				'newlines-between': 'always',
				alphabetize: { order: 'asc', caseInsensitive: true },
				warnOnUnassignedImports: false,
				pathGroups: [
					{
						pattern: 'react*',
						group: 'external',
						position: 'before',
					},
					{
						pattern: '@/**',
						group: 'internal',
						position: 'after',
					},
					{
						pattern: '(.|..)?/**',
						group: 'internal',
						position: 'after',
					},
				],
				pathGroupsExcludedImportTypes: ['react'],
			},
		],
		'import/newline-after-import': ['error', { count: 1 }],
		// 중복 import 방지
		'import/no-duplicates': 'error',
		// 자기 자신 import 방지
		'import/no-self-import': 'error',

		// Unused imports rules
		'no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'error',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
				ignoreRestSiblings: true,
				caughtErrors: 'all',
				caughtErrorsIgnorePattern: '^_',
			},
		],

		// import 경로를 절대 경로를 사용하기로 합의했을 때 사용하기 좋은 규칙
		// allowSameFolder: true로 하면 같은 폴더에서 import할 때는 상대 경로 사용 가능
		// prefix를 지정하면 fix 실행 시 eslint가 자동으로 prefix를 넣어서 import 경로를 고쳐줌
		'no-relative-import-paths/no-relative-import-paths': [
			'warn',
			{
				allowSameFolder: true,
				rootDir: 'src',
				prefix: '@',
			},
		],
	},
};

