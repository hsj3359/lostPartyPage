var sendBossName = ["oreha", "argos", "baltanNormal", "viakissNormal", "baltanHard", "viakissHard", "kukusaten", "abrellshude"]
var BossNameByKor = ["오레하", "아르고스", "발탄 노말", "비아키스 노말", "발탄 하드", "비아키스 하드", "쿠크세이튼", "아브렐슈드"]
var bossLevel = [[1325, 9999], [1370, 9999], [1415, 1445], [1430, 1460], [1445, 9999], [1460, 9999], [1475, 9999], [1490, 9999]];

function partyClear() {
    var modalTile = document.getElementById("partyModalTitle").innerText
    var bossName = getSendBossName(modalTile)
    var partyNum = modalTile.slice(modalTile.length - 3, modalTile.length - 2)
    fetch("https://3359jun.pythonanywhere.com/clearGET/?bossName=" + bossName + "&partyNum=" + partyNum).then((response) => response.json())
        .then((data) => console.log(data));
}

function getSendBossName(name) {
    for (var i = 0; i < sendBossName.length; i++) {
        if (name.indexOf(BossNameByKor[i]) != -1) {
            return sendBossName[i]
        }
    }
    return 0
}

function modalClose() {
    $("#partyModal").modal('hide')

}

function findBossNameForSend(bossName) {
    for (var i = 0; i < BossNameByKor.length; i++) {
        if (BossNameByKor[i] == bossName) {
            return sendBossName[i]
        }
    }

}
function findBossNameForKor(bossName) {
    for (var i = 0; i < sendBossName.length; i++) {
        if (sendBossName[i] == bossName) {
            return BossNameByKor[i]
        }
    }

}

function viewPartyModal(selectRow) {
    console.log(selectRow)
    $('#partyModal').modal('show')
    document.getElementById("partyModal").style.visibility = "visible"
    var partyModalBody = document.getElementById("partyModalBody")
    var partyModalTitle = document.getElementById("partyModalTitle")
    partyModalTitle.innerHTML = findBossNameForKor(selectRow.id) + " " + selectRow.cells[2].innerText + "파티"
    if (selectRow.cells[2].getAttribute("id") > 99) {
        document.getElementById("partyModalButton").style.display = "none"
    }

    console.log(partyModalBody)
    fetch("https://3359jun.pythonanywhere.com/searchParty/?bossName=" + selectRow.id + "&partyNum=" + selectRow.cells[2].getAttribute("id")).then((response) => response.json())
        .then((data) => createPartyModalBody(data, partyModalBody));
}


function createPartyModalBody(data, bodyObject) {
    console.log(bodyObject)
    bodyObject.innerHTML = ""
    var ul = document.createElement('ul')
    for (var i = 0; i < data.length; i++) {
        var li = document.createElement('li')
        li.innerHTML = data[i]
        ul.appendChild(li)
    }
    bodyObject.appendChild(ul)



}

function addUser() {
    var name = document.getElementById("inputAddUser").value
    console.log(name)
    fetch("https://3359jun.pythonanywhere.com/addUser/" + name).then((response) => response.json())
        .then((data) => { if (data == "0") { console.log("실패") } else { "성공" } });

}

function getIndex(selectObject) {
    var x = selectObject.selectedIndex;

    var y = selectObject.options;

    var idx = y[x].index;
    return idx

}

function changeMakeSelect(selectObject) {
    cloneObject = selectObject.cloneNode(true)
    var makeBody = document.getElementById("makeBody")
    var bossNum = selectObject.id
    var maxPartyNum = 0
    if (bossNum == 0 || bossNum == 6) {
        maxPartyNum = 4
    }
    else {
        maxPartyNum = 8
    }
    if (makeBody.childElementCount < maxPartyNum) {
        makeBody.appendChild(cloneObject)
        selectObject.setAttribute("onchange", "")
    }
    else {
        selectObject.setAttribute("onchange", "")
    }

}

function makeSelect(selectObject, data) {
    for (var i = 0; i < data.length; i++) {
        if (i == 0) {
            optionObject = document.createElement("option")
            optionObject.innerHTML = "선택해주세요"
            optionObject.setAttribute("class", "-1")
            selectObject.appendChild(optionObject)
        }
        optionObject = document.createElement("option")
        optionObject.innerHTML = data[i][0] + "/" + data[i][1] + "/" + data[i][2]
        optionObject.setAttribute("class", "" + data[i][3])
        optionObject.setAttribute("id", data[i][0])
        selectObject.appendChild(optionObject)
    }
}

function makeOption(selectObject) {
    body = document.getElementById("makeBody")
    while (body.hasChildNodes()) { body.removeChild(body.firstChild); }
    num = getIndex(selectObject) - 1
    bossName = sendBossName[num]
    if (num == -1) { alert("다시 선택해주세요") }
    else {
        select = document.createElement("select")
        select.setAttribute("class", "form-control makeOption")
        select.setAttribute("onchange", "changeMakeSelect(this)")
        select.setAttribute("id", "" + num)
        body.appendChild(select)
        fetch("https://3359jun.pythonanywhere.com/searchCreatePartyMember/?bossName=" + bossName + "&bossLevel1=" + bossLevel[num][0] + "&bossLevel2=" + bossLevel[num][1]).then((response) => response.json())
            .then((data) => makeSelect(select, data));
    }


}
function changeBossName(bossName) {
    for (var i = 0; i < sendBossName.length; i++) {
        if (sendBossName[i] == bossName) {
            return BossNameByKor[i]
        }
    }
}

function createTable(data) {
    console.log(data)
    table = document.getElementById("partyTable")
    for (var i = 0; i < data.length; i++) {
        row = table.insertRow()
        row.setAttribute("id", data[i][0])
        row.setAttribute("onclick", "viewPartyModal(this)")
        cell1 = row.insertCell()
        cell1.innerHTML = data[i][2]
        cell2 = row.insertCell()
        cell2.innerHTML = changeBossName(data[i][0])
        cell3 = row.insertCell()
        if (data[i][1] > 99) {
            cell3.innerHTML = "완료"

        }
        else {
            cell3.innerHTML = data[i][1]

        }

        cell3.setAttribute("id", data[i][1])

    }

}

function saveParty() {
    var makeDom = document.getElementsByClassName("makeOption")
    var save = true
    for (var i = 0; i < makeDom.length; i++) {
        for (var j = makeDom.length - 1; j > i; j--) {
            if (makeDom[j].options[makeDom[j].selectedIndex].innerText == "선택해주세요") {
                continue
            }
            if (makeDom[i].options[makeDom[i].selectedIndex].innerText == makeDom[j].options[makeDom[j].selectedIndex].innerText) {
                alert("다른 파티원을 선택해주세요")
                save = false
                break;
            }
            else if (makeDom[i].options[makeDom[i].selectedIndex].getAttribute("class") == makeDom[j].options[makeDom[j].selectedIndex].getAttribute("class")) {
                alert("다른 파티원을 선택해주세요")
                save = false
                break;
            }
        }
        if (save == false) {
            console.log("종료")
            break;
        }
    }
    if (save == true) {
        var textData = ""
        for (var i = 0; i < makeDom.length; i++) {
            if (makeDom[i].options[makeDom[i].selectedIndex].getAttribute("class") == "-1") { continue }
            if (i == 0) { textData += makeDom[i].options[makeDom[i].selectedIndex].id.replace(" ", "") }
            else { textData += "," + makeDom[i].options[makeDom[i].selectedIndex].id.replace(" ", "") }
        }
        console.log(textData.replace(" ", ""))
        console.log(document.getElementById("makeDate").value)
        fetch("https://3359jun.pythonanywhere.com/createPartyGet/?bossName=" + bossName + "&userName=" + textData + "&date=" + document.getElementById("makeDate").value).then((response) => response.json())
            .then((data) => console.log("성공"));
    }

}

function createMember(data) {
    var container = document.getElementById("memberContain")
    for (var i = 0; i < data.length; i++) {
        var text = document.createElement("div")
        text.innerHTML = data[i][0] + "/" + data[i][1] + "/" + data[i][2]
        var line = document.createElement("hr")
        var link = document.createElement("a")
        link.setAttribute("href", "https://www.mgx.kr/lostark/character/?character_name=" + encodeURI(data[i][0].replace(/^\s+|\s+$/g, "")))
        link.setAttribute("target", "blank")
        link.appendChild(text)
        container.appendChild(link)
        container.appendChild(line)
    }
}
fetch("https://3359jun.pythonanywhere.com/userData").then((response) => response.json())
    .then((data) => createMember(data));

fetch("https://3359jun.pythonanywhere.com/partyReserVation").then((response) => response.json())
    .then((data) => createTable(data));