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

const BAR_1 = "??";
const BAR_2 = ":";
const BAR_3 = "��";
const BAR_4 = "|";
const BAR_5 = "?";

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
                result += "?";
            }
            else if(perHp8*2<=health && health < perHp8*3){
                result += "?";
            }
            else if(perHp8*3<=health && health < perHp8*4){
                result += "?";
            }
            else if(perHp8*4<=health && health < perHp8*5){
                result += "?";
            }
            else if(perHp8*5<=health && health < perHp8*6){
                result += "?"
            }
            else if(perHp8*6<=health && health < perHp8*7){
                result += "?";
            }
            else if(perHp8*7<=health && health < perHp8*8){
                result += "?";
            }
            break;
            }
        health -= perHp;
        result += "?";
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
    Api.replyRoom(room, "����ӵ�: " + ms + "ms");*/
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
        var fileon = "<?php\n\ndeclare(strict_types=1);\n\nnamespace LEADTV\\HexaMonster\\entity;\n\nuse pocketmine\\entity\\Monster;\nuse pocketmine\\entity\\Entity;\n\nclass CustomMob_" + i + " extends Monster{\n\n   public $networkId = " + i + ";\n   public const NETWORK_ID = " + i + ";\n   public $realName;\n   public $skill = '��';\n   public $monsterSpeed = 0.4;\n   public $width = 0.6;\n   public $height = 1.95;\n\n\n   public function getRealName(){\n      return $this->realName;\n   }\n\n   public function setRealName($name){\n      $this->realName = $name;\n   }\n    public function getName() : string{\n    return 'CustomMob_" + i + "';\n    }\n}";
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
    if (type == undefined) type = "����";
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
        if (type == "����") {
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
        Info.push("�� �̸� : " + item);
        Info.push("�� ID : ?");
        Info.push(B);
    }
    if (ITEM[item] !== undefined) {
        if (ITEM[item]["type"] == "���") {
            if (ITEM[item]["armor"] !== undefined) {
                Info.push(B);
                Info.push("�� �̸� : " + ITEM[item]["name"]);
                Info.push("�� ID : " + ITEM[item]["Id"]);
                Info.push("�� Ÿ�� : " + ITEM[item]["type"]);
                Info.push("�� ������ : ?/" + ITEM[item]["Durability"]);
                Info.push("�� ��ȣ : " + ITEM[item]["armor"]);
                Info.push(B);
            }
            if (ITEM[item]["damage"] !== undefined) {
                Info.push(B);
                Info.push("�� �̸� : " + ITEM[item]["name"]);
                Info.push("�� ID : " + ITEM[item]["Id"]);
                Info.push("�� Ÿ�� : " + ITEM[item]["type"]);
                Info.push("�� ������ : ?/" + ITEM[item]["Durability"]);
                Info.push("�� ������ : " + ITEM[item]["damage"]);
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
    	res.push("???????????\n["+i+"�� ����] [?] " + inv[i] + " "+a[inv[i].toSource()]+"x");
    } else {
    	res.push("???????????\n["+i+"�� ����] ["+ITEM[inv[i]]["type"]+"] " + ITEM[inv[i]]["name"] + " "+a[inv[i].toSource()]+"x");
    }
    }
    rm("::::: " + sender + " ���� �κ��丮 :::::\n" + res.join("\n"), room);
}

function selectJob(player, job) {
    if (job == "������") {
        var sData = data(player);
        sData["JOB"] = "������";
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (job == "����") {
        var sData = data(player);
        sData["JOB"] = "����";
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (job == "����Ŀ") {
        var sData = data(player);
        sData["JOB"] = "����Ŀ";
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    return "| �� �� |\n" + job + " ���� ���� �Ͽ����ϴ�.";
}

function useSkill(player, skill) {
    try {
        skill = JSON.parse(FileStream.read(RPG_SKILL + skill + ".json"));
        if (skill["damage"] !== 0) {
            mhp[player] -= skill["damage"];
            return "| ��ų ��� |\n�̸� : " + skill["name"] + "\n�� ���Ϳ��� " + skill["damage"] + " ������ ����!";
        } else if (skill["hp"] !== 0) {
            var sData = data(player);
            sData["HP"] += skill["hp"]
            var finalData = JSONClean(sData);
            FileStream.write(RPG_USER + player + ".json", finalData);
            return "| ��ų ��� |\n�̸� : " + skill["name"] + "\n�� ü�� " + skill["hp"] + " ����!";
        } else if (skill["mana"] !== 0) {
            var sData = data(player);
            sData["MANA"] += skill["mana"]
            var finalData = JSONClean(sData);
            FileStream.write(RPG_USER + player + ".json", finalData);
            return "| ��ų ��� |\n�̸� : " + skill["name"] + "\n�� ���� " + skill["mana"] + " ����!";
        }
    } catch (e) {
        return "���� ��ų �Դϴ�.";
    }
}

function Equipment(player, type, item) {
    if (getInventory(player).indexOf(item) == -1) {
        return "�������� �����ϴ�.";
    }
    if (type == "�Ӹ�") {
        removeInventory(player, item, "����");
        var sData = data(player);
        sData["Head"] = item;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (type == "����") {
        removeInventory(player, item, "����");
        var sData = data(player);
        sData["Chestplate"] = item;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (type == "�ٸ�") {
        removeInventory(player, item, "����");
        var sData = data(player);
        sData["Leggings"] = item;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (type == "��") {
        removeInventory(player, item, "����");
        var sData = data(player);
        sData["Boots"] = item;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
    }
    if (type == "��") {
        removeInventory(player, item, "����");
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
        return "������ �������� �ʽ��ϴ�.";
    }
    if (type == "sell") {
        if (shop["sells"].indexOf(item) == -1) {
            return item + " �������� �Ǹ� �Ҽ� �����ϴ�.";
        }
        if (getInventory(player).indexOf(item) == -1) {
            return "�������� �����ϴ�.";
        }
        removeInventory(player, shop[item]["name"]);
        var sData = data(player);
        sData["BRONZE"] += shop[item]["sell"];
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
        return item + " ��(��) �Ǹ� �ϼ̽��ϴ�.\n���� ����� : " + shop[item]["sell"] + " BRONZE";
    }
    if (type == "buy") {
        if (shop["buys"].indexOf(item) == -1) {
            return item + " �������� ���� �Ҽ� �����ϴ�.";
        }
        if (ITEM[shop[item]["name"]]["type"] == "���") {
            if (getInventory(player).indexOf(ITEM[shop[item]["name"]]) != -1) {
                return "�� ���� �Ѱ��� ���� ���� �մϴ�.\nâ�� �����ϰų� �����ּ���.";
            }
        }
        if (shop[item]["buy"] >= pd["BRONZE"]) {
            return "���� �����մϴ�.";
        }
        if (pd["BRONZE"] >= shop[item]["buy"]) {
            addInventory(player, item);
            var sData = data(player);
            sData["BRONZE"] -= shop[item]["buy"];
            var finalData = JSONClean(sData);
            FileStream.write(RPG_USER + player + ".json", finalData);
            return item + " ��(��) ���� �ϼ̽��ϴ�.";
        }
    }
    if (type == "����") {
        return "| " + place + " - ���� |\n( ���� ��ǰ )\n| " + shop["buys"].join("\n| ") + "\n( �Ǹ� ��ǰ )\n| " + shop["sells"].join("\n| ");
    }
    if (type == "�����ۺ���") {
        return "| " + item + " |\n���Ű�: " + shop[item]["buy"] + " �����\n�ǸŰ�: " + shop[item]["sell"] + " �����";
    }
}

function GameToolRegister(room, msg, player, isGroupChat, replier, ImageDB, packageName, threadId) {
    if (c[player] == true) {
        if (msg == "Y") {
            rm(Config["Prefix"] + " - ȸ������ �Ϸ�", room);
            var Inventory = ["���� ��", "����", "������ũ"];

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
                "PLACE": "�����",
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
                "HairType": "�Ϲ�",
                "HeadType": "�Ϲ�",
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
            rm("ȸ�������� ��� �Ǿ����ϴ�.", room);
        }
    }
    if (msg == "Gȸ������") {
        var day = new Date();
        var year = day.getFullYear();
        var month = day.getMonth() + 1;
        var inday = day.getDate();
        var min = day.getMinutes();
        var hour = day.getHours();
        var second = day.getSeconds();

        var time = year + "�� " + month + "�� " + inday + "�� " + hour + "�� " + min + "�� " + second + "��";
        /*try{
        	var Playerdata = data(player);
        	var d = Playerdata["LEVEL"];
        	rm("�̹� ȸ������ �߽��ϴ�. ["+d+"]", room);
        	return;
        } catch(e) {*/
        var Rule = FileStream.read(RPG_SETTING + "Rule.json");
        rm(Config["Prefix"] + " - Register" + "\n[ ��Ģ ]" + blank + "\n" + Rule.join("\n\n"), room);
        rm("���� �� : Y | ���� ���� ���� : N\n���� �Ұ��� ���� �÷��̰� �Ұ� �մϴ�.", room);
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
        if (msg.indexOf("G����") == 0 && sender == "LEAD") {
            rm("\nResult/Reply : " + eval(msg.replace("G����", "")), room);
        }
    } catch (e) {
        var ev = msg.replace("G����", "");
        var code = [];
        for (var i = 0; i <= ev.split("\n").length; i++) {
            code.push("| " + i + " | " + ev.split("\n")[i] + "\n" + "=-".repeat(10));
        }

        rm("\n[ Eval(ERROR) ]\n���� : " + e + "\n���� : " + e.lineNumber + "��" + blank + "\n(B) �� ������ �ƴ� �������� �ڵ� �������� �� ���� �Դϴ�.\�� �ڵ�\n" + code.join("\n"), room);
    }
}

function Hair(player, type, room) {
    var symble_hair = "��";
    var symble_hair2 = "��";
    var hair = [];
    var symble = ["?", "?", "?", "?", "?", "?", "?", "?"];

    // ��� ��Ÿ�� [ ���� ]

    // : �Ϲ� :
    if (type == "�Ϲ�") {
        hair.push(symble_hair.repeat(15));
        hair.push(symble_hair.repeat(15));
        hair.push(symble_hair.repeat(15));
        return "\n" + hair.join("\n");
    }
    // : ������ :
    if (type == "������") {
        hair.push(symble_hair.repeat(15));
        hair.push(symble_hair.repeat(8) + symble_hair2.repeat(7));
        hair.push(symble_hair.repeat(7) + symble_hair2.repeat(8));
        hair.push(symble_hair.repeat(6) + symble_hair2.repeat(9));
        return "\n" + hair.join("\n");
    }
    // : ���� :
    if (type == "����") {
        hair.push("�ԤԤԤԤԤ�" + symble_hair.repeat(6) + "�ԤԤԤ�");
        hair.push("�ԤԤԤԤ�" + symble_hair2.repeat(8) + "�ԤԤԤ�");
        hair.push("�ԤԤԤ�" + symble_hair2.repeat(10) + "�ԤԤԤ�");
        hair.push("�ԤԤ�" + symble_hair2.repeat(12) + "�ԤԤ�");
        hair.push("�Ԥ�" + symble_hair2.repeat(14) + "�Ԥ�");
        hair.push("��" + symble_hair2.repeat(16) + "��");
        hair.push(symble_hair.repeat(18));
        hair.push("��" + symble_hair.repeat(15));
        hair.push("��" + symble_hair.repeat(15));
        return "\n" + hair.join("\n");
    }
}

function Head(player, type) {
    var symble_hair = "��";
    var symble_hair2 = "��";
    var head = [];
    var symble = ["?", "?", "?", "?", "?", "?", "?", "?"];
    if (type == "�Ϲ�") {
        head.push(symble_hair.repeat(15));
        head.push(symble_hair.repeat(3) + "```" + symble_hair.repeat(7) + "```" + symble_hair.repeat(3));
        head.push(symble_hair.repeat(3) + "��" + symble_hair.repeat(7) + "��" + symble_hair.repeat(3));
        head.push(symble_hair.repeat(15));
        head.push(symble_hair.repeat(7) + "��" + symble_hair.repeat(7));
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
    var title = "��\n";
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
if(exp>100) return "100�� �̻��Դϴ�."; 
type=type?exp.toFixed(2)+"%":ex+"/"+max; 
exp=Math.round(exp); 
const rects = {0:"",1 : "?",2 : "?",3 : "?",4 : "?",5 : "?",6 : "?",7 : "?",8 : "?",9 : "?"} 
return "?".repeat(exp/10)+rects[exp%10]+" ".repeat((100-exp)/10)+":"+type 
}
function battleMonster(player, room) {
    var monsters = [
        "�䳢",
        "�糪��",
        "����"
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
    var title = "��\n";
    
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
    var battle = "[ ���� ���� ]\n�̸� : " + mon + "\nü�� : " + md["hp"] + "\n����ϴ� ������ : \n|" + md["drops"].join("\n| ") + "\n����ϴ� ����ġ : " + md["exp"];
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
    var title = " ".repeat(3) + "��" + " ".repeat(3) + "\n";
    var mon_battle = "LV." + level + " " + setHealthBar(mhp[player],md["maxhp"],nick,true) + "\n";
    var pla_battle = "LV." + p["LEVEL"] + " " + setHealthBar(p["HP"],p["MAX_HP"],player,true) + "\n";
    var battle = title + mon_battle + pla_battle;
    return battle;
}

function monsterHurt(player, room) {
    var mon = mob[player];
    var d = mon["damage"];
    var game = data(player);
    rm(mon["name"]+" ��(��) "+player+" ���� ���� �ҷ��մϴ�!", room);
    java.lang.Thread.sleep(1000 * 2);
    var damage = mon["damage"];
     var RegData = data(player);
     RegData["HP"] -= damage;
     var finalData = JSONClean(RegData);
     FileStream.write(RPG_USER + player + ".json", finalData);
    rm(mon["name"]+" ��(��) "+player+" �Կ��� "+damage+" �������� �������ϴ�!", room);
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
        return mon["name"] + " ��(��) ��� �Ͽ����ϴ�!\n���� : [" + res + "]\n+ "+mon["bronze"]+" �����\n+ "+mon["silver"]+" �ǹ�\n+ "+mon["gold"]+" ���";
    }
    return "���� ����!\n" + displayBattle(player) + "\n" + mhp[player];
}

function Heal(player){
	var g = data(player);
	if (g["SILVER"] >= 50){
		 var RegData = data(player);
		RegData["HP"] = RegData["MAX_HP"];
		 var finalData = JSONClean(RegData);
        FileStream.write(RPG_USER + player + ".json", finalData);
		return "ȸ�� �Ͽ����ϴ�.";
	}
	if (50 >= g["SILVER"]){
		return "ȸ�� �ҷ��� 50 �ǹ��� �ʿ� �մϴ�.";
	}
}
function skinView(player){
	var game = data(player);
	var sk = getSkinData(player);
	var a = [
    "��" + sk[game["Skin"]]["�Ӹ�"].join("\n�Ԥ�") +
    "\n��" + sk[game["Skin"]]["����"].join("\n��") +
     "\n�Ԥ�" + sk[game["Skin"]]["�ٸ�"].join("\n�Ԥ�")
     ];
     return a.join("");
}
function GameToolInfo(player, room) {
    try {
        var Rdata = read(player);
        var game = data(player);
        rm(
            "[" + player + "] ���� ����" +
            "\n�� �� ID : " + Rdata["Id"] +
            "\n�� ü�� : " + game["HP"] + "/" + game["MAX_HP"] +
            "\n�� ���� : " + game["LEVEL"] +
            "\n�� ���� : " + game["PLACE"] +
            "\n�� ����ġ : " + game["EXP"] + "/" + game["MAX_EXP"] +
            "\n�� ���� : " + game["MANA"] + "/" + game["MAX_MANA"] + blank +
            "\n\n\n�� ���� ����" +
            "\n�� �Ӹ� : " + game["Head"] +
            "\n�� ���� : " + game["Chestplate"] +
            "\n�� �ٸ� : " + game["Leggings"] +
            "\n�� �� : " + game["Boots"] +
            "\n�� �Ӹ� : " + game["Hand"] +
            "\n=< ��Ų ( ��Ÿ ) >=" +
            "\nG��Ų�� - ���� ������ ��Ų�� ���ϴ�."+
            "\n�� ��" +
            "\n�߰� ����" +
            "\n" +
            "\n[ ��� : " + game["GOLD"] + " /  �ǹ� : " + game["SILVER"] + " ]" +
            "\n[ �� : " + game["GameTool"] + " / ũ����Ż : " + game["CRASTAL"] + " ]" +
            "\n[ ��ũ ũ����Ż : " + game["DARK_CRASTAL"] + " / ���� ũ����Ż : " + game["WATER_CRASTAL"] + " ]" +
            "\n[ ���޶��� : " + game["EMERALD"] + " / ��� : " + game["RUBI"] + " ]" +
            "\n" + "\n[ ����� : " + game["BRONZE"] + " ]", room);
        return;
    } catch (e) {
        rm("�α��� �̳� ȸ�������� ���ּ���+", room);
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
    if (Qdata["type"] == "Ŀ�ǵ�") {
        info.push("�� �߰� ����");
    }
    if (Qdata["type"] == "���") {
        nbt = Qdata["monster"];
        info.push("�� ����Ʈ ���� : " + nbt["name"]);
        info.push("�� ����Ʈ ���� ��� Ƚ�� : " + nbt["count"] + "��");
    }
    message = [
        "[" + Qdata["Name"] + "] ����Ʈ�� ���� �մϴ�+" + blank +
        "\n�� ����Ʈ ���� : " + Qdata["description"] +
        "\n�� ����Ʈ Ÿ�� : " + Qdata["type"] +
        "\n�� ����Ʈ ���� : " + ITEM[Qdata["Reward"]["Item"]]["name"] + " (" + Qdata["Reward"]["Item"]["Count"] + "x)" +
        "\n�� ����Ʈ ���� > \n" + info
    ];
    return message;
}

function priceConverter(price, type, ctype) {
    if (ctype == "�����") {
        if (type == "�����") {
            p = 0;
            return Number(price * p) + " " + ctype;
        }
        if (type == "�ǹ�") {
            p = 2;
            return Number(price * p) + " " + ctype;
        }
        if (type == "���") {
            p = 4;
            return Number(price * p) + " " + ctype;
        }
        if (type == "���") {
            p = 7;
            return Number(price * p) + " " + ctype;
        }
        if (type == "���޶���") {
            p = 8;
            return Number(price * p) + " " + ctype;
        }
        if (type == "�ڼ���") {
            p = 12;
            return Number(price * p) + " " + ctype;
        }
        if (type == "ũ����Ż") {
            p = 15;
            return Number(price * p) + " " + ctype;
        }
        if (type == "��ũ ũ����Ż") {
            p = 21;
            return Number(price * p) + " " + ctype;
        }
        if (type == "���ް�") {
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
    if (action == "��Ʋ") {
        select_battleMonster(player, mob, replier, room);
        return false;
    }
    if (action == "����") {
        infoMonster(mob, replier);
        return false;
    }
    if (!(action.indexOf(["��Ʋ", "����"]) != -1)) {
        replier.reply("���� ��� �Դϴ�. ��� ����Ʈ : [ ��Ʋ / ���� ]");
        return false;
    }
}
MapRPG.selectNPC = function(player, npc, action, replier) {
    var npc = MapRPG.load(data(player)["PLACE"])["npcs"][npc];
    var messageR = Math.floor(Math.random() * npc["message"].length);
    var message = npc["message"][messageR];
    if (action == "���ɱ�") {
        replier.reply(npc["name"] + ": " + message);
        return;
    } else if (action == "����") {
        if (npc["type"] == "��������") {
            replier.reply("������ �ϰ� ������ �������̳�..");
            return;
        }
        if (npc["type"] !== "��������") {
            replier.reply("�� NPC�� ���� ���� NPC�� �ƴմϴ�.");
            return;
        }
    }
    if (!(action.indexOf(["����", "���ɱ�"]) != -1)) {
        replier.reply("Gnpc���� [�̸�] [���ɱ�/����]");
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
    var goto = "�� ���� �ִ� �� \n" + mapData["goto"].join("\n| ");
    var npcPrefix = "\n\n[ NPC (" + Number(mapData["npcList"].length) + ") ]\n";
    var npc2 = [];
    for (var i = 0; i < mapData["npcList"].length; i++) {
        npc2.push("\n| [ ID : " + i + " ] [ " + mapData["npcs"][mapData["npcList"][i]]["type"] + " ] " + mapData["npcs"][mapData["npcList"][i]]["name"]);
    }
    var npc = npcPrefix + npc2.join("\n");
    var monster = "\n\n[ ���� (" + mapData["Monster"].length + ") ]\n| " + mapData["Monster"].join("\n| ");
    var bgm = "\n\n[ BGM : " + mapData["bgm"] + " ]";
    var drops = "\n������ ������ (" + mapData["Drops"].length + ") : \n| " + mapData["Drops"].join("\n| ");
    var form = "[ " + name + " ]\n" + goto + npc + monster + drops + bgm;
    return form;
}

MapRPG.createBiome = function(type) {
    var seed = Math.floor(Math.random() * 0x7FFFFFFFFFFFFFFFF);
    var percent = Math.floor(Math.random() * 100);
    /* 0.15�� */
    var snow_temp = 0.15;
    var snowBiome = [
        "���� ���",
        "���� ��",
        "���� ��",
        "������ �غ�",
        "������ Ÿ�̰�",
        "������ Ÿ�̰� ���",
        "������ �ް� Ÿ�̰�"
    ];
    /* 0.5�� */
    var water_temp = 0.5;
    var waterBiome = [
        "��",
        "�ٴ�",
        "���� �ٴ�"
    ];

    /* 0.6�� */
    var birch_temp = 0.6;
    var birchBiome = [
        "���� ���� ��",
        "���� ���� �� ���",
        "�ް� ���� ���� ��",
        "�ް� ���� ���� �� ���"
    ];

    /* 0.7 ~ 1.5*/
    var normal_temp = 0.7;
    var normalBiome = [
        "����",
        "���",
        "�� ����",
        "�غ�"
    ];
    var desert_temp = 1.5;
    var desertBiome = [
        "�� ����",
        "�縷",
        "�޻�"
    ];

    var Biomes = [
        "����",
        "��",
        "ȣ��",
        "�غ�",
        "Ÿ�̰�",
        "Ÿ�̰� ���",
        "�ް� Ÿ�̰�",
        "��",
        "�ٴ�",
        "���� �ٴ�",
        "���� ���� ��",
        "���� ���� �� ���",
        "�ް� ���� ���� ��",
        "�ް� ���� ���� �� ���",
        "����",
        "���",
        "�� ����",
        "�غ�",
        "�� ����",
        "�縷",
        "�޻�"
    ];

    /* Biomes.push(snowBiome);
    Biomes.push(waterBiome);
    Biomes.push(birchBiome);
    Biomes.push(normalBiome);
    Biomes.push(desertBiome); */

    if (type == "����") {
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
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789��������������G�������������������¤äĤŤƤǤȤɤʤˤ̤ͤΤϤФѤҤӡڢ���%&����=<>@#~^*+-_()!:;?�٢��ߢϢТܥ��{}$�ܡݡء����[]`|�ơ�';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function stopQuest(player, quest, room) {
    rm("�߰� ����", room);
}

function Nogada(player, room) {
    money = Math.floor(Math.random() * 300);
    var RegData = data(player);
    RegData["BRONZE"] += money;
    var finalData = JSONClean(RegData);
    FileStream.write(RPG_USER + player + ".json", finalData);
    rm("�밡�ٷ� " + money + " ���� ������ϴ�.", room);
}

function Nodong(player, room) {
	if (player == "�ʷ���"){
		return;
	}
    money = Math.floor(Math.random() * 10);
    var RegData = data(player);
    RegData["SILVER"] += money;
    var finalData = JSONClean(RegData);
    FileStream.write(RPG_USER + player + ".json", finalData);
    rm("���� �Ͽ� " + money + " �ǹ��� ������ϴ�.", room);
}

function LevelUp(player, room) {
    var regData = data(player);
    var �ʿ���_EXP = regData["LEVEL"] * 75;
    if (�ʿ���_EXP >= regData["EXP"]) {
        rm("\n| �˸� |\n�� ����� EXP�� �����մϴ�.\n�ʿ��� EXP : " + Number(�ʿ���_EXP - regData["EXP"]), room);
    }
    if (regData["EXP"] >= �ʿ���_EXP) {
        var backLevel = regData["LEVEL"];
        if (regData["EXP"] >= �ʿ���_EXP){
        var sData = data(player);
        sData["LEVEL"] += 1;
        sData["EXP"] -= �ʿ���_EXP;
        sData["MAX_EXP"] = regData["LEVEL"] + 1 * 75;
        sData["MAX_HP"] += 5;
        sData["MAX_MANA"] += 5;
        sData["DEF"] += 1;
        sData["ATK"] += 2;
        var finalData = JSONClean(sData);
        FileStream.write(RPG_USER + player + ".json", finalData);
        rm("\n| �˸� |\n�� " + backLevel + " -> " + sData["LEVEL"], room);
        }
    }
}

function startQuest(player, quest, room) {
    Qdata = getQuest(quest);
    info = [];
    if (Qdata["type"] == "Ŀ�ǵ�") {
        info.push("�� �߰� ����");
    }
    if (Qdata["type"] == "���") {
        nbt = Qdata["monster"];
        info.push("�� ����Ʈ ���� : " + nbt["name"]);
        info.push("�� ����Ʈ ���� ��� Ƚ�� : " + nbt["count"] + "��");
    }
    user(player, "NOW_QUEST", quest);
    rm("[" + Qdata["Name"] + "] ����Ʈ�� ���� �մϴ�+" + blank +
        "\n�� ����Ʈ ���� : " + Qdata["description"] +
        "\n�� ����Ʈ Ÿ�� : " + Qdata["type"] +
        "\n�� ����Ʈ ���� : " + ITEM[Qdata["Reward"]["Item"]]["name"] + " (" + Qdata["Reward"]["Item"]["Count"] + "x)" +
        "\n�� ����Ʈ ���� > \n" + info,
        room);
}
/*
{
   "Monster_example":{
      "Name": "����_����",
      "description": "Description.",
      "type": "���",
      "monster": [
         "name": "����",
         "count": 10,
      ],
      "Reward": [
         "Item":"���� ����",
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
        return "\n- - - - - - - - - - -\n| �� æ Ʈ |\n�� " + ITEM[item]["name"] + "+ ��æƮ - " + ench + "\n- - - - - - - - - - -";
    }
    if (IDATA[item]["ench"] !== undefined) {
        IDATA[item]["ench"].push(ench + ":" + enchLvl);
        FileStream.write(RPG_USER + "INVENTORY/data/" + player + ".json", JSONClean(IDATA));
        return "\n- - - - - - - - - - -\n| �� æ Ʈ |\n�� " + ITEM[item]["name"] + "+ ��æƮ - " + ench + "\n- - - - - - - - - - -";
    }
    return "\n- - - - - - - - - - -\n| �� æ Ʈ |\n�� " + ITEM[item]["name"] + "+ ��æƮ - " + ench + "\n- - - - - - - - - - -";
}
function Skin(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
	if (skinCreate[sender] !== undefined){
		if (msg.length > 15 && skinType[sender] == "�Ӹ�"){
			replier.reply("�ִ� 15ĭ������ �����մϴ�.");
			return;
		}
		if (msg.length > 17 && skinType[sender] == "�ٸ�"){
			replier.reply("�ִ� 17ĭ������ �����մϴ�.");
			return;
		}
		if (msg.length > 32 && skinType[sender] == "����"){
			replier.reply("�ִ� 32ĭ������ �����մϴ�.");
			return;
		}
		if(msg == "G����"){
			if (skinType[sender] == "�Ӹ�"){
			skinType[sender] = "����";
			replier.reply("���� ������ ���� �Դϴ�.");
			return;
			}
			if (skinType[sender] == "����"){
			skinType[sender] = "�ٸ�";
			replier.reply("���� ������ �ٸ� �Դϴ�.");
			return;
			}
			if (skinType[sender] == "�ٸ�"){
	var RegData = JSON.parse(FileStream.read(RPG_USER + "SKINS/" + sender + ".json"));
	var a = skin[sender]["�̸�"];
    RegData[a] = {};
    RegData[a]["�Ӹ�"] = skin[sender]["�Ӹ�"];
    RegData[a]["����"] = skin[sender]["����"];
    RegData[a]["�ٸ�"] = skin[sender]["�ٸ�"];
    var finalData = JSONClean(RegData);
    FileStream.write(RPG_USER + "SKINS/" + sender + ".json", finalData);
			skinCreate[sender] = undefined;
			replier.reply("�� �Դϴ�!");
			replier.reply("�� �̸�����"+blank+"\n\n\n�� �Ӹ�\n"+skin[sender]["�Ӹ�"].join("\n")+"\n�� ����\n"+skin[sender]["����"].join("\n")+"\n�� �ٸ�\n"+skin[sender]["�ٸ�"].join("\n"));
			return;
			}
			
		}
		if (msg.indexOf("G��Ų����")==0){
		var args = msg.split(" ");
		if (args[1].indexOf(["�Ӹ�","����","�ٸ�"])== -1){
			replier.reply("������ �Ӹ�,����,�ٸ� �ۿ� �����ϴ�.");
			return;
		} else {
			skinType[sender] = args[1];
			return;
		}
	}
	if (msg == "G��Ų��"){
		skin[sender][skinType[sender]].pop();
		replier.reply("��Ų�� �ǵ��Ƚ��ϴ�.");
		replier.reply("[ ��Ų ��Ȳ ]\n���� : "+skinType[sender]+"\n"+skin[sender][skinType[sender]].join("\n"));
		return;
	}
		skin[sender][skinType[sender]].push(msg);
		replier.reply("[ ��Ų ��Ȳ ]\n���� : "+skinType[sender]+"\n"+skin[sender][skinType[sender]].join("\n"));
	}
	if (msg.indexOf("G��Ų����")==0){
	try {
	var RegData = JSON.parse(FileStream.read(RPG_USER + "SKINS/" + sender + ".json"));
	var a = msg.substr(6);
	if (a == ""){
		replier.reply("G��Ų���� (��Ų �̸�)");
		return;
	}
    RegData[a] = {};
    RegData[a]["�Ӹ�"] = [];
    RegData[a]["����"] = [];
    RegData[a]["�ٸ�"] = [];
    var finalData = JSONClean(RegData);
    FileStream.write(RPG_USER + "SKINS/" + sender + ".json", finalData);
    skin[sender] = {};
    skin[sender]["�Ӹ�"] = [];
    skin[sender]["����"] = [];
    skin[sender]["�ٸ�"] = [];
    skin[sender]["�̸�"] = a;
    
    skinCreate[sender] = true;
    skinType[sender] = "�Ӹ�";
    replier.reply("��Ų ������ �����մϴ�.\nG���� �� �̿��Ͽ� ������ �����غ�����!\nä�� �Է����� ����� �ֽ��ϴ�.\n�ѹ� �Է��� ��Ų�� ���� �Դϴ�.");
    return;
	} catch (e) {
		replier.reply("ó�� ����ż� �ٽ� �Է� �ϼžߵ˴ϴ�.");
		FileStream.write(RPG_USER + "SKINS/" + sender + ".json", JSONClean({}));
		return;
		}
	}
	if (msg.indexOf("G��Ų����")==0){
	var RegData = JSON.parse(FileStream.read(RPG_USER + "SKINS/" + sender + ".json"));
	var a = msg.substr(6);
	if (a == ""){
		replier.reply("G��Ų���� (��Ų �̸�)");
		return;
	}
	if (RegData[a] == undefined){
		replier.reply("���� ��Ų �Դϴ�.");
		return;
	}
	var sData = data(sender);
	sData["Skin"] = a;
	var finalData = JSONClean(sData);
    FileStream.write(RPG_USER + sender + ".json", finalData);
	replier.reply("������ �Ϸ� �Ͽ����ϴ�.");
	return;
	}
	if (msg == "G��Ų��"){
		try {
			replier.reply("�� ��Ų : "+data(sender)["Skin"]+"\n\n"+skinView(sender));
			return;
			} catch (e) {
				replier.reply("����� ��Ų�� �����ϴ�.\n"+e+"\n"+e.lineNumber+" Line");
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
    if (msg == "G�κ��丮�����Ͱ�ġ��") {
        FileStream.write(RPG_USER + "INVENTORY/data/" + sender + ".json", JSONClean({}));
        replier.reply("������ NBT �����Ͱ� ����ǵ��� ���������ϴ�.");
    }
    if (msg == "G��"){
    	replier.reply(Heal(sender));
    }
    if (msg.indexOf("G�Ǹ�") == 0) {
        var args = msg.split(" ");
        if (args[1] == undefined) {
            replier.reply("G�Ǹ� (������ �̸�)");
        }
        if (args[1] !== undefined) {
            var a = msg.replace("G�Ǹ� ", "");
            replier.reply(seeShop(sender, "sell", a));
        }
    }
    if (msg.indexOf("G������") == 0) {
        var args = msg.replace("G������ ", "");
        if (getInventory(sender).indexOf(args) == -1) {
            replier.reply(args + " �������� �����ϴ�.");
            return;
        }
        removeInventory(sender, args);
        replier.reply(args + " �������� ���Ƚ��ϴ�.");
    }
    if (msg.indexOf("G����") == 0) {
        var args = msg.split("::");
        var arg = msg.split(" ");
        if (args[1] == undefined || arg[1] == undefined) {
            replier.reply("G����::[��/�Ӹ�/����/�ٸ�/��] [������ ������]");
        }
        if (args[1] !== undefined && arg[1] !== undefined) {
            var t = msg.replace("G����::"+args[1]+" ", "");
            replier.reply(Equipment(sender, args[1], t));
        }
    }
    if (msg.indexOf("G����") == 0) {
        var args = msg.split(" ");
        if (args[1] == undefined) {
            replier.reply("G���� (������ �̸�)");
        }
        if (args[1] !== undefined) {
            var a = msg.replace("G���� ", "");
            replier.reply(seeShop(sender, "buy", a));
        }
    }
    if (msg == "G����") {
        replier.reply(seeShop(sender, "����", "null"));
    }
    if (msg.indexOf("G��������") == 0) {
        var args = msg.split(" ");
        if (args[1] == undefined) {
            replier.reply("G�������� (������ �̸�)");
        }
        if (args[1] !== undefined) {
            var arg = msg.replace("G�������� ", "");
            replier.reply(seeShop(sender, "�����ۺ���", arg));
        }
    }
    if (msg.indexOf("G�����ۺ���") == 0) {
        var args = msg.replace("G�����ۺ��� ", "");
        replier.reply(getItemInfo(args));
    }
    if (msg.indexOf("G���") == 0) {
        replier.reply("* ��� ���\n" + calculator(msg.replace("G��� ", "")));
    }
    if (msg == "G����") {
        replier.reply("[ ���� ]" + blank + HELP);
    }
    if (msg == "Gȸ������") {
        GameToolRegister(sender, room, ImageDB);
    }
    if (msg == "G������") {
        GameToolInfo(sender, room);
    }
    if (msg == "G�κ��丮") {
        GameToolInventory(sender, room);
    }
    if (msg == "G������") {
        LevelUp(sender, room);
    }
    if (msg == "G����Ʈ") {
        args = msg.split(" ");

        questHelp = [
            "�� G����Ʈ ���� - ����Ʈ ������ Ȯ�� �մϴ�.",
            "�� G����Ʈ ���� - ����Ʈ�� ���� �մϴ�."
        ];

        rm(questHelp.join("\n"), room);
    }
    if (msg == "G�밡��") {
        Nogada(sender, room);
    }
    if (msg == "G��") {
        Nodong(sender, room);
    }
    if (msg == "G���") {
        battleMonster(sender, room);
    }
    if (msg == "G����") {
        replier.reply(playerHurt(sender));
    }
    if (msg == "G��ɻ�Ȳ") {
        replier.reply(displayBattle(sender));
    }
    if (msg.indexOf("G������") == 0) {
        var args = msg.substr(5);
        try {
            replier.reply(MapRPG.info(args));
        } catch (e) {
            rm(args + " ������ �����ϴ�.", room);
        }
    }
    if (msg.indexOf("G������") == 0) {
        var args = msg.split(" ");
        if (MapRPG.load(data(sender)["PLACE"])["Monster"].indexOf(args[1]) != -1) {
            MapRPG.selectMob(sender, args[1], args[2], replier);
        }
        if (!(MapRPG.load(data(sender)["PLACE"])["Monster"].indexOf(args[1]) != -1)) {
            replier.reply(args[1] + " ��(��) ���� ���� �Դϴ�.");
        }
    }
    if (msg.indexOf("G���ǽü���") == 0) {
        var args = msg.split(" ");
        if (MapRPG.load(data(sender)["PLACE"])["npcList"].indexOf(args[1]) != -1) {
            MapRPG.selectNPC(sender, args[1], args[2], replier);
        }
        if (!(MapRPG.load(data(sender)["PLACE"])["npcList"].indexOf(args[1]) != -1)) {
            replier.reply(args[1] + " ��(��) ���� NPC �Դϴ�.");
        }
    }
    if (msg.indexOf("G�̵�") == 0) {
        var args = msg.substr(4);
        try {
            if (MapRPG.load(data(sender)["PLACE"])["goto"].indexOf(args) == -1) {
                rm("�ش� �������� ���� �����ϴ�.", room);
            }
            if (MapRPG.load(data(sender)["PLACE"])["goto"].indexOf(args) != -1) {
                rm(args + " �������� �̵��մϴ�!...", room);
                java.lang.Thread.sleep(1000 * 3);
                rm("@" + sender + " | ������ �����߽��ϴ�!", room);
                replier.reply(MapRPG.info(args));
                var RegData = data(sender);
                RegData["PLACE"] = args;
                var finalData = JSONClean(RegData);
                FileStream.write(RPG_USER + sender + ".json", finalData);
            }
        } catch (e) {
            rm(args + " ������ �������� �ʽ��ϴ�.\n" + e + "\n" + e.lineNumber + "��", room);
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