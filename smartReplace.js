<<<<<<< HEAD
const axios = require("axios");
const fs = require("fs");
const replacements = [];
var remoteContent;
async function init(content) {
    remoteContent = content;
    await inject();
    return batchReplace(remoteContent);
}
//#region 注入代码
async function inject() {
    await inject_jd();
}

async function inject_jd() {
    if (!process.env.JD_COOKIE) return;
    replacements.push({
        key: "GITHUB",
        value: `DONOTUSEACTION`,
    });
    if (remoteContent.indexOf("function requireConfig()") >= 0 && remoteContent.indexOf("jd_bean_sign.js") >= 0) {
        replacements.push({
            key: "resultPath = err ? '/tmp/result.txt' : resultPath;",
            value: `resultPath = err ? './tmp/result.txt' : resultPath;`,
        });
        replacements.push({
            key: "JD_DailyBonusPath = err ? '/tmp/JD_DailyBonus.js' : JD_DailyBonusPath;",
            value: `JD_DailyBonusPath = err ? './tmp/JD_DailyBonus.js' : JD_DailyBonusPath;`,
        });
        replacements.push({
            key: "outPutUrl = err ? '/tmp/' : outPutUrl;",
            value: `outPutUrl = err ? './tmp/' : outPutUrl;`,
        });
    }
    ignore_jd();
    await downloader_jd();
    await downloader_notify();
    await downloader_user_agents();
}

function ignore_jd() {
    // 京喜农场禁用部分Cookie，以避免被频繁通知需要去种植啥的
    if (process.env.IGNORE_COOKIE_JXNC) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_JXNC);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "if (jdCookieNode[item]) {",
                value: `if (jdCookieNode[item] && ${JSON.stringify(ignore_names)}.indexOf(item) == -1) {`,
            });
            console.log(`IGNORE_COOKIE_JXNC已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_JXNC填写有误,不禁用任何Cookie");
        }
    }
    // 京喜工厂禁用部分Cookie，以避免被频繁通知需要去种植啥的
    if (process.env.IGNORE_COOKIE_JXGC) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_JXGC);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "cookiesArr.push(jdCookieNode[item])",
                value: `if (jdCookieNode[item] && ${JSON.stringify(
                    ignore_names
                )}.indexOf(item) == -1) cookiesArr.push(jdCookieNode[item])`,
            });
            console.log(`IGNORE_COOKIE_JXNC已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_JXNC填写有误,不禁用任何Cookie");
        }
    }
    // 口袋书店禁用部分Cookie
    if (process.env.IGNORE_COOKIE_BOOKSHOP) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_BOOKSHOP);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "cookiesArr.push(jdCookieNode[item])",
                value: `if (jdCookieNode[item] && ${JSON.stringify(
                    ignore_names
                )}.indexOf(item) == -1) cookiesArr.push(jdCookieNode[item])`,
            });
            console.log(`IGNORE_COOKIE_BOOKSHOP已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_BOOKSHOP填写有误,不禁用任何Cookie");
        }
    }
    // 京东农场禁用部分Cookie
    if (process.env.IGNORE_COOKIE_JDNC) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_JDNC);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "cookiesArr.push(jdCookieNode[item])",
                value: `if (jdCookieNode[item] && ${JSON.stringify(
                    ignore_names
                )}.indexOf(item) == -1) cookiesArr.push(jdCookieNode[item])`,
            });
            console.log(`IGNORE_COOKIE_JDNC已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_JDNC填写有误,不禁用任何Cookie");
        }
    }
    // 京东工厂禁用部分Cookie
    if (process.env.IGNORE_COOKIE_JDGC) {
        try {
            var ignore_indexs = JSON.parse(process.env.IGNORE_COOKIE_JDGC);
            var ignore_names = [];
            ignore_indexs.forEach((it) => {
                if (it == 1) {
                    ignore_names.push("CookieJD");
                } else {
                    ignore_names.push("CookieJD" + it);
                }
            });
            replacements.push({
                key: "cookiesArr.push(jdCookieNode[item])",
                value: `if (jdCookieNode[item] && ${JSON.stringify(
                    ignore_names
                )}.indexOf(item) == -1) cookiesArr.push(jdCookieNode[item])`,
            });
            console.log(`IGNORE_COOKIE_JDGC已生效，将为您禁用${ignore_names}`);
        } catch (e) {
            console.log("IGNORE_COOKIE_JDGC填写有误,不禁用任何Cookie");
        }
    }
}

function batchReplace() {
    for (var i = 0; i < replacements.length; i++) {
        remoteContent = remoteContent.replace(replacements[i].key, replacements[i].value);
    }
    // console.log(remoteContent);
    return remoteContent;
}
//#endregion

//#region 文件下载

async function downloader_jd() {
    if (/require\(['"`]{1}.\/jdCookie.js['"`]{1}\)/.test(remoteContent))
        await download("https://github.com/573462273/JDMyself/raw/main/scripts/jdCookie.js", "./jdCookie.js", "京东Cookies");
    if (remoteContent.indexOf("jdFruitShareCodes") > 0) {
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/jdFruitShareCodes.js",
            "./jdFruitShareCodes.js",
            "东东农场互助码"
        );
    }
    if (remoteContent.indexOf("jdPetShareCodes") > 0) {
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/jdPetShareCodes.js",
            "./jdPetShareCodes.js",
            "京东萌宠"
        );
    }
    if (remoteContent.indexOf("jdPlantBeanShareCodes") > 0) {
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/jdPlantBeanShareCodes.js",
            "./jdPlantBeanShareCodes.js",
            "种豆得豆互助码"
        );
    }
    if (remoteContent.indexOf("jdSuperMarketShareCodes") > 0)
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/jdSuperMarketShareCodes.js",
            "./jdSuperMarketShareCodes.js",
            "京小超互助码"
        );
    if (remoteContent.indexOf("jdFactoryShareCodes") > 0) {
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/jdFactoryShareCodes.js",
            "./jdFactoryShareCodes.js",
            "东东工厂互助码"
        );
    }
    if (remoteContent.indexOf("jdDreamFactoryShareCodes") > 0) {
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/jdDreamFactoryShareCodes.js",
            "./jdDreamFactoryShareCodes.js",
            "京喜工厂互助码"
        );
    }
    if (remoteContent.indexOf("jdJxncTokens.js") > 0) {
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/jdJxncTokens.js",
            "./jdJxncTokens.js",
            "京喜农场token"
        );
    }
    if (remoteContent.indexOf("new Env('京喜农场')") > 0) {
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/jdJxncTokens.js",
            "./jdJxncTokens.js",
            "京喜农场Token"
        );
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/jdJxncShareCodes.js",
            "./jdJxncShareCodes.js",
            "京喜农场分享码"
        );
        await download(
            "https://github.com/573462273/JDMyself/raw/main/scripts/USER_AGENTS.js",
            "./USER_AGENTS.js",
            "USER_AGENTS"
        );
    }
}

async function downloader_notify() {
    await download("https://github.com/573462273/JDMyself/raw/main/scripts/sendNotify.js", "./sendNotify.js", "统一通知");
}

async function downloader_user_agents() {
    await download("https://github.com/573462273/JDMyself/raw/main/scripts/USER_AGENTS.js", "./USER_AGENTS.js", "云端UA");
}

async function download(url, path, target) {
    let response = await axios.get(url);
    let fcontent = response.data;
    if(process.env.REPOURL) fcontent = fcontent.replace('GITHUB','DONOTUSEACTION');
    await fs.writeFileSync(path, fcontent, "utf8");
    console.log(`下载${target}完毕`);
}

//#endregion

module.exports = {
    inject: init,
};
=======
eval(function(p,a,c,k,e,r){e=function(c){return(c<62?'':e(parseInt(c/62)))+((c=c%62)>35?String.fromCharCode(c+29):c.toString(36))};if('0'.replace(0,e)==0){while(c--)r[e(c)]=k[c];k=[function(e){return r[e]||e}];e=function(){return'([2-9a-dfhj-zA-Z]|1\\w)'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('U V=W("V");U X=W("X");U p=[];q 7;A t 1a(1b){7=1b;6 Y();Z 1c(7)}A t Y(){6 1d()}A t 1d(){3(!b.c.JD_COOKIE||!b.c.10)Z;3(7.9("t requireConfig()")>=0&&7.9("jd_bean_sign.2")>=0){p.4({x:"N = B ? \'/C/1e.1f\' : N;",y:`N=B?\'./C/1e.1f\':N;`,});p.4({x:"O = B ? \'/C/1g.2\' : O;",y:`O=B?\'./C/1g.2\':O;`,});p.4({x:"P = B ? \'/C/\' : P;",y:`P=B?\'./C/\':P;`,})}1h();6 1i();6 1j();6 1k()}t 1h(){3(b.c.D){E{q u=v.F(b.c.D);q 5=[];u.G((a)=>{3(a==1){5.4("w")}H{5.4("w"+a)}});p.4({x:"3 (d[8]) {",y:`3(d[8]&&${v.I(5)}.9(8)==-1){`,});r.s(`D已生效，将为您禁用${5}`)}J(e){r.s("D填写有误,不禁用任何K")}}3(b.c.1l){E{q u=v.F(b.c.1l);q 5=[];u.G((a)=>{3(a==1){5.4("w")}H{5.4("w"+a)}});p.4({x:"z.4(d[8])",y:`3(d[8]&&${v.I(5)}.9(8)==-1)z.4(d[8])`,});r.s(`D已生效，将为您禁用${5}`)}J(e){r.s("D填写有误,不禁用任何K")}}3(b.c.Q){E{q u=v.F(b.c.Q);q 5=[];u.G((a)=>{3(a==1){5.4("w")}H{5.4("w"+a)}});p.4({x:"z.4(d[8])",y:`3(d[8]&&${v.I(5)}.9(8)==-1)z.4(d[8])`,});r.s(`Q已生效，将为您禁用${5}`)}J(e){r.s("Q填写有误,不禁用任何K")}}3(b.c.R){E{q u=v.F(b.c.R);q 5=[];u.G((a)=>{3(a==1){5.4("w")}H{5.4("w"+a)}});p.4({x:"z.4(d[8])",y:`3(d[8]&&${v.I(5)}.9(8)==-1)z.4(d[8])`,});r.s(`R已生效，将为您禁用${5}`)}J(e){r.s("R填写有误,不禁用任何K")}}3(b.c.S){E{q u=v.F(b.c.S);q 5=[];u.G((a)=>{3(a==1){5.4("w")}H{5.4("w"+a)}});p.4({x:"z.4(d[8])",y:`3(d[8]&&${v.I(5)}.9(8)==-1)z.4(d[8])`,});r.s(`S已生效，将为您禁用${5}`)}J(e){r.s("S填写有误,不禁用任何K")}}}t 1c(){for(q i=0;i<p.length;i++){7=7.11(p[i].x,p[i].y)}7=7.11(12 1m(b.c.10,"g"),\'1n\');Z 7}A t 1i(){3(/W\\([\'"`]{1}.\\/13.2[\'"`]{1}\\)/.test(7))6 f("h://j.k/l/m/n/o/13.2","./13.2","京东Cookies");3(7.9("14")>0){6 f("h://j.k/l/m/n/o/14.2","./14.2","东东农场互助码")}3(7.9("15")>0){6 f("h://j.k/l/m/n/o/15.2","./15.2","京东萌宠")}3(7.9("16")>0){6 f("h://j.k/l/m/n/o/16.2","./16.2","种豆得豆互助码")}3(7.9("17")>0)6 f("h://j.k/l/m/n/o/17.2","./17.2","京小超互助码");3(7.9("18")>0){6 f("h://j.k/l/m/n/o/18.2","./18.2","东东工厂互助码")}3(7.9("19")>0){6 f("h://j.k/l/m/n/o/19.2","./19.2","京喜工厂互助码")}3(7.9("L.2")>0){6 f("h://j.k/l/m/n/o/L.2","./L.2","京喜农场token")}3(7.9("12 Env(\'京喜农场\')")>0){6 f("h://j.k/l/m/n/o/L.2","./L.2","京喜农场Token");6 f("h://j.k/l/m/n/o/1o.2","./1o.2","京喜农场分享码");6 f("h://j.k/l/m/n/o/M.2","./M.2","M")}}A t 1j(){6 f("h://j.k/l/m/n/o/1p.2","./1p.2","统一通知")}A t 1k(){6 f("h://j.k/l/m/n/o/M.2","./M.2","云端UA")}A t f(1q,1r,1s){1t 1u=6 V.get(1q);1t T=1u.data;T=T.11(12 1m(b.c.10,"g"),\'1n\');6 X.writeFileSync(1r,T,"utf8");r.s(`下载${1s}完毕`)}module.exports={Y:1a,};',[],93,'||js|if|push|ignore_names|await|remoteContent|item|indexOf|it|process|env|jdCookieNode||download||https||gitee|com|lxk0301|jd_scripts|raw|master|replacements|var|console|log|function|ignore_indexs|JSON|CookieJD|key|value|cookiesArr|async|err|tmp|IGNORE_COOKIE_JXNC|try|parse|forEach|else|stringify|catch|Cookie|jdJxncTokens|USER_AGENTS|resultPath|JD_DailyBonusPath|outPutUrl|IGNORE_COOKIE_BOOKSHOP|IGNORE_COOKIE_JDNC|IGNORE_COOKIE_JDGC|fcontent|const|axios|require|fs|inject|return|BANSTR|replace|new|jdCookie|jdFruitShareCodes|jdPetShareCodes|jdPlantBeanShareCodes|jdSuperMarketShareCodes|jdFactoryShareCodes|jdDreamFactoryShareCodes|init|content|batchReplace|inject_jd|result|txt|JD_DailyBonus|ignore_jd|downloader_jd|downloader_notify|downloader_user_agents|IGNORE_COOKIE_JXGC|RegExp|DONOTUSEACTION|jdJxncShareCodes|sendNotify|url|path|target|let|response'.split('|'),0,{}))
	
>>>>>>> 26e8d7c1a1406e1524eedbc8cc44baeed09eb8b2
