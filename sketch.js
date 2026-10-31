// 儲存六道世界美食測驗的完整題目資料。
const questions = [
  { image: "1/1.jpg", title: "請問照片中這道由醋飯與新鮮生魚片組合而成的傳統日本料理，是來自哪一個國家？", options: ["韓國", "日本", "泰國", "中國"], answer: "日本", detail: "壽司是日本最具代表性的傳統美食之一，透過醋飯與生魚片等豐富食材搭配聞名全世界！" },
  { image: "1/2.jpg", title: "這道外皮酥脆、裹著甜辣醬汁且深受年輕人喜愛的「韓式炸雞」，是哪國的國民美食？", options: ["日本", "韓國", "新加坡", "越南"], answer: "韓國", detail: "韓式炸雞結合特製的甜辣醬料或醬油蒜香，是代表性的韓國飲食文化。" },
  { image: "1/3.jpg", title: "這碗加入蝦子、檸檬葉、香茅與辣椒，口感酸辣開胃的「冬蔭功湯」，是哪裡的名菜？", options: ["韓國", "泰國", "新加坡", "日本"], answer: "泰國", detail: "冬蔭功是泰國的國菜級湯品，「冬蔭」意為酸辣，「功」則是蝦子。" },
  { image: "1/4.jpg", title: "這道用透明米紙包裹著鮮蝦、米線與生菜，口感清爽不油膩的「生春捲」，屬於哪國的美食？", options: ["西班牙", "越南", "泰國", "韓國"], answer: "越南", detail: "越南生春捲使用透明柔軟的米皮包裹豐富餡料，沾上酸甜魚露醬是其精髓。" },
  { image: "1/5.jpg", title: "這盤使用香米烹煮、搭配鮮嫩白切雞與特製辣椒醬的「海南雞飯」，是哪國的代表美食？", options: ["越南", "新加坡", "日本", "西班牙"], answer: "新加坡", detail: "海南雞飯被視為新加坡的國菜之一，極度講究雞肉軟嫩度與米飯油香。" },
  { image: "1/6.jpg", title: "這道用平底鍋烹煮、金黃色的米飯吸滿海鮮精華與番紅花香氣的料理，源自哪裡？", options: ["法國", "義大利", "西班牙", "德國"], answer: "西班牙", detail: "西班牙海鮮飯（Paella）是地中海沿岸傳統名菜，以番紅花賦予金黃色澤與香氣。" }
]; // 完成題目資料設定。

// 建立測驗過程使用的畫面、分數與點擊範圍資料。
let screen = "intro"; // 記錄目前顯示的頁面。
let questionIndex = 0; // 記錄目前題目索引。
let score = 0; // 記錄答對的題數。
let chosenIndex = -1; // 記錄玩家在目前題目選擇的選項。
let answerIsCorrect = false; // 記錄目前答案是否正確。
let loadedImages = []; // 儲存預先載入的料理圖片。
let imageLoadFailed = []; // 記錄無法載入的題目圖片。
let clickTargets = []; // 儲存目前畫面的按鈕點擊範圍。
let answerTargets = []; // 儲存目前題目的選項點擊範圍。

// 預先載入六張題目照片。
function preload() { // 開始載入測驗圖片。
  for (let i = 0; i < questions.length; i++) { // 依序處理每一道題目。
    loadedImages[i] = loadImage(questions[i].image, undefined, () => { // 載入圖片並註冊失敗處理。
      imageLoadFailed[i] = true; // 記錄目前題目的圖片無法載入。
      console.error(`圖片載入失敗：${questions[i].image}，請確認圖片檔案存在。`); // 明確顯示圖片載入錯誤與檔案路徑。
    }); // 完成圖片載入設定。
  } // 完成所有圖片載入。
} // 完成預載入函式。

// 建立全螢幕畫布並設定全站繪圖的基本樣式。
function setup() { // 開始設定畫布。
  createCanvas(windowWidth, windowHeight); // 建立填滿瀏覽器視窗的畫布。
  textFont("sans-serif"); // 使用系統無襯線字型。
  textAlign(CENTER, CENTER); // 設定文字預設水平與垂直置中。
  rectMode(CORNER); // 設定矩形座標從左上角開始。
  imageMode(CORNER); // 設定圖片座標從左上角開始。
} // 完成畫布初始化。

// 根據目前狀態繪製首頁、題目頁或成績頁。
function draw() { // 開始繪製畫面。
  background("#ffc8dd"); // 使用指定粉色作為全畫布背景。
  clickTargets = []; // 清除上一幀的按鈕點擊範圍。
  answerTargets = []; // 清除上一幀的答案點擊範圍。
  drawDecorations(); // 繪製背景點綴。
  if (screen === "intro") { // 判斷目前是否為首頁。
    drawIntro(); // 顯示首頁標題及開始按鈕。
  } else if (screen === "question") { // 判斷目前是否為答題頁。
    drawQuestion(); // 顯示題目、圖片與作答選項。
  } else { // 處理測驗結束後的狀態。
    drawSummary(); // 顯示分數、稱號與重玩按鈕。
  } // 完成畫面狀態判斷。
} // 完成畫面繪製。

// 視窗大小改變時同步調整畫布尺寸。
function windowResized() { // 開始處理視窗調整。
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為視窗大小。
} // 完成視窗調整處理。

// 在畫面四周繪製淡色圓點裝飾。
function drawDecorations() { // 開始繪製背景裝飾。
  noStroke(); // 移除裝飾圓點的外框。
  fill(255, 255, 255, 75); // 設定半透明白色裝飾。
  circle(width * 0.08, height * 0.19, 14); // 繪製左上角裝飾點。
  circle(width * 0.91, height * 0.2, 18); // 繪製右上角裝飾點。
  circle(width * 0.11, height * 0.83, 20); // 繪製左下角裝飾點。
  circle(width * 0.9, height * 0.79, 12); // 繪製右下角裝飾點。
} // 完成背景裝飾繪製。

// 繪製測驗首頁與開始按鈕。
function drawIntro() { // 開始繪製首頁。
  const narrow = width < 500; // 判斷是否為窄螢幕版面。
  const centerX = width / 2; // 計算畫布中心位置。
  noStroke(); // 移除首頁圖示圓形外框。
  fill(255, 255, 255, 110); // 設定首頁圖示底圓顏色。
  circle(centerX, height * 0.25, narrow ? 92 : 116); // 繪製首頁裝飾圓形。
  fill("#c9184a"); // 設定圖示文字顏色。
  textSize(narrow ? 40 : 50); // 設定圖示文字大小。
  text("味", centerX, height * 0.25); // 繪製美食主題圖示。
  fill("#6d2932"); // 設定主標題顏色。
  textStyle(BOLD); // 將主標題設為粗體。
  textSize(narrow ? 29 : 46); // 依螢幕寬度調整主標題字級。
  text("各國美食大解密", centerX, height * 0.43); // 顯示測驗標題。
  textStyle(NORMAL); // 將文字樣式恢復為一般字重。
  fill("#7b4653"); // 設定簡介文字顏色。
  textSize(narrow ? 15 : 18); // 依螢幕寬度調整簡介字級。
  drawParagraph("用六道美味料理，帶你環遊世界！", centerX, height * 0.49, width - 48, narrow ? 22 : 26); // 換行繪製測驗簡介。
  fill("#9d6570"); // 設定提示文字顏色。
  textSize(14); // 設定提示文字字級。
  text("準備好了嗎？", centerX, height * 0.59); // 顯示開始提示。
  drawButton("開始測驗", centerX - min(145, width * 0.34), height * 0.66, min(290, width * 0.68), 58, "start"); // 繪製開始按鈕。
  fill("#9d6570"); // 設定頁尾文字顏色。
  textSize(12); // 設定頁尾文字字級。
  drawParagraph("選出你的答案，看看你是不是異國美食通", centerX, height * 0.8, width - 48, 18); // 換行繪製簡短遊玩說明。
} // 完成首頁繪製。

// 繪製題目卡片、料理照片、選項和作答後的解說。
function drawQuestion() { // 開始繪製題目頁。
  const margin = min(28, width * 0.055); // 計算卡片左右留白。
  const cardWidth = min(width - margin * 2, 900); // 計算卡片寬度。
  const cardHeight = max(280, height - 86); // 計算卡片高度並保留頁首空間。
  const cardX = (width - cardWidth) / 2; // 計算卡片水平位置。
  const cardY = 68; // 設定卡片垂直位置。
  const padding = min(26, cardWidth * 0.055); // 計算卡片內距。
  const contentWidth = cardWidth - padding * 2; // 計算卡片內容寬度。
  const imageHeight = min(height * 0.31, cardHeight * 0.34, 270); // 依畫面高度限制圖片高度。
  const item = questions[questionIndex]; // 取得目前題目的資料。
  drawProgress(cardWidth, cardY); // 顯示題號與答題進度。
  drawCard(cardX, cardY, cardWidth, cardHeight); // 繪製題目白色卡片。
  drawFoodImage(loadedImages[questionIndex], cardX + padding, cardY + padding, contentWidth, imageHeight); // 繪製目前料理的圖片。
  const titleY = cardY + padding + imageHeight + 15; // 計算題目文字起始位置。
  fill("#462a31"); // 設定題目文字顏色。
  textStyle(BOLD); // 將題目文字設為粗體。
  textSize(width < 500 ? 16 : 19); // 依螢幕寬度設定題目字級。
  const titleHeight = drawParagraph(item.title, width / 2, titleY, contentWidth, width < 500 ? 23 : 27); // 換行繪製題目文字。
  textStyle(NORMAL); // 將題目文字樣式恢復一般字重。
  drawOptions(item, cardX + padding, titleY + titleHeight + 12, contentWidth); // 繪製答案選項。
  if (chosenIndex !== -1) { // 判斷玩家是否已回答。
    drawFeedback(item, cardX, cardY, cardWidth, cardHeight, padding); // 顯示作答結果和解說。
  } // 完成作答回饋判斷。
} // 完成題目頁繪製。

// 在題目卡片上方顯示題號與作答進度。
function drawProgress(cardWidth, cardY) { // 開始繪製答題進度。
  fill("#6d2932"); // 設定題號文字顏色。
  textStyle(BOLD); // 將題號文字設為粗體。
  textSize(14); // 設定題號文字大小。
  text(`美食挑戰　${questionIndex + 1} / ${questions.length}`, width / 2, 27); // 顯示目前題號。
  textStyle(NORMAL); // 將題號文字樣式恢復一般字重。
  const barWidth = min(cardWidth, 240); // 計算進度條寬度。
  const barX = width / 2 - barWidth / 2; // 計算進度條左側位置。
  noStroke(); // 移除進度條外框。
  fill(255, 255, 255, 150); // 設定進度條底色。
  rect(barX, cardY - 9, barWidth, 5, 5); // 繪製進度條底軌。
  fill("#c9184a"); // 設定已完成進度的顏色。
  rect(barX, cardY - 9, barWidth * ((questionIndex + 1) / questions.length), 5, 5); // 繪製目前答題進度。
} // 完成進度列繪製。

// 繪製具有圓角和柔和陰影的白色卡片。
function drawCard(x, y, cardWidth, cardHeight) { // 開始繪製題目卡片。
  noStroke(); // 移除卡片外框。
  fill(115, 49, 66, 30); // 設定卡片陰影顏色。
  rect(x, y + 5, cardWidth, cardHeight, 24); // 繪製卡片陰影。
  fill("#fffafc"); // 設定卡片背景顏色。
  rect(x, y, cardWidth, cardHeight, 24); // 繪製白色圓角卡片。
} // 完成卡片繪製。

// 將圖片等比例裁切並填滿題目圖片區域。
function drawFoodImage(foodImage, x, y, imageWidth, imageHeight) { // 開始繪製料理圖片。
  if (!foodImage || foodImage.width === 0 || foodImage.height === 0) { // 檢查圖片是否已成功載入。
    fill("#f8e5eb"); // 設定圖片提示底色。
    noStroke(); // 移除圖片提示區外框。
    rect(x, y, imageWidth, imageHeight, 16); // 繪製圖片提示區域。
    fill(imageLoadFailed[questionIndex] ? "#b52f45" : "#9d6570"); // 依圖片載入狀態設定提示文字顏色。
    textSize(15); // 設定圖片提示字級。
    const imageMessage = imageLoadFailed[questionIndex] ? `找不到圖片：${questions[questionIndex].image}` : "料理圖片載入中…"; // 依載入狀態建立提示文字。
    text(imageMessage, x + imageWidth / 2, y + imageHeight / 2); // 顯示圖片載入狀態或錯誤路徑。
    return; // 避免繼續繪製尚未載入的圖片。
  } // 完成圖片載入檢查。
  const imageRatio = foodImage.width / foodImage.height; // 計算原始圖片長寬比例。
  const areaRatio = imageWidth / imageHeight; // 計算圖片顯示區域比例。
  let sourceX = 0; // 設定圖片裁切區域的水平起點。
  let sourceY = 0; // 設定圖片裁切區域的垂直起點。
  let sourceWidth = foodImage.width; // 設定圖片裁切區域的寬度。
  let sourceHeight = foodImage.height; // 設定圖片裁切區域的高度。
  if (imageRatio > areaRatio) { // 判斷原圖是否較寬。
    sourceWidth = foodImage.height * areaRatio; // 按顯示比例裁切圖片寬度。
    sourceX = (foodImage.width - sourceWidth) / 2; // 將水平裁切位置置中。
  } else { // 處理原圖較高的情況。
    sourceHeight = foodImage.width / areaRatio; // 按顯示比例裁切圖片高度。
    sourceY = (foodImage.height - sourceHeight) / 2; // 將垂直裁切位置置中。
  } // 完成圖片裁切計算。
  image(foodImage, x, y, imageWidth, imageHeight, sourceX, sourceY, sourceWidth, sourceHeight); // 將裁切後的圖片繪製到卡片。
} // 完成料理圖片繪製。

// 使用兩欄版面繪製選項，並標出作答正誤。
function drawOptions(item, x, y, contentWidth) { // 開始繪製答案選項。
  const gap = 12; // 設定兩個選項之間的間距。
  const optionWidth = (contentWidth - gap) / 2; // 計算每個選項的寬度。
  const optionHeight = height < 650 ? 46 : 52; // 依畫面高度設定選項按鈕高度。
  for (let i = 0; i < item.options.length; i++) { // 逐一繪製四個選項。
    const column = i % 2; // 計算選項所在欄位。
    const row = floor(i / 2); // 計算選項所在列。
    const optionX = x + column * (optionWidth + gap); // 計算選項水平位置。
    const optionY = y + row * (optionHeight + 10); // 計算選項垂直位置。
    const correctChoice = chosenIndex !== -1 && item.options[i] === item.answer; // 判斷選項是否為正確答案。
    const wrongChoice = chosenIndex === i && !answerIsCorrect; // 判斷玩家是否選錯目前選項。
    const optionColor = correctChoice ? "#80ed99" : wrongChoice ? "#ce4257" : "#fff0f4"; // 使用指定顏色標示正確答案或錯誤選項。
    const labelColor = wrongChoice ? "#ffffff" : correctChoice ? "#205b32" : "#6d2932"; // 設定選項文字的易讀顏色。
    noStroke(); // 移除選項按鈕外框。
    fill(optionColor); // 設定目前選項按鈕顏色。
    rect(optionX, optionY, optionWidth, optionHeight, 14); // 繪製圓角選項按鈕。
    if (chosenIndex === -1 && pointerInside(optionX, optionY, optionWidth, optionHeight)) { // 判斷游標是否停留在可作答選項上。
      noFill(); // 設定懸停外框為透明填色。
      stroke("#c9184a"); // 設定懸停外框顏色。
      strokeWeight(2); // 設定懸停外框線寬。
      rect(optionX, optionY, optionWidth, optionHeight, 14); // 繪製懸停外框。
      noStroke(); // 恢復無外框狀態。
    } // 完成懸停外框判斷。
    fill(labelColor); // 設定選項文字顏色。
    textStyle(BOLD); // 將選項文字設為粗體。
    textSize(width < 500 ? 15 : 17); // 依畫面寬度調整選項字級。
    text(`${String.fromCharCode(65 + i)}　${item.options[i]}`, optionX + optionWidth / 2, optionY + optionHeight / 2); // 顯示選項代號與內容。
    textStyle(NORMAL); // 將選項字重恢復一般字重。
    answerTargets.push({ x: optionX, y: optionY, w: optionWidth, h: optionHeight, index: i }); // 記錄選項點擊範圍。
  } // 完成四個選項繪製。
} // 完成選項繪製。

// 玩家作答後顯示結果、正解說明與下一步按鈕。
function drawFeedback(item, cardX, cardY, cardWidth, cardHeight, padding) { // 開始繪製答題回饋。
  const feedbackY = min(height - 104, cardY + cardHeight - (height < 650 ? 116 : 126)); // 計算回饋文字的垂直位置。
  const contentWidth = cardWidth - padding * 2; // 計算解說文字可用寬度。
  fill(answerIsCorrect ? "#287a42" : "#b52f45"); // 依答題結果設定提示文字顏色。
  textStyle(BOLD); // 將結果提示設為粗體。
  textSize(width < 500 ? 16 : 18); // 依畫面寬度調整提示字級。
  text(answerIsCorrect ? "答對了！太厲害了！" : `再加油，正確答案是「${item.answer}」`, width / 2, feedbackY); // 顯示答題結果與正確答案。
  textStyle(NORMAL); // 恢復解說文字的一般字重。
  fill("#68464d"); // 設定解說文字顏色。
  textSize(width < 500 ? 12 : 14); // 依畫面寬度調整解說字級。
  drawParagraph(item.detail, width / 2, feedbackY + 18, contentWidth, width < 500 ? 17 : 20); // 換行繪製料理解說。
  const buttonWidth = min(contentWidth, 250); // 計算下一步按鈕寬度。
  const buttonHeight = height < 650 ? 43 : 48; // 依畫面高度設定下一步按鈕高度。
  const buttonY = cardY + cardHeight - padding - buttonHeight; // 計算下一步按鈕位置。
  const label = questionIndex === questions.length - 1 ? "查看測驗結果" : "下一題"; // 決定按鈕顯示文字。
  drawButton(label, width / 2 - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "next"); // 繪製下一題或查看結果按鈕。
} // 完成答題回饋繪製。

// 顯示最終答對題數、依分數取得的稱號與重玩按鈕。
function drawSummary() { // 開始繪製成績頁。
  const cardWidth = min(width - 40, 680); // 計算成績卡片寬度。
  const cardHeight = min(height - 48, 560); // 計算成績卡片高度。
  const cardX = (width - cardWidth) / 2; // 計算成績卡片水平位置。
  const cardY = (height - cardHeight) / 2; // 計算成績卡片垂直位置。
  drawCard(cardX, cardY, cardWidth, cardHeight); // 繪製成績頁白色卡片。
  noStroke(); // 移除成績圖示底圓外框。
  fill("#ffe4ec"); // 設定成績圖示底圓顏色。
  circle(width / 2, cardY + cardHeight * 0.2, min(104, height * 0.15)); // 繪製成績圖示底圓。
  fill("#c9184a"); // 設定成績圖示文字顏色。
  textSize(min(42, height * 0.07)); // 設定成績圖示字級。
  text("旅", width / 2, cardY + cardHeight * 0.2); // 顯示美食旅行圖示。
  fill("#6d2932"); // 設定完成標題顏色。
  textStyle(BOLD); // 將完成標題設為粗體。
  textSize(width < 500 ? 25 : 34); // 依畫面寬度調整完成標題字級。
  text("美食探索完成！", width / 2, cardY + cardHeight * 0.39); // 顯示測驗完成訊息。
  fill("#c9184a"); // 設定分數文字顏色。
  textSize(width < 500 ? 27 : 36); // 依畫面寬度調整分數字級。
  text(`答對 ${score} / ${questions.length} 題`, width / 2, cardY + cardHeight * 0.52); // 顯示答對題數。
  fill("#7b4653"); // 設定稱號提示文字顏色。
  textStyle(NORMAL); // 將稱號提示設為一般字重。
  textSize(width < 500 ? 15 : 18); // 依畫面寬度調整提示字級。
  text("你的專屬稱號是", width / 2, cardY + cardHeight * 0.63); // 顯示稱號引導文字。
  fill("#6d2932"); // 設定稱號文字顏色。
  textStyle(BOLD); // 將稱號設為粗體。
  textSize(width < 500 ? 19 : 24); // 依畫面寬度調整稱號字級。
  text(resultTitle(), width / 2, cardY + cardHeight * 0.72); // 顯示依分數取得的稱號。
  textStyle(NORMAL); // 恢復一般文字樣式。
  const buttonWidth = min(cardWidth - 48, 290); // 計算重玩按鈕寬度。
  drawButton("再玩一次", width / 2 - buttonWidth / 2, cardY + cardHeight * 0.81, buttonWidth, 54, "restart"); // 繪製重新開始按鈕。
} // 完成成績頁繪製。

// 依照答對題數決定玩家的測驗稱號。
function resultTitle() { // 開始判斷測驗稱號。
  if (score === questions.length) { // 判斷玩家是否答對全部題目。
    return "異國美食大導遊"; // 回傳全對稱號。
  } // 完成全對稱號判斷。
  if (score >= 4) { // 判斷玩家是否至少答對四題。
    return "潛力無限小吃貨"; // 回傳高分稱號。
  } // 完成高分稱號判斷。
  return "準備出國增廣見聞"; // 回傳鼓勵探索的稱號。
} // 完成稱號判斷函式。

// 繪製共用按鈕並儲存它的點擊位置。
function drawButton(label, x, y, buttonWidth, buttonHeight, action) { // 開始繪製互動按鈕。
  noStroke(); // 移除按鈕外框。
  fill(115, 49, 66, 32); // 設定按鈕陰影顏色。
  rect(x, y + 3, buttonWidth, buttonHeight, 16); // 繪製按鈕陰影。
  fill(pointerInside(x, y, buttonWidth, buttonHeight) ? "#a90f3c" : "#c9184a"); // 依游標位置設定按鈕底色。
  rect(x, y, buttonWidth, buttonHeight, 16); // 繪製圓角按鈕。
  fill("#ffffff"); // 設定按鈕文字為白色。
  textStyle(BOLD); // 將按鈕文字設為粗體。
  textSize(16); // 設定按鈕文字大小。
  text(label, x + buttonWidth / 2, y + buttonHeight / 2); // 將按鈕文字置中。
  textStyle(NORMAL); // 恢復按鈕文字的一般字重。
  clickTargets.push({ x: x, y: y, w: buttonWidth, h: buttonHeight, action: action }); // 記錄按鈕點擊範圍。
} // 完成互動按鈕繪製。

// 將文字依可用寬度換行，並回傳段落高度。
function drawParagraph(content, centerX, startY, maxWidth, lineHeight) { // 開始排版多行文字。
  const lines = []; // 建立分行後的文字清單。
  let currentLine = ""; // 建立目前累積的文字行。
  for (const character of content) { // 逐字測量並安排換行。
    const candidate = currentLine + character; // 建立加上新字後的文字行。
    if (currentLine !== "" && textWidth(candidate) > maxWidth) { // 判斷新字是否會超出可用寬度。
      lines.push(currentLine); // 儲存已完成的文字行。
      currentLine = character; // 使用超出的新字開啟下一行。
    } else { // 處理尚未超出寬度的情況。
      currentLine = candidate; // 將新字加入目前文字行。
    } // 完成換行條件判斷。
  } // 完成逐字測量。
  if (currentLine !== "") { // 判斷最後是否仍有文字尚未儲存。
    lines.push(currentLine); // 儲存最後一行文字。
  } // 完成最後一行處理。
  textAlign(CENTER, TOP); // 將段落文字設定為頂端置中。
  for (let i = 0; i < lines.length; i++) { // 逐行繪製排版後的文字。
    text(lines[i], centerX, startY + i * lineHeight); // 在正確位置繪製目前文字行。
  } // 完成段落繪製。
  textAlign(CENTER, CENTER); // 恢復畫布的預設文字對齊方式。
  return lines.length * lineHeight; // 回傳段落所需的總高度。
} // 完成文字換行排版。

// 判斷滑鼠或觸控指標是否位於指定矩形內。
function pointerInside(x, y, areaWidth, areaHeight) { // 開始檢查指標位置。
  return mouseX >= x && mouseX <= x + areaWidth && mouseY >= y && mouseY <= y + areaHeight; // 回傳指標是否在指定範圍。
} // 完成指標位置檢查。

// 處理答案選擇以及畫面上按鈕的點擊動作。
function mousePressed() { // 開始處理滑鼠或觸控點擊。
  if (screen === "question" && chosenIndex === -1) { // 判斷目前是否正在等待玩家作答。
    for (const target of answerTargets) { // 逐一檢查答案選項的點擊範圍。
      if (pointerInside(target.x, target.y, target.w, target.h)) { // 判斷點擊是否落在某個答案上。
        chooseAnswer(target.index); // 記錄玩家選擇並計算答案正誤。
        return false; // 結束本次點擊處理。
      } // 完成答案命中判斷。
    } // 完成所有答案選項檢查。
  } // 完成作答點擊判斷。
  for (const target of clickTargets) { // 逐一檢查畫面按鈕的點擊範圍。
    if (pointerInside(target.x, target.y, target.w, target.h)) { // 判斷點擊是否落在某個按鈕上。
      activate(target.action); // 執行對應的按鈕動作。
      return false; // 結束本次點擊處理。
    } // 完成按鈕命中判斷。
  } // 完成所有按鈕檢查。
  return false; // 避免畫布點擊觸發瀏覽器預設行為。
} // 完成點擊事件處理。

// 記錄答案並於答對時累計分數。
function chooseAnswer(index) { // 開始處理玩家答案。
  chosenIndex = index; // 儲存玩家選取的選項。
  answerIsCorrect = questions[questionIndex].options[index] === questions[questionIndex].answer; // 比對玩家選項與正確答案。
  if (answerIsCorrect) { // 判斷玩家是否答對。
    score += 1; // 將答對題數加一。
  } // 完成答題計分。
} // 完成答案記錄。

// 根據按鈕動作開始測驗、進入下一題或重新遊玩。
function activate(action) { // 開始處理按鈕動作。
  if (action === "start") { // 判斷是否為開始測驗動作。
    resetQuiz(); // 初始化題號、答案與分數。
    screen = "question"; // 顯示第一道題目。
  } else if (action === "next") { // 判斷是否為前往下一步動作。
    if (questionIndex === questions.length - 1) { // 判斷目前是否已完成最後一題。
      screen = "summary"; // 顯示測驗成績。
    } else { // 處理仍有剩餘題目的情況。
      questionIndex += 1; // 前往下一道題目。
      chosenIndex = -1; // 清除上一題的選項紀錄。
      answerIsCorrect = false; // 重設上一題的作答結果。
    } // 完成下一步處理。
  } else if (action === "restart") { // 判斷是否為重新遊玩動作。
    resetQuiz(); // 清除上一輪的所有作答狀態。
    screen = "intro"; // 返回測驗首頁。
  } // 完成按鈕動作判斷。
} // 完成按鈕動作處理。

// 將題號、分數和作答狀態重設為初始值。
function resetQuiz() { // 開始重設測驗資料。
  questionIndex = 0; // 將題目索引歸零。
  score = 0; // 將答對題數歸零。
  chosenIndex = -1; // 清除目前選取的答案。
  answerIsCorrect = false; // 清除目前作答結果。
} // 完成測驗狀態重設。
