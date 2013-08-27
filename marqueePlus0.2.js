  /*@ Hanson */
  
  /*
	1,滚动的ID
	2,显示的宽度
	3,显示的高度
	4,方向 0(top),1(down),2(left),3(right)
	5,间隔(ms) 越大越慢
  */
  function marqueePlus(divId,width,height,direction,delay) {
		var div,div1,stop,innerWidth,innerHeight,seed,method;
	    var mDiv = document.getElementById(divId);
		
		if(mDiv == null) {
		   return;
		}
		
		innerWidth = mDiv.scrollWidth;
		innerHeight = mDiv.scrollHeight;
		
		if(direction < 2) {
			//if(innerHeight <= parseInt(mDiv.style.height.replace("px",""))) {
			if(innerHeight <= height) {
				return;
			}
		} else {
		   //if(innerWidth <= parseInt(mDiv.style.width.replace("px",""))) {
			if(innerHeight <= width) {
				return;
			}
		}
		
		mDiv.style.position = "relative";
		mDiv.style.width = width + "px";
		mDiv.style.height = height + "px";
		mDiv.style.overflow = "hidden";
		
		div = document.createElement("div");
		div1 = document.createElement("div");
		div.style.cssText = div1.style.cssText = "position:absolute;margin:0;padding:0;height:" + innerHeight + "px;width:" +innerWidth + "px;";
		switch(direction) {
			case 0 :
				div.style.top = "0px";
				div1.style.top = innerHeight + "px";
				method = doTopScroll;
				break;
			case 1 :
				div.style.bottom = "0px";
				div1.style.bottom = innerHeight + "px";
				method = doBottomScroll;
				break;
			case 2 :
				div.style.left = "0px";
				div1.style.left = innerWidth + "px";
				method = doLeftScroll;
				break;
			case 3 :
				div.style.right = "0px";
				div1.style.right = innerWidth + "px";
				method = doRightScroll;
				break;
		}
		
		
		div.innerHTML = div1.innerHTML = mDiv.innerHTML;
		mDiv.innerHTML = "";
		mDiv.appendChild(div);
		mDiv.appendChild(div1);
		
		if(/MSIE (7|8|6)/.test(navigator.userAgent)) {
			seed = 1;
		} else {
			seed = 1;
		}
		
		//闭包定时触发
		/*var mTime = setInterval(function() {
			if(stop) {
				return;
			}
	
			if(parseInt(div1.style.top.replace("px","")) > 0) {
				div.style.top = (parseInt(div.style.top.replace("px","")) - seed) + "px";
				div1.style.top = (parseInt(div1.style.top.replace("px","")) - seed) + "px";
			} else {
				div.style.top = "0px";
				div1.style.top = innerHeight + "px";
			return;
			}
		},speed);*/
		
		function doTopScroll() {
			if(stop) {
				return;
			}
	
			if(parseInt(div1.style.top.replace("px","")) > 0) {
				div.style.top = (parseInt(div.style.top.replace("px","")) - seed) + "px";
				div1.style.top = (parseInt(div1.style.top.replace("px","")) - seed) + "px";
			} else {
				div.style.top = "0px";
				div1.style.top = innerHeight + "px";
				return;
			}
		}
		
		function doBottomScroll() {
			if(stop) {
				return;
			}
	
			if(parseInt(div1.style.bottom.replace("px","")) > 0) {
				div.style.bottom = (parseInt(div.style.bottom.replace("px","")) - seed) + "px";
				div1.style.bottom = (parseInt(div1.style.bottom.replace("px","")) - seed) + "px";
			} else {
				div.style.bottom = "0px";
				div1.style.bottom = innerHeight + "px";
				return;
			}
		}
		
		function doLeftScroll() {
			if(stop) {
				return;
			}
	
			if(parseInt(div1.style.left.replace("px","")) > 0) {
				div.style.left = (parseInt(div.style.left.replace("px","")) - seed) + "px";
				div1.style.left = (parseInt(div1.style.left.replace("px","")) - seed) + "px";
			} else {
				div.style.left = "0px";
				div1.style.left = innerWidth + "px";
				return;
			}
		}
		
		function doRightScroll() {
			if(stop) {
				return;
			}
	
			if(parseInt(div1.style.right.replace("px","")) > 0) {
				div.style.right = (parseInt(div.style.right.replace("px","")) - seed) + "px";
				div1.style.right = (parseInt(div1.style.right.replace("px","")) - seed) + "px";
			} else {
				div.style.right = "0px";
				div1.style.right = innerWidth + "px";
				return;
			}
		}
		
		function mTime() {
		    method();
			setTimeout(function(){
			   mTime();
			},delay);
		}
		
		mDiv.onmouseover = function() {
			stop = true;
		};
		
		mDiv.onmouseout = function() {
			stop = false;
		};
		
		mTime();
  };
  
