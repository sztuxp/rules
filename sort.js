/**
 * 同名排序脚本
 * 更新日期：2025-05-13
 */

const inArg = $arguments;
const numone = inArg.one || false;
const blpx = inArg.blpx || false;
const XHFGF = inArg.sn == undefined ? " " : decodeURI(inArg.sn);

// 特殊排序用的正则
const specialRegex = [
  /(\d\.)?\d+×/,
  /IPLC|IEPL|Kern|Edge|Pro|Std|Exp|Biz|Fam|Game|Buy|Zx|LB|Game/,
];

function jxh(e) {
  const grouped = e.reduce((acc, proxy) => {
    const baseName = proxy.name; // 当前名称作为分组键
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(proxy);
    return acc;
  }, {});

  const result = [];
  Object.values(grouped).forEach(group => {
    group.forEach((proxy, index) => {
      if (group.length > 1) {
        proxy.name = `${proxy.name}${XHFGF}${(index + 1).toString().padStart(2, "0")}`;
      }
      result.push(proxy);
    });
  });

  return result;
}

function oneP(e) {
  const map = {};
  e.forEach(proxy => {
    const base = proxy.name.replace(/[^A-Za-z0-9\u00C0-\u017F\u4E00-\u9FFF]+\d+$/, "");
    if (!map[base]) map[base] = [];
    map[base].push(proxy);
  });

  Object.values(map).forEach(group => {
    if (group.length === 1 && group[0].name.endsWith("01")) {
      group[0].name = group[0].name.replace(/[^.]01$/, "");
    }
  });
  return e;
}

function fampx(pro) {
  const wis = [], wnout = [];
  for (const proxy of pro) {
    if (specialRegex.some(r => r.test(proxy.name))) {
      wis.push(proxy);
    } else {
      wnout.push(proxy);
    }
  }

  const sps = wis.map(p => specialRegex.findIndex(r => r.test(p.name)));
  wis.sort((a, b) => {
    const idxA = wis.indexOf(a), idxB = wis.indexOf(b);
    return sps[idxA] - sps[idxB] || a.name.localeCompare(b.name);
  });

  return wnout.concat(wis);
}

function operator(pro) {
  pro = jxh(pro);           // 同名加序号
  if (numone) pro = oneP(pro);
  if (blpx) pro = fampx(pro);
  return pro;
}

// prettier-ignore
function getList(arg) { switch (arg) { case 'us': return EN; case 'gq': return FG; case 'quan': return QC; default: return ZH; }}
// prettier-ignore
function jxh(e) { const n = e.reduce((e, n) => { const t = e.find((e) => e.name === n.name); if (t) { t.count++; t.items.push({ ...n, name: `${n.name}${XHFGF}${t.count.toString().padStart(2, "0")}`, }); } else { e.push({ name: n.name, count: 1, items: [{ ...n, name: `${n.name}${XHFGF}01` }], }); } return e; }, []);const t=(typeof Array.prototype.flatMap==='function'?n.flatMap((e) => e.items):n.reduce((acc, e) => acc.concat(e.items),[])); e.splice(0, e.length, ...t); return e;}
// prettier-ignore
function oneP(e) { const t = e.reduce((e, t) => { const n = t.name.replace(/[^A-Za-z0-9\u00C0-\u017F\u4E00-\u9FFF]+\d+$/, ""); if (!e[n]) { e[n] = []; } e[n].push(t); return e; }, {}); for (const e in t) { if (t[e].length === 1 && t[e][0].name.endsWith("01")) {/* const n = t[e][0]; n.name = e;*/ t[e][0].name= t[e][0].name.replace(/[^.]01/, "") } } return e; }
// prettier-ignore
function fampx(pro) { const wis = []; const wnout = []; for (const proxy of pro) { const fan = specialRegex.some((regex) => regex.test(proxy.name)); if (fan) { wis.push(proxy); } else { wnout.push(proxy); } } const sps = wis.map((proxy) => specialRegex.findIndex((regex) => regex.test(proxy.name)) ); wis.sort( (a, b) => sps[wis.indexOf(a)] - sps[wis.indexOf(b)] || a.name.localeCompare(b.name) ); wnout.sort((a, b) => pro.indexOf(a) - pro.indexOf(b)); return wnout.concat(wis);}
