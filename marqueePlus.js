  /*@ Hanson */
  
  var div,div1,stop,innerWidth,innerHeight,seed;
  
  /*
	1,滚动的ID
	2,显示的宽度
	3,显示的高度
	4,滚动速度(ms)
  */
  function marqueePlus(divId,width,height,speed) {
	    var mDiv = document.getElementById(divId);
		
		if(mDiv == null) {
		   return;
		}
		
		innerWidth = mDiv.scrollWidth;
		if(innerHeight <= parseInt(mDiv.style.height.replace("px",""))) {
		  return;
		}
		innerHeight = mDiv.scrollHeight;
		mDiv.style.position = "relative";
		mDiv.style.width = width + "px";
		mDiv.style.height = height + "px";
		mDiv.style.overflow = "hidden";
		
		div = document.createElement("div");
		div1 = document.createElement("div");
		div.style.cssText = div1.style.cssText = "position:absolute;margin:0;padding:0;height:" + innerHeight + "px;width:" +innerWidth + "px;";
		div.style.top = "0px";
		div1.style.top = innerHeight + "px";
		div.innerHTML = div1.innerHTML = mDiv.innerHTML;
		mDiv.innerHTML = "";
		mDiv.appendChild(div);
		mDiv.appendChild(div1);
		
		if(/MSIE (7|8|6)/.test(navigator.userAgent)) {
			seed = 1;
		} else {
			seed = 1;
		}
		
		var mTime = setInterval("doMarqeen()",speed);
		
		mDiv.onmouseover = function() {
			stop = true;
		};
		
		mDiv.onmouseout = function() {
			stop = false;
		};
  };
  
  function doMarqeen() {
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
  
