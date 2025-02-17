import { Garden } from './garden.js';

// 记录页面打开时间
const startDate = new Date();

function updateElapsedTime() {
    const now = new Date();
    const elapsed = now - startDate;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const elapsedTimeElement = document.getElementById('elapsedTime');
    elapsedTimeElement.textContent = `已经注视着这颗心 ${days} 天 ${hours % 24} 小时 ${minutes % 60} 分钟 ${seconds % 60} 秒`;
}

// 音乐控制
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.3; // 设置音量为 30%
const musicControl = document.getElementById('musicControl');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicControl.classList.remove('play');
    } else {
        bgMusic.play().catch(() => {
            console.log('等待用户交互后自动播放音乐');
        });
        musicControl.classList.add('play');
    }
    isPlaying = !isPlaying;
}

// 将toggleMusic暴露给全局作用域
globalThis.toggleMusic = toggleMusic;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 更新时间
    updateElapsedTime();
    setInterval(updateElapsedTime, 1000);

    // 初始化花园
    const garden = new Garden('garden');
    garden.render();
});

// 点击页面任意位置播放音乐
document.addEventListener('click', () => {
    if (!isPlaying) {
        toggleMusic();
    }
}, { once: true }); 