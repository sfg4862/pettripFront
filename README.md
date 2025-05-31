# PET TRIP

## Git Commit Message Convention (Style) Guide

- Commit Message Structure

  ```
      type : subject    태그 : 제목 (제목은 개조식 구문으로 작성)
      body 본문 (상세히 작성)
      footer 선택사항 : issue 유형
  ```

- Commit Type

  ```
      feat : 새로운 기능 추가
      fix : 버그 수정
      docs : 문서 수정
      style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
      refactor : 코드 리펙토링
      test : 테스트 코드, 리펙토링 테스트 코드 추가
      chore : 빌드 업무 수정, 패키지 매니저 수정
  ```

- issue 유형

  ```
      - Fixes: 이슈 수정중 (아직 해결되지 않은 경우)
      - Resolves: 이슈를 해결했을 때 사용
      - Ref: 참고할 이슈가 있을 때 사용
      - Related to: 해당 커밋에 관련된 이슈번호 (아직 해결되지 않은 경우)
  ```

## File tree (파일 구조도)

- 기본 파일 구조

  ```
      📦src
      ┣ 📂fonts
        ┗ 📜Font.style.css
      ┣ 📂images
      ┣ 📂common
      ┣ 📂components
      ┣ 📂constants
      ┣ 📂hooks
      ┣ 📂layout
      ┣ 📂pages
      ┣ 📂FAQPage
      ┃ ┣ 📜FAQPage.jsx
      ┃ ┗ 📜FAQPage.style.css
      ┣ 📂HomePage
      ┃ ┣ 📜HomePage.jsx
      ┃ ┗ 📜HomePage.style.css
      ┣ 📂LoginPage
      ┃ ┣ 📜LoginPage.jsx
      ┃ ┗ 📜LoginPage.style.css
      ┣ 📂RecordDailyPage
      ┃ ┣ 📜RecordDailyPage.jsx
      ┃ ┗ 📜RecordDailyPage.style.css
      ┣ 📂RecordMap
      ┃ ┣ 📜RecordMap.jsx
      ┃ ┗ 📜RecordMap.style.css
      ┣ 📂ReviewPage
      ┃ ┣ 📜ReviewPage.jsx
      ┃ ┗ 📜ReviewPage.style.css
      ┣ 📂SearchPage
      ┃ ┣ 📜SearchPage.jsx
      ┃ ┗ 📜SearchPage.style.css
      ┗ 📂SignUpPage
      ┃ ┣ 📜SignUpPage.jsx
      ┃ ┗ 📜SignUpPage.style.css
      ┣ 📂utils
      ┣ 📜App.css
      ┣ 📜App.js
      ┣ 📜index.css
      ┗ 📜index.js
  ```
