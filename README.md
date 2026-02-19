# TeamMeetingWebhook

컨, 코 태그 안하고 신청하는 팀미팅 놓치지 말자!

지정한 시트 표 범위에 `알파벳 + 숫자 3자리` 형식의 팀코드가 작성되면 채널에 알림이 온다

<img width="500" height="200" alt="image" src="https://github.com/user-attachments/assets/8c44ef4a-35a1-45f2-8b7a-9fffdf883eb0" />

## 🍒 How to use

### 1. 팀미팅 시트 (구글 스프레드 시트 형식) > 확장 프로그램 > Apps Script > Code.gs 파일에 main.gs 코드 붙여넣기 후 저장 (배포 안해도됨. ctrl + s로 저장)

- `MATTERMOST_WEBHOOK_URL` : 알림 받을 채널 웹훅 주소
- `DATE_ROW` : 날짜 행
- `TIME_COL` : 시간 열
- `SHEET_INDEX` : 작동할 시트 번호 ( 하단 시트탭 왼쪽 1번째 시트 기준)
- `START_ROW`, `END_ROW`, `START_COL`, `END_COL` : 실제 팀미팅 표 범위 할당
<img width="500" height="632" alt="image" src="https://github.com/user-attachments/assets/e3509f62-1187-4615-948a-54824045f058" />

<img width="500" height="736" alt="image" src="https://github.com/user-attachments/assets/87f7ac4d-381d-4b76-8b34-9e04c7db1ecb" />

### 2. 트리거 설정

- Apps Script 왼쪽 메뉴바에 '시계 모양' > 트리거
<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/29244581-2e4e-4ca4-8b05-7241b93694c6" />

- 트리거 추가 후
- 실행할 함수 선택 > `handleMeetingEdit` 함수
- 이벤트 유형 선택 > `수정시`
- 저장 후 권한 승인 해줘야함.
<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/f7f922f1-46d5-4756-b6e3-b70ece93ad5a" />

### 3. 지정한 채널로 팀미팅 알림이 온다!

<img width="500" height="400" alt="image" src="https://github.com/user-attachments/assets/e596d4db-ae00-4670-ba61-8e0f84986661" />
