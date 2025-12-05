import reactConfig from '../react.js';

// 테스트 환경에 맞게 설정 조정 - TypeScript project 체크 제거
export default reactConfig.map((config) => {
	// TypeScript 파일 설정인 경우 project 체크 제거
	if (config.files && Array.isArray(config.files) && config.files.some((f) => typeof f === 'string' && f.includes('ts'))) {
		const parserOptions = config.languageOptions?.parserOptions;
		if (parserOptions?.project) {
			return {
				...config,
				languageOptions: {
					...config.languageOptions,
					parserOptions: {
						...parserOptions,
						project: false, // project 체크 완전 비활성화
					},
				},
			};
		}
	}
	return config;
});

