importClass(java.lang.Thread);
const BufferedReader = java.io.BufferedReader;
const DataOutputStream = java.io.DataOutputStream;
const InputStreamReader = java.io.InputStreamReader;
const HttpURLConnection = java.net.HttpURLConnection;
const XMLHttpRequest = java.net.XMLHttpRequest;
const URL = java.net.URL;
const URLEncoder = java.net.URLEncoder;
importClass(java.io.File);
importClass(org.jsoup.Jsoup);

const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
const Config = JSON.parse(FileStream.read("sdcard/rpg_config.json"));
const VERSION = Config["Version"];
const PREFIX = Config["Prefix"];
const blank = "\u200b".repeat(500);
const RPG_SETTING = "sdcard/[RPG]/Setting/";
const RPG_SKILL = "sdcard/[RPG]/Setting/Skill/";
const RPG_USER = "sdcard/[RPG]/USER/";
const RPG_ROOM = Config["MainRoom"];

const hurt = {};

const MapRPG = {};
const NBT = {};

const skinCreate = {};
const skinType = {};
const skin = {};

const Party = [];
const Partys = [];
const PartyUser = [];
const PartyLock = [];
const PartyInvite = [];

const toTalk = {};
const toWhat = {};
const that = {};
const seanpc = {};
const npctalk = {};
const battlenpc = {};
const npcmsg = {};

const npc = {};
const npcJob = {};
const npcBuyname = {};
const npcBuyprice = {};
const npcBuyatk = {};
const npcBuydef = {};
const npctype = {};
const npcSay = {};
const npcC = {};
const npcCheck = {};

const mob = {};

const c = {};

const ITEM = JSON.parse(FileStream.read(RPG_SETTING + "items.json"));
//const QUEST = JSON.parse(FileStream.read(RPG_SETTING + "quests.json"));
const MONSTER = RPG_SETTING + "Monsters/";
//const MAP = JSON.parse(FileStream.read(RPG_SETTING + "map.json"))

const BAR_1 = "𝄀";
const BAR_2 = ":";
const BAR_3 = "Ι";
const BAR_4 = "|";
const BAR_5 = "⸽";

/* Player Action */
const PlayerAction = {};
const PlayerYN = {};

const mhp = {};

const math = Bridge.getScopeOf("math.js");

function setHealthBar(health,max,tag,percent){
    if(typeof health != "number" || !health) return false;
    if(typeof max != "number" || !health) return false;
    let hpTmp = health;
    let perHp = max/10;
    let result = "";
    for(i=0; i>-1; i++){
        if(health<perHp){
        var perHp8 = perHp/8;
            if(health<perHp8){
            }
            else if(perHp8<=health && health<perHp8*2){
                result += "▏";
            }
            else if(perHp8*2<=health && health < perHp8*3){
                result += "▎";
            }
            else if(perHp8*3<=health && health < perHp8*4){
                result += "▍";
            }
            else if(perHp8*4<=health && health < perHp8*5){
                result += "▌";
            }
            else if(perHp8*5<=health && health < perHp8*6){
                result += "▋"
            }
            else if(perHp8*6<=health && health < perHp8*7){
                result += "▊";
            }
            else if(perHp8*7<=health && health < perHp8*8){
                result += "▉";
            }
            break;
            }
        health -= perHp;
        result += "█";
    }
    if(!percent){
        result = tag+": ("+hpTmp+"/"+max+")\n"+result;
    }
    else{
        result = tag+": "+((hpTmp/max)*100).toFixed(2)+"%\n"+result;
    }
    return result;
}
function rm(msg, room) {
	//var timea = new Date().getTime();
    if (room == undefined) room = RPG_ROOM;
    Api.replyRoom(room, PREFIX + msg);
    /*var timeb = new Date().getTime();
    var ms = (timeb - timea);
    Api.replyRoom(room, "응답속도: " + ms + "ms");*/
}
objectBar = function(objectMin, objectMax, bar) {
    var length = 10;
    var value = objectMin;
    var max = objectMax;
    var per = Math.floor(value / max * length);
    var result = bar.repeat(per) + " ".repeat(max + per) + bar;

    return result;
}

function JSONSave(file, obj) {
    FileStream.write(file, JSONClean(obj));
}

function makeMob() {
    for (var i = 10; i <= 118; i++) {
        var fileon = "<?php\n\ndeclare(strict_types=1);\n\nnamespace LEADTV\\HexaMonster\\entity;\n\nuse pocketmine\\entity\\Monster;\nuse pocketmine\\entity\\Entity;\n\nclass CustomMob_" + i + " extends Monster{\n\n   public $networkId = " + i + ";\n   public const NETWORK_ID = " + i + ";\n   public $realName;\n   public $skill = '힐';\n   public $monsterSpeed = 0.4;\n   public $width = 0.6;\n   public $height = 1.95;\n\n\n   public function getRealName(){\n      return $this->realName;\n   }\n\n   public function setRealName($name){\n      $this->realName = $name;\n   }\n    public function getName() : string{\n    return 'CustomMob_" + i + "';\n    }\n}";
        FileStream.write("sdcard/Mobs/CustomMob_" + i + ".php", fileon);
    }
}

function user(target, res, to) {
    var Data = data(target);
    Data[res] = to;
    var result = JSONClean(Data);
    var write = FileStream.write(RPG_USER + target + ".json", result);
    return write;
}

function read(target) {
    return JSON.parse(FileStream.read(RPG_USER + target + ".json"));
}

function write(target, res) {
    var result = JSONClean(res);
    var write = FileStream.write(RPG_USER + target + ".json", result);
    return write;
}

function data(target) {
    return JSON.parse(FileStream.read(RPG_USER + target + ".json"));
}

function addInventory(player, item) {
    try {
        var Inv = JSON.parse(FileStream.read(RPG_USER + "INVENTORY/data/" + player + ".json"));
        Inv[item] = {};
        Inv[item]["Durability"] = ITEM[item]["Durability"];
        var finalData = JSONClean(Inv);
        FileStream.write(RPG_USER + "INVENTORY/data/" + player + ".json", finalData);

        var Inv = JSON.parse(FileStream.read(RPG_USER + "INVENTORY/" + player + ".json"));
        Inv.push(item);
        var finalData = JSONClean(Inv);
        FileStream.write(RPG_USER + "INVENTORY/" + player + ".json", finalData);
    } catch (e) {
        var Inv = JSON.parse(FileStream.read(RPG_USER + "INVENTORY/" + player + ".json"));
        Inv.push(item);
        var finalData = JSONClean(Inv);
        FileStream.write(RPG_USER + "INVENTORY/" + player + ".json", finalData);
    }
}

function removeInventory(player, item, type) {
    if (type == undefined) type = "없음";
    if (isItem(item) == "true") {
        if (ITEM[item]["Durability"] !== undefined) {
            var ItemData = getDataInventory(player);
            delete ItemData[item];
            var finalData = JSONClean(ItemData);
            FileStream.write(RPG_USER + "INVENTORY/data/" + player + ".json", finalData);

            var Inv = JSON.parse(FileStream.read(RPG_USER + "INVENTORY/" + player + ".json"));
            Inv.pop(item);
            var finalData = JSONClean(Inv);
            FileStream.write(RPG_USER + "INVENTORY/" + player + ".json", finalData);
        }
        if (type == "장착") {
            var Inv = JSON.parse(FileStream.read(RPG_USER + "INVENTORY/" + player + ".json"));
            Inv.pop(item);
            var finalData = JSONClean(Inv);
            FileStream.write(RPG_USER + "INVENTORY/" + player + ".json", finalData);
        }
    }
    var Inv = JSON.parse(FileStream.read(RPG_USER + "INVENTORY/" + player + ".json"));
    Inv.pop(item);
    var finalData = JSONClean(Inv);
    FileStream.write(RPG_USER + "INVENTORY/" + player + ".json", finalData);
}

function getInventory(player) {
    var Inv = JSON.parse(FileStream.read(RPG_USER + "INVENTORY/" + player + ".json"));
    return JSONClean(Inv);
}

function isItem(item) {
    if (ITEM[item] == undefined) {
        return "false";
    }
    if (ITEM[item] !== undefined) {
        return "true";
    }
}

function isDurabilityItem(item) {
    if (isItem(item) == "false") {
        return "false";
    }
    if (isItem(item) == "true") {
        if (ITEM[item]["Durability"] == undefined) {
            return "false";
        }
        if (ITEM[item]["Durability"] !== undefined) {
            return "true";
        }
    }
}

function getItemInfo(item) {
    var B = "- - - - - - - - - - - -";
    var Info = [];
    if (ITEM[item] == undefined) {
        Info.push(B);
        Info.push("· 이름 : " + item);
        Info.push("· ID : ?");
        Info.push(B);
    }
    if (ITEM[item] !== undefined) {
        if (ITEM[item]["type"] == "장비") {
            if (ITEM[item]["armor"] !== undefined) {
                Info.push(B);
                Info.push("· 이름 : " + ITEM[item]["name"]);
                Info.push("· ID : " + ITEM[item]["Id"]);
                Info.push("· 타입 : " + ITEM[item]["type"]);
                Info.push("· 내구도 : ?/" + ITEM[item]["Durability"]);
                Info.push("· 보호 : " + ITEM[item]["armor"]);
                Info.push(B);
            }
            if (ITEM[item]["damage"] !== undefined) {
                Info.push(B);
                Info.push("· 이름 : " + ITEM[item]["name"]);
                Info.push("· ID : " + ITEM[item]["Id"]);
                Info.push("· 타입 : " + ITEM[item]["type"]);
                Info.push("· 내구도 : ?/" + ITEM[item]["Durability"]);
                Info.push("· 데미지 : " + ITEM[item]["damage"]);
                Info.push(B);
            }
        }
    }
    return Info.join("\n");
}

function GameToolInventory(player, room) {
    var inv = JSON.parse(FileStream.read(RPG_USER + "INVENTORY/" + player + ".json"));
    var res = [];
    var a = {};
    inv.map(function(s) {
        a[s.toSource()] = (isNaN(a[s.toSource()]) ? 0 : a[s.toSource()]) + 1;
    });
    for (var i = 0; i < inv.length; i++) {
    if (ITEM[inv[i]] == undefined){
    	res.push("═══════════\n["+i+"번 슬롯] [?] " + inv[i] + " "+a[inv[i].toSource()]+"x");
    } else {
    	res.push("═══════════\n["+i+"번 슬롯] ["+ITEM[inv[i]]["type"]+"] " + ITEM[inv[i]]["name"] + " "+a[inv[i].toSource()]+"x");
    }
    }
    rm("::::: " + sender + " 님의 인벤토리 :::::\n" + res.join("\n"), room);
}

function selectJob(player, job) {
    if (job == "마법사") {
        var sData = data(player);
        sData["JOB"] = "마법사";
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (job == "전사") {
        var sData = data(player);
        sData["JOB"] = "전사";
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (job == "버서커") {
        var sData = data(player);
        sData["JOB"] = "버서커";
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    return "| 전 직 |\n" + job + " 으로 전직 하였습니다.";
}

function useSkill(player, skill) {
    try {
        skill = JSON.parse(FileStream.read(RPG_SKILL + skill + ".json"));
        if (skill["damage"] !== 0) {
            mhp[player] -= skill["damage"];
            return "| 스킬 사용 |\n이름 : " + skill["name"] + "\n· 몬스터에게 " + skill["damage"] + " 데미지 공격!";
        } else if (skill["hp"] !== 0) {
            var sData = data(player);
            sData["HP"] += skill["hp"]
            var finalData = JSONClean(sData);
            FileStream.write(RPG_USER + player + ".json", finalData);
            return "| 스킬 사용 |\n이름 : " + skill["name"] + "\n· 체력 " + skill["hp"] + " 충전!";
        } else if (skill["mana"] !== 0) {
            var sData = data(player);
            sData["MANA"] += skill["mana"]
            var finalData = JSONClean(sData);
            FileStream.write(RPG_USER + player + ".json", finalData);
            return "| 스킬 사용 |\n이름 : " + skill["name"] + "\n· 마나 " + skill["mana"] + " 충전!";
        }
    } catch (e) {
        return "없는 스킬 입니다.";
    }
}

function Equipment(player, type, item) {
    if (getInventory(player).indexOf(item) == -1) {
        return "아이템이 없습니다.";
    }
    if (type == "머리") {
        removeInventory(player, item, "장착");
        var sData = data(player);
        sData["Head"] = item;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (type == "몸통") {
        removeInventory(player, item, "장착");
        var sData = data(player);
        sData["Chestplate"] = item;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (type == "다리") {
        removeInventory(player, item, "장착");
        var sData = data(player);
        sData["Leggings"] = item;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (type == "발") {
        removeInventory(player, item, "장착");
        var sData = data(player);
        sData["Boots"] = item;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (type == "손") {
        removeInventory(player, item, "장착");
        var sData = data(player);
        sData["Hand"] = item;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
}

function seeShop(player, type, item) {
    var pd = data(player);
    var place = pd["PLACE"];
    var shop = JSON.parse(FileStream.read(RPG_SETTING + "Shop/" + place + ".json"));
    if (shop == null) {
        return "상점이 존재하지 않습니다.";
    }
    if (type == "sell") {
        if (shop["sells"].indexOf(item) == -1) {
            return item + " 아이템은 판매 할수 없습니다.";
        }
        if (getInventory(player).indexOf(item) == -1) {
            return "아이템이 없습니다.";
        }
        removeInventory(player, shop[item]["name"]);
        var sData = data(player);
        sData["BRONZE"] += shop[item]["sell"];
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
        return item + " 을(를) 판매 하셨습니다.\n얻은 브론즈 : " + shop[item]["sell"] + " BRONZE";
    }
    if (type == "buy") {
        if (shop["buys"].indexOf(item) == -1) {
            return item + " 아이템은 구매 할수 없습니다.";
        }
        if (ITEM[shop[item]["name"]]["type"] == "장비") {
            if (getInventory(player).indexOf(ITEM[shop[item]["name"]]) != -1) {
                return "※ 장비는 한개만 소유 가능 합니다.\n창고에 보관하거나 버려주세요.";
            }
        }
        if (shop[item]["buy"] >= pd["BRONZE"]) {
            return "브론즈가 부족합니다.";
        }
        if (pd["BRONZE"] >= shop[item]["buy"]) {
            addInventory(player, item);
            var sData = data(player);
            sData["BRONZE"] -= shop[item]["buy"];
            var finalData = JSONClean(sData);
            FileStream.write(RPG_USER + player + ".json", finalData);
            return item + " 을(를) 구매 하셨습니다.";
        }
    }
    if (type == "보기") {
        return "| " + place + " - 상점 |\n( 구매 물품 )\n| " + shop["buys"].join("\n| ") + "\n( 판매 물품 )\n| " + shop["sells"].join("\n| ");
    }
    if (type == "아이템보기") {
        return "| " + item + " |\n구매가: " + shop[item]["buy"] + " 브론즈\n판매가: " + shop[item]["sell"] + " 브론즈";
    }
}

function GameToolRegister(room, msg, player, isGroupChat, replier, ImageDB, packageName, threadId) {
    if (c[player] == true) {
        if (msg == "Y") {
            rm(Config["Prefix"] + " - 회원가입 완료", room);
            var Inventory = ["나무 검", "지도", "스테이크"];

            var PlayerData = {
                "nick": player,
                "Id": java.lang.String(ImageDB.getProfileImage()).hashCode(),
                "ATK": 10,
                "DEF": 5,
                "LEVEL": 1,
                "HP": 20,
                "MAX_HP": 20,
                "EXP": 0,
                "MAX_EXP": 100,
                "MANA": 20,
                "MAX_MANA": 20,
                "SKILLS": [],
                "XYZ": [0, 0, 0],
                "QUEST": [],
                "NOW_QUEST": "x",
                "ENTITY": [],
                "EFFECT": [],
                "PLACE": "이즈마을",
                "GameTool": 0,
                "CRASTAL": 0,
                "DARK_CRASTAL": 0,
                "WATER_CRASTAL": 0,
                "EMERALD": 0,
                "RUBI": 0,
                "GOLD": 5,
                "SILVER": 20,
                "BRONZE": 500,
                "SP": 3,
                "ROON": {},
                "Head": {},
                "Chestplate": {},
                "Leggings": {},
                "Boots": {},
                "Hand": {},
                "HairType": "일반",
                "HeadType": "일반",
                "FIRST": time,
                "STAT": {
                    "HP": 0,
                    "DEF": 0,
                    "LUK": 0
                }
            };
            write(player, PlayerData);
            FileStream.write(RPG_USER + "INVENTORY/" + player + ".json", JSONClean(Inventory));
            FileStream.write(RPG_USER + "INVENTORY/data/" + player + ".json", JSONClean({}));
            c[player] = false;
        }
        if (msg == "N") {
            rm("회원가입이 취소 되었습니다.", room);
        }
    }
    if (msg == "G회원가입") {
        var day = new Date();
        var year = day.getFullYear();
        var month = day.getMonth() + 1;
        var inday = day.getDate();
        var min = day.getMinutes();
        var hour = day.getHours();
        var second = day.getSeconds();

        var time = year + "년 " + month + "월 " + inday + "일 " + hour + "시 " + min + "분 " + second + "초";
        /*try{
        	var Playerdata = data(player);
        	var d = Playerdata["LEVEL"];
        	rm("이미 회원가입 했습니다. ["+d+"]", room);
        	return;
        } catch(e) {*/
        var Rule = FileStream.read(RPG_SETTING + "Rule.json");
        rm(Config["Prefix"] + " - Register" + "\n[ 규칙 ]" + blank + "\n" + Rule.join("\n\n"), room);
        rm("동의 함 : Y | 동의 하지 않음 : N\n동의 불가시 게임 플레이가 불가 합니다.", room);
        c[player] = true;
    }
}

function waitM(ms) {
    return java.lang.Thread.sleep(ms);
}

function wait(second) {
    return waitM(1000 * second);
}

function lang(msg) {
    return JSON.parse(FileStream.read(RPG_SETTING + "lang" + ".json"))[msg];
}

function EvalO(sender, room, msg, replier) {
    try {
        if (msg.indexOf("G실행") == 0 && sender == "LEAD") {
            rm("\nResult/Reply : " + eval(msg.replace("G실행", "")), room);
        }
    } catch (e) {
        var ev = msg.replace("G실행", "");
        var code = [];
        for (var i = 0; i <= ev.split("\n").length; i++) {
            code.push("| " + i + " | " + ev.split("\n")[i] + "\n" + "=-".repeat(10));
        }

        rm("\n[ Eval(ERROR) ]\n내용 : " + e + "\n라인 : " + e.lineNumber + "줄" + blank + "\n(B) 봇 오류가 아닌 마스터의 코드 실행으로 난 오류 입니다.\· 코드\n" + code.join("\n"), room);
    }
}

function Hair(player, type, room) {
    var symble_hair = "■";
    var symble_hair2 = "□";
    var hair = [];
    var symble = ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"];

    // 헤어 스타일 [ 남성 ]

    // : 일반 :
    if (type == "일반") {
        hair.push(symble_hair.repeat(15));
        hair.push(symble_hair.repeat(15));
        hair.push(symble_hair.repeat(15));
        return "\n" + hair.join("\n");
    }
    // : 가르마 :
    if (type == "가르마") {
        hair.push(symble_hair.repeat(15));
        hair.push(symble_hair.repeat(8) + symble_hair2.repeat(7));
        hair.push(symble_hair.repeat(7) + symble_hair2.repeat(8));
        hair.push(symble_hair.repeat(6) + symble_hair2.repeat(9));
        return "\n" + hair.join("\n");
    }
    // : 모자 :
    if (type == "모자") {
        hair.push("ㅤㅤㅤㅤㅤㅤ" + symble_hair.repeat(6) + "ㅤㅤㅤㅤ");
        hair.push("ㅤㅤㅤㅤㅤ" + symble_hair2.repeat(8) + "ㅤㅤㅤㅤ");
        hair.push("ㅤㅤㅤㅤ" + symble_hair2.repeat(10) + "ㅤㅤㅤㅤ");
        hair.push("ㅤㅤㅤ" + symble_hair2.repeat(12) + "ㅤㅤㅤ");
        hair.push("ㅤㅤ" + symble_hair2.repeat(14) + "ㅤㅤ");
        hair.push("ㅤ" + symble_hair2.repeat(16) + "ㅤ");
        hair.push(symble_hair.repeat(18));
        hair.push("ㅤ" + symble_hair.repeat(15));
        hair.push("ㅤ" + symble_hair.repeat(15));
        return "\n" + hair.join("\n");
    }
}

function Head(player, type) {
    var symble_hair = "□";
    var symble_hair2 = "◆";
    var head = [];
    var symble = ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"];
    if (type == "일반") {
        head.push(symble_hair.repeat(15));
        head.push(symble_hair.repeat(3) + "```" + symble_hair.repeat(7) + "```" + symble_hair.repeat(3));
        head.push(symble_hair.repeat(3) + "●" + symble_hair.repeat(7) + "●" + symble_hair.repeat(3));
        head.push(symble_hair.repeat(15));
        head.push(symble_hair.repeat(7) + "▲" + symble_hair.repeat(7));
        head.push(symble_hair.repeat(15));
        head.push(symble_hair.repeat(5) + "-------" + symble_hair.repeat(5));
        return "\n" + head.join("\n");
    }
}

function select_battleMonster(player, mon, replier, room) {
    var md = JSON.parse(FileStream.read(MONSTER + mon + ".json"));
    var hp = objectBar(md["hp"], md["maxhp"], BAR_5);
    var exp = md["exp"];
    var nick = md["name"];
    var level = md["level"]
    var p = data(player);
    var _hp = objectBar(p["HP"], p["MAX_HP"], BAR_5);
    var title = "Ω\n";
    var mon_battle = "LV." + level + " " + nick + " > " + "HP " + hp + "\n";
    var pla_battle = "LV." + p["LEVEL"] + " " + player + " > " + "HP " + _hp + "\n";
    var battle = title + mon_battle + pla_battle;

    mob[player] = {
        "name": md["name"],
        "maxhp": md["maxhp"],
        "level": md["level"],
        "exp": md["exp"],
        "drops": md["drops"],
        "damage": md["damage"],
        "bronze": Math.floor(Math.random() * 30) * md["level"],
        "silver": Math.floor(Math.random() * 5) * md["level"],
        "gold": Math.floor(Math.random() * 3) * md["level"]
    };
    mhp[player] = Number(md["hp"]);
rm(battle, room);
for (;;){
	Thread.sleep(1000 * 5);
if (mhp[player] >= 0){
monsterHurt(player, room);
mhp[player] -= mhp[player]/20;
}
if (0 >= mhp[player] || 0 >= p["HP"]){
	break;
}
}

}
function bar2(ex,max,type){ 
var exp=ex/max*100; 
if(exp>100) return "100퍼 이상입니다."; 
type=type?exp.toFixed(2)+"%":ex+"/"+max; 
exp=Math.round(exp); 
const rects = {0:"",1 : "▏",2 : "▎",3 : "▍",4 : "▌",5 : "▋",6 : "▊",7 : "▉",8 : "█",9 : "█"} 
return "█".repeat(exp/10)+rects[exp%10]+" ".repeat((100-exp)/10)+":"+type 
}
function battleMonster(player, room) {
    var monsters = [
        "토끼",
        "당나귀",
        "돼지"
    ];
    var mathrand = Math.floor(Math.random() * monsters.length);
    var mon = monsters[mathrand];
    var md = JSON.parse(FileStream.read(MONSTER + mon + ".json"));
    var hp = objectBar(md["hp"], md["maxhp"], BAR_5);
    var exp = md["exp"];
    var nick = md["name"];
    var level = md["level"]
    var p = data(player);
    var _hp = objectBar(p["HP"], p["MAX_HP"], BAR_5);
    var title = "Ω\n";
    
    mob[player] = {
        "name": md["name"],
        "maxhp": md["maxhp"],
        "level": md["level"],
        "exp": md["exp"],
        "drops": md["drops"],
        "damage": md["damage"],
        "bronze": Math.floor(Math.random() * 30) * md["level"],
        "silver": Math.floor(Math.random() * 5) * md["level"],
        "gold": Math.floor(Math.random() * 3) * md["level"]
    };
    mhp[player] = Number(md["hp"]);
    
hurt[player] = md["name"];
    
    var mon_battle = "LV." + level + " " + setHealthBar(mhp[player],md["maxhp"],nick,true) + "\n";
    var pla_battle = "LV." + p["LEVEL"] + " " + setHealthBar(p["HP"],p["MAX_HP"],player,true) + "\n";
    var battle = title + mon_battle + pla_battle;
rm(battle, room);
for (;;){
	Thread.sleep(1000 * 5);
if (mhp[player] >= 0){
monsterHurt(player, room);
mhp[player] -= mhp[player]/20;
}
if (0 >= mhp[player] || 0 >= p["HP"]){
	break;
}
}
}

function infoMonster(mob, replier) {
    var mon = mob[player]["name"];
    var md = JSON.parse(FileStream.read(MONSTER + mon + ".json"));
    var battle = "[ 몬스터 도감 ]\n이름 : " + mon + "\n체력 : " + md["hp"] + "\n드롭하는 아이템 : \n|" + md["drops"].join("\n| ") + "\n드롭하는 경험치 : " + md["exp"];
    replier.reply(battle);
}

function displayBattle(player) {
    var mon = mob[player]["name"];
    var md = JSON.parse(FileStream.read(MONSTER + mon + ".json"));
    var hp = objectBar(mhp[player], md["maxhp"], BAR_5);
    var exp = md["exp"];
    var nick = md["name"];
    var level = md["level"]
    var p = data(player);
    var _hp = objectBar(p["HP"], p["MAX_HP"], BAR_5);
    var title = " ".repeat(3) + "Ω" + " ".repeat(3) + "\n";
    var mon_battle = "LV." + level + " " + setHealthBar(mhp[player],md["maxhp"],nick,true) + "\n";
    var pla_battle = "LV." + p["LEVEL"] + " " + setHealthBar(p["HP"],p["MAX_HP"],player,true) + "\n";
    var battle = title + mon_battle + pla_battle;
    return battle;
}

function monsterHurt(player, room) {
    var mon = mob[player];
    var d = mon["damage"];
    var game = data(player);
    rm(mon["name"]+" 이(가) "+player+" 님을 공격 할려합니다!", room);
    java.lang.Thread.sleep(1000 * 2);
    var damage = mon["damage"];
     var RegData = data(player);
     RegData["HP"] -= damage;
     var finalData = JSONClean(RegData);
     FileStream.write(RPG_USER + player + ".json", finalData);
    rm(mon["name"]+" 이(가) "+player+" 님에게 "+damage+" 데미지를 입혔습니다!", room);
    rm(displayBattle(player), room);
}

function playerHurt(player) {
    var mon = mob[player];
    var game = data(player);
    mhp[player] -= game["ATK"];
    if (0 >= mhp[player]) {
        var i = mon["drops"];
        var inv = JSON.parse(FileStream.read(RPG_USER + "INVENTORY/" + player + ".json"));
        var res = [];
        if (ITEM[i] !== undefined) {
            res = "ID : " + ITEM[i]["Id"] + " | " + ITEM[i]["name"];
        }
        if (ITEM[i] == undefined) {
            res = "ID : " + "?" + " | " + i;
        }
        var RegData = data(player);
        RegData["EXP"] += mon["exp"];
        RegData["BRONZE"] += mon["bronze"];
        RegData["SILVER"] += mon["silver"];
        RegData["GOLD"] += mon["gold"];
        var finalData = JSONClean(RegData);
        FileStream.write(RPG_USER + player + ".json", finalData);
        addInventory(player, i);
        mhp[player] = mon["hp"];
        return mon["name"] + " 을(를) 사냥 하였습니다!\n보상 : [" + res + "]\n+ "+mon["bronze"]+" 브론즈\n+ "+mon["silver"]+" 실버\n+ "+mon["gold"]+" 골드";
    }
    return "나의 공격!\n" + displayBattle(player) + "\n" + mhp[player];
}

function Heal(player){
	var g = data(player);
	if (g["SILVER"] >= 50){
		 var RegData = data(player);
		RegData["HP"] = RegData["MAX_HP"];
		 var finalData = JSONClean(RegData);
        FileStream.write(RPG_USER + player + ".json", finalData);
		return "회복 하였습니다.";
	}
	if (50 >= g["SILVER"]){
		return "회복 할려면 50 실버가 필요 합니다.";
	}
}
function skinView(player){
	var game = data(player);
	var sk = getSkinData(player);
	var a = [
    "ㅤ" + sk[game["Skin"]]["머리"].join("\nㅤㅤ") +
    "\nㅤ" + sk[game["Skin"]]["몸통"].join("\nㅤ") +
     "\nㅤㅤ" + sk[game["Skin"]]["다리"].join("\nㅤㅤ")
     ];
     return a.join("");
}
function GameToolInfo(player, room) {
    try {
        var Rdata = read(player);
        var game = data(player);
        rm(
            "[" + player + "] 님의 정보" +
            "\n· 내 ID : " + Rdata["Id"] +
            "\n· 체력 : " + game["HP"] + "/" + game["MAX_HP"] +
            "\n· 레벨 : " + game["LEVEL"] +
            "\n· 지역 : " + game["PLACE"] +
            "\n· 경험치 : " + game["EXP"] + "/" + game["MAX_EXP"] +
            "\n· 마나 : " + game["MANA"] + "/" + game["MAX_MANA"] + blank +
            "\n\n\n· 장착 정보" +
            "\n· 머리 : " + game["Head"] +
            "\n· 몸통 : " + game["Chestplate"] +
            "\n· 다리 : " + game["Leggings"] +
            "\n· 발 : " + game["Boots"] +
            "\n· 머리 : " + game["Hand"] +
            "\n=< 스킨 ( 베타 ) >=" +
            "\nG스킨뷰 - 현재 장착한 스킨을 봅니다."+
            "\n· 룬" +
            "\n추가 예정" +
            "\n" +
            "\n[ 골드 : " + game["GOLD"] + " /  실버 : " + game["SILVER"] + " ]" +
            "\n[ Ω : " + game["GameTool"] + " / 크리스탈 : " + game["CRASTAL"] + " ]" +
            "\n[ 다크 크리스탈 : " + game["DARK_CRASTAL"] + " / 워터 크리스탈 : " + game["WATER_CRASTAL"] + " ]" +
            "\n[ 에메랄드 : " + game["EMERALD"] + " / 루비 : " + game["RUBI"] + " ]" +
            "\n" + "\n[ 브론즈 : " + game["BRONZE"] + " ]", room);
        return;
    } catch (e) {
        rm("로그인 이나 회원가입을 해주세요+", room);
        return;
    }
}

function getQuest(quest) {
    return QUEST[quest];
}

function playerQuest(player) {
    if (data(player)["NOW_QUEST"] == "x") {
        return undefined;
    }
    return getQuest(data(player)["NOW_QUEST"])["Name"];
}

function infoQuest(player) {
    Qdata = getQuest(data(player)["NOW_QUEST"]);
    info = [];
    if (Qdata["type"] == "커맨드") {
        info.push("· 추가 예정");
    }
    if (Qdata["type"] == "사냥") {
        nbt = Qdata["monster"];
        info.push("· 퀘스트 몬스터 : " + nbt["name"]);
        info.push("· 퀘스트 몬스터 사냥 횟수 : " + nbt["count"] + "번");
    }
    message = [
        "[" + Qdata["Name"] + "] 퀘스트를 진행 합니다+" + blank +
        "\n· 퀘스트 설명 : " + Qdata["description"] +
        "\n· 퀘스트 타입 : " + Qdata["type"] +
        "\n· 퀘스트 보상 : " + ITEM[Qdata["Reward"]["Item"]]["name"] + " (" + Qdata["Reward"]["Item"]["Count"] + "x)" +
        "\n· 퀘스트 정보 > \n" + info
    ];
    return message;
}

function priceConverter(price, type, ctype) {
    if (ctype == "브론즈") {
        if (type == "브론즈") {
            p = 0;
            return Number(price * p) + " " + ctype;
        }
        if (type == "실버") {
            p = 2;
            return Number(price * p) + " " + ctype;
        }
        if (type == "골드") {
            p = 4;
            return Number(price * p) + " " + ctype;
        }
        if (type == "루비") {
            p = 7;
            return Number(price * p) + " " + ctype;
        }
        if (type == "에메랄드") {
            p = 8;
            return Number(price * p) + " " + ctype;
        }
        if (type == "자수정") {
            p = 12;
            return Number(price * p) + " " + ctype;
        }
        if (type == "크리스탈") {
            p = 15;
            return Number(price * p) + " " + ctype;
        }
        if (type == "다크 크리스탈") {
            p = 21;
            return Number(price * p) + " " + ctype;
        }
        if (type == "오메가") {
            p = 32;
            return Number(price * p) + " " + ctype;
        }
    }
}
base64_encode = function(str) {
    var q = java.lang.String(str);
    var encodedString = java.util.Base64.getEncoder().encodeToString(q.getBytes());
    return encodedString;
}
base64_decode = function(base64str) {
    var decoded = java.util.Base64.getDecoder().decode(base64str);
    var decodedStr = new java.lang.String(decoded);
    return decodedStr;
}
MapRPG.create = function(name, entity, metadata) {
    var MapExample = {
        goto: metadata["goto"],
        npcs: metadata["npc"],
        Monster: entity,
        bgm: metadata["bgm"],
        Users: [],
        Drops: metadata["drops"],
        Metadata: base64_encode(metadata),
        npcList: metadata["npcList"]
    };
    MapExample = JSONClean(MapExample);
    FileStream.write(RPG_SETTING + "Maps/" + name + ".json", MapExample);
}
MapRPG.remove = function(name) {
    FileStream.remove(RPG_SETTING + "Maps/" + name + ".json");
}
MapRPG.read = function(name) {
    return "[ JSON Data ]\n" + FileStream.read(RPG_SETTING + "Maps/" + name + ".json");
}
MapRPG.load = function(name) {
    return JSON.parse(FileStream.read(RPG_SETTING + "Maps/" + name + ".json"));
}
MapRPG.selectMob = function(player, mob, action, replier, room) {
    if (action == "배틀") {
        select_battleMonster(player, mob, replier, room);
        return false;
    }
    if (action == "정보") {
        infoMonster(mob, replier);
        return false;
    }
    if (!(action.indexOf(["배틀", "정보"]) != -1)) {
        replier.reply("없는 명령 입니다. 명령 리스트 : [ 배틀 / 정보 ]");
        return false;
    }
}
MapRPG.selectNPC = function(player, npc, action, replier) {
    var npc = MapRPG.load(data(player)["PLACE"])["npcs"][npc];
    var messageR = Math.floor(Math.random() * npc["message"].length);
    var message = npc["message"][messageR];
    if (action == "말걸기") {
        replier.reply(npc["name"] + ": " + message);
        return;
    } else if (action == "수리") {
        if (npc["type"] == "대장장이") {
            replier.reply("수리를 하고 싶지만 개발중이네..");
            return;
        }
        if (npc["type"] !== "대장장이") {
            replier.reply("이 NPC는 수리 관련 NPC가 아닙니다.");
            return;
        }
    }
    if (!(action.indexOf(["수리", "말걸기"]) != -1)) {
        replier.reply("Gnpc선택 [이름] [말걸기/수리]");
        return;
    }
}
MapRPG.mapExist = function(name) {
    var b = new java.io.File(sdcard + RPG_SETTING + "Maps/" + name + ".json");
    if (!(b.exists())) return "no";
    if (b.exists()) return "yes";
}
MapRPG.info = function(name) {
    var mapData = MapRPG.load(name);
    var goto = "· 갈수 있는 곳 \n" + mapData["goto"].join("\n| ");
    var npcPrefix = "\n\n[ NPC (" + Number(mapData["npcList"].length) + ") ]\n";
    var npc2 = [];
    for (var i = 0; i < mapData["npcList"].length; i++) {
        npc2.push("\n| [ ID : " + i + " ] [ " + mapData["npcs"][mapData["npcList"][i]]["type"] + " ] " + mapData["npcs"][mapData["npcList"][i]]["name"]);
    }
    var npc = npcPrefix + npc2.join("\n");
    var monster = "\n\n[ 몬스터 (" + mapData["Monster"].length + ") ]\n| " + mapData["Monster"].join("\n| ");
    var bgm = "\n\n[ BGM : " + mapData["bgm"] + " ]";
    var drops = "\n떨어진 아이템 (" + mapData["Drops"].length + ") : \n| " + mapData["Drops"].join("\n| ");
    var form = "[ " + name + " ]\n" + goto + npc + monster + drops + bgm;
    return form;
}

MapRPG.createBiome = function(type) {
    var seed = Math.floor(Math.random() * 0x7FFFFFFFFFFFFFFFF);
    var percent = Math.floor(Math.random() * 100);
    /* 0.15도 */
    var snow_temp = 0.15;
    var snowBiome = [
        "얼음 평원",
        "얼음 산",
        "얼음 강",
        "차가운 해변",
        "차가운 타이가",
        "차가운 타이가 고원",
        "차가운 메가 타이가"
    ];
    /* 0.5도 */
    var water_temp = 0.5;
    var waterBiome = [
        "강",
        "바다",
        "깊은 바다"
    ];

    /* 0.6도 */
    var birch_temp = 0.6;
    var birchBiome = [
        "자작 나무 숲",
        "자작 나무 숲 고원",
        "메가 자작 나무 숲",
        "메가 자작 나무 숲 고원"
    ];

    /* 0.7 ~ 1.5*/
    var normal_temp = 0.7;
    var normalBiome = [
        "들판",
        "고원",
        "꽃 들판",
        "해변"
    ];
    var desert_temp = 1.5;
    var desertBiome = [
        "모래 사장",
        "사막",
        "메사"
    ];

    var Biomes = [
        "절벽",
        "산",
        "호수",
        "해변",
        "타이가",
        "타이가 고원",
        "메가 타이가",
        "강",
        "바다",
        "깊은 바다",
        "자작 나무 숲",
        "자작 나무 숲 고원",
        "메가 자작 나무 숲",
        "메가 자작 나무 숲 고원",
        "들판",
        "고원",
        "꽃 들판",
        "해변",
        "모래 사장",
        "사막",
        "메사"
    ];

    /* Biomes.push(snowBiome);
    Biomes.push(waterBiome);
    Biomes.push(birchBiome);
    Biomes.push(normalBiome);
    Biomes.push(desertBiome); */

    if (type == "랜덤") {
        var BiomeLength = Biomes.length;
        var BiomeRand = Math.floor(Math.random() * BiomeLength);
        var info = [{
                "seed": seed
            },
            {
                "biome": Biomes[BiomeRand]
            },
            {
                "temp": Math.floor(Math.random() * 45)
            },
            {
                "chunk": Math.floor(Math.random() * 16)
            }
        ];
        info = JSONClean(info);
        FileStream.write(RPG_SETTING + "Biomes/" + seed + ".json", info);
        return seed + "\n" + MapRPG.readBiome(seed);
    }
    var info = [{
            "seed": seed
        },
        {
            "biome": type
        },
        {
            "temp": Math.floor(Math.random() * 45)
        },
        {
            "chunk": Math.floor(Math.random() * 16)
        }
    ];
    info = JSONClean(info);
    FileStream.write(RPG_SETTING + "Biomes/" + seed + ".json", info);
    return seed + "\n" + MapRPG.readBiome(seed);
}
MapRPG.saveBiome = function(saveData, seed) {
    saveData = JSONClean(saveData);
    FileStream.write(RPG_SETTING + "Biomes/" + seed + ".json", saveData);
    return MapRPG.readBiome(seed);
}
MapRPG.readBiome = function(seed) {
    return FileStream.read(RPG_SETTING + "Biomes/" + seed + ".json");
}
MapRPG.loadBiome = function(seed) {
    return JSON.parse(FileStream.read(RPG_SETTING + "Biomes/" + seed + ".json"));
}

function randombyte(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ㄱㄴㄷㄹㅁㅂㅅGㅈㅊㅋㅁㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ★♥♡%&×÷=<>@#~^*+-_()!:;?☆♤◆☎☜♪αⓒ{}$￦◎※√π→←[]`|°·';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function stopQuest(player, quest, room) {
    rm("추가 예정", room);
}

function Nogada(player, room) {
    money = Math.floor(Math.random() * 300);
    var RegData = data(player);
    RegData["BRONZE"] += money;
    var finalData = JSONClean(RegData);
    FileStream.write(RPG_USER + player + ".json", finalData);
    rm("노가다로 " + money + " 브론즈를 얻었습니다.", room);
}

function Nodong(player, room) {
	if (player == "초롱이"){
		return;
	}
    money = Math.floor(Math.random() * 10);
    var RegData = data(player);
    RegData["SILVER"] += money;
    var finalData = JSONClean(RegData);
    FileStream.write(RPG_USER + player + ".json", finalData);
    rm("일을 하여 " + money + " 실버를 얻었습니다.", room);
}

function LevelUp(player, room) {
    var regData = data(player);
    var 필요한_EXP = regData["LEVEL"] * 75;
    if (필요한_EXP >= regData["EXP"]) {
        rm("\n| 알림 |\n· 당신의 EXP가 부족합니다.\n필요한 EXP : " + Number(필요한_EXP - regData["EXP"]), room);
    }
    if (regData["EXP"] >= 필요한_EXP) {
        var backLevel = regData["LEVEL"];
        if (regData["EXP"] >= 필요한_EXP){
        var sData = data(player);
        sData["LEVEL"] += 1;
        sData["EXP"] -= 필요한_EXP;
        sData["MAX_EXP"] = regData["LEVEL"] + 1 * 75;
        sData["MAX_HP"] += 5;
        sData["MAX_MANA"] += 5;
        sData["DEF"] += 1;
        sData["ATK"] += 2;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
        rm("\n| 알림 |\n· " + backLevel + " -> " + sData["LEVEL"], room);
        }
    }
}

function startQuest(player, quest, room) {
    Qdata = getQuest(quest);
    info = [];
    if (Qdata["type"] == "커맨드") {
        info.push("· 추가 예정");
    }
    if (Qdata["type"] == "사냥") {
        nbt = Qdata["monster"];
        info.push("· 퀘스트 몬스터 : " + nbt["name"]);
        info.push("· 퀘스트 몬스터 사냥 횟수 : " + nbt["count"] + "번");
    }
    user(player, "NOW_QUEST", quest);
    rm("[" + Qdata["Name"] + "] 퀘스트를 진행 합니다+" + blank +
        "\n· 퀘스트 설명 : " + Qdata["description"] +
        "\n· 퀘스트 타입 : " + Qdata["type"] +
        "\n· 퀘스트 보상 : " + ITEM[Qdata["Reward"]["Item"]]["name"] + " (" + Qdata["Reward"]["Item"]["Count"] + "x)" +
        "\n· 퀘스트 정보 > \n" + info,
        room);
}
/*
{
   "Monster_example":{
      "Name": "예제_몬스터",
      "description": "Description.",
      "type": "사냥",
      "monster": [
         "name": "개미",
         "count": 10,
      ],
      "Reward": [
         "Item":"나무 조각",
         "Count": 3
      ]
   }   
}
*/
function getDataInventory(player) {
    return JSON.parse(FileStream.read(RPG_USER + "INVENTORY/data/" + player + ".json"));
}

function Enchant(player, item, ench, enchLvl) {
    var IDATA = getDataInventory(player);
    if (IDATA[item]["ench"] == undefined) {
        IDATA[item]["ench"] = [];
        IDATA[item]["ench"].push(ench + ":" + enchLvl);
        FileStream.write(RPG_USER + "INVENTORY/data/" + player + ".json", JSONClean(IDATA));
        return "\n- - - - - - - - - - -\n| 인 챈 트 |\n· " + ITEM[item]["name"] + "+ 인챈트 - " + ench + "\n- - - - - - - - - - -";
    }
    if (IDATA[item]["ench"] !== undefined) {
        IDATA[item]["ench"].push(ench + ":" + enchLvl);
        FileStream.write(RPG_USER + "INVENTORY/data/" + player + ".json", JSONClean(IDATA));
        return "\n- - - - - - - - - - -\n| 인 챈 트 |\n· " + ITEM[item]["name"] + "+ 인챈트 - " + ench + "\n- - - - - - - - - - -";
    }
    return "\n- - - - - - - - - - -\n| 인 챈 트 |\n· " + ITEM[item]["name"] + "+ 인챈트 - " + ench + "\n- - - - - - - - - - -";
}
function Skin(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
	if (skinCreate[sender] !== undefined){
		if (msg.length > 15 && skinType[sender] == "머리"){
			replier.reply("최대 15칸까지만 가능합니다.");
			return;
		}
		if (msg.length > 17 && skinType[sender] == "다리"){
			replier.reply("최대 17칸까지만 가능합니다.");
			return;
		}
		if (msg.length > 32 && skinType[sender] == "몸통"){
			replier.reply("최대 32칸까지만 가능합니다.");
			return;
		}
		if(msg == "G다음"){
			if (skinType[sender] == "머리"){
			skinType[sender] = "몸통";
			replier.reply("다음 부위는 몸통 입니다.");
			return;
			}
			if (skinType[sender] == "몸통"){
			skinType[sender] = "다리";
			replier.reply("다음 부위는 다리 입니다.");
			return;
			}
			if (skinType[sender] == "다리"){
	var RegData = JSON.parse(FileStream.read(RPG_USER + "SKINS/" + sender + ".json"));
	var a = skin[sender]["이름"];
    RegData[a] = {};
    RegData[a]["머리"] = skin[sender]["머리"];
    RegData[a]["몸통"] = skin[sender]["몸통"];
    RegData[a]["다리"] = skin[sender]["다리"];
    var finalData = JSONClean(RegData);
    FileStream.write(RPG_USER + "SKINS/" + sender + ".json", finalData);
			skinCreate[sender] = undefined;
			replier.reply("끝 입니다!");
			replier.reply("· 미리보기"+blank+"\n\n\n· 머리\n"+skin[sender]["머리"].join("\n")+"\n· 몸통\n"+skin[sender]["몸통"].join("\n")+"\n· 다리\n"+skin[sender]["다리"].join("\n"));
			return;
			}
			
		}
		if (msg.indexOf("G스킨부위")==0){
		var args = msg.split(" ");
		if (args[1].indexOf(["머리","몸통","다리"])== -1){
			replier.reply("부위는 머리,몸통,다리 밖에 없습니다.");
			return;
		} else {
			skinType[sender] = args[1];
			return;
		}
	}
	if (msg == "G스킨백"){
		skin[sender][skinType[sender]].pop();
		replier.reply("스킨을 되돌렸습니다.");
		replier.reply("[ 스킨 현황 ]\n부위 : "+skinType[sender]+"\n"+skin[sender][skinType[sender]].join("\n"));
		return;
	}
		skin[sender][skinType[sender]].push(msg);
		replier.reply("[ 스킨 현황 ]\n부위 : "+skinType[sender]+"\n"+skin[sender][skinType[sender]].join("\n"));
	}
	if (msg.indexOf("G스킨제작")==0){
	try {
	var RegData = JSON.parse(FileStream.read(RPG_USER + "SKINS/" + sender + ".json"));
	var a = msg.substr(6);
	if (a == ""){
		replier.reply("G스킨제작 (스킨 이름)");
		return;
	}
    RegData[a] = {};
    RegData[a]["머리"] = [];
    RegData[a]["몸통"] = [];
    RegData[a]["다리"] = [];
    var finalData = JSONClean(RegData);
    FileStream.write(RPG_USER + "SKINS/" + sender + ".json", finalData);
    skin[sender] = {};
    skin[sender]["머리"] = [];
    skin[sender]["몸통"] = [];
    skin[sender]["다리"] = [];
    skin[sender]["이름"] = a;
    
    skinCreate[sender] = true;
    skinType[sender] = "머리";
    replier.reply("스킨 제작을 시작합니다.\nG다음 를 이용하여 마음것 제작해보세요!\n채팅 입력으로 만들수 있습니다.\n한번 입력이 스킨의 한줄 입니다.");
    return;
	} catch (e) {
		replier.reply("처음 만드셔서 다시 입력 하셔야됩니다.");
		FileStream.write(RPG_USER + "SKINS/" + sender + ".json", JSONClean({}));
		return;
		}
	}
	if (msg.indexOf("G스킨장착")==0){
	var RegData = JSON.parse(FileStream.read(RPG_USER + "SKINS/" + sender + ".json"));
	var a = msg.substr(6);
	if (a == ""){
		replier.reply("G스킨장착 (스킨 이름)");
		return;
	}
	if (RegData[a] == undefined){
		replier.reply("없는 스킨 입니다.");
		return;
	}
	var sData = data(sender);
	sData["Skin"] = a;
	var finalData = JSONClean(sData);
    FileStream.write(RPG_USER + sender + ".json", finalData);
	replier.reply("장착을 완료 하였습니다.");
	return;
	}
	if (msg == "G스킨뷰"){
		try {
			replier.reply("· 스킨 : "+data(sender)["Skin"]+"\n\n"+skinView(sender));
			return;
			} catch (e) {
				replier.reply("당신은 스킨이 없습니다.\n"+e+"\n"+e.lineNumber+" Line");
				return;
			}
		}
}
function getSkinData(player){
	return JSON.parse(FileStream.read(RPG_USER + "SKINS/" + player + ".json"));
}
function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
    var Data = msg.split(" ");
     Skin(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId);
    GameToolRegister(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId);
    //PartyPro(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId);
    if (msg == "G인벤토리데이터고치기") {
        FileStream.write(RPG_USER + "INVENTORY/data/" + sender + ".json", JSONClean({}));
        replier.reply("아이템 NBT 데이터가 적용되도록 고쳐졌습니다.");
    }
    if (msg == "G힐"){
    	replier.reply(Heal(sender));
    }
    if (msg.indexOf("G판매") == 0) {
        var args = msg.split(" ");
        if (args[1] == undefined) {
            replier.reply("G판매 (아이템 이름)");
        }
        if (args[1] !== undefined) {
            var a = msg.replace("G판매 ", "");
            replier.reply(seeShop(sender, "sell", a));
        }
    }
    if (msg.indexOf("G버리기") == 0) {
        var args = msg.replace("G버리기 ", "");
        if (getInventory(sender).indexOf(args) == -1) {
            replier.reply(args + " 아이템은 없습니다.");
            return;
        }
        removeInventory(sender, args);
        replier.reply(args + " 아이템을 버렸습니다.");
    }
    if (msg.indexOf("G장착") == 0) {
        var args = msg.split("::");
        var arg = msg.split(" ");
        if (args[1] == undefined || arg[1] == undefined) {
            replier.reply("G장착::[손/머리/몸통/다리/발] [장착할 아이템]");
        }
        if (args[1] !== undefined && arg[1] !== undefined) {
            var t = msg.replace("G장착::"+args[1]+" ", "");
            replier.reply(Equipment(sender, args[1], t));
        }
    }
    if (msg.indexOf("G구매") == 0) {
        var args = msg.split(" ");
        if (args[1] == undefined) {
            replier.reply("G구매 (아이템 이름)");
        }
        if (args[1] !== undefined) {
            var a = msg.replace("G구매 ", "");
            replier.reply(seeShop(sender, "buy", a));
        }
    }
    if (msg == "G상점") {
        replier.reply(seeShop(sender, "보기", "null"));
    }
    if (msg.indexOf("G상점보기") == 0) {
        var args = msg.split(" ");
        if (args[1] == undefined) {
            replier.reply("G상점보기 (아이템 이름)");
        }
        if (args[1] !== undefined) {
            var arg = msg.replace("G상점보기 ", "");
            replier.reply(seeShop(sender, "아이템보기", arg));
        }
    }
    if (msg.indexOf("G아이템보기") == 0) {
        var args = msg.replace("G아이템보기 ", "");
        replier.reply(getItemInfo(args));
    }
    if (msg.indexOf("G계산") == 0) {
        replier.reply("* 계산 결과\n" + calculator(msg.replace("G계산 ", "")));
    }
    if (msg == "G도움말") {
        replier.reply("[ 도움말 ]" + blank + HELP);
    }
    if (msg == "G회원가입") {
        GameToolRegister(sender, room, ImageDB);
    }
    if (msg == "G내정보") {
        GameToolInfo(sender, room);
    }
    if (msg == "G인벤토리") {
        GameToolInventory(sender, room);
    }
    if (msg == "G레벨업") {
        LevelUp(sender, room);
    }
    if (msg == "G퀘스트") {
        args = msg.split(" ");

        questHelp = [
            "· G퀘스트 정보 - 퀘스트 정보를 확인 합니다.",
            "· G퀘스트 포기 - 퀘스트를 포기 합니다."
        ];

        rm(questHelp.join("\n"), room);
    }
    if (msg == "G노가다") {
        Nogada(sender, room);
    }
    if (msg == "G일") {
        Nodong(sender, room);
    }
    if (msg == "G사냥") {
        battleMonster(sender, room);
    }
    if (msg == "G공격") {
        replier.reply(playerHurt(sender));
    }
    if (msg == "G사냥상황") {
        replier.reply(displayBattle(sender));
    }
    if (msg.indexOf("G맵정보") == 0) {
        var args = msg.substr(5);
        try {
            replier.reply(MapRPG.info(args));
        } catch (e) {
            rm(args + " 지역은 없습니다.", room);
        }
    }
    if (msg.indexOf("G몹선택") == 0) {
        var args = msg.split(" ");
        if (MapRPG.load(data(sender)["PLACE"])["Monster"].indexOf(args[1]) != -1) {
            MapRPG.selectMob(sender, args[1], args[2], replier);
        }
        if (!(MapRPG.load(data(sender)["PLACE"])["Monster"].indexOf(args[1]) != -1)) {
            replier.reply(args[1] + " 는(은) 없는 몬스터 입니다.");
        }
    }
    if (msg.indexOf("G엔피시선택") == 0) {
        var args = msg.split(" ");
        if (MapRPG.load(data(sender)["PLACE"])["npcList"].indexOf(args[1]) != -1) {
            MapRPG.selectNPC(sender, args[1], args[2], replier);
        }
        if (!(MapRPG.load(data(sender)["PLACE"])["npcList"].indexOf(args[1]) != -1)) {
            replier.reply(args[1] + " 는(은) 없는 NPC 입니다.");
        }
    }
    if (msg.indexOf("G이동") == 0) {
        var args = msg.substr(4);
        try {
            if (MapRPG.load(data(sender)["PLACE"])["goto"].indexOf(args) == -1) {
                rm("해당 지역에는 갈수 없습니다.", room);
            }
            if (MapRPG.load(data(sender)["PLACE"])["goto"].indexOf(args) != -1) {
                rm(args + " 지역으로 이동합니다!...", room);
                java.lang.Thread.sleep(1000 * 3);
                rm("@" + sender + " | 지역에 도착했습니다!", room);
                replier.reply(MapRPG.info(args));
                var RegData = data(sender);
                RegData["PLACE"] = args;
                var finalData = JSONClean(RegData);
                FileStream.write(RPG_USER + sender + ".json", finalData);
            }
        } catch (e) {
            rm(args + " 지역은 존재하지 않습니다.\n" + e + "\n" + e.lineNumber + "줄", room);
            FileStream.remove(RPG_SETTING + "Maps/" + args + ".json");
        }
    }
}
NBT.create = function(metadata) {
    return base64_encode(metadata);
}
NBT.get = function(metadata) {
    return base64_decode(metadata);
}

JSONClean = function(jsObj) {
    return JSON.stringify(jsObj, null, "\t");
}

itemCreate = function(name, metadata) {
    var itemData = JSON.parse(FileStream.read(RPG_SETTING + "items.json"));
    itemData[name] = metadata;
    var finalData = JSONClean(itemData);
    FileStream.write(RPG_SETTING + "items.json", finalData);
}
mapCreate = function(name, metadata) {
    var mapData = {};
    mapData[name] = metadata;
    var finalData = JSONClean(mapData);
    FileStream.write(RPG_SETTING + "Maps/" + name + ".json", finalData);
}
/*
var name = "???";
var meta = {};
var go = [];
var bgm = "";
var npcList = [];
var mon = [];
meta["goto"] = go;
meta["bgm"] = bgm;
meta["npcList"] = npcList;
meta["Users"] = [];
meta["Drops"] = [];
meta["Monster"] = mon;
meta["npcs"] = {};
meta["Metadata"] = base64_encode(meta);
mapCreate(name, meta);
*/
function onStartCompile(){
	rm("Reloaded.");
}
