var cvs=document.getElementById("cvs");
var ctx=cvs.getContext("2d");

//画布大小
cvs.width=900;
cvs.height=600;

var snakeSize=20;
var cvsGridX=cvs.width/snakeSize;
var cvsGridY=cvs.height/snakeSize;
var length=0;
var snakeBody=[];//其实每个蛇的身体都是一个对象，属性有x，y以及color
var dire=2;//设置初始方向为向左，自定义方向参数:上为1，下为-1，左为2，右为-2
var food={};//每个食物也是一个对象，属性为x,y以及color

/**
*初始化背景，蛇以及食物
*/
function init(){
	console.log(1);
	snakeBody=[];
	length=0;
	for(var i=0;i<3;i++){
		createSnakeNode(parseInt(cvsGridX/2)+i,parseInt(cvsGridY/2));
	}
	drawSnake();
	putFood();
}

/**
*创建蛇的节点
*/
function createSnakeNode(x,y){
	snakeBody.push({x:x,y:y,color:(length==0?"red":"#000")});
	length++;
}

/**
*构建蛇的整体形状
*/
function drawSnake(){
	ctx.clearRect(0,0,cvs.width,cvs.height);
	for(var i=0;i<snakeBody.length;i++){
		drawRect(snakeBody[i]);
	}
	drawRect(food);
}

/**
*绘制蛇的身体
*/
function drawRect(snakeNode){
	ctx.beginPath();
	ctx.fillStyle=snakeNode.color;
	ctx.fillRect(snakeNode.x*snakeSize,snakeNode.y*snakeSize,snakeSize,snakeSize);
	ctx.closePath();
}

/**
*让蛇进行移动
*/
function snakeMove(){
	//在蛇的移动时进行判断，如果咬到自身，那么游戏结束，重新开始，

	//这里选择重新建立一个对象而不是直接等于头结点，原因是如果直接等于的话，相当于对头结点的引用
	//那么万一对其进行修改的话，会影响头结点
	var newSnakeHeadNode={x:snakeBody[0].x,y:snakeBody[0].y,color:snakeBody[0].color};
	if(dire==1){
		newSnakeHeadNode.y-=1;
	}else if(dire==-1){
		newSnakeHeadNode.y+=1;
	}else if(dire==2){
		newSnakeHeadNode.x-=1;
	}else if(dire==-2){
		newSnakeHeadNode.x+=1;
	}
	for(var i=snakeBody.length-1;i>0;i--){
		snakeBody[i].x=snakeBody[i-1].x;
		snakeBody[i].y=snakeBody[i-1].y;
		//进行头和身体的碰撞判断
		if((snakeBody[i].x==newSnakeHeadNode.x) && (snakeBody[i].y==newSnakeHeadNode.y)){
			gameOver();
			return;
		}
	}
	snakeBody[0]=newSnakeHeadNode;
	checkOutOfBorder(snakeBody[0]);
	isGetFood(snakeBody[0]);
	drawSnake();
}

/**
*判断是否碰到外边界
*/
function checkOutOfBorder(node){
	if(node.x<0 || node.x>cvsGridX-1 || node.y<0 || node.y>cvsGridY-1){
		dire=2;
		init();
	}
}

/**
*游戏结束
*/
function gameOver(){
	init();
}

/**
*判断蛇是否获得了食物
*/
function isGetFood(node){
	if(node.x==food.x && node.y==food.y){
		putFood();
		snakeBody.push({x:snakeBody[snakeBody.length-1].x,y:snakeBody[snakeBody.length-1].y,color:"#ff0"});
	}	
}

/**
*阻止默认事件，当按下上下按钮的时候，屏幕不会滑动;并传入键盘按下事件
*/
document.onkeydown=function(e){
	e.preventDefault();
	if(e.keyCode==38){
		setDirection(1);
	}else if(e.keyCode==40){
		setDirection(-1);
	}else if(e.keyCode==37){
		setDirection(2);
	}else if(e.keyCode==39){
		setDirection(-2);
	}
};

/**
*控制蛇的方向
*/
function setDirection(dir){
	if(Math.abs(dir) == Math.abs(dire)){
		return;
	}else{
		dire=dir;
	}
}

/**
*放置食物
*/
function putFood(){
	var flag=1;
	while(1){
		flag=1;
		var foodX=parseInt(Math.random()*cvsGridX);
		var foodY=parseInt(Math.random()*cvsGridY);
		for(var i=0;i<snakeBody.length;i++){
			if(foodX==snakeBody[i].x && foodY==snakeBody[i].y){
				flag=0;
			}
		}	
		if(flag){
			break;
		}
	}
	food.x=foodX;
	food.y=foodY;
	food.color="#00f";
}

init();
setInterval(function(){
	snakeMove();
	drawSnake();
},100);
