/**
 * 第二块：纯排序脚本
 * sort.js
 * 只负责同名编号和特殊排序
 */

const inArg = $arguments;

const numone = inArg.one || false;
const blpx = inArg.blpx || false;
const XHFGF = inArg.sn == undefined ? " " : decodeURI(inArg.sn);

const specialRegex = [
  /(\d\.)?\d+×/,
  /IPLC|IEPL|Kern|Edge|Pro|Std|Exp|Biz|Fam|Game|Buy|Zx|LB|Game/,
];

// prettier-ignore
function jxh(e) {
  const n = e.reduce((e, n) => {
    const t = e.find((e) => e.name === n.name);
    if (t) {
      t.count++;
      t.items.push({ ...n, name: `${n.name}${XHFGF}${t.count.toString().padStart(2, "0")}` });
    } else {
      e.push({ name: n.name, count: 1, items: [{ ...n, name: `${n.name}${XHFGF}01` }] });
    }
    return e;
  }, []);
  const t = (typeof Array.prototype.flatMap === 'function' ? n.flatMap(e => e.items) : n.reduce((acc, e) => acc.concat(e.items), []));
  e.splice(0, e.length, ...t);
  return e;
}

// prettier-ignore
function oneP(e) {
  const t = e.reduce((e, t) => {
    const n = t.name.replace(/[^A-Za-z0-9\u00C0-\u017F\u4E00-\u9FFF]+\d+$/, "");
    if (!e[n]) e[n] = [];
    e[n].push(t);
    return e;
  }, {});
  for (const key in t) {
    if (t[key].length === 1 && t[key][0].name.endsWith("01")) {
      t[key][0].name = t[key][0].name.replace(/[^.]01/, "");
    }
  }
  return e;
}

// prettier-ignore
function fampx(pro) {
  const wis = [], wnout = [];
  for (const proxy of pro) {
    if (specialRegex.some(regex => regex.test(proxy.name))) {
      wis.push(proxy);
    } else {
      wnout.push(proxy);
    }
  }
  const sps = wis.map(proxy => specialRegex.findIndex(regex => regex.test(proxy.name)));
  wis.sort((a, b) => sps[wis.indexOf(a)] - sps[wis.indexOf(b)] || a.name.localeCompare(b.name));
  wnout.sort((a, b) => pro.indexOf(a) - pro.indexOf(b));
  return wnout.concat(wis);
}

function operator(pro) {
  pro = jxh(pro);
  if (numone) pro = oneP(pro);
  if (blpx) pro = fampx(pro);
  return pro;
}

//$done({ proxies: operator($proxies) }); 
// prettier-ignore
function getList(arg) { switch (arg) { case 'us': return EN; case 'gq': return FG; case 'quan': return QC; default: return ZH; }}
// prettier-ignore
function jxh(e) { const n = e.reduce((e, n) => { const t = e.find((e) => e.name === n.name); if (t) { t.count++; t.items.push({ ...n, name: `${n.name}${XHFGF}${t.count.toString().padStart(2, "0")}`, }); } else { e.push({ name: n.name, count: 1, items: [{ ...n, name: `${n.name}${XHFGF}01` }], }); } return e; }, []);const t=(typeof Array.prototype.flatMap==='function'?n.flatMap((e) => e.items):n.reduce((acc, e) => acc.concat(e.items),[])); e.splice(0, e.length, ...t); return e;}
// prettier-ignore
function oneP(e) { const t = e.reduce((e, t) => { const n = t.name.replace(/[^A-Za-z0-9\u00C0-\u017F\u4E00-\u9FFF]+\d+$/, ""); if (!e[n]) { e[n] = []; } e[n].push(t); return e; }, {}); for (const e in t) { if (t[e].length === 1 && t[e][0].name.endsWith("01")) {/* const n = t[e][0]; n.name = e;*/ t[e][0].name= t[e][0].name.replace(/[^.]01/, "") } } return e; }
// prettier-ignore
function fampx(pro) { const wis = []; const wnout = []; for (const proxy of pro) { const fan = specialRegex.some((regex) => regex.test(proxy.name)); if (fan) { wis.push(proxy); } else { wnout.push(proxy); } } const sps = wis.map((proxy) => specialRegex.findIndex((regex) => regex.test(proxy.name)) ); wis.sort( (a, b) => sps[wis.indexOf(a)] - sps[wis.indexOf(b)] || a.name.localeCompare(b.name) ); wnout.sort((a, b) => pro.indexOf(a) - pro.indexOf(b)); return wnout.concat(wis);}
