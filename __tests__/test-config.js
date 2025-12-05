import { ESLint } from 'eslint';
import { fileURLToPath } from 'url';
import path from 'path';
import { readdir, writeFile, unlink } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');

/**
 * ESLint 설정이 올바르게 로드되고 작동하는지 테스트합니다.
 */
async function testConfig() {
	console.log('🧪 ESLint 설정 테스트 시작...\n');

	// React 설정 테스트
	await testConfigFile('react.js', 'React 설정');
	
	// Next.js 설정 테스트
	await testConfigFile('next.js', 'Next.js 설정');
}

/**
 * 특정 설정 파일을 테스트합니다.
 */
async function testConfigFile(configFile, configName) {
	console.log(`📋 ${configName} 테스트 중...`);

	// 임시 설정 파일 생성
	const tempConfigPath = path.join(__dirname, 'temp-eslint.config.js');
	
	try {
		// 설정 파일 import
		const configPath = path.join(rootDir, configFile);
		const configModule = await import(`file://${configPath}`);
		const config = configModule.default;

		// 임시 설정 파일 생성 (ESLint 9는 설정 파일 경로를 필요로 함)
		const configCode = `import config from '${configPath.replace(/\\/g, '/')}';
export default config;`;
		await writeFile(tempConfigPath, configCode, 'utf8');

		// ESLint 인스턴스 생성 (ESLint 9 flat config)
		const eslint = new ESLint({
			overrideConfigFile: tempConfigPath,
		});

		// fixtures 디렉토리의 모든 파일 가져오기
		const files = await readdir(fixturesDir);
		const testFiles = files
			.filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
			.map((file) => path.join(fixturesDir, file));

		if (testFiles.length === 0) {
			console.log(`  ⚠️  테스트 파일이 없습니다.\n`);
			await unlink(tempConfigPath).catch(() => {});
			return;
		}

		// 각 파일에 대해 ESLint 실행
		for (const file of testFiles) {
			const results = await eslint.lintFiles([file]);
			const fileName = path.basename(file);

			// 결과 출력
			if (results[0] && results[0].messages.length === 0) {
				console.log(`  ✅ ${fileName}: 오류 없음`);
			} else if (results[0]) {
				console.log(`  ⚠️  ${fileName}: ${results[0].messages.length}개 오류 발견`);
				results[0].messages.forEach((message) => {
					const severity = message.severity === 2 ? '❌' : '⚠️';
					console.log(
						`     ${severity} ${message.line}:${message.column} - ${message.message} (${message.ruleId})`
					);
				});
			}
		}

		console.log(`  ✅ ${configName} 테스트 완료\n`);
	} catch (error) {
		console.error(`  ❌ ${configName} 테스트 실패:`, error.message);
		if (error.stack) {
			console.error(error.stack);
		}
		process.exit(1);
	} finally {
		// 임시 파일 정리
		await unlink(tempConfigPath).catch(() => {});
	}
}

// 테스트 실행
testConfig().catch((error) => {
	console.error('테스트 실행 중 오류 발생:', error);
	process.exit(1);
});

