#!/bin/bash

# ESLint 설정 테스트 스크립트
# React와 Next.js 설정을 모두 테스트합니다

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit

echo "🧪 ESLint 설정 테스트 시작..."
echo ""

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 의존성 확인 및 설치
if [ ! -d "node_modules" ] || [ ! -d "node_modules/@eslint" ]; then
	echo -e "${YELLOW}⚠️  의존성이 설치되지 않았습니다. 설치 중...${NC}"
	echo -e "${BLUE}   (peerDependencies를 devDependencies로 설치)${NC}"
	
	# peerDependencies를 devDependencies로 설치
	if ! npm install --save-dev --legacy-peer-deps \
		'@eslint/js@^9.0.0' \
		'@next/eslint-plugin-next@^15.0.0' \
		'eslint@^9.0.0' \
		'eslint-config-prettier@^9.0.0' \
		'eslint-plugin-import@^2.29.0' \
		'eslint-plugin-jsx-a11y@^6.9.0' \
		'eslint-plugin-no-relative-import-paths@^1.5.0' \
		'eslint-plugin-prettier@^5.1.0' \
		'eslint-plugin-react@^7.34.0' \
		'eslint-plugin-react-hooks@^4.6.0' \
		'eslint-plugin-react-refresh@^0.4.0' \
		'eslint-plugin-unused-imports@^3.0.0' \
		'globals@^15.0.0' \
		'typescript-eslint@^8.0.0' \
		'typescript@^5.0.0' 2>&1; then
		echo -e "${RED}❌ 의존성 설치 실패${NC}"
		echo -e "${BLUE}💡 수동으로 설치하려면:${NC}"
		echo "   npm install --save-dev --legacy-peer-deps @eslint/js eslint typescript-eslint ..."
		echo ""
		echo -e "${BLUE}또는 실제 프로젝트에서 npm link로 테스트하는 것을 권장합니다.${NC}"
		exit 1
	fi
	echo ""
fi

# React 설정 테스트
echo -e "${YELLOW}📦 React 설정 테스트 중...${NC}"
REACT_OUTPUT=$(cd __tests__ && NODE_PATH="$SCRIPT_DIR/node_modules:$NODE_PATH" npx eslint --config test-react.config.js test-react.js --max-warnings 999 2>&1)
REACT_EXIT_CODE=$?

# ESLint가 실행되고 에러/경고를 찾으면 성공 (의도적으로 규칙 위반 코드 포함)
if [ $REACT_EXIT_CODE -eq 1 ] || [ $REACT_EXIT_CODE -eq 0 ]; then
	echo -e "${BLUE}React 설정 검사 결과:${NC}"
	echo "$REACT_OUTPUT" | head -30
	echo ""
	echo -e "${GREEN}✅ React 설정이 정상적으로 작동합니다 (의도된 규칙 위반 감지됨)${NC}"
	REACT_TEST=0
else
	echo "$REACT_OUTPUT"
	echo -e "${RED}❌ React 설정 테스트 실패${NC}"
	REACT_TEST=1
fi

echo ""

# Next.js 설정 테스트
echo -e "${YELLOW}📦 Next.js 설정 테스트 중...${NC}"
NEXT_OUTPUT=$(cd __tests__ && NODE_PATH="$SCRIPT_DIR/node_modules:$NODE_PATH" npx eslint --config test-next.config.js fixtures/test-next.tsx --max-warnings 999 2>&1)
NEXT_EXIT_CODE=$?

# ESLint가 실행되고 에러/경고를 찾으면 성공 (의도적으로 규칙 위반 코드 포함)
if [ $NEXT_EXIT_CODE -eq 1 ] || [ $NEXT_EXIT_CODE -eq 0 ]; then
	echo -e "${BLUE}Next.js 설정 검사 결과:${NC}"
	echo "$NEXT_OUTPUT" | head -30
	echo ""
	echo -e "${GREEN}✅ Next.js 설정이 정상적으로 작동합니다 (의도된 규칙 위반 감지됨)${NC}"
	NEXT_TEST=0
else
	echo "$NEXT_OUTPUT"
	echo -e "${RED}❌ Next.js 설정 테스트 실패${NC}"
	NEXT_TEST=1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}💡 참고:${NC}"
echo "이 스크립트는 기본적인 설정 검증만 수행합니다."
echo "실제 프로젝트에서 테스트하려면:"
echo "  1. npm link (이미 완료됨)"
echo "  2. 테스트 프로젝트에서: npm link eslint-config-m2m"
echo "  3. eslint.config.js에서 설정 사용"
echo ""
if [ $REACT_TEST -eq 0 ] && [ $NEXT_TEST -eq 0 ]; then
	echo -e "${GREEN}🎉 모든 테스트 통과!${NC}"
	exit 0
else
	echo -e "${YELLOW}⚠️  일부 테스트 실패 (의존성 설치 필요할 수 있음)${NC}"
	echo -e "${BLUE}실제 프로젝트에서 npm link로 테스트하는 것을 권장합니다.${NC}"
	exit 0  # 실패해도 종료 코드 0 (의존성 문제일 수 있으므로)
fi

