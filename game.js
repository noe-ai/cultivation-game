class Game {
    constructor() {
        this.power = 0;
        this.level = '凡人';
        this.unlockedStories = new Set();
        this.dailyActivities = [
            { 
                name: '打坐', 
                power: 1, 
                gains: { spirit: 1 },
                description: '提升修为和神识'
            },
            { 
                name: '习武', 
                power: 1.2, 
                gains: { strength: 1 },
                description: '提升修为和体魄'
            },
            { 
                name: '采药', 
                power: 1, 
                gains: { items: { '灵草': 0.1 } },
                description: '提升修为，有机会获得灵草'
            },
            { 
                name: '寻宝', 
                power: 0.8, 
                gains: { items: { '灵石': 0.1 } },
                description: '提升修为，有机会获得灵石'
            }
        ];
        this.currentActivity = this.dailyActivities[0];
        this.spirit = 0;    // 神识
        this.strength = 0;  // 体魄
        this.endurance = 0; // 耐力
        
        this.levels = [
            {name: '凡人', threshold: 0, story: 'first_enlightenment'},
            {name: '练气初期', threshold: 100, story: 'qi_enlightenment'},
            {name: '练气中期', threshold: 500, story: 'cave_discovery'},
            {name: '练气后期', threshold: 1000, story: 'master_meeting'},
            {name: '筑基期', threshold: 5000, story: 'foundation_building'},
            {name: '金丹期', threshold: 10000, story: 'golden_core'}
        ];
        
        // 修改背包系统，添加物品效果
        this.inventory = {
            '灵石': {
                count: 0,
                effect: '直接获得100点修为',
                use: () => {
                    this.power += 100;
                    return '使用灵石，修为+100';
                }
            },
            '丹药': {
                count: 0,
                effect: '提升修炼效率50%，持续300秒',
                use: () => {
                    const originalPower = this.currentActivity.power;
                    this.currentActivity.power *= 1.5;
                    setTimeout(() => {
                        this.currentActivity.power = originalPower;
                        this.showMessage('丹药效果已消失');
                    }, 300000);
                    return '服用丹药，效率提升50%';
                }
            },
            '灵草': {
                count: 0,
                effect: '提升体魄和神识各10点',
                use: () => {
                    this.spirit += 10;
                    this.strength += 10;
                    return '使用灵草，体魄和神识各+10';
                }
            },
            '法器': {
                count: 0,
                effect: '永久提升修炼效率10%',
                use: () => {
                    this.currentActivity.power *= 1.1;
                    return '使用法器，永久提升修炼效率10%';
                }
            }
        };
        
        this.totalItems = 0;
        
        // 将成就系统改为章节系统
        this.chapters = {
            '第一章 - 药师之约': {
                description: '村里的老药师待你如亲孙，教你认药采药。这日他重病在床，你暗自发誓一定要找到传说中的"续命草"。',
                unlocked: false,
                condition: { power: 0 }
            },
            '第二章 - 山野遇友': {
                description: '寻药途中，你救下一位受伤的少年。他为报恩执意同行，说这山中机缘险恶，一个人太危险。',
                unlocked: false,
                condition: { power: 100 }
            },
            '第三章 - 江湖恩义': {
                description: '一场山洪中，你们救下了一队商队。领队是位江湖豪侠，说江湖上素闻续命草的下落。',
                unlocked: false,
                condition: { power: 500 }
            },
            '第四章 - 抉择之路': {
                description: '终于寻得续命草，却发现只剩最后一株。此时，少年的亲人病情也在恶化。',
                unlocked: false,
                condition: { power: 1000 }
            },
            '第五章 - 山野传说': {
                description: '一位游方道人说，在这片山林深处，住着一位隐世的老医仙。他或许知道续命草的培育之法。',
                unlocked: false,
                condition: { power: 5000 }
            },
            '第六章 - 归程': {
                description: '学得培育之法，你带着续命草和满满的收获踏上归程。',
                unlocked: false,
                condition: { power: 10000 }
            }
        };
        
        // 添加被动系统相关属性
        this.clickCount = 0;          // 总点击次数
        this.passiveUnlocked = false; // 是否解锁被动增长
        this.passiveRate = 0;         // 被动增长率
        this.passiveInterval = null;  // 被动增长定时器
        
        // 改进被动探索系统
        this.exploreSystem = {
            // 不同场景的事件
            scenes: {
                '山林': {
                    events: [
                        {
                            text: "一只灵兔从你脚边跃过，留下了一株发光的灵草...",
                            rewards: [
                                { type: 'item', item: '灵草', chance: 0.8 },
                                { type: 'power', value: 10, chance: 0.2 }
                            ]
                        },
                        {
                            text: "你发现了一处灵气充沛的洞穴，适合打坐修炼...",
                            rewards: [
                                { type: 'power', value: 20, chance: 0.6 },
                                { type: 'spirit', value: 2, chance: 0.4 }
                            ]
                        }
                    ]
                },
                '溪边': {
                    events: [
                        {
                            text: "溪水冲刷下露出一块温润的玉石...",
                            rewards: [
                                { type: 'item', item: '灵石', chance: 0.7 },
                                { type: 'power', value: 15, chance: 0.3 }
                            ]
                        },
                        {
                            text: "一缕清泉灵气钻入体内，让你顿感神清气爽...",
                            rewards: [
                                { type: 'spirit', value: 3, chance: 0.5 },
                                { type: 'strength', value: 2, chance: 0.5 }
                            ]
                        }
                    ]
                }
            },
            
            // 当前场景
            currentScene: '山林',
            
            // 场景切换冷却时间（分钟）
            sceneCooldown: 30,
            lastSceneChange: Date.now()
        };
        
        // 消息队列系统
        this.messageQueue = [];
        this.messageDisplayTime = 5000; // 消息显示时间（毫秒）
        
        // 添加故事记录
        this.storyHistory = {
            daily: [],
            special: [],
            main: []
        };
        
        this.isStoryLocked = false; // 添加故事锁定状态
        
        this.init();
    }
    
    init() {
        document.getElementById('cultivate').addEventListener('click', (e) => {
            this.cultivate();
            this.showClickPower(e);
        });
        
        document.getElementById('cultivation-method').addEventListener('click', () => this.changeActivity());
        document.getElementById('inventory').addEventListener('click', () => this.showInventory());
        document.getElementById('achievements').addEventListener('click', () => this.showAchievements());
        
        setInterval(() => this.checkRandomEvent(), 30000);
        this.updateUI();
        this.showDailyActivity();
        
        // 启动被动探索
        setInterval(() => this.passiveExplore(), 60000); // 每分钟触发一次被动探索
        
        // 检查是否已解锁被动增长
        this.checkPassiveUnlock();
        
        // 添加标签页切换事件
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchStoryTab(btn.dataset.tab));
        });
        
        // 设置初始修炼按钮文本
        document.getElementById('cultivate').textContent = 
            `开始${this.currentActivity.name}`;
    }
    
    showClickPower(e) {
        const power = document.getElementById('click-power');
        power.textContent = `+${this.currentActivity.power}`;
        power.style.left = `${e.clientX}px`;
        power.style.top = `${e.clientY}px`;
        power.classList.remove('active');
        void power.offsetWidth; // 触发重绘
        power.classList.add('active');
    }
    
    cultivate() {
        if (this.isStoryLocked) {
            this.showMessage("请先完成当前剧情选择...");
            return;
        }

        this.clickCount++;
        this.power += this.currentActivity.power;
        
        // 切换按钮文本
        const cultivateBtn = document.getElementById('cultivate');
        if (cultivateBtn.textContent.startsWith('开始')) {
            cultivateBtn.textContent = `停止${this.currentActivity.name}`;
        } else {
            cultivateBtn.textContent = `开始${this.currentActivity.name}`;
        }
        
        // 增加日常事件触发概率到 20%
        if (Math.random() < 0.2) {
            // 直接从 storySystem 获取事件
            const events = storySystem.dailyEvents[this.currentActivity.name];
            if (events && events.length > 0) {
                // 随机选择一个事件
                const event = events[Math.floor(Math.random() * events.length)];
                
                // 清空并显示新事件
                const storyContent = document.getElementById('story-content');
                storyContent.innerHTML = '';
                
                // 创建事件显示元素
                const eventDiv = document.createElement('div');
                eventDiv.className = 'story-event daily';
                eventDiv.innerHTML = `<div class="story-text">${event.text}</div>`;
                storyContent.appendChild(eventDiv);
                
                // 处理事件奖励
                if (event.power || event.spirit || event.strength || event.items) {
                    let rewards = [];
                    if (event.power) {
                        this.power += event.power;
                        rewards.push(`修为 +${event.power}`);
                    }
                    if (event.spirit) {
                        this.spirit += event.spirit;
                        rewards.push(`神识 +${event.spirit}`);
                    }
                    if (event.strength) {
                        this.strength += event.strength;
                        rewards.push(`体魄 +${event.strength}`);
                    }
                    if (event.items) {
                        Object.entries(event.items).forEach(([item, count]) => {
                            this.inventory[item].count += count;
                            rewards.push(`${item} +${count}`);
                        });
                    }
                    
                    // 显示奖励信息
                    if (rewards.length > 0) {
                        setTimeout(() => {
                            const rewardDiv = document.createElement('div');
                            rewardDiv.className = 'story-event reward';
                            rewardDiv.innerHTML = `<div class="story-text">获得：${rewards.join('，')}</div>`;
                            storyContent.appendChild(rewardDiv);
                        }, 1000);
                    }
                }
            }
        }
        
        this.checkLevelUp();
        this.checkChapterUnlock();
        this.updateUI();
    }
    
    changeActivity() {
        const currentIndex = this.dailyActivities.indexOf(this.currentActivity);
        const nextIndex = (currentIndex + 1) % this.dailyActivities.length;
        this.currentActivity = this.dailyActivities[nextIndex];
        
        // 更新修炼按钮文本为当前修炼方式名称
        document.getElementById('cultivate').textContent = 
            `开始${this.currentActivity.name}`;
        
        // 更新界面
        this.updateUI();
        
        // 更新被动增长率
        if (this.passiveUnlocked) {
            this.passiveRate = this.currentActivity.power * 0.3;
        }
    }
    
    showDailyActivity() {
        // 清空故事内容面板，为事件消息做准备
        document.getElementById('story-content').innerHTML = '';
        document.getElementById('choices').innerHTML = '';
    }
    
    getNextLevel() {
        if (this.power >= this.levels[this.levels.length - 1].threshold) {
            return {
                name: '大乘期',
                threshold: Infinity
            };
        }
        
        for (let level of this.levels) {
            if (level.threshold > this.power) {
                return level;
            }
        }
        return this.levels[this.levels.length - 1];
    }
    
    checkRandomEvent() {
        if (Math.random() < 0.3) { // 30%概率触发随机事件
            const randomEvents = [
                "在修炼时，一只蝴蝶落在你的肩头，似乎被你的气息吸引...",
                "远处传来阵阵钟声，让你的心神格外宁静...",
                "一阵清风拂过，带来了一丝特殊的灵气...",
                "你发现了一株普通的药草，或许对修炼有帮助...",
                "天空中过一朵五彩祥云，你若有所悟..."
            ];
            const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
            this.showMessage(event);
        }
    }
    
    // 修改 showMessage 方法
    showMessage(message, type = 'daily') {
        const storyContent = document.getElementById('story-content');
        const div = document.createElement('div');
        div.className = `story-event ${type}`;
        div.innerHTML = `<div class="story-text">${message}</div>`;
        
        // 将新消息插入到顶部
        if (storyContent.firstChild) {
            storyContent.insertBefore(div, storyContent.firstChild);
        } else {
            storyContent.appendChild(div);
        }
    }
    
    checkLevelUp() {
        let levelChanged = false;
        
        // 从低到高检查境界
        for (let level of this.levels) {
            if (this.power >= level.threshold && this.level !== level.name) {
                levelChanged = true;
                this.level = level.name;
                // 只在首次达到该境界时显示突破剧情
                if (!this.unlockedStories.has(level.story)) {
                    this.showBreakthroughStory(level.story);
                }
            }
        }
        
        // 如果界发生变化，更新UI
        if (levelChanged) {
            this.updateUI();
        }
    }
    
    showBreakthroughStory(storyId) {
        if (this.unlockedStories.has(storyId)) return;
        
        const story = storySystem.mainStory[storyId];
        if (!story) return;
        
        // 锁定修炼
        this.isStoryLocked = true;
        
        // 从第一个场景开始
        this.showStoryScene(story, 0);
    }

    showStoryScene(story, sceneIndex) {
        const scene = story.scenes[sceneIndex];
        if (!scene) return;
        
        // 显示场景内容
        const storyContent = document.getElementById('story-content');
        storyContent.innerHTML = '';
        
        const storyDiv = document.createElement('div');
        storyDiv.className = 'story-event main';
        storyDiv.innerHTML = `<div class="story-text">${scene.text}</div>`;
        storyContent.appendChild(storyDiv);
        
        // 显示选项
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        
        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.onclick = () => {
                if (choice.nextScene !== undefined) {
                    // 继续下一个场景
                    this.showStoryScene(story, choice.nextScene);
                } else {
                    // 最后一个场景，处理奖励并结束剧情
                    this.makeChoice(choice);
                    this.isStoryLocked = false;
                    choicesDiv.innerHTML = '';
                }
            };
            choicesDiv.appendChild(button);
        });
    }
    
    makeChoice(choice) {
        // 处理奖励
        if (choice.reward) {
            // 应用属性奖励
            if (choice.reward.power) this.power += choice.reward.power;
            if (choice.reward.spirit) this.spirit += choice.reward.spirit;
            if (choice.reward.strength) this.strength += choice.reward.strength;
            
            // 显示奖励描述
            const rewardDiv = document.createElement('div');
            rewardDiv.className = 'story-event reward';
            rewardDiv.innerHTML = `<div class="story-text">${choice.reward.description}</div>`;
            document.getElementById('story-content').appendChild(rewardDiv);
        }
        
        // 解锁修炼（重要！）
        this.isStoryLocked = false;
        
        // 清空选项
        document.getElementById('choices').innerHTML = '';
        
        // 更新界面
        this.updateUI();
        
        // 延迟一会后恢复日常界面
        setTimeout(() => {
            this.showDailyActivity();
        }, 3000);
    }
    
    updateUI() {
        // 更新基础属性
        document.getElementById('power').textContent = Math.floor(this.power);
        document.getElementById('spirit').textContent = Math.floor(this.spirit);
        document.getElementById('strength').textContent = Math.floor(this.strength);
        
        // 更新境界信息
        document.getElementById('level').textContent = this.level;
        const nextLevel = this.getNextLevel();
        document.getElementById('next-level').textContent = 
            nextLevel.threshold === Infinity ? '已达最高' : nextLevel.name;
        
        // 更新修炼方式信息
        document.getElementById('current-method').textContent = this.currentActivity.name;
        document.getElementById('gain-power').textContent = this.currentActivity.power.toFixed(1);
        
        // 更新神识/体魄增益信息（如果有的话）
        if (this.currentActivity.gains?.spirit) {
            document.getElementById('gain-spirit').textContent = this.currentActivity.gains.spirit;
            document.getElementById('gain-spirit').parentElement.style.display = 'block';
        } else {
            document.getElementById('gain-spirit').parentElement.style.display = 'none';
        }
        
        if (this.currentActivity.gains?.strength) {
            document.getElementById('gain-strength').textContent = this.currentActivity.gains.strength;
            document.getElementById('gain-strength').parentElement.style.display = 'block';
        } else {
            document.getElementById('gain-strength').parentElement.style.display = 'none';
        }
        
        // 更新被动修炼信息
        if (this.passiveUnlocked) {
            document.getElementById('passive-info').textContent = 
                `被动获得 ${this.passiveRate.toFixed(1)}/秒`;
        } else {
            document.getElementById('clicks-to-passive').textContent = 
                Math.max(0, 100 - this.clickCount);
        }
        
        // 更新其他信息
        this.totalItems = Object.values(this.inventory).reduce((sum, item) => sum + item.count, 0);
        document.getElementById('item-count').textContent = this.totalItems;
        document.getElementById('achievement-count').textContent = 
            Object.values(this.chapters).filter(chapter => chapter.unlocked).length;
    }
    
    showInventory() {
        const content = document.getElementById('story-content');
        const choices = document.getElementById('choices');
        
        content.innerHTML = '<div class="story-event">【背包】</div>';
        choices.innerHTML = '';
        
        Object.entries(this.inventory).forEach(([item, data]) => {
            if (data.count > 0) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'story-event';
                itemDiv.innerHTML = `
                    <div class="story-text">${item} x${data.count}</div>
                    <div class="story-text">${data.effect}</div>
                `;
                content.appendChild(itemDiv);
                
                const button = document.createElement('button');
                button.textContent = `使用${item}`;
                button.onclick = () => this.useItem(item);
                choices.appendChild(button);
            }
        });
        
        // 添加返回按钮
        const backButton = document.createElement('button');
        backButton.textContent = '返回';
        backButton.onclick = () => this.showDailyActivity();
        choices.appendChild(backButton);
    }
    
    useItem(itemName) {
        const item = this.inventory[itemName];
        if (item.count > 0) {
            item.count--;
            const message = item.use();
            this.showMessage(message);
            this.updateUI();
            
            // 如果物品用完了，刷新背包显示
            if (item.count === 0) {
                setTimeout(() => this.showInventory(), 3000);
            }
        }
    }
    
    // 修改显示成就的方法为���示章节
    showAchievements() {
        const content = document.getElementById('story-content');
        const choices = document.getElementById('choices');
        
        content.innerHTML = '<div class="story-event">【修仙之路】</div>';
        choices.innerHTML = '';
        
        Object.entries(this.chapters).forEach(([title, chapter]) => {
            const chapterDiv = document.createElement('div');
            chapterDiv.className = `story-event ${chapter.unlocked ? 'unlocked' : 'locked'}`;
            chapterDiv.innerHTML = `
                <div class="story-text">${title} ${chapter.unlocked ? '✓' : ''}</div>
                <div class="story-text">${chapter.description}</div>
            `;
            content.appendChild(chapterDiv);
        });
        
        // 添加返回按钮
        const backButton = document.createElement('button');
        backButton.textContent = '返回';
        backButton.onclick = () => this.showDailyActivity();
        choices.appendChild(backButton);
    }
    
    // 检查章节解锁
    checkChapterUnlock() {
        const currentChapter = chapterSystem.getCurrentChapter(this.power);
        
        // 更新章节标题栏
        document.getElementById('chapter-title').textContent = currentChapter.title;
        document.getElementById('chapter-desc').textContent = currentChapter.description;
    }
    
    checkPassiveUnlock() {
        if (!this.passiveUnlocked && this.clickCount >= 100) {
            this.passiveUnlocked = true;
            // 修改为点击收益的30%
            this.passiveRate = this.currentActivity.power * 0.3;
            this.showMessage("你的勤奋修炼让你领悟到了自动修炼之法！");
            
            // 启动被动增长
            this.passiveInterval = setInterval(() => {
                this.power += this.passiveRate;
                this.updateUI();
            }, 1000);
        }
    }
    
    // 改进被动探索方法
    passiveExplore() {
        // 检查是应该切换场景
        this.checkSceneChange();
        
        // 获取当前场景的事件
        const scene = this.exploreSystem.scenes[this.exploreSystem.currentScene];
        if (!scene) return;
        
        // 30%概率触发事件
        if (Math.random() < 0.3) {
            const event = scene.events[Math.floor(Math.random() * scene.events.length)];
            
            // 处理奖励
            let rewardText = [];
            event.rewards.forEach(reward => {
                if (Math.random() < reward.chance) {
                    switch (reward.type) {
                        case 'power':
                            this.power += reward.value;
                            rewardText.push(`获得${reward.value}点修为`);
                            break;
                        case 'spirit':
                            this.spirit += reward.value;
                            rewardText.push(`神识+${reward.value}`);
                            break;
                        case 'strength':
                            this.strength += reward.value;
                            rewardText.push(`体魄+${reward.value}`);
                            break;
                        case 'item':
                            if (this.inventory[reward.item]) {
                                this.inventory[reward.item].count++;
                                rewardText.push(`获得${reward.item}`);
                            }
                            break;
                    }
                }
            });
            
            if (rewardText.length > 0) {
                this.showMessage(`在${this.exploreSystem.currentScene}：${event.text}\n${rewardText.join('，')}`);
                this.updateUI();
            }
        }
    }
    
    // 检查场景切换
    checkSceneChange() {
        const now = Date.now();
        if (now - this.exploreSystem.lastSceneChange >= this.exploreSystem.sceneCooldown * 60000) {
            const scenes = Object.keys(this.exploreSystem.scenes);
            let newScene;
            do {
                newScene = scenes[Math.floor(Math.random() * scenes.length)];
            } while (newScene === this.exploreSystem.currentScene);
            
            this.exploreSystem.currentScene = newScene;
            this.exploreSystem.lastSceneChange = now;
            
            this.showMessage(`你来到了${newScene}...`);
        }
    }
    
    // 消息队列管理
    addToMessageQueue(message) {
        this.messageQueue.push({
            text: message,
            time: Date.now()
        });
        this.displayMessages();
    }
    
    displayMessages() {
        const content = document.getElementById('story-content');
        const now = Date.now();
        
        // 清理过期消息
        this.messageQueue = this.messageQueue.filter(msg => 
            now - msg.time < this.messageDisplayTime
        );
        
        // 显示最新的几条消息
        if (this.messageQueue.length > 0) {
            let messages = this.messageQueue
                .map(msg => msg.text)
                .join('\n\n');
                
            content.innerHTML = messages;
            
            // 自滚动到底部
            content.scrollTop = content.scrollHeight;
        } else {
            this.showDailyActivity(); // 如果没有消息，显示常规界面
        }
    }

    // 修改 handleDailyEvent 方法
    handleDailyEvent() {
        const events = storySystem.dailyEvents[this.currentActivity.name];
        if (!events) return;

        const event = events[Math.floor(Math.random() * events.length)];
        
        // 清空之前的内容，显示新的日常事件
        const storyContent = document.getElementById('story-content');
        storyContent.innerHTML = '';
        
        // 创建并显示事件描述
        const eventDiv = document.createElement('div');
        eventDiv.className = 'story-event daily';
        eventDiv.innerHTML = `<div class="story-text">${event.text}</div>`;
        storyContent.appendChild(eventDiv);

        // 处理奖励
        if (event.power || event.spirit || event.strength || event.items) {
            let rewards = [];
            if (event.power) {
                this.power += event.power;
                rewards.push(`修为 +${event.power}`);
            }
            if (event.spirit) {
                this.spirit += event.spirit;
                rewards.push(`神识 +${event.spirit}`);
            }
            if (event.strength) {
                this.strength += event.strength;
                rewards.push(`体魄 +${event.strength}`);
            }
            if (event.items) {
                Object.entries(event.items).forEach(([item, count]) => {
                    this.inventory[item].count += count;
                    rewards.push(`${item} +${count}`);
                });
            }
            
            if (rewards.length > 0) {
                setTimeout(() => {
                    const rewardDiv = document.createElement('div');
                    rewardDiv.className = 'story-event reward';
                    rewardDiv.innerHTML = `<div class="story-text">获得：${rewards.join('，')}</div>`;
                    storyContent.appendChild(rewardDiv);
                }, 1000); // 延迟显示奖励信息
            }
        }
        
        this.updateUI();
    }

    // 检查和触发特殊事件
    checkSpecialEvents() {
        storySystem.specialEvents.forEach(event => {
            if (!this.unlockedStories.has(event.id) && this.meetCondition(event.condition)) {
                if (Math.random() < 0.1) { // 10%触发概率
                    this.triggerSpecialEvent(event);
                }
            }
        });
    }

    meetCondition(condition) {
        if (!condition) return true;
        return (!condition.level || this.level === condition.level) &&
               (!condition.power || this.power >= condition.power) &&
               (!condition.spirit || this.spirit >= condition.spirit);
    }

    // 处理特殊事件
    triggerSpecialEvent(event) {
        // 清空之前的内容
        const storyContent = document.getElementById('story-content');
        storyContent.innerHTML = '';
        
        // 创建并显示事件描述
        const eventDiv = document.createElement('div');
        eventDiv.className = 'story-event special';
        eventDiv.innerHTML = `
            <div class="story-text">【${event.title}】</div>
            <div class="story-text">${event.text}</div>
        `;
        storyContent.appendChild(eventDiv);
        
        // 显示选项
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        
        event.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.onclick = () => this.makeSpecialChoice(choice, event);
            choicesDiv.appendChild(button);
        });
    }

    // 修改 makeSpecialChoice 方法
    makeSpecialChoice(choice, event) {
        const storyContent = document.getElementById('story-content');
        const choicesDiv = document.getElementById('choices');
        
        // 清空选项
        choicesDiv.innerHTML = '';
        
        if (choice.risk && Math.random() < choice.risk) {
            // 失败结果
            const failureDiv = document.createElement('div');
            failureDiv.className = 'story-event special';
            failureDiv.innerHTML = `<div class="story-text">${choice.failure.text}</div>`;
            storyContent.appendChild(failureDiv);
            
            // 应用惩罚
            if (choice.failure.penalty) {
                Object.entries(choice.failure.penalty).forEach(([attr, value]) => {
                    this[attr] += value;
                    const penaltyDiv = document.createElement('div');
                    penaltyDiv.className = 'story-event special';
                    penaltyDiv.innerHTML = `<div class="story-text">${attr} ${value > 0 ? '+' : ''}${value}</div>`;
                    storyContent.appendChild(penaltyDiv);
                });
            }
        } else {
            // 成功结果
            if (choice.success) {
                const successDiv = document.createElement('div');
                successDiv.className = 'story-event special';
                successDiv.innerHTML = `<div class="story-text">${choice.success.text}</div>`;
                storyContent.appendChild(successDiv);
                
                // 应用奖励
                if (choice.success.reward) {
                    Object.entries(choice.success.reward).forEach(([attr, value]) => {
                        if (attr !== 'description') {
                            this[attr] += value;
                            const rewardDiv = document.createElement('div');
                            rewardDiv.className = 'story-event reward';
                            rewardDiv.innerHTML = `<div class="story-text">${attr} +${value}</div>`;
                            storyContent.appendChild(rewardDiv);
                        }
                    });
                }
            }
        }
        
        this.updateUI();
    }

    // 切换故事标签页
    switchStoryTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        this.showStoryHistory(tab);
    }

    // 显示故事历史
    showStoryHistory(type) {
        const content = document.getElementById('story-content');
        content.innerHTML = '';
        
        this.storyHistory[type].slice().reverse().forEach(story => {
            const div = document.createElement('div');
            div.className = `story-event ${type}`;
            div.innerHTML = `
                <div class="story-time">${story.time}</div>
                <div class="story-text">${story.text}</div>
                ${story.reward ? `<div class="story-reward">${story.reward}</div>` : ''}
            `;
            content.appendChild(div);
        });
    }

    // 添加故事记录
    addStoryRecord(type, text, reward = null) {
        const story = {
            time: new Date().toLocaleString(),
            text,
            reward
        };
        
        this.storyHistory[type].push(story);
        
        // 如果当前正在显示该类型的故事，则更新显示
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        if (activeTab === type) {
            this.showStoryHistory(type);
        }
    }
}

window.onload = () => new Game(); 