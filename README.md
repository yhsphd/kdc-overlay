# KDC-Overlay

Duo Cup: KOREA 2026 방송을 위한 실시간 스트리밍 오버레이 프로젝트입니다. 백엔드(Node.js)와 프론트엔드(Vue 3)가 하나의 모노리포로 통합되어 관리됩니다.

## 📂 프로젝트 구조

```text
kdc-overlay/
├── apps/
│   ├── backend/       # Node.js + Express + Socket.io (백엔드 로직)
│   └── frontend/      # Vue 3 + Vite + Pinia (오버레이 UI)
├── dist/              # 최종 빌드 결과물 (exe, cmd)
├── .github/workflows/ # GitHub Actions CI/CD 설정
├── package.json       # 루트 워크스페이스 및 공통 스크립트
└── turbo.json         # Turborepo 파이프라인 설정
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 22 이상
- npm (최신 버전 권장)

### 의존성 설치
```bash
# 루트 폴더에서 실행
npm install
```

### 개발 실행
```bash
# 백엔드와 프론트엔드 개발 서버를 동시에 실행
npm run dev
```
* VS Code를 사용하신다면 `F5` 키를 눌러 **Full Stack (Backend + Frontend)** 디버깅 모드로 실행할 수 있습니다.

## 🛠 주요 명령어 (Scripts)

| 명령어 | 설명 |
| :--- | :--- |
| `npm run build` | 프론트엔드 빌드 후 백엔드와 통합하여 `dist/`에 실행 파일 생성 |
| `npm run dev` | 개발 모드 실행 (백엔드 노드 실행 + 프론트엔드 Vite HMR) |
| `npm run fix` | Lint 및 Format 오류를 자동으로 수정 (`lint:fix` + `format:fix`) |
| `npm run lint` | ESLint를 사용한 코드 정적 분석 (CI용) |
| `npm run format` | Prettier를 사용한 코드 스타일 검사 (CI용) |
| `npm run clean` | 모든 빌드 아티팩트 및 캐시 삭제 |

## 📦 빌드 파이프라인

본 프로젝트는 **Turborepo**를 사용하여 빌드 최적화를 수행합니다.
1. `@kdc/frontend` 빌드 (`dist/` 생성)
2. `@kdc/backend`가 프론트엔드 결과물을 자신의 `public/` 폴더로 복사
3. `pkg`를 사용하여 백엔드와 프론트엔드가 통합된 단일 실행 파일 생성
4. 최종 결과물은 프로젝트 루트의 `dist/` 폴더로 출력

## 🚢 CI/CD 및 배포

GitHub Actions를 통해 자동 배포가 설정되어 있습니다.
- **방법**: 버전 태그(`v*`)를 생성하여 푸시하면 자동으로 실행됩니다.
- **과정**: 빌드 수행 후 GitHub Release를 생성하고 `kdc-overlay.exe`, `kdc-overlay.cmd` 파일을 업로드합니다.
