import yangtzeBackground from '@/assets/images/basins/yangtze-river-background.webp';
import pearlBackground from '@/assets/images/basins/pearl-river-background-v3.webp';
import dolphinPoster from '@/assets/images/interactions/chinese-white-dolphin-home-1920x1080.jpg';
import { yangtzeRiverNodes } from '@/data/yangtzeRiverNodes';
import { yangtzeRiverRegions } from '@/data/yangtzeRiverRegions';
import { pearlRiverNodes } from '@/data/pearlRiverNodes';
import { pearlRiverRegions } from '@/data/pearlRiverRegions';
import type { BasinNarrativeConfig, BasinStorySection } from '@/types/basinStory';

function nodeSections(nodeId: string, reflection: string): BasinStorySection[] {
  const node = [...yangtzeRiverNodes, ...pearlRiverNodes].find((candidate) => candidate.id === nodeId);
  return [
    { id: 'background', label: '背景介绍', paragraphs: [node?.locationDescription ?? '这段流域资料正在整理。', node?.summary ?? '从一处生态变化，观察整条河流的响应。'] },
    { id: 'problem', label: '问题剖析', paragraphs: [node?.problemDescription ?? '河流中的变化会沿水系传递，不能只看单一地点。'], points: node?.causes },
    { id: 'governance', label: '怎样治理', paragraphs: ['治理从识别真实生态需求开始，再把监测结果放进流域协同决策。'], points: node?.governanceMeasures },
    { id: 'change', label: '治理变化', paragraphs: [node?.significance ?? '治理效果需要由水文过程和生命状态共同检验。'], points: node?.ecologicalImpacts },
    { id: 'reflection', label: '水滴感悟', paragraphs: [reflection, node?.culturalMeaning ?? '把水还给河流，也是在为生命留下空间。'] },
  ];
}

const yangtzeNarrative: BasinNarrativeConfig = {
  basinId: 'yangtze-river',
  riverName: '长江',
  pageTitle: '长江流域',
  pageSubtitle: '生命与水流节律',
  theme: 'yangtze',
  background: yangtzeBackground,
  nodes: yangtzeRiverNodes,
  regions: yangtzeRiverRegions,
  scenes: [
    {
      id: 'yangtze-joint-regulation', label: '江湖共调', title: '让洪峰有处可去', summary: '从上游梯级水库到通江湖泊，让不同时间、不同地点的水有序通过。',
      nodeId: 'dongting-lake', videoFilename: 'yangtze-cascade-dispatch.mp4', videoTitle: '梯级调度——美好生态', mediaAfterSectionId: 'problem',
      sections: [
        { id: 'background', label: '背景介绍', paragraphs: ['长江像一条横贯中国的大水脉。它从高山峡谷一路奔来，汇集岷江、嘉陵江、汉江等许多支流，也与洞庭湖、鄱阳湖等大型湖泊相连。', '如果把长江比作一条很长很长的路，那么每一条支流都是从不同方向汇入的“车流”。平常，它们共同滋养城市、农田和湿地；可一到汛期，暴雨会让许多支流同时变成急匆匆的“水车队”，一起冲向干流。', '长江的水有明显的季节变化：夏天雨多，江水涨得快；冬春雨少，有些河段水位又会下降。因此，治理长江不是让水永远保持一样多，而是学会在水多与水少之间找到平衡。'] },
        { id: 'problem', label: '问题剖析', paragraphs: ['洪水最怕“赶在一起”。假如上游下了一场大雨，中游的支流也同时涨水，洞庭湖、鄱阳湖周边再遇到强降雨，几股洪峰便可能像在狭窄路口相遇的车流，互相叠加、越积越高。', '可是，水也不能被永远关在水库里。下泄水量太少，可能影响沿江供水、船舶航行和农田灌溉；一些鱼类还会因为水流太缓、水温或水位变化不合适，而难以正常繁殖。', '所以，长江面临的不是简单的“洪水要不要拦”，而是一个更复杂的问题：洪水来了，怎样让它慢下来、错开来？枯水来了，怎样让河流仍保持基本活力？', '看，远处的云正在下雨，上游的水库和江湖也都在等待消息。它们该怎样配合，才能不让洪峰挤在同一段河道里呢？'], points: ['多地暴雨 → 支流同时涨水 → 洪峰相遇 → 中下游压力增加'] },
        { id: 'governance', label: '怎样治理', paragraphs: ['长江采用的是“江河湖库联合调度”的办法。它不像一个人独自解决难题，而像一支大型接力队：上游水库、三峡工程、支流水库和通江湖泊，都要根据同一份“水情地图”协同配合。', '汛期来临前，工作人员会根据降雨预报、水位数据和洪峰路径，提前判断哪里可能来水最多。部分水库会预先腾出空间，就像在大雨到来前先给“水的停车场”留出车位。', '洪峰到来时，上游梯级水库分批拦蓄洪水，让原本同时抵达的水流错开时间。三峡水库则发挥重要的防洪调节作用：当上游来水过急时，先帮忙“接住”一部分；当下游水位下降时，再根据需要有序补水。', '洞庭湖、鄱阳湖等通江湖泊也很重要。它们像长江身边的大口袋，在洪水来时能够分担部分水量；在江水变化时，又与干流保持水体交换。', '今天，数字化系统就像长江的“智慧大脑”。屏幕上会不断更新雨量、水位、流速和水库蓄水情况，帮助工作人员推演：如果这里多拦一点水，那里晚放几个小时，洪峰会怎样移动？鱼类栖息地又会不会受到影响？'] },
        { id: 'change', label: '治理变化', paragraphs: ['经过联合调度，原本可能在同一时间、同一河段相遇的洪峰被分散开来，洪水压力得到缓解。枯水期，适度补水也能帮助维持下游航道水深、城乡用水和河流基本生态流量。', '更重要的是，人们不再只把水库看作一座座孤立的大坝，而是把它们与江河湖泊看成一个整体。上游的一次蓄水、中游的一次调度、湖泊的一次涨落，都会影响千里之外的河流。', '这就像照顾一条很长的生命线：不能只照顾其中一小段，而要让整条大江都能顺畅呼吸。'] },
        { id: 'reflection', label: '水滴感悟', paragraphs: ['“从前，我总以为洪水只是我跑得太快。后来我才知道，当许多支流同时奔来，再宽的河道也会感到拥挤。现在，人们为我留出停靠的空间，也为我安排继续前行的时刻。原来，水不必永远被拦住，只要在合适的时候慢一点、让一点、等一等。”', '生态文明并不是要求江河永远平静，而是尊重它本来的涨落规律。天人合一的智慧，就在于人们不强迫水违背自然，而是顺着季节、地形和水势，让洪水有处可蓄、枯水有流可补、生命有水可依。'] },
      ],
      interaction: {
        id: 'yangtze-cascade-dispatch', mode: 'dispatch', rewardStars: 3,
        question: '上游持续来水，下游需要防洪空间，鱼类繁殖期又需要适宜的水文过程。你会怎样组织梯级水库？',
        choices: [
          { id: 'single', label: 'A. 各水库只按自己的发电计划运行', isCorrect: false, feedback: '单库各自运行会把风险和水文波动传给下游，整条江需要共享预报与响应信息。' },
          { id: 'flat', label: 'B. 全部水库维持完全相同的稳定下泄', isCorrect: false, feedback: '稳定并不总等于健康。洪水安全与生态繁殖都需要根据实时来水调整节奏。' },
          { id: 'joint', label: 'C. 共享预报和库情，分工联合调度并保留生态窗口', isCorrect: true, feedback: '判断正确！联合调度把防洪边界、工程能力和生命需求放进同一张流域图里。' },
        ],
      },
    },
    {
      id: 'yangtze-golden-waterway', label: '黄金水道', title: '让发展取之有度', summary: '利用大江的力量，也让河流继续保有照顾生命的节律。',
      nodeId: 'three-gorges', videoFilename: 'yangtze-ecological-dispatch.mp4', videoTitle: '三峡也“催生”？揭秘生态调度的“流量密码”', mediaAfterSectionId: 'governance',
      sections: [
        { id: 'background', label: '背景介绍', paragraphs: ['长江不只是自然界的一条大河，也是一条连接中国东中西部的重要通道。', '千百年来，人们沿着长江航行、贸易、耕作、建城。今天，巨大的船队依然沿江而行，把粮食、矿产、集装箱和各地的产品运往远方。长江像一条天然的大走廊，把高山、平原、城市和港口连接在一起，因此被称为“黄金水道”。', '同时，长江上游峡谷落差大，水流蕴藏着巨大的能量。三峡、葛洲坝等水利枢纽把水位落差转化为清洁电力，再通过输电线路送往远方城市。', '如果把长江比作一位慷慨的朋友，它既能为城市点亮灯火，也能托起万吨船队的远行。'] },
        { id: 'problem', label: '问题剖析', paragraphs: ['可是，大江的力量并不是取之不尽、用之不竭的。发电希望水流稳定、落差充足；船舶通航希望航道水深合适；防洪需要水库留出库容；下游农田和城市需要供水；鱼类繁殖则需要特定的水温、水位和流速。', '这些需求有时会像坐在同一张桌子上的人：每个人都希望多分一点水，却不能只顾自己。', '如果只追求发电，水库下泄的节奏可能与鱼类繁殖需要的水流节奏不同；如果只追求航运，也不能忽视河流生态；如果工程建设只考虑人类便利，江中的生命可能失去原本熟悉的家园。', '人类怎样使用长江的力量，又怎样不把长江变成只为人类服务的“机器”？', '三峡让我的力量变成了电，也让大船跨过了高高的水位差。可江里的鱼儿会不会想念从前的水流节奏呢？原来，水库还能用一种特别的方式，为生命送去信号。'] },
        { id: 'governance', label: '怎样治理', paragraphs: ['三峡工程和葛洲坝工程并不是只负责发电。它们需要在防洪、供水、航运、发电和生态之间不断协调，就像同时演奏许多声部的乐队，不能只有一种声音响亮。', '在航运方面，三峡双线五级船闸像一座“水上电梯”。船舶进入闸室后，水位会一层层升高或降低，帮助它们跨越巨大的水位落差。过去险峻难行的峡江航道，如今可以让大型船队更有秩序地通行。', '在能源方面，水电把流动的水转化为电能。与燃煤发电相比，水电能够减少部分污染物和碳排放，为城市提供更多清洁能源。', '但真正体现治理智慧的，是“生态调度”。鱼类并不会阅读水库运行表，它们却能感受到水流的变化。有些鱼类会把适度涨水、水温变化和流速变化，当作繁殖季到来的信号。', '因此，工作人员会在科学研究的基础上，尝试调整下泄流量和时间，模拟更接近自然的水文过程。这就像为江中的鱼群敲响一阵“水流的钟声”：告诉它们，适合迁徙、产卵或觅食的时节可能来了。', '同时，沿江还需要加强船舶污染防治、岸线生态修复和水质保护。因为一条真正的黄金水道，不应只让货物高效流通，也应让清水和生命持续流动。'] },
        { id: 'change', label: '治理变化', paragraphs: ['今天，长江的水流能够转化为清洁电力，船队能够更安全、有序地穿越峡江，沿江地区之间的联系更加紧密。', '与此同时，人们越来越认识到：工程的成功不只看发了多少电、过了多少船，也要看下游河道是否保持基本流量，鱼类是否仍有适宜的繁殖条件，岸线是否仍然保有绿色空间。', '这意味着，长江的发展正在从“只追求利用”走向“利用与保护并重”。'] },
        { id: 'reflection', label: '水滴感悟', paragraphs: ['“我的奔流可以点亮万家灯火，也能托起远行的船。可我身体里还住着鱼群、江豚、水草和无数细小生命。人们若只听见机器的轰鸣，就会错过它们的呼吸；只有在使用我的力量时，也愿意听懂生命的节奏，这份力量才能流得更远。”', '生态文明强调的不是停止发展，而是绿色发展、节制发展。天人合一并不是拒绝建造工程，而是在工程与自然之间找到边界：取水有度、用水有节、调水有情，让人类的创造力成为守护山河的力量。'] },
      ],
    },
    {
      id: 'yangtze-life', label: '生命长江', title: '给生命留一段长江', summary: '从认识动物开始，把守护延伸到整条江的栖息地、通道与水文节律。',
      nodeId: 'chinese-sturgeon-reserve', mediaAfterSectionId: 'background',
      sections: [
        { id: 'background', label: '背景介绍', paragraphs: ['长江看起来是一条奔流的水道，其实更像一座绵延数千公里的“生命大社区”。江水中有鱼类、江豚、微生物和水生植物；江边有洲滩、湿地和芦苇；与长江相连的湖泊，则像这座社区里的花园和育儿室。它们共同组成了一个彼此依赖的生态网络。', '中华鲟是长江中非常特别的“旅行家”。它会在江海之间长距离洄游，需要找到合适的水流、水温和产卵地点。长江江豚则像江中的“小精灵”，依靠相对清洁、安静、食物充足的水域生活。', '它们不是长江里的“装饰品”，而是河流健康状况的信号灯。鱼类能顺利洄游、江豚能安心觅食，说明这条江仍保有活力。', '在我长长的旅途中，住着许多老朋友。你能认出它们吗？请记住：每认出一种生命，就多理解一份长江需要被守护的理由。'] },
        { id: 'problem', label: '问题剖析', paragraphs: ['过去很长一段时间里，长江中的生命面临着许多压力。过度捕捞会让一些鱼类还没来得及长大、繁殖，就离开了河流；废弃渔网可能缠住鱼类和江豚；船舶噪声、污染和高强度岸线开发，会影响动物觅食、交流和栖息；河流与湖泊之间的联系减弱，也会让一些鱼类失去产卵和育幼的场所。', '对于人类来说，一张渔网也许只是捕鱼工具；但对一条鱼来说，它可能是一堵突然出现的墙。对于一只江豚来说，水下不断传来的噪声，可能会干扰它寻找同伴和食物。', '因此，中华鲟数量减少、江豚生存受威胁，并不是某一种动物单独遇到了困难，而是在提醒我们：长江这座“生命大社区”的房间、道路和食物链，都曾受到影响。'] },
        { id: 'governance', label: '怎样治理', paragraphs: ['保护长江生命，不能只救助一只受伤的江豚，也不能只放流一批鱼苗，而要让整条生态链慢慢恢复。', '首先，长江重点水域实施十年禁渔。它就像给已经疲惫的河流按下“休养键”，让鱼类有足够时间长大、繁殖，逐步恢复种群数量。禁渔并不是简单地“不许捕鱼”，还包括帮助退捕渔民转产上岸，让他们能够用新的方式继续生活；有些昔日渔船也转变成生态巡护船，守护曾经赖以生活的江面。', '其次，科研人员开展中华鲟人工繁育、增殖放流和长期监测。放流不是把鱼苗送进水里就结束了，还要研究它们是否能适应环境、是否能顺利成长、是否能在未来自然繁殖。', '同时，人们也在修复鱼类产卵场、索饵场和栖息地，清理废弃渔网，保护江边洲滩和湿地，并改善长江与洞庭湖、鄱阳湖等水域的生态联系。', '生态调度同样是保护生命的重要工具。通过保障适宜的流量、水位和水温变化，可以为部分鱼类繁殖和幼鱼成长创造更好的条件。', '此外，《长江保护法》、生态保护红线、巡护执法和科学监测，共同为长江生命划出不能轻易突破的底线。'] },
        { id: 'change', label: '治理变化', paragraphs: ['生态修复不是按一下按钮就能完成的事情。鱼类恢复需要经历多个繁殖周期，湿地修复需要等待植物重新扎根，江豚的生存环境也需要长期维护。', '但当禁渔让鱼类获得休养生息的时间，当废弃渔网被清理，当湿地和产卵场逐步恢复，长江生态系统便有机会慢慢找回自己的节奏。', '真正值得期待的变化，不只是看到更多鱼苗被放流，而是有一天，它们能够自己完成迁徙、繁殖和成长；不只是救助一只江豚，而是让江豚能够在更广阔、更安静的水域中自由生活。'] },
        { id: 'reflection', label: '水滴感悟', paragraphs: ['“我曾以为，只要江水还在流，生命就一定会留下。后来才明白，鱼儿需要道路，江豚需要安静，湿地需要潮涨潮落，每一种生命都有自己的时间表。人们愿意停下捕捞的手，清理遗落的渔网，为江湖重新打开通道，我才知道：守护长江，不只是守护一条河，更是在守护万物共同生活的家。”', '生态文明提醒我们，人类并不是站在自然之外的管理者，而是生命共同体中的一员。天人合一的真正含义，是承认每一种生命都有存在的价值，也愿意为它们留下时间、空间与尊重。', '为鱼留一段洄游的水路，为江豚留一片安静的江湾，为后代留一条仍然生机勃勃的长江。'] },
      ],
      interaction: {
        id: 'yangtze-species-recognition', mode: 'species-recognition', rewardStars: 3,
        question: '观察形态与生活线索，哪一种是需要往返江海、回到长江繁殖的中华鲟？',
        choices: [
          { id: 'sturgeon', label: 'A. 中华鲟', description: '长吻、骨板明显，具有洄游习性', isCorrect: true, feedback: '认对啦！中华鲟需要相对完整的洄游通道和适宜的繁殖水流；长江江豚需要清洁、安静、食物充足的水域；胭脂鱼需要较完整的河流栖息环境；江豚幼崽则需要安全水域和稳定的食物来源。认出名字，是理解整条生态链的开始。' },
          { id: 'finless-porpoise', label: 'B. 长江江豚', description: '体形圆润、无背鳍，常在淡水活动', isCorrect: false, feedback: '这是长江江豚，也是重要旗舰物种，但它和中华鲟的形态与生活史并不相同。再观察一次吧。' },
          { id: 'chinese-sucker', label: 'C. 胭脂鱼', description: '幼鱼体色鲜明，体高随成长变化', isCorrect: false, feedback: '胭脂鱼同样值得保护，但这次要找的是往返江海的中华鲟。' },
        ],
      },
    },
  ],
};

const pearlNarrative: BasinNarrativeConfig = {
  basinId: 'pearl-river',
  riverName: '珠江',
  pageTitle: '珠江流域',
  pageSubtitle: '淡水抵达城市与海洋',
  theme: 'pearl',
  background: pearlBackground,
  nodes: pearlRiverNodes,
  regions: pearlRiverRegions,
  scenes: [
    {
      id: 'pearl-salt', label: '枯水期的咸潮', title: '淡水如何抵住海潮', summary: '枯水期，水库、泵站与取水口需要共同守住城市的淡水窗口。',
      nodeId: 'greater-bay-water-network', videoFilename: 'pearl-salt-tide.mp4', videoTitle: '珠江压咸补淡影像',
      sections: nodeSections('greater-bay-water-network', '海水逆流而上时，一滴淡水的抵达，需要上游与城市共同安排。'),
      interaction: {
        id: 'pearl-salt-tide-response', mode: 'dispatch', rewardStars: 3,
        question: '枯水期咸潮逼近取水口，你会怎样保障城市供水，同时避免一次性过量放水？',
        choices: [
          { id: 'wait', label: 'A. 等咸潮到达取水口后再临时停水', isCorrect: false, feedback: '被动停水会放大供水风险。需要提前结合潮汐、来水与库容进行协同。' },
          { id: 'all', label: 'B. 立即把上游水库全部放空', isCorrect: false, feedback: '一次性大量放水忽略了后续枯水期和生态需求，调度需要更有节奏。' },
          { id: 'joint', label: 'C. 预报咸潮窗口，上游补水并同步抢淡蓄库', isCorrect: true, feedback: '选择正确！压咸补淡、泵站抢淡和水库蓄水共同构成了连续的供水防线。' },
        ],
      },
    },
    {
      id: 'pearl-city', label: '城市里的河流', title: '让茅洲河真正变清', summary: '河面变清只是开始，治河更要追到排水系统和污染源头。',
      videoFilename: 'maozhou-river-governance.mp4', videoTitle: '茅洲河流域治理影像',
      sections: [
        { id: 'background', label: '背景介绍', paragraphs: ['茅洲河流经高密度城市与产业区域。人口、厂区、道路和支流密集，让每一处排水变化都可能汇入同一条河。'] },
        { id: 'problem', label: '问题剖析', paragraphs: ['污染并不只在河面。雨污混流、管网缺口、沿岸排放和内源污染相互叠加，单纯清淤或换水难以长期解决。'] },
        { id: 'governance', label: '怎样治理', paragraphs: ['治理沿着污染物的路径反向追踪。'], points: ['排查并控制工业与生活污染源', '完善雨污分流和污水收集管网', '清理内源污染并修复河岸生态', '以跨区域监测持续检验水质'] },
        { id: 'change', label: '治理变化', paragraphs: ['当进入河道的污染持续减少，水质改善才不再依赖临时补水，城市也重新获得可亲近的滨水空间。'] },
        { id: 'reflection', label: '水滴感悟', paragraphs: ['让我变清的不是一场河面美容，而是城市地下管网、岸上生产生活与河流空间一起改变。'] },
      ],
      interaction: {
        id: 'pearl-maozhou-governance', mode: 'choice', rewardStars: 3,
        question: '要让茅洲河长期变清，最先应该把治理力量放在哪里？',
        choices: [
          { id: 'paint', label: 'A. 只美化河岸并增加灯光景观', isCorrect: false, feedback: '景观改善不能阻止污染继续进入河流，河岸好看不等于水质真正恢复。' },
          { id: 'flush', label: 'B. 长期依赖调水把污染冲走', isCorrect: false, feedback: '调水可以缓解局部水质，却不能代替污染源控制和管网建设。' },
          { id: 'source', label: 'C. 控源截污、完善管网，再结合清淤与生态修复', isCorrect: true, feedback: '找到根源了！从源头减少污染，再修复河道，水质改善才会稳定下来。' },
        ],
      },
    },
    {
      id: 'pearl-estuary', label: '淡水抵达河口', title: '给白海豚留下安静的家', summary: '淡水、潮汐、红树林和近海浅滩，共同托住珠江口的生命网络。',
      nodeId: 'pearl-river-estuary', poster: dolphinPoster, videoFilename: 'chinese-white-dolphin.mp4', videoTitle: '珠江口中华白海豚保护影像',
      sections: nodeSections('pearl-river-estuary', '当我抵达海洋，治水并没有结束。这里的每一次航行、施工和水质变化，都会被海豚听见。'),
      interaction: {
        id: 'pearl-dolphin-protection', mode: 'choice', rewardStars: 3,
        question: '施工与航运无法完全停止时，怎样更有效地保护中华白海豚？',
        choices: [
          { id: 'none', label: 'A. 只在岸上设置保护宣传牌', isCorrect: false, feedback: '宣传很重要，但海豚真正面对的是栖息地、水质、航线和水下噪声。' },
          { id: 'monitor', label: 'B. 监测活动范围，避让敏感水域与时段并降低噪声', isCorrect: true, feedback: '做得好！持续监测、主动避让和生境保护，才能把人类活动的干扰真正降下来。' },
          { id: 'feed', label: 'C. 在航道附近集中投喂吸引海豚', isCorrect: false, feedback: '人为投喂会改变野生动物行为，还可能把海豚吸引到高风险航道附近。' },
        ],
      },
    },
  ],
};

export { pearlNarrative, yangtzeNarrative };
