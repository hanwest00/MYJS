/********************/
/***Editor: hanX*****/
/***Date:20121106****/
/********************/

var row = 20;
var col = 6;
var gameColor = "#ccc";
var startX = 1;//必須小于col
var startY = 1;//必須小于row
var boxSize = 10;
var boxColor = new Array("red","green","blue","pink");
var gamePanelArray = new Array();
var speed = 300;//下落速度,ms(毫秒)
var doDrop;
var currShape = {};
var panel;
var frozenBoxArr = new Array();
var currPoint = 0;//当前分数
var gameStart = false;
var pause = true;
var perPoint = 100;//每消除一行的基础分
var checkpoint = 10000;//過關分數

var shape = [
             [["0|1","1|1","2|1","3|1"],["1|0","1|1","1|2","1|3"],["2|1","1|1","0|1","-1|1"],["1|2","1|1","1|0","1|-1"]],
             [["1|0","0|1","1|1","2|1"],["2|1","1|0","1|1","1|2"],["1|2","2|1","1|1","0|1"],["0|1","1|2","1|1","1|0"]],
			 [["0|0","1|0","1|1","2|1"],["2|0","2|1","1|1","1|2"]/*,["2|2","1|2","1|1","0|1"],["0|2","0|1","1|1","1|0"]*/],
			 [["0|0","1|0","0|1","1|1"]],
			 [["2|0","1|0","1|1","0|1"],["2|2","2|1","1|1","1|0"]],
			 [["0|0","0|1","1|1","2|1","2|0"],["2|0","1|0","1|1","1|2","2|2"],["2|2","2|1","1|1","0|1","0|2"],["0|2","1|2","1|1","1|0","0|0"]]
			];//形狀

//小矩形
var minBox = function(x,y,size,color){
     this.x = x;
	 this.y = y;
	 this.sX = x;
	 this.sY = y;
	 this.size = size;
	 this.color = color;
	 this.frozen = false;
	 var box = document.createElement("div");

	 this.getBox = function(){ 
	   box.style.width = this.size + "px";
	   box.style.height = this.size + "px";
	   box.style.background = this.color;
	   box.style.position = "absolute";
	   box.style.left = (this.x + startX) * this.size + "px";
	   box.style.top = (this.y + startY) * this.size + "px";
	   gamePanelArray[this.y + startY][this.x + startX] = 1;
	   return box;
	 }
	 
	 this.boxGetter = function(){
	   return box;
	 }
	 
	 this.changeColor = function(color){
	    this.color = color;
	    box.style.background = color;
	 }
	 
	 this.checkCollision = function(position){
	    if((position == "bottom")&&(((this.y + startY + 1) >= row) || (gamePanelArray[this.y + startY + 1][this.x + startX] == 1))){
		  return true;
		}
	 
	    if((position == "right")&&((gamePanelArray[this.y + startY][this.x + startX + 1] == 1) || ((this.x + startX + 1) >= col))){
		   return true;
		}
		
		if((position == "left")&&((gamePanelArray[this.y + startY][this.x + startX - 1] == 1) || ((this.x + startX) <= 0))){
		  return true;
		}
		return false;
	 }
	 
	 this.changeColor = function(color){
	    box.style.background = color;
	 }

	 this.change = function(cX,cY){
	  
	   this.x = this.x + cX;
	   this.y = this.y + cY;
	   box.style.left = (this.x + startX) * this.size + "px";
	   box.style.top = (this.y + startY) * this.size + "px";
	   gamePanelArray[this.y + startY][this.x + startX] = 1;
	  
	 }
	 
	 this.checkChange = function(nX,nY,specLeft,specRight){
	        if(gamePanelArray[this.y + nY - this.sY + startY][this.x + nX - this.sX + specLeft - specRight + startX] == 1){
			  return true;
			}
			return false;
	 }
	 
	 this.changeShape = function(nX,nY,specLeft,specRight){
	   if(!this.frozen){
	     this.change((nX - this.sX + specLeft - specRight),(nY - this.sY));
		 this.sX = nX;
		 this.sY = nY;
	   }
	 }
	 
	 this.clearPosition = function(){
	    gamePanelArray[this.y + startY][this.x + startX] = 0;
	 }
}

//形状
var shapeBox = function(shapeArray){
     this.isFrozen = false;
	 this.midBoxNo = 0;
	 var currShapeNo = Math.floor(Math.random()*shapeArray.length);
	 var currShapeArray = shapeArray[currShapeNo];
     var BoxArray = new Array();
     
	 this.createShapeBox = function(){
	     for(var i = 0;i < currShapeArray.length; i++){ 
	      BoxArray[i] = new minBox(parseInt(currShapeArray[i].split("|")[0]),parseInt(currShapeArray[i].split("|")[1]),boxSize,boxColor[Math.floor(Math.random()*boxColor.length)]);
		  if(currShapeArray[i] == "1|1"){
		     this.midBoxNo = i;
		  }
	    }
	    return BoxArray;
	 }
	 
	 this.changeShape = function(){
	  if(!this.dropEnd()){
	     var spL = 0;
		 var spR = 0;
		 var tempShapeNo = currShapeNo;
		
	    if (currShapeNo >= (shapeArray.length - 1)){
		  currShapeNo = 0;
	    }
		else {
		  currShapeNo = currShapeNo + 1;
		}
		
		currShapeArray = shapeArray[currShapeNo];
		
		 if((BoxArray[this.midBoxNo].x + startX) < this.getBoxMaxY().sY){ 
		     spL = this.getBoxMaxY().sY - BoxArray[this.midBoxNo].x - startX - 1;
		  }
		  
		  if((col - BoxArray[this.midBoxNo].x - startX - 1) < (BoxArray[this.midBoxNo].sY - this.getBoxMinY().sY)){
		     spR = (BoxArray[this.midBoxNo].sY - this.getBoxMinY().sY) - (col - BoxArray[this.midBoxNo].x - startX - 1);
		  }
		  
		 //检测变形后是否会与fronzenBox碰撞
		for(var i = 0;i < currShapeArray.length; i++){ 
		   if(BoxArray[i].checkChange(parseInt(currShapeArray[i].split("|")[0]),parseInt(currShapeArray[i].split("|")[1]),spL,spR)){
		      currShapeNo = tempShapeNo;
			  currShapeArray = shapeArray[currShapeNo];
			  return;
		   }
		}
		
		this.clearPosition();

	    for(var i = 0;i < currShapeArray.length; i++){ 
		    BoxArray[i].changeShape(parseInt(currShapeArray[i].split("|")[0]),parseInt(currShapeArray[i].split("|")[1]),spL,spR);
	      }
		}	
	 }
	 
	 this.dropEnd = function(){
	    var bottom = 0;
		var end = false;
	    for(var i = 0;i < BoxArray.length; i++){ 
		  if(BoxArray[i].checkCollision("bottom")){
		     for(var j = 0; j<currShapeArray.length;j++){
			   if((BoxArray[i].sX + "|" + (BoxArray[i].sY + 1)) != currShapeArray[j]){
			      bottom++;
			   }
			 }
			 
			 if(bottom == currShapeArray.length){
			   end = true;
			 }
			 bottom = 0;
		  }
	    }
		if(end){
		  stopDrop();
		  this.frozen();
		  return true;
		}
		return false;
	 }
	 
	 this.leftEnd = function(){
	   var left = 0;
	   var end = false;
	   for(var i = 0;i < BoxArray.length; i++){ 
	       if(BoxArray[i].checkCollision("left")){
		     for(var j = 0; j<currShapeArray.length;j++){
			     if(((BoxArray[i].sX - 1)+ "|" + BoxArray[i].sY) != currShapeArray[j]){
			      left++;
			   }
			 }
			 
			 if(left == currShapeArray.length){
			   end = true;
			 }
			 left = 0;
		   }
		   
	    }
		
		if(end){
		     return true;
		 }
		 return false;
	 }
	 
	 this.rightEnd = function(){
	   var right = 0;
	   var end = false;
	   for(var i = 0;i < BoxArray.length; i++){ 
	       if(BoxArray[i].checkCollision("right")){
		     for(var j = 0; j<currShapeArray.length;j++){
			     if(((BoxArray[i].sX + 1)+ "|" + BoxArray[i].sY) != currShapeArray[j]){
			      right++;
			   }
			 }
			 
			 if(right == currShapeArray.length){
			   end = true;
			 }
			 right = 0;
		   }
		   
	    }
		
		if(end){
		     return true;
		 }
		 return false;
	 }
	 
	 this.getBoxMaxX = function(){
	    var maxXBox = BoxArray[0];
	    for(var i = 0;i < BoxArray.length; i++){ 
		   if(BoxArray[i].x >= maxXBox.x){
		      maxXBox = BoxArray[i];
		   }
	    }
		return maxXBox;
	 }
	 
	 this.getBoxMinX = function(){
	    var MinXBox = BoxArray[0];
	    for(var i = 0;i < BoxArray.length; i++){ 
		   if(BoxArray[i].x <= MinXBox.x){
		      MinXBox = BoxArray[i];
		   }
	    }
		return MinXBox;
	 }
	 
	 this.getBoxMaxY = function(){
	   var maxYBox = BoxArray[0];
	   for(var i = 0;i < BoxArray.length; i++){ 
		   if(BoxArray[i].y >= maxYBox.y){
		      maxYBox = BoxArray[i];
		   }
	    }
		return maxYBox;
	 }
	 
	 this.getBoxMinY = function(){
	   var minYBox = BoxArray[0];
	   for(var i = 0;i < BoxArray.length; i++){ 
		   if(BoxArray[i].y <= minYBox.y){
		      minYBox = BoxArray[i];
		   }
	    }
		return minYBox;
	 }
	 
	 this.isSpecial= function(){
	   var SpecUp = 0;
	   var SpecDown = 0;
	   var SpecLeft = 0;
	   var SpecRight = 0;
	   for(var i = 0;i < BoxArray.length; i++){ 
		   if(BoxArray[i].sY > 1){
		      SpecDown++;
		   }
		   if(BoxArray[i].sY < 1){
		      SpecUp++;
		   }
		   if(BoxArray[i].sX > 1){
		      SpecRight++;
		   }
		   if(BoxArray[i].sX < 1){
		      SpecLeft++;
		   }
	    }
		return [SpecUp,SpecDown,SpecLeft,SpecRight];
	 }
	 
	 this.clearPosition = function(){
	   for(var i = 0;i < BoxArray.length; i++){ 
		    BoxArray[i].clearPosition();
	      }
	 }

	 this.shapeBoxDrop = function(){
	   if(!this.dropEnd()){
	      this.clearPosition();
          for(var i = 0;i < BoxArray.length; i++){ 
	    	BoxArray[i].change(0,1);
	      }
		}else{
		   for(var j = 0;j < BoxArray.length; j++){ 
		    frozenBoxArr.push(BoxArray[j]);
			}
		   if(this.getBoxMinX().y > 3){
		     createItem();
		   }
		   else{
		     //gameover
			 gameOver();
		   }
		   clearRow();
		}
     }
	 
	 this.shapeBoxLeft = function(){
	   if(!this.leftEnd()){
	     this.clearPosition();
		 for(var i = 0;i < BoxArray.length; i++){ 
	    	BoxArray[i].change(-1,0);
	      }
	   }
	 }
	 
	 this.shapeBoxRight = function(){
	   if(!this.rightEnd()){
	     this.clearPosition();
		 for(var i = 0;i < BoxArray.length; i++){ 
	    	BoxArray[i].change(1,0);
	      }
	   }
	 }
	 
	 this.frozen = function(){
	   for(var i = 0;i < BoxArray.length; i++){ 
	    	BoxArray[i].frozen = true;
	      }
	   this.isFrozen = true;
	 }
}

//game主界面
var gamePanel = function(){
     var mainPanel = document.createElement("div");
	 for(var i = 0;i<row;i++){
	    gamePanelArray[i] = new Array();
	    for(var j = 0;j<col;j++){
	     gamePanelArray[i][j] = 0;
	    }
	 }
	 mainPanel.style.width = col * boxSize +"px";
	 mainPanel.style.height = row * boxSize +"px";
	 mainPanel.style.position = "relative";
	 mainPanel.style.background = gameColor;
	 mainPanel.style.margin = "30px auto";
	 return mainPanel;
}

function start(){
  if(!gameStart){
    return;
  }
  panel = new gamePanel();
  document.body.appendChild(panel);
  createItem();
  bindEvent();
}

//清除满行
function clearRow(){

  var fullRow = new Array();
  var tmpFullRow = new Array();
  var fullRowNum = new Array();
  var count = 0;
  for(var i =0;i<row;i++){
     for(var j =0 ;j <frozenBoxArr.length;j++){
	   if(frozenBoxArr[j].y == i){
	     tmpFullRow.push(j);
		 count++;
	   }
	 }
	 if(count == col){
	    fullRowNum.push(i);
		var tLeng = fullRow.length;
		for(var k = 0;k< tmpFullRow.length;k++){
		  fullRow[tLeng + k] = tmpFullRow[k];
		}
	 }
	 count = 0;
	 tmpFullRow.splice(0,tmpFullRow.length);
  }
  
  if(fullRowNum.length > 0){
    recordPoint(fullRowNum.length);//加分
	showPoint();
    for(var s = 0;s<fullRow.length;s++){
		   frozenBoxArr[fullRow[s]].clearPosition();
		   panel.removeChild(frozenBoxArr[fullRow[s]].boxGetter());
		   frozenBoxArr[fullRow[s]] = 0;
		}
		
	 var remainingBox = new Array();
	 
	 for(var b in frozenBoxArr){
	   if(frozenBoxArr[b] != 0){
	     remainingBox.push(frozenBoxArr[b]);
	   }
	 }

     //对消除后剩余的frozenbox array按照Y的倒序排序
	 if(remainingBox.length > 1){
     var tempBox;
     for (var i = 0;i < remainingBox.length - 1;i++){
	   for(var j = i + 1;j < remainingBox.length;j++){
	      if(remainingBox[i].y < remainingBox[j].y){
		   tempBox = remainingBox[i];
		   remainingBox[i] = remainingBox[j];
		   remainingBox[j] = tempBox;
		 }
	    }
	   }
	 }
	 
	 for(var s = 0;s<remainingBox.length;s++){
	     remainingBox[s].changeColor("#000");
	 }
	 
    for(var j = 0;j<fullRowNum.length;j++){
      for(var s = 0;s<remainingBox.length;s++){
           if(remainingBox[s].y + startY <= fullRowNum[j]){
		      remainingBox[s].clearPosition();
              remainingBox[s].change(0,1);
		    }
         }
	 }
	
	  fullRow.splice(0,fullRow.length);
	  fullRowNum.splice(0,fullRowNum.length);
	  remainingBox.splice(0,remainingBox.length);
  }
}

//创建新的形状
function createItem(){
  var newShape = new shapeBox(shape[Math.floor(Math.random()*shape.length)]);
  newShape.prototype = shapeBox.prototype;
  var shapeArr = newShape.createShapeBox();
  for(var i = 0; i <shapeArr.length;i++)
  {
    panel.appendChild(shapeArr[i].getBox());
  }
  currShape = newShape;
  startDrop();
}

//For test start
var mainArr = document.createElement("div");


function testMainArr(){
  
    document.body.appendChild(mainArr);
    mainArr.innerHTML = "";
   for(var i = 0;i < gamePanelArray.length;i++){
      for(var j = 0;j<col;j++){
	    mainArrSpan = document.createElement("span");
		mainArrSpan.innerHTML = gamePanelArray[i][j];
	    mainArr.appendChild(mainArrSpan);
	  }
	  mainArrSplit = document.createElement("<br />");
	  mainArr.appendChild(mainArrSplit);
   }
   
}
//For test end

//自动下落
function startDrop(){
   if(currShape.prototype === shapeBox.prototype && pause){
	  doDrop = setInterval("currShape.shapeBoxDrop()",speed);
	  pause = false;
   }
}

//停止下落
function stopDrop(){
    if(!pause){
	 clearInterval(doDrop); 
	 pause = true;
	 }
}

//重新开始
function reStart(){
   document.body.removeChild(panel);
   gameStart = true;
   start();
}

//绑定键盘事件
function bindEvent(){
 
  document.onkeydown = function(e){
    var e = window.event||e;
    var key = e.keyCode||e.which;
	 if(!gameStart){
	    return;
	 }
     if(key == 83 || key == 40){
        currShape.shapeBoxDrop();
     }
	 
	 if(key == 65 || key == 37){
	    currShape.shapeBoxLeft();
	 }
	 
	 if(key == 68 || key == 39){
	    currShape.shapeBoxRight();
	 }
	 
	 if(key == 87 || key == 38){
	    currShape.changeShape();
	 }
   }
   
}

//游戏结束时发生
function gameOver(){
   var overBox = document.createElement("div");
   overBox.style.width = (col * 2 / 3) * boxSize + "px";
   overBox.style.height = "20px";
   overBox.style.position = "absolute";
   overBox.style.top = (row * boxSize / 2) - parseInt(overBox.style.height.replace("px","")) + "px";
   overBox.style.left = (col * boxSize - parseInt(overBox.style.width.replace("px","")))/2 + "px";
   overBox.style.textAlign = "center";
   overBox.style.background = "#ccc";
   overBox.innerHTML = "Game Over";
   panel.appendChild(overBox);
   clearInterval(doDrop);
   gameStart = false;
}

//计分算法
function recordPoint(rowCount){
  currPoint += (row + rowCount + perPoint) * rowCount;
  recordPoint();
}

// 关卡算法
var level = 1;
function recordPoint(){
  if(currPoint > checkpoint){
     speed -= currPoint/10000;
	 checkpoint = checkpoint * level;
	 level++;
	 showLevel();
  }
}

//显示分数
function showPoint(){
  if(document.getElementById("point_show"))
  {
    document.getElementById("point_show").innerHTML = "分数：" + currPoint;
	return;
  }
  var pointShow = document.createElement("div");
  pointShow.setAttribute("id","point_show");
  pointShow.style.width = "100px";
  pointShow.innerHTML = "分数：" + currPoint;
  document.body.appendChild(pointShow);
}

//显示关卡
function showLevel(){
   if(document.getElementById("level_show"))
  {
    document.getElementById("level_show").innerHTML = "分数：" + currPoint;
	return;
  }
  var levelShow = document.createElement("div");
  levelShow.setAttribute("id","level_show");
  levelShow.style.width = "100px";
  levelShow.innerHTML = "关卡：" + currPoint;
  document.body.appendChild(levelShow);
}




