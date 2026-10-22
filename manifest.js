{
  "name": "Portal Belajar Siswa SMA",
  "short_name": "Portalbelajarsma",
  "description": "Portal belajar ringan, smart quiz, dan planner SNBT siswa SMA",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
// =====================================================================
// MODUL SMART STUDY & TASK MANAGER (PRIORITAS CERDAS)
// =====================================================================

const taskForm = document.getElementById('taskForm');
const taskListContainer = document.getElementById('taskList');

// Mengambil data tugas dari LocalStorage browser
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 1. Fungsi Algoritma Penentuan Prioritas Cerdas
function calculatePriority(deadlineStr, difficulty) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return { score: 999, label: "TERLAMBAT 🚨", classBadge: "badge-tinggi", days: diffDays };
    }
    
    const weightTime = Math.max(1, 10 - diffDays);
    const score = (difficulty * 2) + weightTime;
    
    if (score >= 12 || diffDays <= 1) {
        return { score: score, label: "TINGGI (Mendesak) 🔥", classBadge: "badge-tinggi", days: diffDays };
    } else if (score >= 7) {
        return { score: score, label: "SEDANG ⚠️", classBadge: "badge-sedang", days: diffDays };
    } else {
        return { score: score, label: "RENDAH ☕", classBadge: "badge-rendah", days: diffDays };
    }
}

// 2. Fungsi Render & Auto-Sorting Berdasarkan Prioritas
function renderTasks() {
    if (!taskListContainer) return;
    taskListContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        taskListContainer.innerHTML = '<p class="text-muted" style="text-align: center; padding: 20px;">Belum ada tugas tercatat. Kerja bagus!</p>';
        return;
    }

    // Urutkan tugas otomatis dari prioritas tertinggi ke terendah
    tasks.sort((a, b) => {
        let pA = calculatePriority(a.tenggat, a.kesulitan).score;
        let pB = calculatePriority(b.tenggat, b.kesulitan).score;
        return pB - pA;
    });

    tasks.forEach((task, index) => {
        const priorityInfo = calculatePriority(task.tenggat, task.kesulitan);
        
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <div class="task-info">
                <h3>📖 ${task.mapel} - ${task.tugas}</h3>
                <p>📅 Deadline: ${task.tenggat} (${priorityInfo.days} hari lagi)</p>
                <p>⚡ Kesulitan: ${task.kesulitan}/5</p>
                <span class="badge-priority ${priorityInfo.classBadge}">Prioritas: ${priorityInfo.label}</span>
            </div>
            <div class="task-actions">
                <button class="btn-delete-task" onclick="deleteTask(${index})">Hapus</button>
            </div>
        `;
        taskListContainer.appendChild(taskCard);
    });

    // Sinkronisasi angka ke widget dashboard jika ada
    const dashTodoCount = document.getElementById('dashTodoCount');
    if (dashTodoCount) {
        dashTodoCount.textContent = tasks.length;
    }
}

// 3. Event Listener Form Submit
if (taskForm) {
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const mapel = document.getElementById('mapel').value;
        const tugas = document.getElementById('tugas').value;
        const tenggat = document.getElementById('tenggat').value;
        const kesulitan = parseInt(document.getElementById('kesulitan').value);
        
        const newTask = { mapel, tugas, tenggat, kesulitan };
        tasks.push(newTask);
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskForm.reset();
    });
}

// 4. Fungsi Hapus Tugas
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Jalankan render saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderTasks);
