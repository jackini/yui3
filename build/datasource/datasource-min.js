YUI.add("datasource-local",function(C){var B=C.Lang,A=function(){A.superclass.constructor.apply(this,arguments);};C.mix(A,{NAME:"DataSource.Local",ATTRS:{source:{value:null}},_tId:0,issueCallback:function(F){if(F.callback){var E=F.callback.scope||this,D=(F.error&&F.callback.failure)||F.callback.success;if(D){D.apply(E,[F]);}}}});C.extend(A,C.Base,{initializer:function(D){this._initEvents();},destructor:function(){},_initEvents:function(){this.publish("request",{defaultFn:C.bind("_defRequestFn",this)});this.publish("data",{defaultFn:C.bind("_defDataFn",this)});this.publish("response",{defaultFn:C.bind("_defResponseFn",this)});},_defRequestFn:function(E){var D=this.get("source");if(B.isUndefined(D)){E.error=new Error(this.toString()+" Source undefined");}if(E.error){this.fire("error",E);}this.fire("data",C.mix({data:D},E));},_defDataFn:function(G){var E=G.data,F=G.meta,D={results:(B.isArray(E))?E:[E],meta:(F)?F:{}};this.fire("response",C.mix({response:D},G));},_defResponseFn:function(D){A.issueCallback(D);},sendRequest:function(D,F){var E=A._tId++;this.fire("request",{tId:E,request:D,callback:F});return E;}});C.namespace("DataSource").Local=A;},"@VERSION@",{requires:["base"]});YUI.add("datasource-xhr",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NAME:"DataSource.XHR",ATTRS:{io:{value:B.io}}});B.extend(A,B.DataSource.Local,{initializer:function(C){this._queue={interval:null,conn:null,requests:[]};},_queue:null,_defRequestFn:function(E){var D=this.get("source"),C={on:{success:function(H,F,G){this.fire("data",B.mix({data:F},G));},failure:function(H,F,G){G.error=new Error(this.toString()+" Data failure");this.fire("error",B.mix({data:F},G));this.fire("data",B.mix({data:F},G));}},context:this,arguments:E};this.get("io")(D,C);return E.tId;}});B.DataSource.XHR=A;},"@VERSION@",{requires:["datasource-base"]});YUI.add("datasource-scriptnode",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NAME:"DataSource.ScriptNode",ATTRS:{get:{value:B.Get},asyncMode:{value:"allowAll"},scriptCallbackParam:{value:"callback"},generateRequestCallback:{value:function(C,D){return"&"+C.get("scriptCallbackParam")+"=YUI.Env.DataSource.callbacks["+D+"]";}}},callbacks:[],_tId:0});B.extend(A,B.DataSource.Local,{initializer:function(C){},_defRequestFn:function(F){var E=this.get("source"),D=this.get("get"),G=A._tId++,C=this;YUI.Env.DataSource.callbacks[G]=B.rbind(function(H){if((C.get("asyncMode")!=="ignoreStaleResponses")||(G===A.callbacks.length-1)){C.fire("data",B.mix({data:H},F));}else{}delete A.callbacks[G];},this,G);E+=F.request+this.get("generateRequestCallback")(this,G);D.script(E,{autopurge:true,onFailure:B.bind(function(H){H.error=new Error(this.toString()+" Data failure");this.fire("error",H);},this,F)});return F.tId;}});B.DataSource.ScriptNode=A;YUI.namespace("Env.DataSource.callbacks");},"@VERSION@",{requires:["datasource-base","get"]});YUI.add("datasource-function",function(B){var A=B.Lang,C=function(){C.superclass.constructor.apply(this,arguments);};B.mix(C,{NAME:"DataSource.Function",ATTRS:{source:{validator:A.isFunction},context:{value:null}}});B.extend(C,B.DataSource.Local,{initializer:function(D){},_defRequestFn:function(G){var F=this.get("source"),E=this.get("scope")||this,D;if(F){D=F.call(E,G.request,this,G);this.fire("data",B.mix({data:D},G));}else{G.error=new Error(this.toString()+" Data failure");this.fire("error",G);}return G.tId;}});B.DataSource.Function=C;},"@VERSION@",{requires:["datasource-base"]});YUI.add("datasource-cache",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NS:"cache",NAME:"DataSourceCache",ATTRS:{}});B.extend(A,B.Cache,{initializer:function(C){this.doBefore("_defRequestFn",this._beforeDefRequestFn);this.doBefore("_defResponseFn",this._beforeDefResponseFn);},_beforeDefRequestFn:function(D){var C=(this.retrieve(D.request))||null;if(C&&C.response){this.get("host").fire("response",B.mix({response:C.response},D));return new B.Do.Halt("DataSourceCache plugin halted _defRequestFn");}},_beforeDefResponseFn:function(C){this.add(C.request,C.response,(C.callback&&C.callback.argument));}});B.namespace("plugin").DataSourceCache=A;},"@VERSION@",{requires:["plugin","datasource-base","cache"]});YUI.add("datasource-jsonschema",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NS:"schema",NAME:"DataSourceJSONSchema",ATTRS:{schema:{}}});B.extend(A,B.Plugin.Base,{initializer:function(C){this.doBefore("_defDataFn",this._beforeDefDataFn);},_beforeDefDataFn:function(E){var D=((this.get("host") instanceof B.DataSource.XHR)&&B.Lang.isString(E.data.responseText))?E.data.responseText:E.data,C=B.DataSchema.JSON.apply(this.get("schema"),D);if(!C){C={meta:{},results:D};}this.get("host").fire("response",B.mix({response:C},E));return new B.Do.Halt("DataSourceJSONSchema plugin halted _defDataFn");}});B.namespace("plugin").DataSourceJSONSchema=A;},"@VERSION@",{requires:["plugin","datasource-base","dataschema-json"]});YUI.add("datasource-xmlschema",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NS:"schema",NAME:"DataSourceXMLSchema",ATTRS:{schema:{}}});B.extend(A,B.Plugin.Base,{initializer:function(C){this.doBefore("_defDataFn",this._beforeDefDataFn);},_beforeDefDataFn:function(E){var D=((this.get("host") instanceof B.DataSource.XHR)&&E.data.responseXML&&(E.data.responseXML.nodeType===9))?E.data.responseXML:E.data,C=B.DataSchema.XML.apply(this.get("schema"),D);if(!C){C={meta:{},results:D};}this.get("host").fire("response",B.mix({response:C},E));return new B.Do.Halt("DataSourceXMLSchema plugin halted _defDataFn");}});B.namespace("plugin").DataSourceXMLSchema=A;},"@VERSION@",{requires:["plugin","datasource-base","dataschema-xml"]});YUI.add("datasource-arrayschema",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NS:"schema",NAME:"DataSourceArraySchema",ATTRS:{schema:{}}});B.extend(A,B.Plugin.Base,{initializer:function(C){this.doBefore("_defDataFn",this._beforeDefDataFn);
},_beforeDefDataFn:function(E){var D=((this.get("host") instanceof B.DataSource.XHR)&&B.Lang.isString(E.data.responseText))?E.data.responseText:E.data,C=B.DataSchema.Array.apply(this.get("schema"),D);if(!C){C={meta:{},results:D};}this.get("host").fire("response",B.mix({response:C},E));return new B.Do.Halt("DataSourceArraySchema plugin halted _defDataFn");}});B.namespace("plugin").DataSourceArraySchema=A;},"@VERSION@",{requires:["plugin","datasource-base","dataschema-array"]});YUI.add("datasource-textschema",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NS:"schema",NAME:"DataSourceTextSchema",ATTRS:{schema:{}}});B.extend(A,B.Plugin.Base,{initializer:function(C){this.doBefore("_defDataFn",this._beforeDefDataFn);},_beforeDefDataFn:function(E){var D=((this.get("host") instanceof B.DataSource.XHR)&&B.Lang.isString(E.data.responseText))?E.data.responseText:E.data,C=B.DataSchema.Text.apply(this.get("schema"),D);if(!C){C={meta:{},results:D};}this.get("host").fire("response",B.mix({response:C},E));return new B.Do.Halt("DataSourceTextSchema plugin halted _defDataFn");}});B.namespace("plugin").DataSourceTextSchema=A;},"@VERSION@",{requires:["plugin","datasource-base","dataschema-text"]});YUI.add("datasource-polling",function(C){var A=C.Lang,B=function(){this._intervals={};};B.prototype={_intervals:null,setInterval:function(F,E,G){var D=C.later(F,this,this.sendRequest,[E,G],true);this._intervals[D.id]=D;return D.id;},clearInterval:function(E,D){E=D||E;if(this._intervals[E]){this._intervals[E].cancel();delete this._intervals[E];}},clearAllIntervals:function(){C.each(this._intervals,this.clearInterval,this);}};C.augment(C.DataSource.Local,B);},"@VERSION@",{requires:["datasource-base"]});YUI.add("datasource",function(A){},"@VERSION@",{use:["datasource-local","datasource-xhr","datasource-scriptnode","datasource-function","datasource-cache","datasource-jsonschema","datasource-xmlschema","datasource-arrayschema","datasource-textschema","datasource-polling"]});