const riddles = [
    { text: "Song Ngư là cá, tay ___ bắt cá.", ans: "gấu", img: "img/1.jpg" },
    { text: "Ngăn kéo ngay dưới bông mai, nam tả nữ ___.", ans: "hữu", img: "img/3.jpg" },
    { text: "Đồ ăn ngon thì cần phải có ___ ___.", ans: "gia vị", img: "img/2.jpg" },
    { text: "Ra ngoài muốn chỉnh trang thì phải soi ___ chính giữa.", ans: "gương", img: "img/7.webp" },
    { text: "Vua thùng phá sảnh, càn cả bàn, gom ___ về.", ans: "chip", img: "img/8.webp" },
    { text: "Ra ngoài đi học chớ quên mang ___.", ans: "cặp", img: "img/4.jpg" },
    { text: "Bữa sáng đơn giản nhất: Bánh dinh dưỡng + ___.", ans: "sữa", img: "img/5.jpg" },
    { text: "___ trong, ___ giấy, ___ điện đều nằm chung một tủ.", ans: "băng keo", img: "img/6.jpg" }
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
		const riddle = riddles[currentRiddleIndex]

		document.getElementById('riddle-title').innerText = `Câu đố ${currentRiddleIndex + 1}/???`
		document.getElementById('riddle-img').src = riddle.img
		document.getElementById('riddle-text').innerText = riddle.text

		const input = document.getElementById('riddle-input')
		input.value = ""
		input.classList.remove("correct", "wrong")

		const feedback = document.getElementById("riddle-feedback")
		feedback.innerText = ""
		feedback.classList.remove("correct-msg", "wrong-msg")

		document.getElementById("next-btn").style.display = "none"

		input.focus()
	} else {
		document.getElementById('riddle-container').style.display = 'none'
		document.getElementById('sort-container').style.display = 'block'
		renderSortable()
	}
}

function checkRiddle() {
	const input = document.getElementById("riddle-input")
	const feedback = document.getElementById("riddle-feedback")
	const value = input.value.trim().toLowerCase()
	const correctAnswer = riddles[currentRiddleIndex].ans.toLowerCase()

	if (value === correctAnswer) {
		input.classList.remove("wrong")
		input.classList.add("correct")

		feedback.innerText = "Đúng rồi, giờ thì tìm quà dựa trên gợi ý trước khi sang câu tiếp nào."
		feedback.classList.remove("wrong-msg")
		feedback.classList.add("correct-msg")

		document.getElementById("next-btn").style.display = "inline-block"
	} else {
		input.classList.remove("correct")
		input.classList.add("wrong")

		feedback.innerText = "Sai rồi, thử lại đê!"
		feedback.classList.remove("correct-msg")
		feedback.classList.add("wrong-msg")
	}
}

function nextRiddle() {
	document.getElementById("next-btn").style.display = "none"

	const input = document.getElementById("riddle-input")
	input.value = ""
	input.classList.remove("correct", "wrong")

	currentRiddleIndex++

	if (currentRiddleIndex < riddles.length) {
		loadRiddle()
	} else {
		document.getElementById("riddle-container").style.display = "none"
		document.getElementById("sort-container").style.display = "block"
		renderSortable()
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
    
    alert(`Úm ba la... Hóa ra bạn Nu vẫn còn món quà thứ 9 là '10 vé miễn trừ rửa chén'. Giờ để xem bạn Nu có 'hack' thêm được món quà thứ 10 không nhé...`);

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
	if (isRunning && !confirm("Hệ thống đang chạy, reset timer?")) return
	stopTimer()
	currentMode = mode
	timeLeft = pomoModes[mode].time
	document.documentElement.style.setProperty('--bg-color', pomoModes[mode].color + '22')
	document.querySelectorAll('.btn-tab').forEach(btn => btn.classList.remove('active'))
	document.getElementById(pomoModes[mode].tabId).classList.add('active')
	document.getElementById('start-btn').style.backgroundColor = pomoModes[mode].color
	updateTimerDisplay()
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
	const input = document.getElementById('todo-input')
	if (!input.value.trim()) return

	const li = document.createElement('li')
	li.className = 'todo-item'
	li.innerHTML = `
		<div class="todo-left">
			<input type="checkbox">
			<span>${input.value}</span>
		</div>
		<button onclick="this.closest('li').remove(); updateTodoStats();">×</button>
	`

	const checkbox = li.querySelector('input')
	checkbox.addEventListener('change', function() {
		if (this.checked) {
			li.classList.add('done')
			document.getElementById('todo-list').appendChild(li)
		} else {
			li.classList.remove('done')
			document.getElementById('todo-list').prepend(li)
		}
		updateTodoStats()
	})

	document.getElementById('todo-list').prepend(li)
	input.value = ""
	updateTodoStats()
}

function updateTodoStats() {
    const total = document.querySelectorAll('.todo-item').length;
    const done = document.querySelectorAll('.todo-item input:checked').length;
    document.getElementById('todo-stats').innerText = `${done}/${total}`;
}

function changeVideo(value) {
	const player = document.getElementById('youtube-player')

	if (value.includes('list=')) {
		const listId = value.split('list=')[1].split('&')[0]
		player.src = `https://www.youtube.com/embed/videoseries?list=${listId}`
	} else if (value.includes('youtu.be/')) {
		const videoId = value.split('youtu.be/')[1].split('?')[0]
		player.src = `https://www.youtube.com/embed/${videoId}`
	} else if (value.includes('v=')) {
		const videoId = value.split('v=')[1].split('&')[0]
		player.src = `https://www.youtube.com/embed/${videoId}`
	}
}

// Hàm xử lý link dán vào
function loadCustomVideo() {
    const input = document.getElementById('custom-link').value;
    const player = document.getElementById('youtube-player');
    let videoId = "";

    try {
        if (input.includes('v=')) {
            // Link dạng youtube.com/watch?v=ABC
            videoId = input.split('v=')[1].split('&')[0];
        } else if (input.includes('youtu.be/')) {
            // Link dạng youtu.be/ABC
            videoId = input.split('youtu.be/')[1].split('?')[0];
        } else if (input.includes('list=')) {
            // Link playlist
            const listId = input.split('list=')[1].split('&')[0];
            player.src = `https://www.youtube.com/embed/videoseries?list=${listId}`;
            return;
        }

        if (videoId) {
            player.src = `https://www.youtube.com/embed/${videoId}`;
        } else {
            alert("Link không đúng định dạng YouTube rồi.");
        }
    } catch (e) {
        alert("Có lỗi khi đọc link rồi!");
    }
}

document.getElementById('todo-input').addEventListener('keypress', function(e) {
	if (e.key === 'Enter') addTodo()
})

updateTimerDisplay();