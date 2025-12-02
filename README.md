# 💬 SongNS
<p align="center">
  <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/snsLogo.png" alt="SNS Logo" width="300" />
</p>

![전체화면](https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/songns.JPG)

> "오늘을 담은 한 장의 기록, 그리고 한 곡의 사운드.
음악으로 이어지는 나만의 SNS, 지금 시작해보세요."

## 💡 프로젝트 소개
- SongNS는 사용자가 하루와 어울리는 음악을 검색하고, 그 음악과 함께 사진·텍스트를 기록해 **뮤직카드**로 만들어 공유할 수 있는 SNS 플랫폼입니다.
- 단순히 게시글을 올리는 것이 아니라, 오늘의 감정과 분위기에 맞는 음악 한 곡을 함께 기록함으로써 더 깊이 있는 나만의 스토리를 남길 수 있는 서비스입니다.
---
## 📅 개발기간
#### 2025.11.24 ~ 2025.12.02(기획 2일, 제작 5일)

## 📌 기획 배경
음악 감상과 SNS 활동이 분리되어 있어, 사용자가 자신의 음악 취향을 공유하고 소통하는 과정이 번거로웠습니다.  
사용자들이 좋아하는 음악을 다른 사람들과 쉽게 공유하고 발견하며 소통할 수 있는 공간이 필요했습니다.
또한, 한 번에 많은 콘텐츠를 보여주는 기존 방식은 집중도가 낮고, 새로운 음악을 발견하기 어려웠습니다.  
이에 따라, 한 장씩 카드 형태의 게시물을 랜덤으로 보여주어 사용자가 한 콘텐츠에 집중하면서 자연스럽게 음악을 탐색하고 공유할 수 있는 SNS 플랫폼을 기획하게 되었습니다.

--- 
## 🛠 사용기술

| 구분 | 기술 / 라이브러리 | 
|------|----------------|
| **프론트엔드** | 	![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)  ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![MaterialUI](https://img.shields.io/badge/Material%20UI-%23FFFFFF?style=for-the-badge&logo=MUI&logoColor=#007FFF)| 
| **백엔드** | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)|
| **데이터베이스** | ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white) |
| **기타 / 도구** |![Last.fm](https://img.shields.io/badge/last.fm-D51007?style=for-the-badge&logo=last.fm&logoColor=white) ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)|
---
## ✨ 페이지별 주요 기능
### 1. 로그인 / 회원가입

| 로그인 | 회원가입 |
|---------|---------|
| <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EB%A1%9C%EA%B7%B8%EC%9D%B8.JPG"/> | <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85.JPG" /> |
- 아이디찾기, 비밀번호찾기
- 비밀번호는 암호화 되어 저장

### 2. 메인페이지 / 상세보기

| 메인 | 상세보기 |
|---------|---------|
| <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EB%A9%94%EC%9D%B8%EC%95%8C%EB%9E%8C.JPG"/> | <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EC%83%81%EC%84%B8%EB%B3%B4%EA%B8%B0.JPG" /> |
- 좌측 사이드바 (메인, 좋아요목록, 친구목록, 나의 프로필, 설정)
- 우측 새 댓글 알림 버튼, 새 채팅 알림 버튼 (버튼 위 알람 수 만큼 숫자 표시)
- 상단 헤더 (로고 클릭시 메인페이지 이동, 노래검색창, 로그아웃 버튼)
- 좋아요, 댓글 기능
- 화살표 클릭시 Slide & Fade Card Transition로 랜덤 피드 띄우기
- 상단 음반 이모지 클릭시 음반 돌아가며 **해당음악 정보 페이지로(Last.fm API) 이동**
- 프로필 이미지 클릭시 해당 유저 프로필페이지로 이동

### 3. 댓글알람 / 채팅알람

| 댓글알림창 | 채팅알림창 |
|---------|---------|
| <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EB%8C%93%EA%B8%80.JPG"/> | <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EB%8C%93%EA%B8%80%EC%95%8C%EB%A6%BC.JPG" /> |
- 메인에서 우측 알림창 클릭시 슬라이드 인(Slide-in) 효과로 창 띄움
- **안읽은 알림 / 읽은 알림 구분**

### 4. 채팅방 
<img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EC%B1%84%ED%8C%85.JPG"/>

- **Persistent Component** 형태로 페이지 이동해도 계속 유지 
- 채팅방 **동시 여러개 띄우기** 가능, 드래그 통해 **위치 이동**

### 5. 좋아요목록 / 팔로우,팔로잉 목록
| 좋아요목록 | 팔로우,팔로잉 목록 |
|---------|---------|
| <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EC%A2%8B%EC%95%84%EC%9A%94%EB%AA%A9%EB%A1%9D.JPG"/> | <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%ED%8C%94%EB%A1%9C%EC%9A%B0.JPG" /> |

- 좋아요 누른 게시글들 카드 형태로 모아보기 음악 중점이므로 음악 정보 표시, 클릭시 해당 게시글 상세보기 이동
- 나를 팔로우한 사람/ 내가 팔로우한 사람 분리하여 표시, 클릭시 해당 유저 프로필페이지 이동

### 6. 내 프로필 / 다른 유저 프로필
| 내 프로필 | 다른유저 프로필 |
|---------|---------|
| <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80.JPG"/> | <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EB%8B%A4%EB%A5%B8%EC%9C%A0%EC%A0%80%ED%94%84%EB%A1%9C%ED%95%84.JPG" /> |

- 다른 유저 프로필페이지 들어간 경우 팔로우/팔로우 취소 가능
- 채팅 이모지 클릭시 (채팅내역 없는경우-> 새 채팅방 생성 후 채팅 팝업, 채팅내역 존재하는 경우-> 이전 내역 불러온 후 채팅 팝업)

### 7. 게시글 추가 / 프로필 수정
| 게시글 추가 | 프로필 수정 |
|---------|---------|
| <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%B6%94%EA%B0%80.JPG"/> | <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%ED%94%84%EB%A1%9C%ED%95%84%EC%88%98%EC%A0%95.JPG" /> |

- 게시글 작성시 이미지 선택, **음악 검색 후 선택(Last.fm API 을 통해 키워드 입력 시 가수명 또는 음악 제목에 포함된 리스트 출력)**

### 8. 노래 검색 / Feed, Listen 버튼
| 노래검색 | feed |
|---------|---------|
| <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EB%85%B8%EB%9E%98%EA%B2%80%EC%83%89.JPG"/> | <img src="https://github.com/yeseul1008/SongNs/blob/main/readmeIMG/%EB%85%B8%EB%9E%98%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC.JPG" /> |

- 헤더에서 노래 검색시 **해당 키워드 관련 노래 리스트 전부 출력**
- Feed 버튼 클릭 => 해당 음원으로 작성한 게시글 출력
- Listen 버튼 클릭 => 해당 음원 정보 담은 **Last.fm 사이트로 이동**

---

## 💬 프로젝트 후기
😄 좋았던 점
- 평소에 있으면 좋겠다고 생각한 기능을 가진 SNS를 직접 구상하고 만들어보면서, 기획부터 개발까지 전체 과정을 경험할 수 있었다.
- UI를 원하는 형태로 자유롭게 꾸며보는 재미가 있었고, 머릿속에서 구상한 디자인을 실제 화면에서 구현했을 때 성취감을 느꼈다.
- React와 MUI를 활용해 컴포넌트를 구성하고 상태를 관리하면서, 프론트엔드 개발 실력을 한 단계 끌어올릴 수 있었다.
- 서버와 클라이언트 간 데이터 통신을 직접 구현하면서 API 설계와 비동기 처리에 대한 이해가 깊어졌다.
- 댓글, 좋아요, 채팅 등 사용자 인터랙션을 구현하며 실제 사용자 입장에서 기능을 고민하고 개선하는 경험을 할 수 있었다.

😥 보완할 점
- 애플뮤직, 스포티파이 등등 대중적인 음악 API를 사용하고싶었는데 우회해야만 사용가능하거나 큰 금액을 지불해야하는 등 API를 가져오는데 많은 어려움이 있어 조금은 아쉬운 API를 택했다. 웹에서 음악 재생이 가능했다면 더 만족스러웠겠지만 방법이 보이지 않아 현재의 링크 연결 방법을 사용하였다. 좀 더 계속해서 찾아봤으면 원하던 기능을 모두 구현할 수 있었겠지만 시간문제로 차선책으로 Last.fm API를 사용한 점이 아쉬웠다.
