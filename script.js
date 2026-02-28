const riddles = [
    { text: "Song Ngư là cá, tay ___ bắt cá.", ans: "gấu", img: "https://cf.shopee.vn/file/vn-11134207-820l4-mfxoko6bkpam39" },
    { text: "Ngăn kéo ngay dưới bông mai, nam ___ nữ tả.", ans: "hữu", img: "https://via.placeholder.com/300x150?text=Hinh+Cau+2" },
    { text: "Đồ ăn ngon thì cần phải có ___.", ans: "gia vị", img: "https://via.placeholder.com/300x150?text=Hinh+Cau+3" },
    { text: "Ra ngoài muốn chỉnh trang thì phải soi ___ chính giữa.", ans: "gương", img: "https://via.placeholder.com/300x150?text=Hinh+Cau+4" },
    { text: "Vua thùng phá sảnh, càn cả bàn, gom về ___.", ans: "chip", img: "https://via.placeholder.com/300x150?text=Hinh+Cau+5" },
    { text: "Ra ngoài đi học chớ quên mang ___.", ans: "cặp", img: "https://via.placeholder.com/300x150?text=Hinh+Cau+6" },
    { text: "Bữa sáng đơn giản nhất: Bánh dinh dưỡng + ___.", ans: "sữa", img: "https://via.placeholder.com/300x150?text=Hinh+Cau+7" },
    { text: "___ trong, ___ giấy, ___ điện đều nằm chung một tủ.", ans: "băng keo", img: "https://via.placeholder.com/300x150?text=Hinh+Cau+8" }
];

const correctOrder = ["Gương", "Vòng tay", "Trà sữa", "Blind box", "Sơn Hải Kinh", "Bộ poker", "Sổ sticker", "Bùa"];

let currentRiddleIndex = 0;
let sortableInstance = null;


const pomoModes = {
    pomo: { time: 25 * 60, tabId: 'pomo-btn', color: '#e74c3c' },
    short: { time: 5 * 60, tabId: 'short-btn', color: '#2ecc71' },
    long: { time: 15 * 60, tabId: 'long-btn', color: '#27ae60' }
};

let currentMode = 'pomo';
let timeLeft = pomoModes[currentMode].time;
let timerInterval = null;
let isRunning = false;
let pomoSessionsCompleted = 0;
let totalFocusTime = 0;

const alarm = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

function showPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    if(pageId === 'gift-page') initGiftPage();
}

function toggleModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('open');
    }
}

function closeModalDirect(id) {
    document.getElementById(id).classList.remove('open');
}

function initGiftPage() {
    const saved = localStorage.getItem('birthday_progress_v2');
    if (saved === 'completed') {
        showFinalResult();
        return;
    }
    currentRiddleIndex = 0;
    document.getElementById('riddle-container').style.display = 'block';
    document.getElementById('sort-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'none';
    loadRiddle();
}

function loadRiddle() {
    if (currentRiddleIndex < riddles.length) {
        const riddle = riddles[currentRiddleIndex];
        document.getElementById('riddle-title').innerText = `Câu đố ${currentRiddleIndex + 1}/${riddles.length}`;
        document.getElementById('riddle-img').src = riddle.img;
        document.getElementById('riddle-text').innerText = riddle.text;
        document.getElementById('riddle-input').value = "";
        document.getElementById('riddle-input').focus();
    } else {
        document.getElementById('riddle-container').style.display = 'none';
        document.getElementById('sort-container').style.display = 'block';
        renderSortable();
    }
}

function checkRiddle() {
    let input = document.getElementById('riddle-input').value.toLowerCase().trim();
    if (input === riddles[currentRiddleIndex].ans) {
        currentRiddleIndex++;
        loadRiddle();
    } else {
        alert("Sai bét rồi!");
        document.getElementById('riddle-input').select();
    }
}

document.getElementById('riddle-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkRiddle();
});

function renderSortable() {
    const list = document.getElementById('sortable-list');
    list.innerHTML = "";
    let shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(item => {
        let li = document.createElement('li');
        li.className = 'sortable-item';
        li.innerText = item;
        list.appendChild(li);
    });

    if (sortableInstance) sortableInstance.destroy();
    sortableInstance = new Sortable(list, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        forceFallback: true
    });
}

function checkSort() {
    const items = document.querySelectorAll('.sortable-item');
    let score = 0;
    items.forEach((item, index) => {
        if (item.innerText === correctOrder[index]) score++;
    });

    let finalAwardText = score === 8 ? "Quá đỉnh! Xin chúc mừng bạn Nu đã nhận được món quà thứ 10: 🎉 +8 vé miễn trừ rửa chén 🎉" : `Cố gắng lắm rồi! Nu nhận được món quà thứ 10 là 🎉 +${score} vé miễn trừ rửa chén 🎉.`;
    
    alert(`Úm ba la... Hóa ra bạn vẫn còn món quà thứ 9 là '-10 lần rửa chén'. Giờ để xem bạn có 'hack' thêm được món quà thứ 10 không nhé...`);

    document.getElementById('final-msg').innerText = finalAwardText;
    document.getElementById('final-list').innerHTML = `<strong>Thứ tự đúng là:</strong><br>${correctOrder.join(" ➔ ")}`;
    document.getElementById('sort-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    
    localStorage.setItem('birthday_progress_v2', 'completed');
    localStorage.setItem('final_award_text_v2', finalAwardText);
}

function showFinalResult() {
    document.getElementById('riddle-container').style.display = 'none';
    document.getElementById('sort-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('final-msg').innerText = localStorage.getItem('final_award_text_v2');
    document.getElementById('final-list').innerHTML = `<strong>Thứ tự đúng là:</strong><br>${correctOrder.join(" ➔ ")}`;
}

function setMode(mode) {
    if (isRunning && !confirm("Hệ thống đang chạy, reset timer?")) return;
    stopTimer();
    currentMode = mode;
    timeLeft = pomoModes[mode].time;
    document.body.style.backgroundColor = pomoModes[mode].color;
    document.querySelectorAll('.btn-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(pomoModes[mode].tabId).classList.add('active');
    document.getElementById('start-btn').style.backgroundColor = pomoModes[mode].color;
    updateTimerDisplay();
}

function toggleTimer() {
    if (isRunning) stopTimer(); else startTimer();
}

function startTimer() {
    isRunning = true;
    document.getElementById('start-btn').innerText = "STOP";
    timerInterval = setInterval(() => {
        timeLeft--;
        if (currentMode === 'pomo') totalFocusTime++;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            alarm.play();
            handleSessionCompleted();
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    document.getElementById('start-btn').innerText = "START";
}

function handleSessionCompleted() {
    stopTimer();
    if (currentMode === 'pomo') {
        pomoSessionsCompleted++;
        document.getElementById('pomo-count').innerText = pomoSessionsCompleted;
        if (pomoSessionsCompleted % 4 === 0) setMode('long'); else setMode('short');
    } else {
        setMode('pomo');
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('total-focus-time').innerText = Math.floor(totalFocusTime / 60);
}

function addTodo() {
    const input = document.getElementById('todo-input');
    if (!input.value.trim()) return;
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
        <input type="checkbox" onchange="updateTodoStats()">
        <span>${input.value}</span>
        <button onclick="this.parentElement.remove(); updateTodoStats();">✕</button>
    `;
    document.getElementById('todo-list').appendChild(li);
    input.value = "";
    updateTodoStats();
}

function updateTodoStats() {
    const total = document.querySelectorAll('.todo-item').length;
    const done = document.querySelectorAll('.todo-item input:checked').length;
    document.getElementById('todo-stats').innerText = `${done}/${total}`;
}

updateTimerDisplay();