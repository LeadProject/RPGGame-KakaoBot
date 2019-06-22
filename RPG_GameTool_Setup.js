const scriptName="RPG_GameTool_Setup.js";
const pin;
const mode;
const checkUpdate;
const setPoint;

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
    /*(이 내용은 길잡이일 뿐이니 지우셔도 무방합니다)
     *(String) room: 메시지를 받은 방 이름
     *(String) msg: 메시지 내용
     *(String) sender: 전송자 닉네임
     *(boolean) isGroupChat: 단체/오픈채팅 여부
     *replier: 응답용 객체. replier.reply("메시지") 또는 replier.reply("방이름","메시지")로 전송
     *(String) ImageDB.getProfileImage(): 전송자의 프로필 이미지를 Base64로 인코딩하여 반환
     *(String) packageName: 메시지를 받은 메신저의 패키지 이름. (카카오톡: com.kakao.talk, 페메: com.facebook.orca, 라인: jp.naver.line.android
     *(int) threadId: 현재 쓰레드의 순번(스크립트별로 따로 매김)     *Api,Utils객체에 대해서는 설정의 도움말 참조*/
    if (msg === pin && pin !== 0){
    	if (mode == "update"){
    	pin = 0;
        manage = sender;
    	replier.reply("인증이 완료 되었습니다.\nRPG 업데이트가 시작 됩니다.");
        Update(replier);
        }
    	if (mode == "setup"){
    	pin = 0;
        manage = sender;
    	replier.reply("인증이 완료 되었습니다.\nRPG 설치가 시작 됩니다.");
        replier.reply("관리자 인증 : " + sender);
        replier.reply("1. 데이터 베이스 세팅");
        replier.reply("채팅으로 RPG 접두사를 입력 해주세요.\n접두사 예시) :: RPG :: player님이 사망하였습니다.");
        setPoint = "접두사";
        mode = "setting";
        var in = {
        	"Prefix": ":: RPG ::",
            "MainRoom": room,
            "Admin": sender,
            "Version": Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/RPGUpdate.txt")
        };
        FileStream.write("sdcard/rpg_config.json", JSONClean(in));
    	}
    }
    if (checkUpdate !== undefined && msg == "네"){
    if (manage == sender){
    var version = Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/RPGUpdate.txt");
    var c = getConfig();
    c["Version"] = version;
    FileStream.write("sdcard/rpg_config.json", JSONClean(c));
    if (checkUpdate == "beta"){
    replier.reply("----- RPG -----");
	replier.reply("RPG JavaScript 파일을 설치 합니다.");
	java.lang.Thread.sleep(1200);
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/RPG.js"));
	FileStream.write("sdcard/katalkbot/[게임툴] 알피지.js", file);
	Api.complie("[게임툴] 알피지.js");
	Api.on("[게임툴] 알피지.js");
	replier.reply("업데이트가 완료 되었습니다.\n개발자: 리드");
	Api.off(scriptName);
	}
	if (checkUpdate == "none"){
    replier.reply("----- RPG -----");
	replier.reply("RPG JavaScript 파일을 설치 합니다.");
	java.lang.Thread.sleep(1200);
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/RPG-Pre.js"));
	FileStream.write("sdcard/katalkbot/[게임툴] 알피지.js", file);
	Api.complie("[게임툴] 알피지.js");
	Api.on("[게임툴] 알피지.js");
	replier.reply("업데이트가 완료 되었습니다.\n개발자: 리드");
	Api.off(scriptName);
	}
    	}
    }
    if (mode == "setting"){
    if (manage == sender){
    	if (setPoint == "접두사"){
    	var c = getConfig();
        c["Prefix"] = msg;
        FileStream.write("sdcard/rpg_config.json", JSONClean(c));
    	replier.reply("접두사 설정이 완료 되었습니다.");
        replier.reply("RPG를 할 채팅방 이름을 입력 해주세요.");
        setPoint = "채팅방";
    }
    if (setPoint == "채팅방"){
    	var c = getConfig();
        c["MainRoom"] = msg;
        FileStream.write("sdcard/rpg_config.json", JSONClean(c));
    	replier.reply("채팅방 설정이 완료 되었습니다.");
        replier.reply("RPG 기본 파일들을 설치 합니다.");
        setPoint = undefined;
        mode = undefined;
        Install(replier);
    }
    
    	}
    }
    if (msg == "run:setup"){
    	pin = Math.floor(Math.random() * 99999);
        mode = "setup";
        Api.makeNoti("RPG Check Pin", pin, 3);
        replier.reply("알림 창으로 핀 번호를 전송 했습니다. 전송된 핀 번호를 입력 하시면 설치가 가능합니다.");
   }
   if (msg == "run:update"){
    	pin = Math.floor(Math.random() * 99999);
        mode = "update";
        Api.makeNoti("RPG Check Pin", pin, 3);
        replier.reply("알림 창으로 핀 번호를 전송 했습니다. 전송된 핀 번호를 입력 하시면 업데이트가 가능합니다.");
   }
}

function Install(replier)
{
	replier.reply("기본 아이템DB 설치중...");
	java.lang.Thread.sleep(200);
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/items.json"));
	FileStream.write("sdcard/[RPG]/Setting/items.json", JSONClean(file));
	replier.reply("기본 아이템DB 설치 완료!");
	
	replier.reply("기본 몬스터DB 설치중...");
	java.lang.Thread.sleep(200);
	
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/토끼.json"));
	FileStream.write("sdcard/[RPG]/Setting/Monsters/토끼.json", JSONClean(file));
	
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/돼지.json"));
	FileStream.write("sdcard/[RPG]/Setting/Monsters/돼지.json", JSONClean(file));
	
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/당나귀.json"));
	FileStream.write("sdcard/[RPG]/Setting/Monsters/당나귀.json", JSONClean(file));
	
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/상어.json"));
	FileStream.write("sdcard/[RPG]/Setting/Monsters/상어.json", JSONClean(file));
	replier.reply("기본 몬스터DB 설치 완료!");
	replier.reply("기본 지역DB 설치중...");
	java.lang.Thread.sleep(200);
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/Map이즈마을.json"));
	FileStream.write("sdcard/[RPG]/Setting/Maps/이즈마을.json", JSONClean(file));
	
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/Map모래마을.json"));
	FileStream.write("sdcard/[RPG]/Setting/Maps/모래마을.json", JSONClean(file));
	
	replier.reply("기본 지역DB 설치 완료!");
	
	replier.reply("기본 지역DB 설치중...");
	java.lang.Thread.sleep(200);
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/Shop이즈마을.json"));
	FileStream.write("sdcard/[RPG]/Setting/Shop/이즈마을.json", JSONClean(file));
	
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/Shop모래마을.json"));
	FileStream.write("sdcard/[RPG]/Setting/Shop/모래마을.json", JSONClean(file));
	
	replier.reply("기본 지역 상점DB 설치 완료!");
	
	replier.reply("----- RPG -----");
	replier.reply("RPG JavaScript 파일을 설치 합니다.");
	java.lang.Thread.sleep(1200);
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/RPG-Pre.js"));
	FileStream.write("sdcard/katalkbot/[게임툴] 알피지.js", file);
	Api.complie("[게임툴] 알피지.js");
	Api.on("[게임툴] 알피지.js");
	replier.reply("설치가 완료 되었습니다.\n개발자: 리드");
	Api.off(scriptName);
}
function Update(replier)
{
	var newVersion = Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/RPGUpdate.txt");
	var typeUpdate = Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/RPGUpdateType.txt");
	if (getConfig["Version"] == newVersion){
		replier.reply("최신 버전 입니다.\nVersion: "+getConfig["Version"]);
		return;
	}
	if (getConfig["Version"] !== newVersion){
replier.reply(
"최신 업데이트 "+newVersion+" 버전 업데이트가 있습니다!\n• 업데이트 내용\n"+updatefor+
"\n업데이트 모드 체크를 시작합니다."
);
java.lang.Thread.sleep(700);
if (typeUpdate == "필수")
{
	replier.reply("필수 업데이트 입니다!\n즉시 업데이트 합니다!");
	replier.reply("----- RPG -----");
	replier.reply("RPG JavaScript 파일을 설치 합니다.");
	java.lang.Thread.sleep(1200);
	var file = JSON.parse(Utils.getWebText("https://github.com/MinecraftLEAD/KakaoTalk-Bots/blob/master/RPG-Pre.js"));
	FileStream.write("sdcard/katalkbot/[게임툴] 알피지.js", file);
	Api.complie("[게임툴] 알피지.js");
	Api.on("[게임툴] 알피지.js");
	replier.reply("업데이트가 완료 되었습니다.\n개발자: 리드");
	Api.off(scriptName);
}
if (typeUpdate == "베타")
{
	replier.reply("베타 업데이트 입니다!\n불안정 할수 있습니다. 그래도 설치 하실려면 '네' 를 입력 해주세요.");
	checkUpdate = "beta";
}
if (typeUpdate == "일반")
{
	replier.reply("일반 업데이트 입니다!\n설치 하실려면 '네' 를 입력 해주세요.");
	checkUpdate = "none";
}
		return;
	}
}
function onStartCompile(){
    /*컴파일 또는 Api.reload호출시, 컴파일 되기 이전에 호출되는 함수입니다.
     *제안하는 용도: 리로드시 자동 백업*/
    
}
getConfig = function() {
	return JSON.parse(FileStream.read("sdcard/rpg_config.json"));
}
JSONClean = function(jsObj) {
    return JSON.stringify(jsObj, null, "\t");
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState,activity) {
    var layout=new android.widget.LinearLayout(activity);
    layout.setOrientation(android.widget.LinearLayout.HORIZONTAL);
    var txt=new android.widget.TextView(activity);
    txt.setText("액티비티 사용 예시입니다.");
    layout.addView(txt);
    activity.setContentView(layout);
}
function onResume(activity) {}
function onPause(activity) {}
function onStop(activity) {}