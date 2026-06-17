// One-off: translate the remaining Chinese in migrated content to English.
// Replaces the inner of each <p>/<figcaption>/<h*>/<li> whose decoded text
// contains a known Chinese phrase. Run from repo root: node tools/i18n-en.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const base = 'app/src/';
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'").replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
const hasHan = (s) => /[一-鿿]/.test(s);
const L = (href, text) =>
  `<a href="${href}" target="_blank" rel="noreferrer noopener">${text}</a>`;

const files = {
  'project-bodies/talos-principle.html': [
    ['致敬Croteam', 'A tribute to Croteam.'],
    ['完整项目可查看', `(Full project on ${L('https://www.zcool.com.cn/work/ZNDIzNDczMjQ=.html', 'ZCOOL')}.)`],
  ],
  'project-bodies/diy-motion-elements.html': [
    ['DIY元素是用户', 'DIY Elements is a kit that lets users customize their home screen, built from dynamic templates and layered motion. The widgets mainly cover weather status, personalized stickers, signatures, and more.'],
    ['主导了元素与挂件', 'I led the design and the motion work for the elements and widgets, including the default neon, holiday, and realistic-style element sets.'],
  ],
  'project-bodies/3d-ui-exploration.html': [
    ['扁平化UI是主流', 'In conventional apps, flat UI is the mainstream design direction.'],
    ['投影等应用场景', 'But in projection scenarios, a good light engine can render true black as invisible, achieving a nearly borderless result. This 3D UI is a bold experiment — meant to blend more naturally into the projected wall and approach a glasses-free AR effect.'],
  ],
  'project-bodies/dynamic-weather-art.html': [
    ['基于天气表现', `A series of surrealist pieces built on weather. By observing clouds and the atmosphere, I abstracted their forms and concepts into looping animations whose colors shift over time, alongside several animation sequences for different weather states. The final result animated beautifully on JMGO projectors. (See the full project on ${L('https://www.behance.net/gallery/126400841/Artistic-Weather', 'Behance')}.)`],
    ['冰雪', 'Snow &amp; Ice'],
    ['雷雨', 'Thunderstorm'],
    ['多云', 'Cloudy'],
  ],
  'project-bodies/wallpaper-universal-design.html': [
    ['这幅动态背景灵感', 'This animated wallpaper was inspired by the cover of my favorite post-rock album, and went through countless iterations. At first I used the Redshift renderer to simulate realistic clouds, but the results were mediocre and large, dense cloud masses were hard to produce — the planet itself is enormous, so its churning feels at once minute and vast. In the end I composited cloud footage sampled from video, VDB sequence animations, and some simulated Redshift clouds. The video loops seamlessly.'],
  ],
  'project-bodies/china-mobile-cave.html': [
    ['中国移动的CAVE大屏', "China Mobile's CAVE large-screen project was a major job I took on while freelancing."],
    ['实地考察后', "After an on-site survey, to build a real sense of depth in the space we calculated the venue's aspect ratio and stretched four surfaces — floor, left and right walls, and the front wall — to match the ideal viewing angle for an eye at the center of the room. To drive JVC's 8K laser projectors, we stitched the four wall feeds together into a smart-city promo video at up to 10K resolution."],
    ['城市沙盘的2.5d视图', "Early on, following the client's brief, we created a 2.5D view of the city sand-table model and a top-down map for the floor screen, and modeled several real-world landmarks within the sand table."],
    ['控台中的所有动画', 'I also produced all the animated UI for the control console, and used UE4 to build a series of narrative animations that carried the logic of the whole video.'],
    ['城市沙盘2.5d视图', 'City sand-table — 2.5D view'],
    ['地幕视图', 'Floor-screen view'],
  ],
  'project-bodies/nft-asset-design.html': [
    ['这是一次关于对NFT', "A study of NFT display devices, platforms, and visuals. The company planned to launch an NFT display platform that, once linked to a personal wallet, would showcase your NFT collection on the wall."],
    ['除载体外', "Beyond the device itself, I created a set of in-house NFT pieces for display. Spanning a 'lively' and a 'classical' series, they push past traditional 2D and animated NFTs: built on baked 3D models looping skeletal animation, so users can rotate and inspect each piece from every angle — works made to be admired and toyed with. The varied dynamic materials use OSL shaders, cloth, vertex distortion, and other techniques. Only still frames are shown below."],
    ['以及外部nft作品在投影仪', 'Plus how external NFT works might appear on a projector, and the motion of the display device itself.'],
    ['个别NFT动态效果', 'Motion of individual NFTs.'],
  ],
  'project-bodies/luna-os-ar-theme.html': [
    ['坚果投影2021', `LUNA OS is JMGO's in-house dual-mode operating system, released in 2021, with a standard viewing mode and a DIY companion mode. When playback isn't needed, users switch from classic mode to companion mode with one tap. Companion mode offers a range of wall surfaces with different functions: a customizable info dashboard, themed weather, a clock, personalized DIY, music-reactive visuals, and more. Its guiding direction is a borderless design that blends naturally into the wall. (See the ${L('https://www.jmgo.com/luna', 'LUNA OS site')} for details.)`],
    ['首发AR主题', "As LUNA OS's launch AR theme, it had to emphasize melting into the wall. While working out the 3D theme early on, I concluded it should follow a glasses-free 3D visual direction while also delivering a glasses-free AR effect."],
    ['颗粒度要求高', "Projectors are demanding about image granularity — even traditional 1080p HD is often pixel-shifted up from 720p. So I imagined filling every pixel of the projected 720p frame with tens of thousands of model particles, each churning slowly and gracefully up and down within the frame, so the upper half appears to extend outward as an AR effect. The result turned out well and confirmed my hunch: just as 2K/4K monitors can't display 1080p video perfectly, a native 1080p panel always plays HD sources more crisply than a 2K-or-higher one — a matter of the display controller's tuning, which can't downscale cleanly and fill every pixel."],
    ['经历了长久的思考', 'After a long stretch of thinking and design reasoning, plus continuous visual trial-and-error across several drafts, I arrived at a relatively unified solution.'],
    ['完整项目请查看', `(See the full project on ${L('https://www.behance.net/gallery/126400841/Artistic-Weather', 'Behance')}.)`],
    ['最终颜色测试', '(Final color test)'],
    ['密度与纵轴颗粒度测试', '(Density and vertical-axis granularity test)'],
    ['部分动态过程稿_1', '(Motion work-in-progress — 1)'],
    ['部分动态过程稿_2', '(Motion work-in-progress — 2)'],
    ['三个时间段', '(Three times of day: morning, afternoon, and night.)'],
    ['宣传页面', '(Promo page)'],
  ],
  'migrated/blog-wind.html': [
    ['漫步十四寸度假村', 'Midday. Wandering through the Fourteen-Inch Resort, the post-rock track &ldquo;This Is Not Where We Are Supposed To Be&rdquo; echoing in my ears.'],
    ['就让我堕落在这宁静午后', 'So let me sink into this quiet afternoon:'],
    ['哪怕污水遍地', 'Even amid pooling sewage, flying trash, and air thick with malice.'],
    ['刹那百感交集', 'A rush of feelings in an instant — yet all I want is to walk this road to its end.'],
    ['无人的戈壁或海滩', "If one day — yesterday, or some future day — if my fortune isn't even enough to fall to beggary, I hope to lie spread-eagled on an empty desert or shore, savoring a moment of fierce sun, draped in a gentle gale, meeting a fleeting death, chasing an everlasting one."],
    ['我愿躺着摇椅', "And if I still could, I'd lie in a rocking chair on the rooftop — sun blazing, wind blowing, gazing on — until the sun sinks west, until the sky fills with stars, until I no longer know why."],
    ['有限的和煦', 'Finite warmth, finite limits.'],
  ],
  'migrated/blog-silence-is-a-eternal-theme.html': [
    ['回首伊始', 'Months on &nbsp; looking back to the start &nbsp; the instant it all felt certain &nbsp; and just like that, the curtain fell'],
    ['开始就盼着结束', 'For months &nbsp; I longed for the end from the very start &nbsp; yet when it truly ended &nbsp; words choked in my throat &nbsp; tears streaming down'],
    ['把一个月的汗流干', "In a single day &nbsp; I sweat out a whole month's worth"],
    ['炎热酷暑', 'Under a 38°C blaze that felt like open flame &nbsp; sweat pouring like rain &nbsp; an unforgettable heat &nbsp; that let me forget the ache of the parting to come'],
    ['再次奔赴', 'Faraway places &nbsp; society &nbsp; the dyeing vat &nbsp; setting out once more &nbsp; every chapter deeply cherished &nbsp; since it exists, it must carry its own meaning'],
    ['葛优躺', 'Sprawled out lazily &nbsp; swaying &nbsp; gazing afar'],
    ['海平面的一抹白线', 'A thin white line on the horizon &nbsp; an inexplicable sorrow'],
    ['夜里独自流淌', 'Drifting alone through the night &nbsp; quietly heartbroken &nbsp; flying solitary'],
    ['纵有万般不舍', 'However reluctant to part &nbsp; don’t forget to pack your bags &nbsp; meetings and partings &nbsp; such is life'],
    ['紧握这一刻', 'Hold tight to this moment'],
    ['坚强的信条', 'A steadfast creed'],
    ['必然会让我们再次相遇', 'will surely bring us together again'],
    ['少年', 'Young one'],
    ['那天的夕阳', 'The sunset that day'],
    ['清晨', 'Morning'],
    ['凌晨', 'Before dawn'],
    ['晚', 'Night'],
    ['云', 'Clouds'],
  ],
};

let unresolved = [];
for (const [rel, maps] of Object.entries(files)) {
  const path = base + rel;
  let html = readFileSync(path, 'utf8');
  html = html.replace(
    /<(p|figcaption|h[1-6]|li)((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/g,
    (m, tag, attrs, inner) => {
      const text = decode(inner.replace(/<[^>]+>/g, ''));
      if (!hasHan(text)) return m;
      for (const [test, repl] of maps) {
        if (text.includes(test)) return `<${tag}${attrs}>${repl}</${tag}>`;
      }
      unresolved.push(`${rel}: ${text.slice(0, 40)}`);
      return m;
    }
  );
  writeFileSync(path, html);
  // report any remaining Han in the file
  if (hasHan(decode(html.replace(/<[^>]+>/g, '')))) {
    const leftover = decode(html.replace(/<[^>]+>/g, '')).match(/[一-鿿][^\s<]{0,20}/g) || [];
    unresolved.push(`${rel} LEFTOVER: ${[...new Set(leftover)].join(' | ')}`);
  }
  console.log('translated ' + rel);
}
if (unresolved.length) {
  console.log('\nUNRESOLVED:');
  unresolved.forEach((u) => console.log('  ' + u));
  process.exitCode = 1;
} else {
  console.log('\nAll Chinese translated — no Han characters remain. ✓');
}
