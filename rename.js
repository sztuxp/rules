/**
 * 节点改名脚本 - 只处理名称修改
 * 更新日期：2025-05-13
 */

const inArg = $arguments;

const nf = inArg.nf || false;
const addflag = inArg.flag || false;
const blgd = inArg.blgd || false;
const bl = inArg.bl || false;
const blnx = inArg.blnx || false;
const nx = inArg.nx || false;
const clear = inArg.clear || false;
const nm = inArg.nm || false;
const key = inArg.key || false;

const FGF = inArg.fgf == undefined ? " " : decodeURI(inArg.fgf);
const FNAME = inArg.name == undefined ? "" : decodeURI(inArg.name);
const BLKEY = inArg.blkey == undefined ? "" : decodeURI(inArg.blkey);
const blockquic = inArg.blockquic == undefined ? "" : decodeURI(inArg.blockquic);

const nameMap = { cn: "cn", zh: "cn", us: "us", en: "us", quan: "quan", gq: "gq", flag: "gq" };
const inname = nameMap[inArg.in] || "";
const outputName = nameMap[inArg.out] || "";

// 国家数据（保持原样）
const FG = ['🇭🇰','🇲🇴','🇹🇼', /* ... 保持你原来的 FG、EN、ZH、QC 数组 */ ];
const EN = [ /* ... */ ];
const ZH = [ /* ... */ ];
const QC = [ /* ... */ ];

// 保留关键词相关正则（保持原样）
const nameclear = /(套餐|到期|有效|剩余|版本|已用|过期|失联|测试|官方|网址|备用|群|TEST|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL)/i;
const regexArray = [/* ... 你原来的 regexArray */];
const valueArray = [/* ... 你原来的 valueArray */];
const nameblnx = /(高倍|(?!1)2+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;
const namenx = /(高倍|(?!1)(0\.|\d)+(x|倍)|ˣ²|ˣ³|ˣ⁴|ˣ⁵|ˣ¹⁰)/i;
const keya = /港|Hong|HK|新加坡|SG|.../i;   // 保持你原来的
const keyb = /.../i;

const rurekey = { /* 保持你原来的替换规则 */ };

let Allmap = {};
let AMK = [];

function getList(arg) {
  switch (arg) {
    case 'us': return EN;
    case 'gq': return FG;
    case 'quan': return QC;
    default: return ZH;
  }
}

function initMap() {
  if (AMK.length > 0) return;
  const outList = getList(outputName);
  const inputList = inname ? [getList(inname)] : [ZH, FG, QC, EN];

  inputList.forEach(arr => {
    arr.forEach((value, i) => {
      Allmap[value] = outList[i];
    });
  });
  AMK = Object.entries(Allmap);
}

function operator(pro) {
  initMap();

  const BLKEYS = BLKEY ? BLKEY.split("+") : [];

  // 先过滤
  if (clear || nx || blnx || key) {
    pro = pro.filter(res => {
      const n = res.name;
      return !(clear && nameclear.test(n)) &&
             !(nx && namenx.test(n)) &&
             !(blnx && !nameblnx.test(n)) &&
             !(key && !(keya.test(n) && /2|4|6|7/i.test(n)));
    });
  }

  pro.forEach(e => {
    let retainKey = "";
    let ikey = "", ikeys = "";
    const originalName = e.name;

    // rurekey 预替换
    Object.keys(rurekey).forEach(k => {
      if (rurekey[k].test(e.name)) {
        e.name = e.name.replace(rurekey[k], k);
      }
    });

    // block-quic
    if (blockquic === "on") e["block-quic"] = "on";
    else if (blockquic === "off") e["block-quic"] = "off";
    else delete e["block-quic"];

    // BLKEY 处理（支持 > 替换）
    if (BLKEY) {
      let replaceStr = "";
      BLKEYS.forEach(item => {
        if (item.includes(">")) {
          const [from, to] = item.split(">");
          if (originalName.includes(from) || e.name.includes(from)) {
            replaceStr = to || "";
            retainKey = to || from;
          }
        } else if (originalName.includes(item) || e.name.includes(item)) {
          retainKey = item;
        }
      });
      if (replaceStr) retainKey = replaceStr;
    }

    // 倍率保留
    if (blgd) {
      regexArray.forEach((reg, i) => {
        if (reg.test(e.name)) ikeys = valueArray[i];
      });
    }
    if (bl) {
      const match = e.name.match(/((倍率|X|x|×)\D?((\d{1,3}\.)?\d+)\D?)|((\d{1,3}\.)?\d+)(倍|X|x|×)/);
      if (match) {
        const num = match[0].match(/(\d[\d.]*)/)[0];
        if (num !== "1") ikey = num + "×";
      }
    }

    // 核心：查找国家并重命名
    const findKey = AMK.find(([key]) => e.name.includes(key) || originalName.includes(key));

    if (findKey) {
      const countryName = findKey[1];
      let flag = "";

      if (addflag) {
        const idx = getList('gq').indexOf(countryName); // 简化处理
        if (idx !== -1) {
          flag = FG[idx] || "";
          if (flag === "🇹🇼") flag = "🇨🇳";
        }
      }

      const parts = [];
      if (nf) parts.push(FNAME);
      if (flag) parts.push(flag);
      if (!nf) parts.push(FNAME);
      parts.push(countryName, retainKey, ikey, ikeys);

      e.name = parts.filter(Boolean).join(FGF);
    } else {
      e.name = nm ? (FNAME + FGF + originalName) : null;
    }
  });

  // 移除未匹配的节点
  return pro.filter(e => e.name !== null);
}

$done({ proxies: operator($proxies) });
