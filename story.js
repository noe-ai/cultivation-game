const storySystem = {
    // 第一层：日常小确幸（按修炼方式分类）
    dailyEvents: {
        '打坐': [
            {
                text: "远处传来阵阵钟声，让你的心神格外宁静...",
                effect: "神识提升",
                spirit: 10
            },
            {
                text: "一缕阳光洒在你身上，温暖而不炙热...",
                effect: "修为提升",
                power: 15
            },
            {
                text: "一只蝴蝶落在你肩头，与你同享这份宁静...",
                effect: "双重提升",
                power: 10,
                spirit: 5
            },
            {
                text: "微风轻拂，带来远处青竹的沙沙声...",
                effect: "小有收获",
                power: 5
            },
            {
                text: "云层中透出一缕金光，恰好笼罩在你身上...",
                effect: "修为提升",
                power: 12
            },
            {
                text: "清晨的露珠滴落在草叶上，发出轻微的响声...",
                effect: "心神宁静",
                spirit: 8
            },
            {
                text: "你静静地感受着天地间流动的灵气...",
                effect: "稳步提升",
                power: 8
            }
        ],

        '习武': [
            {
                text: "一片树叶随风飘落，让你领悟了轻身之法...",
                effect: "体魄提升",
                strength: 10
            },
            {
                text: "看到竹子在风中摇曳，你明白了以柔克刚...",
                effect: "全面提升",
                power: 10,
                strength: 8
            },
            {
                text: "一群飞鸟掠过天际，让你想到了剑阵变化...",
                effect: "修为提升",
                power: 15
            },
            {
                text: "你专注地重复着招式，渐入佳境...",
                effect: "基础提升",
                power: 8
            },
            {
                text: "汗水滴落在地上，你依然沉浸在修炼中...",
                effect: "体魄增强",
                strength: 6
            },
            {
                text: "晨露打湿了衣衫，却丝毫不影响你的练习...",
                effect: "稳步提升",
                power: 7
            }
        ],

        '采药': [
            {
                text: "你发现了一株普通的药草，或许对修炼有帮助...",
                items: { '灵草': 1 }
            },
            {
                text: "山涧处有一簇不知名的灵芝，散发着淡淡药香...",
                items: { '灵草': 2 }
            },
            {
                text: "遇到一位采药老人，教了你一些辨药之法...",
                items: { '灵草': 1 },
                spirit: 5
            },
            {
                text: "你安静地寻找着药草的踪迹...",
                effect: "专注修炼",
                power: 5
            },
            {
                text: "清晨的露水打湿了草药的叶子...",
                effect: "继续搜寻",
                power: 3
            },
            {
                text: "一只小鸟叼来一片奇特的树叶...",
                items: { '灵草': 1 },
                spirit: 3
            },
            {
                text: "你在老树根下发现了几株珍贵的药草...",
                items: { '灵草': 2 }
            }
        ],

        '寻宝': [
            {
                text: "溪水冲刷下露出一块温润的玉石...",
                items: { '灵石': 1 }
            },
            {
                text: "一只小狐狸留下了一颗晶莹的珠子...",
                items: { '灵石': 2 }
            },
            {
                text: "雨后的泥土中闪烁着异样的光芒...",
                items: { '灵石': 3 }
            },
            {
                text: "你静静地探索着周围的环境...",
                effect: "专注搜寻",
                power: 4
            },
            {
                text: "山壁上的青苔下似乎藏着什么...",
                items: { '灵石': 1 },
                spirit: 2
            },
            {
                text: "一阵微风吹过，卷来一张古旧的符箓...",
                items: { '法器': 1 }
            },
            {
                text: "你在废弃的草庐中找到一个布满尘土的盒子...",
                items: { '丹药': 1 }
            }
        ]
    },

    // 第二层：特殊事件（随机触发，有特殊条件和奖励）
    specialEvents: [
        {
            id: 'whispers_wind',
            title: "风中絮语",
            condition: { level: '练气初期', spirit: 100 },
            text: `一阵异常的风拂过，带来若有若无的絮语声。你仔细聆听，似乎能分辨出几个断断续续的字句：
            
            "...秘境...月圆...三叩......"`,
            choices: [
                {
                    text: "凝神倾听",
                    risk: 0.5,
                    success: {
                        text: "你捕捉到了完整的信息：'月圆之夜，叩击古三下，自有玄机'",
                        reward: { 
                            spirit: 100,
                            description: "获得神秘指引"
                        }
                    },
                    failure: {
                        text: "风声渐弱，信息消散在风中...",
                        penalty: { spirit: -20 }
                    }
                },
                {
                    text: "记下感悟",
                    reward: { 
                        spirit: 30,
                        description: "留下一些灵感" 
                    }
                }
            ]
        },
        {
            id: 'ancient_reflection',
            title: "水中倒影",
            condition: { level: '练气中期', power: 600 },
            text: `在山涧打坐时，你无意中注意到水中的倒影有些异常。
            
            仔细观察，倒影中的你似乎在做着一个奇特的手势，与你当前的动作并不相同...`,
            choices: [
                {
                    text: "模仿倒影",
                    risk: 0.7,
                    success: {
                        text: "这个手势引动了周围的灵气，你似乎领悟到了一种新的修炼方式...",
                        reward: {
                            power: 300,
                            spirit: 100,
                            description: "领悟神秘手诀"
                        }
                    },
                    failure: {
                        text: "手势错误，灵气紊乱...",
                        penalty: { power: -100 }
                    }
                },
                {
                    text: "静心观察",
                    reward: {
                        spirit: 50,
                        description: "获得一些感悟"
                    }
                }
            ]
        },
        {
            id: 'resonating_stones',
            title: "石音共鸣",
            condition: { level: '练气后期', spirit: 800 },
            text: `两块平平无奇的山石，在你经过时忽然发出了微弱的共鸣声。
            
            仔细观察，石头表面似乎有些细微的路，是某种古老的符文...`,
            choices: [
                {
                    text: "尝试调和",
                    risk: 0.6,
                    success: {
                        text: "你成功让两块石头产生了强烈的共鸣，一股古老的传承涌入心神...",
                        reward: {
                            power: 500,
                            spirit: 200,
                            description: "获得远古传承"
                        }
                    },
                    failure: {
                        text: "共鸣失控，震荡伤及心神...",
                        penalty: { spirit: -100 }
                    }
                },
                {
                    text: "记录符文",
                    reward: {
                        spirit: 80,
                        description: "留下符文拓印"
                    }
                }
            ]
        },
        {
            id: 'moonlight_herb',
            title: "月华异草",
            condition: { level: '练气后期', power: 1200 },
            text: `月光如水的夜晚，你发现一株普通的草药在月光下若隐若现。
            
            仔细观察，这株草药似乎在随着月光的变化而改变着形态...`,
            choices: [
                {
                    text: "月光下采摘",
                    risk: 0.5,
                    success: {
                        text: "你在恰当的时机采下了草药，它散发出淡淡的月华之气...",
                        reward: {
                            items: { '灵草': 3 },
                            spirit: 150,
                            description: "获得月华草"
                        }
                    },
                    failure: {
                        text: "时机未到，草药化作月光消散...",
                        penalty: { spirit: -50 }
                    }
                },
                {
                    text: "观察变化",
                    reward: {
                        spirit: 60,
                        description: "领悟月华之理"
                    }
                }
            ]
        }
    ],

    // 第三层：主线剧情（只触发一次的重要剧情）
    mainStory: {
        'first_enlightenment': {
            scenes: [
                {
                    text: `"孩子，你可知道这山后有一株老梅树吗？"
                    
                    这是祖父生前最后一次与你说话。那时你只顾着为他熬药，随口应了一声。谁知这一应，竟成了永别。`,
                    choices: [
                        {
                            text: '寻找老梅',
                            nextScene: 1
                        },
                        {
                            text: '驻足回忆',
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: `月色下，老梅树依旧傲然挺立。树下的石头上似乎刻着什么字迹...
                    
                    走近一看，是祖父的笔迹："天地有道，草木有情。悟之者，得之。"`,
                    choices: [
                        {
                            text: '抚摸石刻',
                            nextScene: 2
                        },
                        {
                            text: '凝视老梅',
                            nextScene: 2
                        }
                    ]
                },
                {
                    text: `忽然，一阵清风拂过，老梅轻轻摇曳，几片梅花随风飘落。
                    
                    就在这一刻，你仿佛明白了什么。原来祖父说的"道"，一直都在眼前。`,
                    choices: [
                        {
                            text: '接住梅花',
                            reward: {
                                power: 50,
                                spirit: 20,
                                description: '你从老梅的坚韧中领悟了修行之道'
                            }
                        }
                    ]
                }
            ]
        },

        'qi_enlightenment': {
            scenes: [
                {
                    text: `山中采药时，你遇到一位受伤的老者。
                    
                    "小友，能否帮我采一株'碧玉草'？就在那悬崖边上..."`,
                    choices: [
                        {
                            text: '冒险采药',
                            nextScene: 1
                        },
                        {
                            text: '询问详情',
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: `悬崖边的碧玉草正在随风摇曳，你小心翼翼地靠近。
                    
                    突然，一阵狂风袭来，你一个踉跄...`,
                    choices: [
                        {
                            text: '奋力一搏',
                            nextScene: 2
                        },
                        {
                            text: '稳住身形',
                            nextScene: 2
                        }
                    ]
                },
                {
                    text: `千钧一发之际，体内灵力突然自行运转，形成一个完整的周天。
                    
                    你稳住身形，不仅采到了碧玉草，更踏入了练气境界！`,
                    choices: [
                        {
                            text: '回去救人',
                            reward: {
                                power: 100,
                                spirit: 50,
                                description: '你成功迈入练气境界，救人的执念让你突破了瓶颈'
                            }
                        }
                    ]
                }
            ]
        },

        'cave_discovery': {
            scenes: [
                {
                    text: `一场大雨过后，山体滑坡露出一个洞口。洞中隐约传来阵阵龙吟之声。
                    
                    "这声音..."老者的话在你脑海中响起，"或许就是他说的龙吟洞！"`,
                    choices: [
                        {
                            text: '进入探索',
                            nextScene: 1
                        },
                        {
                            text: '观察周围',
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: `洞中有一面石壁，上面刻着古老的壁画。画中一条龙盘旋在山间，似乎在守护着什么。
                    
                    龙吟声越来越近，石壁上的壁画竟然开始发光...`,
                    choices: [
                        {
                            text: '触摸壁画',
                            nextScene: 2
                        },
                        {
                            text: '凝神聆听',
                            nextScene: 2
                        }
                    ]
                },
                {
                    text: `一股磅礴的龙气涌入体内，你仿佛看到了远古时期的一幕：
                    
                    一条真龙在守护着这片山林，为了护佑苍生，它化作了这片大地的一部分...`,
                    choices: [
                        {
                            text: '承接龙气',
                            reward: {
                                power: 200,
                                strength: 100,
                                description: '你得到了远古真龙的一丝传承'
                            }
                        }
                    ]
                }
            ]
        },

        'master_meeting': {
            scenes: [
                {
                    text: `深夜，你在老梅树下打坐。忽然，一个声音传来：
                    
                    "那株碧玉草，救的可不是一个普通的老人啊..."`,
                    choices: [
                        {
                            text: '警惕戒备',
                            nextScene: 1
                        },
                        {
                            text: '平静回应',
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: `月光下，一位白发老者缓步走来。正是当日你救下的那位老人！
                    
                    "你的心性难得，若愿意，老夫可以教你一些东西..."`,
                    choices: [
                        {
                            text: '恭敬行礼',
                            nextScene: 2
                        },
                        {
                            text: '虚心求教',
                            nextScene: 2
                        }
                    ]
                },
                {
                    text: `老者取出一枚玉简："这是我毕生所学，今日传你。
                    
                    记住，修行之道，不在求全，但求无愧。"`,
                    choices: [
                        {
                            text: '接受传承',
                            reward: {
                                power: 300,
                                spirit: 150,
                                description: '你得到了老者的传承，修为大进'
                            }
                        }
                    ]
                }
            ]
        },

        'foundation_building': {
            scenes: [
                {
                    text: `深夜，你在老梅树下打坐。突然，树上落下一片梅花，恰好落在你的掌心。
                    
                    这一刻，你想起了祖父的话："天地有道，草木有情。"如今的你，似乎真正理解了这句话的含义。`,
                    choices: [
                        {
                            text: '凝视梅花',
                            nextScene: 1
                        },
                        {
                            text: '闭目感悟',
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: `梅花在掌心渐渐化作一缕清气，融入你的体内。
                    
                    刹那间，你仿佛看到了这株老梅从发芽、生长到开花的全过程，一切都在遵循着某种玄妙的规律...`,
                    choices: [
                        {
                            text: '顺应天机',
                            nextScene: 2
                        },
                        {
                            text: '把握规律',
                            nextScene: 2
                        }
                    ]
                },
                {
                    text: `你终于明白，修行不只是积累力量，更是对天地规律的理解与顺应。
                    
                    体内灵力开始自发运转，形成一个完整的小周天。这一刻，你的境界有了质的飞跃！`,
                    choices: [
                        {
                            text: '水到渠成',
                            reward: {
                                power: 500,
                                spirit: 200,
                                description: '你成功筑基，对天地大道有了更深的理解'
                            }
                        }
                    ]
                }
            ]
        },

        'golden_core': {
            scenes: [
                {
                    text: `多年过去，你已经成为了村里的守护者，就如同当年的祖父一样。
                    
                    这一日，你又一次来到老梅树下。老梅依旧傲然挺立，但你发现树下多了一个小女孩...`,
                    choices: [
                        {
                            text: '上前询问',
                            nextScene: 1
                        },
                        {
                            text: '静观其变',
                            nextScene: 1
                        }
                    ]
                },
                {
                    text: `"叔叔，我想学医。"小女孩怯生生地说，"我想治好生病的爷爷..."
                    
                    这一刻，恍若时光倒流，你仿佛看到了当年的自己。`,
                    choices: [
                        {
                            text: '收她为徒',
                            nextScene: 2
                        },
                        {
                            text: '指点迷津',
                            nextScene: 2
                        }
                    ]
                },
                {
                    text: `"天地有道，草木有情。"你轻声说出这句话，就像当年祖父教导你一样。
                    
                    一瞬间，你感觉体内灵力产生了某种质变。原来不知不觉间，你已经走出了自己的道...`,
                    choices: [
                        {
                            text: '道心永恒',
                            reward: {
                                power: 1000,
                                spirit: 500,
                                description: '你凝结金丹，传承道统'
                            }
                        }
                    ]
                }
            ]
        }
    }
};

// 导出故事系统
// export { storySystem };