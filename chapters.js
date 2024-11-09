const chapterSystem = {
    chapters: [
        {
            title: "第一章 - 初入修行",
            description: "你开始踏上修行之路，一切都充满未知...",
            condition: { power: 0 }
        },
        {
            title: "第二章 - 老梅寻道",
            description: "祖父留下的老梅树，似乎蕴含着不为人知的秘密...",
            condition: { power: 100 }
        },
        {
            title: "第三章 - 碧玉奇缘",
            description: "悬崖边的碧玉草，是机缘还是劫难？",
            condition: { power: 500 }
        },
        {
            title: "第四章 - 龙吟古洞",
            description: "雨后的山洞中传来阵阵龙吟之声...",
            condition: { power: 1000 }
        },
        {
            title: "第五章 - 道心初现",
            description: "经历种种，你的道心渐渐明晰...",
            condition: { power: 5000 }
        },
        {
            title: "第六章 - 传承有道",
            description: "一切都在冥冥中自有安排...",
            condition: { power: 10000 }
        }
    ],

    getCurrentChapter(power) {
        for (let i = this.chapters.length - 1; i >= 0; i--) {
            if (power >= this.chapters[i].condition.power) {
                return this.chapters[i];
            }
        }
        return this.chapters[0];
    }
}; 