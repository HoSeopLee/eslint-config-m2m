# eslint-config-m2m

SmartM2M 프로젝트를 위한 공유 ESLint 설정 패키지입니다.

- 📦 [npm 패키지](https://www.npmjs.com/package/eslint-config-m2m)
- 🐙 [GitHub 저장소](https://github.com/HoSeopLee/eslint-config-m2m)

## 설치

### npm을 사용하는 경우

```bash
# 1단계: 라이브러리 설치
npm install --save-dev eslint-config-m2m

# 2단계: 필수 의존성 설치
npm install --save-dev \
  @eslint/js \
  eslint \
  eslint-config-prettier \
  eslint-plugin-import \
  eslint-plugin-jsx-a11y \
  eslint-plugin-no-relative-import-paths \
  eslint-plugin-prettier \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-plugin-unused-imports \
  globals \
  typescript-eslint

# Next.js 프로젝트인 경우 추가 설치
npm install --save-dev @next/eslint-plugin-next
```

### yarn을 사용하는 경우

```bash
# 1단계: 라이브러리 설치
yarn add -D eslint-config-m2m

# 2단계: 필수 의존성 설치
yarn add -D \
  @eslint/js \
  eslint \
  eslint-config-prettier \
  eslint-plugin-import \
  eslint-plugin-jsx-a11y \
  eslint-plugin-no-relative-import-paths \
  eslint-plugin-prettier \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-plugin-unused-imports \
  globals \
  typescript-eslint

# Next.js 프로젝트인 경우 추가 설치
yarn add -D @next/eslint-plugin-next
```

### pnpm을 사용하는 경우

```bash
# 1단계: 라이브러리 설치
pnpm add -D eslint-config-m2m

# 2단계: 필수 의존성 설치
pnpm add -D \
  @eslint/js \
  eslint \
  eslint-config-prettier \
  eslint-plugin-import \
  eslint-plugin-jsx-a11y \
  eslint-plugin-no-relative-import-paths \
  eslint-plugin-prettier \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-plugin-unused-imports \
  globals \
  typescript-eslint

# Next.js 프로젝트인 경우 추가 설치
pnpm add -D @next/eslint-plugin-next
```

> **참고**: 이 패키지는 `peerDependencies`를 사용하므로, 필수 의존성을 별도로 설치해야 합니다.

## 사용 방법

### React 프로젝트

프로젝트의 `eslint.config.js` (또는 `eslint.config.mjs`) 파일에서:

```javascript
// 방법 1: 명시적으로 react 사용 (권장)
import reactConfig from 'eslint-config-m2m/react';

export default reactConfig;

// 방법 2: 기본 export 사용 (하위 호환성)
import eslintConfig from 'eslint-config-m2m';

export default eslintConfig;
```

### Next.js 프로젝트

Next.js 프로젝트의 경우 `eslint-config-m2m/next`를 사용하세요:

```javascript
import nextConfig from 'eslint-config-m2m/next';

export default nextConfig;
```

> **참고**: 
> - Next.js 설정은 React 설정을 기반으로 하며, Next.js 전용 규칙이 추가로 적용됩니다.
> - 기본 export (`eslint-config-m2m`)는 React 설정을 반환하며, 하위 호환성을 위해 유지됩니다.
> - 새로운 프로젝트에서는 명시적으로 `/react` 또는 `/next`를 사용하는 것을 권장합니다.

### 개별 모듈 사용

필요한 모듈만 선택적으로 사용할 수 있습니다:

```javascript
import eslintConfig from 'eslint-config-m2m';
import reactConfig from 'eslint-config-m2m/react';
import tsConfig from 'eslint-config-m2m/ts';
import a11yConfig from 'eslint-config-m2m/a11y';
import importConfig from 'eslint-config-m2m/import';
import prettierConfig from 'eslint-config-m2m/prettier';
import nextConfig from 'eslint-config-m2m/next'; // Next.js 전용

export default [
  ...eslintConfig,
  // 또는 필요한 모듈만 추가
  reactConfig,
  tsConfig,
];
```

### 설정 확장

기본 설정을 확장하여 커스터마이징할 수 있습니다:

```javascript
import eslintConfig from 'eslint-config-m2m';

export default [
  ...eslintConfig,
  {
    rules: {
      // 추가 규칙 또는 규칙 오버라이드
      'no-console': 'error',
    },
  },
];
```

### 프로젝트별 설정 추가

#### React (Vite) 프로젝트

Vite 프로젝트의 경우 `tsconfig.app.json`을 사용합니다:

```javascript
import eslintConfig from 'eslint-config-m2m';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  ...eslintConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        // Vite 프로젝트의 tsconfig 경로 지정
        project: ['./tsconfig.app.json'], // Vite는 tsconfig.app.json 사용
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      react: {
        version: '19.2.0', // React 버전 명시
      },
      // 프로젝트별 설정 (예: tailwind 경로)
      'better-tailwindcss': {
        entryPoint: path.resolve(__dirname, 'src/styles/tailwind.css'),
      },
    },
  },
];
```

#### Next.js 프로젝트

Next.js 프로젝트의 경우 `tsconfig.json`을 사용하며, Next.js 전용 설정을 활용합니다:

```javascript
import nextConfig from 'eslint-config-m2m/next';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  ...nextConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        // Next.js 프로젝트의 tsconfig 경로 지정
        project: ['./tsconfig.json'], // Next.js는 tsconfig.json 사용
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      react: {
        version: '19.2.0', // React 버전 명시
      },
      // 프로젝트별 설정 (예: tailwind 경로)
      'better-tailwindcss': {
        entryPoint: path.resolve(__dirname, 'src/styles/tailwind.css'),
      },
    },
  },
];
```

## 포함된 설정

### React
- React 및 React Hooks 관련 규칙
- JSX 키, 중복 props, 정의되지 않은 JSX 사용 방지
- 배열 인덱스를 key로 사용 시 경고
- self-closing 태그 강제, Fragment 축약형 사용
- boolean prop 축약형 사용
- state 직접 변경 방지, deprecated API 사용 경고

### TypeScript
- TypeScript 관련 규칙 및 네이밍 컨벤션
- `any` 사용 경고, 빈 함수 경고
- `as const` 사용 권장
- interface/type 앞에 I, T 접두사 사용 불가

### 접근성 (a11y)
- JSX 접근성 규칙
- 이미지 alt 텍스트, ARIA 속성 검증
- 컨트롤과 레이블 연결, 클릭 이벤트와 키 이벤트 연결
- 테이블 관련 접근성 규칙 (scope 속성, caption 등)
- 비대화형 요소에 tabindex 사용 금지

### Import
- Import 순서 자동 정렬 (React 우선, 알파벳 순)
- 미사용 import 자동 정리
- 중복 import 방지
- 절대 경로 사용 권장 (상대 경로 경고)

### Prettier
- Prettier 통합 및 충돌 방지
- 코드 포맷팅 자동화

### 일반 JavaScript
- `===` 사용 강제 (`==` 금지)
- `eval` 사용 금지
- `debugger`, `alert` 사용 경고
- 사용되지 않은 표현식 경고
- 구조 분해 할당 권장
- 배열 메서드 콜백에서 return 문 체크 (버그 방지)
- switch 문 fallthrough 방지
- 생성자에서 return 사용 방지
- 중첩된 삼항 연산자 경고
- 함수 반환 일관성 권장

### Next.js (선택 사항)
- Next.js 전용 ESLint 규칙 적용
- `<a>` 태그 대신 Next.js `Link` 컴포넌트 사용 강제
- `<img>` 태그 대신 Next.js `Image` 컴포넌트 사용 권장
- Document Head 관련 규칙 (next/head 사용 권장)
- Next.js API 이름 오타 검사
- Import 순서에 Next.js 패턴 포함 (`next/*` 우선순위)
- Next.js 빌드 파일 무시 (`.next/`, `out/`, `next-env.d.ts` 등)

> **참고**: Next.js 설정은 React 설정의 모든 기능을 포함하며, Next.js 특화 규칙이 추가로 적용됩니다.

## 라이선스

MIT

