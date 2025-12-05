import js from '@eslint/js';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

import importConfig from './configs/import.js';
import reactConfig from './configs/react.js';
import tsConfig from './configs/ts.js';
import a11yConfig from './configs/a11y.js';
import prettierConfig from './configs/prettier.js';
import nextConfig from './configs/next.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config([
	{
		ignores: [
			'dist/**',
			'node_modules/**',
			'public/**',
			'*.config.js',
			'*.config.ts',
			'*.config.mjs',
			'.prettierrc.js',
			'vite.config.ts',
			'build/**',
			'coverage/**',
			'.next/**',
			'out/**',
			'next-env.d.ts',
			'eslint.config.js',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,

	// TypeScript 파일에 대한 설정
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			...reactConfig.plugins,
			...importConfig.plugins,
			...a11yConfig.plugins,
			...prettierConfig.plugins,
			...nextConfig.plugins,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				sourceType: 'module',
				project: ['./tsconfig.json', './tsconfig.app.json'],
				tsconfigRootDir: __dirname,
			},
		},
		settings: {
			'better-tailwindcss': {
				entryPoint: path.resolve(__dirname, 'src/styles/tailwind.css'),
			},
			...reactConfig.settings,
			...importConfig.settings,
		},
		rules: {
			...tsConfig.rules,
			...importConfig.rules,
			...reactConfig.rules,
			...a11yConfig.rules,
			...prettierConfig.rules,
			...nextConfig.rules,

			// Import order에 Next.js 패턴 추가
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
							pattern: 'next/*',
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
					pathGroupsExcludedImportTypes: ['react', 'next'],
				},
			],

			// General JavaScript rules
			// console 사용 허용 (디버깅 및 로깅 목적으로 사용 가능)
			'no-console': 'off',
			// 함수 매개변수 재할당 허용 (매개변수 직접 수정 가능)
			'no-param-reassign': 'off',
			// ++, -- 연산자 사용 제한 (for 루프의 증감식은 허용)
			'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
			// 배열 메서드 콜백에서 return 문 필수 여부 체크 (버그 방지를 위해 권장)
			'array-callback-return': 'warn',
			// for...in 루프에서 hasOwnProperty 체크 필수 여부 (프로토타입 체인 속성 접근 방지)
			'guard-for-in': 'warn',
			// 특정 문법 사용 제한 비활성화 (예: for...of, label 등)
			'no-restricted-syntax': 'off',
			// 클래스 메서드에서 this 사용 필수 여부 비활성화
			'class-methods-use-this': 'off',
			// 언더스코어로 시작/끝나는 식별자 사용 허용 (예: _private, __filename)
			'no-underscore-dangle': 'off',
			// switch 문에서 case fallthrough 방지 (break 누락으로 인한 버그 방지)
			'no-fallthrough': 'warn',
			// switch 문에서 default case 필수 여부 비활성화
			'default-case': 'off',
			// 생성자에서 return 문 사용 방지 (생성자에서 return은 의미 없음)
			'no-constructor-return': 'warn',
			// 전역 require() 사용 허용 (CommonJS 모듈 시스템 사용 가능)
			'global-require': 'off',
			// eslint-disable-next-line 주석 사용 허용
			'eslint-disable-next-line': 'off',
			// 중첩된 삼항 연산자 사용 경고 (가독성을 위해 권장)
			'no-nested-ternary': 'warn',
			// 함수에서 일관된 return 문 사용 권장 (조건부 return 허용하되 경고)
			'consistent-return': 'warn',
			// 사용되지 않은 표현식 경고
			'no-unused-expressions': 'warn',
			// debugger 문 경고
			'no-debugger': 'warn',
			// alert 사용 경고
			'no-alert': 'warn',
			// === 사용 강제
			'eqeqeq': ['error', 'always'],
			// eval 사용 금지
			'no-eval': 'error',
			// var 사용 금지, let/const 사용
			'no-var': 'error',
			// 재할당 없는 변수는 const 사용
			'prefer-const': 'error',
			// 화살표 함수 사용 권장
			'prefer-arrow-callback': 'warn',
			// 암묵적 타입 변환 방지
			'no-implicit-coercion': 'warn',

			// 구조 분해 할당에 대한 컨벤션을 맞추면 일관적인 코드를 유지할 수 있어 가독성에 도움
			// 변수 선언식에서 객체에 대해서만 구조 분해 할당 규칙을 강제
			// ESLint의 --fix 옵션을 넣어서 실행하면 구조 분해 할당을 적용하는 코드로 자동 수정
			'prefer-destructuring': [
				'error',
				{
					VariableDeclarator: {
						array: false,
						object: true,
					},
					AssignmentExpression: {
						array: false,
						object: false,
					},
				},
			],
		},
	},

	// JavaScript 파일에 대한 설정 (TypeScript parser 사용 안 함)
	{
		files: ['**/*.{js,jsx}'],
		plugins: {
			...reactConfig.plugins,
			...importConfig.plugins,
			...a11yConfig.plugins,
			...prettierConfig.plugins,
			...nextConfig.plugins,
		},
		languageOptions: {
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				sourceType: 'module',
			},
		},
		settings: {
			'better-tailwindcss': {
				entryPoint: path.resolve(__dirname, 'src/styles/tailwind.css'),
			},
			...reactConfig.settings,
			...importConfig.settings,
		},
		rules: {
			...importConfig.rules,
			...reactConfig.rules,
			...a11yConfig.rules,
			...prettierConfig.rules,
			...nextConfig.rules,

			// Import order에 Next.js 패턴 추가
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
							pattern: 'next/*',
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
					pathGroupsExcludedImportTypes: ['react', 'next'],
				},
			],

			'react-refresh/only-export-components': [
				'warn',
				{
					allowConstantExport: true,
				},
			],

			// General JavaScript rules
			// console 사용 허용 (디버깅 및 로깅 목적으로 사용 가능)
			'no-console': 'off',
			// 함수 매개변수 재할당 허용 (매개변수 직접 수정 가능)
			'no-param-reassign': 'off',
			// ++, -- 연산자 사용 제한 (for 루프의 증감식은 허용)
			'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
			// 배열 메서드 콜백에서 return 문 필수 여부 체크 (버그 방지를 위해 권장)
			'array-callback-return': 'warn',
			// for...in 루프에서 hasOwnProperty 체크 필수 여부 (프로토타입 체인 속성 접근 방지)
			'guard-for-in': 'warn',
			// 특정 문법 사용 제한 비활성화 (예: for...of, label 등)
			'no-restricted-syntax': 'off',
			// 클래스 메서드에서 this 사용 필수 여부 비활성화
			'class-methods-use-this': 'off',
			// 언더스코어로 시작/끝나는 식별자 사용 허용 (예: _private, __filename)
			'no-underscore-dangle': 'off',
			// switch 문에서 case fallthrough 방지 (break 누락으로 인한 버그 방지)
			'no-fallthrough': 'warn',
			// switch 문에서 default case 필수 여부 비활성화
			'default-case': 'off',
			// 생성자에서 return 문 사용 방지 (생성자에서 return은 의미 없음)
			'no-constructor-return': 'warn',
			// 전역 require() 사용 허용 (CommonJS 모듈 시스템 사용 가능)
			'global-require': 'off',
			// eslint-disable-next-line 주석 사용 허용
			'eslint-disable-next-line': 'off',
			// 중첩된 삼항 연산자 사용 경고 (가독성을 위해 권장)
			'no-nested-ternary': 'warn',
			// 함수에서 일관된 return 문 사용 권장 (조건부 return 허용하되 경고)
			'consistent-return': 'warn',
			// 사용되지 않은 표현식 경고
			'no-unused-expressions': 'warn',
			// debugger 문 경고
			'no-debugger': 'warn',
			// alert 사용 경고
			'no-alert': 'warn',
			// === 사용 강제
			'eqeqeq': ['error', 'always'],
			// eval 사용 금지
			'no-eval': 'error',
			// var 사용 금지, let/const 사용
			'no-var': 'error',
			// 재할당 없는 변수는 const 사용
			'prefer-const': 'error',
			// 화살표 함수 사용 권장
			'prefer-arrow-callback': 'warn',
			// 암묵적 타입 변환 방지
			'no-implicit-coercion': 'warn',

			'prefer-destructuring': [
				'error',
				{
					VariableDeclarator: {
						array: false,
						object: true,
					},
					AssignmentExpression: {
						array: false,
						object: false,
					},
				},
			],
		},
	},

	// 테스트 파일들(__tests__ 폴더 내 파일과 이름에 spec 또는 test를 포함하는 파일들)에 대해 특별한 규칙 설정
	// react-refresh/only-export-components 규칙을 비활성화하여 테스트에서 불필요한 경고 방지
	{
		files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
		rules: {
			'react-refresh/only-export-components': 'off',
		},
	},
]);

