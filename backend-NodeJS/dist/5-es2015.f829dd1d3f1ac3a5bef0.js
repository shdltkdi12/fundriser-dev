(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{gkWZ:function(e,r,t){"use strict";t.r(r),t.d(r,"DataVModule",(function(){return U}));var s=t("M0ag"),a=t("tyNb"),o=t("fXoL"),n=t("Ac7g"),c=t("SdXu");const i=[{path:"relation",component:(()=>{class e{constructor(e){this.http=e,this.options={title:{text:"User Releaction"},tooltip:{},animationDurationUpdate:1500,animationEasingUpdate:"quinticInOut",series:[{type:"graph",layout:"force",symbolSize:60,focusNodeAdjacency:!0,roam:!0,categories:[{name:"User"}],label:{normal:{show:!0,textStyle:{fontSize:12}}},force:{repulsion:2e3,gravity:.3},edgeSymbol:["circle","arrow"],edgeSymbolSize:[4,10],draggable:!0,tooltip:{triggerOn:"click",formatter:e=>"node"===e.dataType?`${e.data.name}\uff1a${e.data.arg}`:e.name},data:Array(20).fill({}).map((e,r)=>({name:"User"+r,arg:r+10,category:0})),links:[{source:"User0",target:"User1"},{source:"User0",target:"User2"},{source:"User0",target:"User3"},{source:"User1",target:"User4"},{source:"User2",target:"User5"},{source:"User3",target:"User6"},{source:"User4",target:"User7"},{source:"User5",target:"User8"},{source:"User6",target:"User9"},{source:"User1",target:"User10"},{source:"User1",target:"User11"},{source:"User11",target:"User12"},{source:"User11",target:"User13"},{source:"User11",target:"User14"},{source:"User11",target:"User15"},{source:"User11",target:"User16"},{source:"User11",target:"User17"},{source:"User11",target:"User18"},{source:"User11",target:"User19"}],lineStyle:{normal:{opacity:.7,width:1,curveness:.1}}}]}}chartInit(e){this.ecIntance=e}ngOnInit(){window.addEventListener("resize",()=>this.resize)}resize(){this.ecIntance&&this.ecIntance.resize()}ngOnDestroy(){window.removeEventListener("resize",()=>this.resize)}}return e.\u0275fac=function(r){return new(r||e)(o.Tb(n.r))},e.\u0275cmp=o.Nb({type:e,selectors:[["app-data-v-relation"]],decls:3,vars:1,consts:[[3,"title"],["href","http://localhost:8000?campaignid=04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb",1,"nz-button"]],template:function(e,r){1&e&&(o.Ub(0,"page-header",0),o.Zb(1,"a",1),o.Pc(2," Try it out!\n"),o.Yb()),2&e&&o.sc("title","Checkout Process")},directives:[c.a],encapsulation:2}),e})()}];let u=(()=>{class e{}return e.\u0275mod=o.Rb({type:e}),e.\u0275inj=o.Qb({factory:function(r){return new(r||e)},imports:[[a.o.forChild(i)],a.o]}),e})(),U=(()=>{class e{}return e.\u0275mod=o.Rb({type:e}),e.\u0275inj=o.Qb({factory:function(r){return new(r||e)},imports:[[s.b,u]]}),e})()}}]);