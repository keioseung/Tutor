# AI Education App

AI 교육 플랫폼 - 다국어 지원 모바일 앱 및 관리자 대시보드

## 🚀 프로젝트 구조

```
ai-education-app/
├── backend/         # Node.js + Express + Prisma (API 서버)
├── mobile/          # React Native + Expo (모바일 앱)
├── admin/           # Next.js (관리자 대시보드)
└── package.json     # 모노레포 관리
```

## 🛠 기술 스택

### Backend
- **Node.js** + **Express** - API 서버
- **Prisma** + **SQLite** - 데이터베이스 ORM
- **JWT** - 인증 시스템
- **bcryptjs** - 비밀번호 암호화

### Mobile App
- **React Native** + **Expo** - 크로스 플랫폼 모바일 앱
- **Expo Router** - 네비게이션
- **React Native Paper** - UI 컴포넌트
- **Axios** - API 통신

### Admin Dashboard
- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **React Hook Form** - 폼 관리

## 📋 주요 기능

### 모바일 앱
- 🌍 **다국어 지원**: 한국어, 영어, 일본어, 중국어
- 📚 **일일 학습**: 매일 3개 콘텐츠 학습
- 📊 **진도 추적**: 학습 진행률 시각화
- ❤️ **즐겨찾기**: 중요한 내용 북마크
- 🔍 **검색 기능**: 과거 학습 내용 검색
- 📝 **단어장**: 모르는 단어 저장 및 복습
- 📖 **학습 노트**: 개인 메모 기능
- 👥 **커뮤니티**: 질문/답변, 스터디 그룹
- 📈 **학습 통계**: 언어별 학습 분석

### 관리자 대시보드
- 📝 **콘텐츠 관리**: 다국어 교육 콘텐츠 업로드
- 📅 **스케줄링**: 예약 발행 기능
- 📊 **사용자 분석**: 학습 패턴 분석
- 📋 **템플릿 관리**: 자주 사용하는 형식 저장

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# Node.js 18+ 설치 필요
node --version

# 프로젝트 클론
git clone <repository-url>
cd ai-education-app

# 의존성 설치
npm run install:all
```

### 2. 데이터베이스 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# 환경 변수 설정
cp env.example .env

# 데이터베이스 설정 및 시드 데이터 생성
npm run db:setup
npm run db:seed
```

### 3. 서버 실행

```bash
# 루트 디렉토리에서 모든 서버 동시 실행
npm run dev:all

# 또는 개별 실행
npm run dev:backend  # 백엔드 (포트 3001)
npm run dev:admin    # 관리자 페이지 (포트 3000)
npm run dev:mobile   # 모바일 앱 (포트 8081)
```

## 📱 모바일 앱 실행

### Expo Go 앱 사용
1. 스마트폰에 **Expo Go** 앱 설치
2. 터미널에서 QR 코드 스캔
3. 앱 실행

### 시뮬레이터 사용
```bash
cd mobile
npm run ios     # iOS 시뮬레이터
npm run android # Android 에뮬레이터
```

## 🔧 개발 환경

### 백엔드 API
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Docs**: http://localhost:3001/api

### 관리자 대시보드
- **URL**: http://localhost:3000
- **기본 계정**: admin@aiedu.com / admin123

### 모바일 앱
- **URL**: exp://localhost:8081
- **테스트 계정**: test@aiedu.com / admin123

## 📊 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 프로필 조회

### 콘텐츠
- `GET /api/content` - 콘텐츠 목록
- `GET /api/content/daily` - 오늘의 학습
- `GET /api/content/:id` - 콘텐츠 상세
- `GET /api/content/search/:query` - 콘텐츠 검색

### 학습
- `GET /api/learning/progress` - 학습 진도
- `POST /api/learning/progress/:contentId` - 진도 업데이트
- `GET /api/learning/favorites` - 즐겨찾기
- `POST /api/learning/favorites/:contentId` - 즐겨찾기 토글

### 커뮤니티
- `GET /api/community/questions` - 질문 목록
- `POST /api/community/questions` - 질문 작성
- `GET /api/community/study-groups` - 스터디 그룹

## 🗄 데이터베이스 스키마

### 주요 테이블
- **users** - 사용자 정보
- **contents** - 교육 콘텐츠
- **content_translations** - 다국어 번역
- **learning_progress** - 학습 진도
- **favorites** - 즐겨찾기
- **vocabulary** - 단어장
- **notes** - 학습 노트
- **questions** - 질문
- **study_groups** - 스터디 그룹

## 🌍 다국어 지원

### 지원 언어
- 🇰🇷 한국어 (KOREAN)
- 🇺🇸 영어 (ENGLISH)
- 🇯🇵 일본어 (JAPANESE)
- 🇨🇳 중국어 (CHINESE)

### 언어 설정
- 모바일 앱: 설정에서 언어 변경
- 관리자: 콘텐츠 작성 시 다국어 입력

## 🔒 보안

- JWT 토큰 기반 인증
- bcryptjs로 비밀번호 암호화
- CORS 설정으로 API 접근 제한
- Rate limiting으로 API 과부하 방지

## 📈 모니터링

### 백엔드 로그
```bash
cd backend
npm run dev
```

### 데이터베이스 관리
```bash
cd backend
npm run db:studio  # Prisma Studio 실행
```

## 🚀 배포

### 백엔드 배포
```bash
cd backend
npm run build
npm start
```

### 관리자 페이지 배포
```bash
cd admin
npm run build
npm start
```

### 모바일 앱 배포
```bash
cd mobile
expo build:android  # Android APK
expo build:ios      # iOS IPA
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해주세요.

---

**AI Education App** - 더 나은 AI 교육을 위한 플랫폼 🚀
