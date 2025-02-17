// deno-lint-ignore-file
export class Garden {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.love = [];
        this.hearts = [];
        this.scale = 1;
        this.baseSize = 10;
        this.score = 0;
        this.isPlaying = false;
        this.maxHearts = 10;
        
        // 调整画布大小
        this.resize();
        globalThis.addEventListener('resize', () => {
            this.resize();
            this.init();
        });
        
        // 初始化游戏
        this.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isPlaying) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.checkHeartCollision(x, y);
        });

        document.getElementById('startButton').addEventListener('click', () => {
            document.getElementById('gameStart').classList.add('hidden');
            this.startGame();
        });

        document.getElementById('showMessage').addEventListener('click', () => {
            document.getElementById('gameWin').classList.add('hidden');
            document.getElementById('words').classList.remove('hidden');
        });
    }

    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.updateScore();
        this.spawnHeart();
    }

    spawnHeart() {
        if (!this.isPlaying) return;
        
        const heart = {
            x: Math.random() * (this.width - 40) + 20,
            y: -30,
            speed: Math.random() * 2 + 1,
            rotation: Math.random() * 360,
            size: Math.random() * 10 + 20
        };
        
        this.hearts.push(heart);
        
        // 设置下一个心形生成的时间
        const nextSpawnTime = Math.random() * 2000 + 1000;
        setTimeout(() => this.spawnHeart(), nextSpawnTime);
    }

    checkHeartCollision(mouseX, mouseY) {
        this.hearts = this.hearts.filter(heart => {
            const distance = Math.sqrt(
                Math.pow(mouseX - heart.x, 2) + 
                Math.pow(mouseY - heart.y, 2)
            );
            
            if (distance < heart.size) {
                this.collectHeart();
                return false;
            }
            return true;
        });
    }

    collectHeart() {
        this.score++;
        this.updateScore();
        
        if (this.score >= this.maxHearts) {
            this.gameWin();
        }
    }

    updateScore() {
        document.getElementById('heartCount').textContent = this.score;
    }

    gameWin() {
        this.isPlaying = false;
        document.getElementById('gameWin').classList.remove('hidden');
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.scale = Math.min(this.width, this.height) / 800;
    }

    init() {
        this.particles = [];
        this.love = [];
        this.hearts = [];

        // 创建心形轨迹点
        for (let angle = 0; angle < 2 * Math.PI; angle += 0.1) {
            const x = 16 * Math.pow(Math.sin(angle), 3);
            const y = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
            this.love.push({
                x: this.width / 2 + x * this.baseSize * this.scale,
                y: this.height / 2 + y * this.baseSize * this.scale
            });
        }

        const particleCount = Math.floor((this.width * this.height) / 10000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 * this.scale + 1,
                speedX: (Math.random() - 0.5) * 2 * this.scale,
                speedY: (Math.random() - 0.5) * 2 * this.scale,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const hue = Math.random() * 60 + 330; // 粉色到紫色的范围
        const saturation = 80 + Math.random() * 20;
        const lightness = 50 + Math.random() * 10;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    drawHeart() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.love[0].x, this.love[0].y);
        
        for (let i = 1; i < this.love.length; i++) {
            const xc = (this.love[i].x + this.love[i - 1].x) / 2;
            const yc = (this.love[i].y + this.love[i - 1].y) / 2;
            this.ctx.quadraticCurveTo(this.love[i - 1].x, this.love[i - 1].y, xc, yc);
        }
        
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.lineWidth = 2 * this.scale;
        this.ctx.stroke();
        
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        this.ctx.fill();
    }

    updateParticles() {
        for (let p of this.particles) {
            p.x += p.speedX;
            p.y += p.speedY;

            const buffer = p.size * 2;
            if (p.x < -buffer) p.x = this.width + buffer;
            if (p.x > this.width + buffer) p.x = -buffer;
            if (p.y < -buffer) p.y = this.height + buffer;
            if (p.y > this.height + buffer) p.y = -buffer;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
            gradient.addColorStop(0, p.color.replace(')', ', 0.3)'));
            gradient.addColorStop(1, p.color.replace(')', ', 0)'));
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }

    updateHearts() {
        this.hearts = this.hearts.filter(heart => {
            heart.y += heart.speed;
            heart.rotation += 2;
            
            // 绘制爱心
            this.ctx.save();
            this.ctx.translate(heart.x, heart.y);
            this.ctx.rotate(heart.rotation * Math.PI / 180);
            
            this.ctx.beginPath();
            this.ctx.font = `${heart.size}px Arial`;
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('❤', 0, 0);
            
            this.ctx.restore();
            
            return heart.y < this.height + 30;
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawHeart();
        this.updateParticles();
        this.updateHearts();
        requestAnimationFrame(() => this.render());
    }
} 