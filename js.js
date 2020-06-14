//都需要的变量
var maxSpace = 639; //可用内存空间的下标为0-639共640K

//最先适配算法的变量
var map = new Map(); //利用Map()新建一个分区表 key的值为起始地址 value的值为占用空间 地址空间从0-639
var $index = 0; //因为要用到循环查找，所以要记录当前位置
var arrayObj; //map对应的数组
var work = 1; //记录作业号
//最佳适配算法的变量
var map2 = new Map();
var arrayObj2;
var work2 = 1; //记录作业号
$sort();

//给map排序
function $sort() {
	arrayObj = Array.from(map); //把分区表从map的形式变为数组的形式以便对其进行排序
	arrayObj.sort(function (a, b) { //对分区表按key的值进行排序
		"use strict";
		return a[0] - b[0];
	});
	map = new Map(arrayObj.map(i => [i[0], i[1]])); //把分区表从数组的形式转化为map的形式
	//----------------------------------------------------------------------------//
	arrayObj2 = Array.from(map2);
	arrayObj2.sort(function (a, b) {
		"use strict";
		return a[0] - b[0];
	});
	map2 = new Map(arrayObj2.map(i => [i[0], i[1]]));
}

//分配空间
function $allocate() {
	//同时执行两种算法
	firstAdaptationAlgorithm();
	bestFitAlgorithm();
}

//释放空间
function $release() {
	let exist = false;
	for (let [key, value] of map) {
		if (value == Number(document.getElementById("release").value)) {
			exist = true;
			map.delete(key);
		}
	}
	//如果要删除的区间不存在则弹窗提示
	if (exist == false) {
		alert("区间大小为" + Number(document.getElementById("release").value) + "的区间不存在");
		document.getElementById("work").innerHTML += "申请释放" + Number(document.getElementById("release").value) + "K 但区间不存在<br/>";
	} else
		document.getElementById("work").innerHTML += "申请释放" + Number(document.getElementById("release").value) + "K<br/>";
	
	let exist2=false;
	for (let [key, value] of map2) {
		if (value == Number(document.getElementById("release").value)) {
			exist2 = true;
			map2.delete(key);
		}
	}
	if(exist2==false){
		alert("区间大小为" + Number(document.getElementById("release").value) + "的区间不存在");
	}
	
	$sort();
	printTable();
}

function printTable() {
	//打印表格
	document.getElementById("table").innerHTML = "<tr><th colspan='2'>首次适应算法分区表&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</th></tr><tr><td>起始地址</td><td>占用空间</td></tr>";
	document.getElementById("table2").innerHTML = "<tr><th colspan='2'>最佳适配算法分区表&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</th></tr><tr><td>起始地址</td><td>占用空间</td></tr>";
	for (let [key, value] of map) {
		document.getElementById("table").innerHTML += "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
	}
	for(let [key,value] of map2){
		document.getElementById("table2").innerHTML +="<tr><td>" + key + "</td><td>" + value + "</td></tr>";
	}
	//绘图1
	var c = document.getElementById("myCanvas");
	var cxt = c.getContext("2d");
	var ctx = c.getContext("2d");
	cxt.fillStyle = "#808080";
	cxt.fillRect(0, 0, 1280, 120);

	for (let [key, value] of map) {
		cxt.fillStyle = "#ffc800";
		cxt.fillRect(key * 2, 0, value * 2, 90);
		cxt.strokeRect(key * 2, 0, value * 2, 90);
		ctx.fillStyle = "black";
		ctx.font = "10px Georgia";
		ctx.fillText(key + "K", key * 2 + 1, 85);
		ctx.fillText(key + value - 1 + "K", (key + value) * 2 - 24, 85);
	}
	//绘图2
	var c2 = document.getElementById("myCanvas2");
	var cxt2 = c2.getContext("2d");
	var ctx2 = c2.getContext("2d");
	cxt2.fillStyle = "#808080";
	cxt2.fillRect(0, 0, 1280, 120);
	for (let [key, value] of map2) {
		cxt2.fillStyle = "#ffc800";
		cxt2.fillRect(key * 2, 0, value * 2, 90);
		cxt2.strokeRect(key * 2, 0, value * 2, 90);
		ctx2.fillStyle = "black";
		ctx2.font = "10px Georgia";
		ctx2.fillText(key + "K", key * 2 + 1, 85);
		ctx2.fillText(key + value - 1 + "K", (key + value) * 2 - 24, 85);
	}

}

//给map排序，并更新打印的分区图
function update() {
	$sort();
	printTable();
}

//循环首次适应算法
function firstAdaptationAlgorithm() {
	//打印log
	//如果拒绝某次请求，会打印"被拒绝"
	document.getElementById("work").innerHTML += "作业" + work + "申请" + document.getElementById("allocate").value + "K";
	work++;
	let start = $index;
	let space = Number(document.getElementById("allocate").value);
	//space不能为0
	if (space == 0) { //不能为0
		alert("不能为0或空");
		document.getElementById("work").innerHTML += " 被拒绝<br/>";
		return 0;
	}
	if (isNaN(space)) { //输入不能为非数字
		alert("请输入数字类型的输入");
		document.getElementById("work").innerHTML += " 被拒绝<br/>";
		return 0;
	}
	while (1) {

		//如果分区表全部空闲
		if (map.size == 0 && space <= maxSpace + 1) {
			map.set(0, space);
			update();
			document.getElementById("work").innerHTML += "<br/>";
			return 0;
		}
		
		//如果当前指针为0但分区表第一项不是从0开始
		if (map.size != 0 && $index == 0 && space <= arrayObj[0][0]) {
			map.set(0, space);
			update();
			document.getElementById("work").innerHTML += "<br/>";
			return 0;
		}

		//如果分区表当前指针走到的位置是分区表最后一位且仍有足够空闲空间
		if (map.size != 0 && $index == map.size - 1 && (arrayObj[$index][0] + arrayObj[$index][1] + space - 1) <= maxSpace) {
			map.set(arrayObj[$index][0] + arrayObj[$index][1], space);
			update();
			document.getElementById("work").innerHTML += "<br/>";
			return 0;
		}
		//如果分区表当前指针走到的位置不是分区表最后一位,且紧邻该分区存在空闲空间
		if (map.size != 0 && $index >= 0 && $index < map.size - 1 && (arrayObj[$index][0] + arrayObj[$index][1] + space - 1) <= arrayObj[$index + 1][0] - 1) {
			map.set(arrayObj[$index][0] + arrayObj[$index][1], space);
			update();
			document.getElementById("work").innerHTML += "<br/>";
			return 0;
		}
		
		//当前指针所指分区表项的下一个邻接区间没有空闲空间，所以将指针指向下一项
		$index = ($index + 1) % map.size;
		//如果循环了一轮依然没有找到空闲空间，则无法插入
		if ($index == start) {
			alert("内存不足");
			document.getElementById("work").innerHTML += " 被拒绝<br/>";
			return 0;
		}
	}
}

//最佳适应算法
function bestFitAlgorithm() {
	document.getElementById("work2").innerHTML += "作业" + work2 + "申请" + document.getElementById("allocate").value + "K";
	work2++;
	let space = Number(document.getElementById("allocate").value);
	if (space == 0) { //不能为0
		document.getElementById("work2").innerHTML += " 被拒绝<br/>";
		return 0;
	}
	if (isNaN(space)) { //输入不能为非数字
		document.getElementById("work2").innerHTML += " 被拒绝<br/>";
		return 0;
	}
	//如果分区表全部空闲
	if (map2.size == 0 && space <= maxSpace + 1) {
		map2.set(0, space);
		update();
		document.getElementById("work2").innerHTML +="<br/>";
		return 0;
	}
	let haveAlert=0;
	let minSpace = 1000;
	let bestPlace;
	let index2 = 0;
	if (arrayObj2[0][0] >= space) {
		minSpace = arrayObj2[0][0];
		bestPlace = 0;
	}
	while (1) {
		if (index2 == map2.size - 1) {
			if ((arrayObj2[index2][0] + arrayObj2[index2][1] + space - 1) <= maxSpace &&
				maxSpace - arrayObj2[index2][0] - arrayObj2[index2][1] + 1 < minSpace) {
				minSpace = maxSpace - arrayObj2[index2][0] - arrayObj2[index2][1] + 1;
				bestPlace=arrayObj2[index2][0]+arrayObj2[index2][1];
			}
		}
		if (index2 < map2.size - 1) {
			if ((arrayObj2[index2][0] + arrayObj2[index2][1] + space - 1) <= arrayObj2[index2 + 1][0] - 1 &&
				arrayObj2[index2 + 1][0] - arrayObj2[index2][0] - arrayObj2[index2][1] < minSpace) {
				minSpace = arrayObj2[index2 + 1][0] - arrayObj2[index2][0] - arrayObj2[index2][1];
				bestPlace=arrayObj2[index2][0]+arrayObj2[index2][1];
			}
		}
		index2 = (index2 + 1) % map2.size;
		if (index2 == 0 && minSpace==1000) {
			alert("内存不足");
			haveAlert=1;
			document.getElementById("work2").innerHTML += " 被拒绝";
			break;
		}
		else if(index2==0){
			break;
		}
	}
	if(haveAlert!=1)map2.set(bestPlace,space);
	document.getElementById("work2").innerHTML +="<br/>";
	update();
	return 0;
}
