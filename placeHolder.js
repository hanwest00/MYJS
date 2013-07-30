/*
	@Hanson
*/

function placeHolder(objId,holderText,type/*0 : input hidden , 1 : click hidden*/) {
     var ieReg = /MSIE [78]/;
     var userPholder = null;
     var obj = document.getElementById(objId);
     
     if(ieReg.test(navigator.userAgent)) {
     
        if(obj.parentNode.style.position != "relative") {
           obj.parentNode.style.position = "relative";
	    }
        userPholder = document.createElement("span");
        
        userPholder.innerHTML = holderText;
        userPholder.style.cssText = "position:absolute;top:4px;cursor:text;left:2px;z-index:0;color:#999;";
        
        obj.parentNode.appendChild(userPholder);
     }
     
     userPholder.onclick = function () {
	     obj.focus();
	 };
     if(type == 1) {
         obj.onfocus = function () {
	         if(obj.value != "") {
	         return;
	      }
	         hiddenOrShowObj(userPholder);
	     };
         
         obj.onblur = function () {
	         if(obj.value != "") {
	         return;
	      }
	         hiddenOrShowObj(userPholder);
	     };
	 } else {
	     obj.onkeyup= function () {
		    if(obj.value != "") {
		  	 	     userPholder.style.display = "none";
		    } else { 
		       userPholder.style.display = "inline";
		    }        
		};
	 }
	 
     function hiddenOrShowObj(obj) {
         if(obj != null) {
            if(obj.style.display == "none") {
	            obj.style.display = "inline";
	         } else {
	            obj.style.display = "none";
	         }
         }
     }				  
}