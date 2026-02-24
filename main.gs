// ================= [설정 구역: 여기만 수정하세요] =================
const CONFIG = {
  MATTERMOST_WEBHOOK_URL: "알림 받을 채널 웹훅주소 작성",
  DATE_ROW: 2,    // 날짜가 적혀있는 행 번호 (예: 3행이면 3)
  TIME_COL: 1,    // 시간이 적혀있는 열 번호 (예: A열이면 1, B열이면 2)
  SHEET_INDEX: 1,  // 작동할 시트 번호 (첫 번째 시트면 1)

  // [범위 설정]
  START_ROW: 1,   // 데이터 입력을 감시할 시작 행 
  END_ROW: 9,    // 데이터 입력을 감시할 끝 행
  START_COL: 1,   // 데이터 입력을 감시할 시작 열
  END_COL: 15     // 데이터 입력을 감시할 끝 열
};
// ================================================================

function handleMeetingEdit(e) {
 if (!e) return;

  const range = e.range;
  const sheet = range.getSheet();
  const row = range.getRow();
  const col = range.getColumn();

  // 1. 시트 체크 (사용자가 설정한 인덱스 확인)
  if (sheet.getIndex() !== CONFIG.SHEET_INDEX) return;

  // 2. 범위 체크 (설정한 범위 밖이면 즉시 종료)
  if (row < CONFIG.START_ROW || row > CONFIG.END_ROW || 
      col < CONFIG.START_COL || col > CONFIG.END_COL) {
    return; 
  }

  const newValue = e.value ? String(e.value).trim() : String(range.getValue()).trim();
  
  const teamCodePattern = /^[A-Z]\d{3}$/;
  let message = "";

  // [신청] 값이 입력되었을 때 (타이핑 또는 붙여넣기)
  if (teamCodePattern.test(newValue)) {
    const dateLabel = getFormattedDate(sheet, col);
    const timeLabel = String(sheet.getRange(row, CONFIG.TIME_COL).getDisplayValue());

    message = `### :hyperkitty: **팀 미팅 신청 알림** :hyperkitty: \n` +
              `- **날짜**: ${dateLabel}\n` +
              `- **시간**: ${timeLabel}\n` +
              `- **팀 코드**: ${newValue}\n` +
              `👉 [시트 바로가기](${e.source.getUrl()})`;
  }
  // [취소] 값이 지워졌을 때
  else if (!newValue) {
    // 취소의 경우 oldValue 패턴 체크가 필요하지만, 붙여넣기 시 oldValue를 알 수 없으므로
    // 필요하다면 이 조건문을 좀 더 완화하거나 지금처럼 유지할 수 있습니다.
    const oldValue = e.oldValue ? String(e.oldValue).trim() : "";
    
    if (teamCodePattern.test(oldValue)) {
      const dateLabel = getFormattedDate(sheet, col);
      const timeLabel = String(sheet.getRange(row, CONFIG.TIME_COL).getDisplayValue());

      message = `### :cryingloopy: **팀 미팅 취소 알림** :cryingloopy: \n` +
                `- **날짜**: ${dateLabel}\n` +
                `- **시간**: ${timeLabel}\n` +
                `- **팀 코드**: ${oldValue}\n` +
                `👉 [시트 바로가기](${e.source.getUrl()})`;
    }
  }

  if (message) {
    sendToMattermost(message);
  }
}

// 날짜 포맷 함수
function getFormattedDate(sheet, col) {
  // 설정된 행(DATE_ROW)에서 날짜 추출
  const rawDate = sheet.getRange(CONFIG.DATE_ROW, col).getValue();
  if (!(rawDate instanceof Date)) return rawDate;
  
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const formattedDate = Utilities.formatDate(rawDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
  return `${formattedDate} (${week[rawDate.getDay()]})`;
}


function sendToMattermost(text) {
  const payload = { "text": text };
  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  UrlFetchApp.fetch(CONFIG.MATTERMOST_WEBHOOK_URL, options);
}
// 디버그 함수
function testhandleMeetingEdit() {
  // 1. 활성 스프레드시트 가져오기
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 2. 맨 왼쪽(첫 번째) 시트 가져오기
  const firstSheet = ss.getSheets()[0]; 
  
  // 3. 테스트할 셀 지정 (예: 첫 번째 시트의 C5 셀)
  const testRange = firstSheet.getRange("C5");
  
  // 4. 가짜 이벤트 객체 구성
  const fakeEvent = {
    range: testRange,
    value: "", // 테스트용 팀 코드
    source: ss     // e.source를 사용하는 경우를 대비
  };
  
  // 5. handleMeetingEdit 함수 실행
  console.log("테스트 시작: 시트 이름 - " + firstSheet.getName());
  handleMeetingEdit(fakeEvent);
  console.log("테스트 종료");
}
