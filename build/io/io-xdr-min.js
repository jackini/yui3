YUI.add("io-xdr",function(C){var A="io:xdrReady";function B(D,G){var E='<object id="yuiIoSwf" type="application/x-shockwave-flash" data="'+D+'" width="0" height="0">'+'<param name="movie" value="'+D+'">'+'<param name="FlashVars" value="yid='+G+'">'+'<param name="allowScriptAccess" value="sameDomain">'+"</object>",F=document.createElement("div");document.body.appendChild(F);F.innerHTML=E;}C.mix(C.io,{_transport:{},_fn:{},_xdr:function(D,E,F){if(F.on){this._fn[E.id]=F.on;}E.c.send(D,F,E.id);return E;},xdrReady:function(D){C.fire(A,D);},transport:function(D){switch(D.id){case"flash":B(D.src,D.yid);this._transport.flash=C.config.doc.getElementById("yuiIoSwf");break;}}});},"@VERSION@",{requires:["io-base"]});