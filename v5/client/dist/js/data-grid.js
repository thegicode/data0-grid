"use strict";(()=>{var F=Object.defineProperty,P=Object.defineProperties;var N=Object.getOwnPropertyDescriptors;var H=Object.getOwnPropertySymbols;var R=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var O=(s,t,e)=>t in s?F(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e,_=(s,t)=>{for(var e in t||(t={}))R.call(t,e)&&O(s,e,t[e]);if(H)for(var e of H(t))B.call(t,e)&&O(s,e,t[e]);return s},A=(s,t)=>P(s,N(t));var W=(s,t)=>{var e={};for(var n in s)R.call(s,n)&&t.indexOf(n)<0&&(e[n]=s[n]);if(s!=null&&H)for(var n of H(s))t.indexOf(n)<0&&B.call(s,n)&&(e[n]=s[n]);return e};var k=(s,t,e)=>new Promise((n,l)=>{var i=r=>{try{a(e.next(r))}catch(h){l(h)}},o=r=>{try{a(e.throw(r))}catch(h){l(h)}},a=r=>r.done?n(r.value):Promise.resolve(r.value).then(i,o);a((e=e.apply(s,t)).next())});var d=class extends HTMLElement{constructor(e){super();this.cellController=e.cellController,this.dataModel=e.dataModel,this.selection=e.selection,this._type=e.type,this._key=e.key,this._value=e.value.toString(),this._readOnly=!0,this._el=null}get readOnly(){return this._readOnly}set readOnly(e){this._readOnly=e,this._el instanceof HTMLInputElement&&(this._el.readOnly=e)}get key(){return this._key}get type(){return this._type}get value(){return this._value}set value(e){let n=this.checkValueType(e);n!=null&&(this._value=n.toString(),(this._el instanceof HTMLInputElement||this._el instanceof HTMLSelectElement)&&(this._el.value=n.toString()))}get currentValue(){var e;if(this._el instanceof HTMLInputElement||this._el instanceof HTMLSelectElement)return((e=this._el)==null?void 0:e.value)||""}focus(){var e;(e=this._el)==null||e.focus()}blur(){var e;(e=this._el)==null||e.blur()}connectedCallback(){this.render(),this.addEventListener("change",this.onChange.bind(this)),this.addEventListener("keydown",this.onKeyDown.bind(this))}render(){this._el=this.createElement(),this._el&&this.appendChild(this._el)}checkValueType(e){return e||null}onChange(e){var n;!this._el||!this.currentValue||this._value!==this.currentValue&&(this._value=(n=this.currentValue)==null?void 0:n.toString(),this.updateData())}onKeyDown(e){if(!this.selection.selectedCells.size)return;let l=this.readOnly===!1,i=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];if(l){switch(e.key){case"Enter":e.preventDefault(),this.readOnly=!0;let o=this.moveUpDown(e.shiftKey);if(!o)return;o.instance.readOnly=this._type!=="checkbox";break;case"Tab":e.preventDefault(),this.blur(),this.readOnly=!0,this.moveSide(e.shiftKey);break;case"Escape":e.preventDefault(),this.value=this._value,this.readOnly=!0;break}this._type==="checkbox"&&i.includes(e.key)&&this.handleArrowKey(e)}else{switch(e.key){case"Enter":e.preventDefault(),this._type==="string"?this.moveUpDown(e.shiftKey):(this.readOnly=!1,this.focus());break;case"Tab":e.preventDefault(),this.moveSide(e.shiftKey);break}i.includes(e.key)&&this.handleArrowKey(e)}}moveUpDown(e){return e?this.selection.moveTo(this.cellController.row-1,this.cellController.col):this.selection.moveTo(this.cellController.row+1,this.cellController.col)}moveSide(e){e?this.selection.moveTo(this.cellController.row,this.cellController.col-1):this.selection.moveTo(this.cellController.row,this.cellController.col+1)}handleArrowKey(e){switch(e.preventDefault(),e.key){case"ArrowUp":this.selection.moveTo(this.cellController.row-1,this.cellController.col);break;case"ArrowDown":this.selection.moveTo(this.cellController.row+1,this.cellController.col);break;case"ArrowLeft":this.selection.moveTo(this.cellController.row,this.cellController.col-1);break;case"ArrowRight":this.selection.moveTo(this.cellController.row,this.cellController.col+1);break}}updateData(){let e=this.getCellId();e&&this.dataModel.updateFieldValue(e,this._key,this.value)}getCellId(){var n,l;let e=(l=(n=this.parentElement)==null?void 0:n.parentElement)==null?void 0:l.querySelector("td[data-id]");return e?e.getAttribute("data-id"):null}};var g=class extends d{constructor(e){super(e);this._el=null}get readOnly(){return this._readOnly}set readOnly(e){this._readOnly=Boolean(e),this._el&&(this._el.ariaReadOnly=String(Boolean(e)))}get currentValue(){return this._el?this._el.checked.toString():""}createElement(){let e=document.createElement("input");return e.type="checkbox",e.checked=Boolean(this._value==="true"),e.ariaReadOnly=this._readOnly.toString(),e}};var b=class extends d{constructor(e){super(e);this._dataListID=`datalist-${this._key}`}checkValueType(e){let n=document.getElementById(this._dataListID);return n&&[...n.options].some(i=>i.value===e)?e:null}createElement(){let e=document.createElement("input");return e.type="text",e.setAttribute("list",this._dataListID),e.value=this._value,e.readOnly=!0,e}};var y=class extends d{constructor(e){super(e);this._el=null}get readOnly(){return this._readOnly}set readOnly(e){this._readOnly=e,this._el&&(this._el.ariaReadOnly=e.toString())}checkValueType(e){return this._el&&[...this._el.options].some(l=>l.textContent===e)?e:null}createElement(){let e=document.createElement("select"),n=new DocumentFragment;return this.dataModel.records.map(l=>this.createOptionElement(l)).forEach(l=>n.appendChild(l)),e.appendChild(n),e.ariaReadOnly="true",e.value=this._value,e}createOptionElement(e){let n=e[this._key],l=document.createElement("option");return l.value=n.toString(),l.textContent=n.toString(),l}onChange(e){super.onChange(e),this.readOnly=!0;let n=this.selection.moveTo(this.cellController.row+1,this.cellController.col);n&&(n.instance.readOnly=!1)}};var C=class extends d{constructor(t){super(t)}get value(){return this._value}set value(t){}createElement(){let t=document.createElement("span");return t.textContent=this._value,t.className="text",t.tabIndex=0,t}};var E=class extends d{constructor(t){super(t)}checkValueType(t){if(this._type==="number"){let e=Number(t);return isNaN(e)?null:e}else return this._type==="text"&&t&&typeof t=="string"?t:null}createElement(){let t=document.createElement("input");return t.type=this._type,t.value=this._value,t.readOnly=this._readOnly,t}};var G=[{id:"a-1",name:"name1",description:"description1",quantity:1,food:"food1",vegetable:"vegetable1",option:!0,ref:"ref1"},{id:"a-2",name:"name2",description:"description2",quantity:2,food:"food2",vegetable:"vegetable2",option:!0,ref:"ref2"},{id:"a-3",name:"name3",description:"description3",quantity:3,food:"food3",vegetable:"vegetable3",option:!1,ref:"ref3"},{id:"a-4",name:"name4",description:"description4",quantity:4,food:"food4",vegetable:"vegetable4",option:!1,ref:"ref4"},{id:"a-5",name:"name5",description:"description5",quantity:5,food:"food5",vegetable:"vegetable5",option:!0,ref:"ref5"}];var I=class{constructor(t){this.dataGrid=t,this._selectedCells=new Set,this._currentSelectionRange=[],this._isRangeSelecting=!1,this._rangeSelectingStart=null,this._copiedCells=[]}get selectedCells(){return this._selectedCells}set selectedCells(t){this._selectedCells=t}get currentSelectionRange(){return this._currentSelectionRange}get isRangeSelecting(){return this._isRangeSelecting}set isRangeSelecting(t){this._isRangeSelecting=t}get rangeSelectingStart(){return this._rangeSelectingStart}set rangeSelectingStart(t){this._rangeSelectingStart=t}set copiedCell(t){this._copiedCells=t}get copiedCell(){return this._copiedCells}selectCell(t,e=!1){e||this.clearSelection(),this._selectedCells.add(t),t.classList.add("selected"),t.instance.focus(),t.instance.type==="checkbox"&&(t.instance.readOnly=!1)}moveTo(t,e){var l;let n=(l=this.dataGrid.tbody)==null?void 0:l.querySelector(`td[data-row="${t}"][data-col="${e}"]`);if(n)return this.selectCell(n),n.scrollIntoView({behavior:"smooth",block:"center",inline:"end"}),n.instance.type==="checkbox"&&(n.instance.readOnly=!1),n}selectRange(t,e){var u;let n=t.instance.row,l=t.instance.col,i=e.instance.row,o=e.instance.col,a=Math.min(n,i),r=Math.max(n,i),h=Math.min(l,o),m=Math.max(l,o);this.clearSelection();let c=[];for(let f=a;f<=r;f++){let p=[];for(let T=h;T<=m;T++){let v=(u=this.dataGrid.tbody)==null?void 0:u.querySelector(`td[data-row="${f}"][data-col="${T}"]`);v&&(this.selectCell(v,!0),p.push(v))}c.push(p)}this._currentSelectionRange=c,this._selectedCells.size>1&&(this.dataGrid.csvButtonVisible=!0)}clearSelection(){this._selectedCells.forEach(e=>{e.classList.remove("selected")}),this._selectedCells.clear();let t=this.dataGrid.querySelector(".selected-th");t&&t.classList.remove("selected-th")}};var M=class{constructor(t=[]){this._records=[];this._records=Array.isArray(t)?[...t]:[]}get records(){return this._records.map(t=>_({},t))}set records(t){Array.isArray(t)?this._records=t.map(e=>_({},e)):console.error("Data must be an array.")}updateFieldValue(t,e,n){let l=this._records.findIndex(i=>i.id===t);l!==-1?(this._records[l]=A(_({},this._records[l]),{[e]:n}),console.log(this.records[l])):console.error(`Record with id: ${t} not found.`)}updateRecordFields(t){let i=t,{id:e}=i,n=W(i,["id"]),l=this._records.findIndex(o=>o.id===e);l!==-1?(this._records[l]=_(_({},this._records[l]),n),console.log(this.records[l])):console.error(`Record with id: ${e} not found.`)}};var q=[{key:"id",type:"string"},{key:"name",type:"text"},{key:"description",type:"string"},{key:"quantity",type:"number"},{key:"food",type:"datalist"},{key:"vegetable",type:"select"},{key:"option",type:"checkbox"},{key:"ref",type:"text"}];var S=class{constructor(t,e){this.dataGrid=t.dataGrid,this.dataModel=this.dataGrid.dataModel,this.selection=t.selection,this.tableController=t,this._cell=null,this._row=e.row,this._col=e.col,this._type=e.type,this._key=e.key,this._contentElement=null,this.createCell(e.value)}get row(){return this._row}set row(t){this._cell&&(this._cell.dataset.row=t.toString()),this._row=t}get col(){return this._col}set col(t){this._cell&&(this._cell.dataset.col=t.toString()),this._col=t}get cellElement(){return this._cell}get contentElement(){return this._contentElement}get readOnly(){return this._contentElement?this._contentElement.readOnly:!0}set readOnly(t){this._contentElement&&(this._contentElement.readOnly=t)}get key(){return this._key}get value(){return this._contentElement?this._contentElement.value:""}set value(t){this._contentElement&&(this._contentElement.value=t)}get type(){return this._type}focus(){this._contentElement&&this._contentElement.focus()}createCell(t){let e=document.createElement("td");e.dataset.row=this._row.toString(),e.dataset.col=this._col.toString(),this._key==="id"&&(e.dataset.id=t.toString());let n=this.createChildElement(t.toString());e.appendChild(n),this._contentElement=n,this._cell=e,this.bindEvents(),e.instance=this}createChildElement(t){let e={cellController:this,dataModel:this.dataModel,selection:this.selection,type:this._type,key:this._key,value:t};switch(this._type){case"text":case"number":return new E(e);case"checkbox":return new g(e);case"select":return new y(e);case"datalist":return new b(e);default:return new C(e)}}bindEvents(){this._cell&&(this._cell.addEventListener("click",this.onClick.bind(this)),this._cell.addEventListener("dblclick",this.onDBClick.bind(this)),this._cell.addEventListener("mousedown",this.onMouseDown.bind(this)),this._cell.addEventListener("mousemove",this.onMouseMove.bind(this)),this._cell.addEventListener("mouseup",this.onMouseUp.bind(this)))}onClick(t){this.dataGrid.csvButtonVisible=!1;let e=this.selection.selectedCells;e.forEach(n=>{n.instance.readOnly=!0}),this._cell&&(t.shiftKey&&e.size>0?this.selection.selectRange(Array.from(e)[0],this._cell):this.selection.selectCell(this._cell,t.shiftKey))}onDBClick(){this.readOnly=!1,this._contentElement&&this._contentElement.focus()}onMouseDown(t){t.shiftKey||!this._cell||(this.selection.isRangeSelecting=!0,this.selection.rangeSelectingStart=this._cell,this.selection.clearSelection(),this.selection.selectCell(this._cell))}onMouseMove(t){this.selection.isRangeSelecting&&this.selection.rangeSelectingStart&&this._cell&&this.selection.selectRange(this.selection.rangeSelectingStart,this._cell)}onMouseUp(){this.selection.isRangeSelecting=!1}};var L=class{constructor(t,e,n){this.tbody=null;return this.dataModel=e.dataModel,e.tbody&&(this.tbody=e.tbody),this.selection=e.selection,this.tableController=n,this.sortItem=n.sortItem,this._headerOrders=t,this._isDragging=!1,this._draggingColumn=null,this._activeSortButton=null,this.theadTr=this.createHeader(),this}get headerOrders(){return this._headerOrders}setHeaderOrders(){let t=this.theadTr.querySelectorAll("th"),e=Array.from(t).map(n=>n.textContent||"");this._headerOrders=e.slice(1)}createHeader(){let t=document.createDocumentFragment(),e=document.createElement("th");t.appendChild(e),this._headerOrders.forEach(l=>{let i=document.createElement("th");if(i.textContent=l.toString(),this.sortItem.includes(l)){let o=this.createSortButton(l);i.appendChild(o)}this.addThEvents(i),t.appendChild(i)});let n=document.createElement("tr");return n.appendChild(t),n}addThEvents(t){["mousedown","mousemove","mouseup"].forEach(e=>{t.addEventListener(e,n=>this.handleThEvents(t,e,n))})}handleThEvents(t,e,n){let l=Array.from(t.parentNode.children).indexOf(t)-1;e==="mousedown"?this.handleThMouseDown(t,l):e==="mousemove"&&this._isDragging?this.handleThMouseMove(l):e==="mouseup"&&this._isDragging&&this.handleThMouseUp(t)}handleThMouseDown(t,e){this.selection.clearSelection(),e>=0&&(this._isDragging=!0,this._draggingColumn=e,this.selectColumn(e),t.classList.add("dragging"))}handleThMouseMove(t){t>=0&&t!==this._draggingColumn&&(this.moveColumn(t),this._draggingColumn=t)}handleThMouseUp(t){this._isDragging=!1,this._draggingColumn=null,t.classList.remove("dragging")}selectColumn(t){let e=this.tbody&&this.tbody.querySelectorAll(`td[data-col="${t}"]`);e&&e.forEach(l=>this.selection.selectCell(l,!0));let n=this.theadTr.querySelector(`th:nth-child(${t+2})`);n&&n.classList.add("selected-th")}moveColumn(t){var a;let e=this._draggingColumn,n=(a=this.tbody)==null?void 0:a.querySelectorAll("tr");n&&n.forEach(r=>{let h=Array.from(r.children),m=h[e+1],c=h[t+1];r.insertBefore(m,t<e?c:c.nextSibling),m.instance&&(m.instance.col=t),c.instance&&(c.instance.col=e);let u=m.instance.contentElement;u&&u.children.length>1&&u.removeChild(u.children[0])});let l=this.theadTr.querySelectorAll("th"),i=l[e+1],o=l[t+1];this.theadTr.insertBefore(i,t<e?o:o.nextSibling),this.setHeaderOrders()}createSortButton(t){let e=document.createElement("button");return e.type="button",e.dataset.sort="",e.className="sort-button",e.addEventListener("click",this.onClickSortButton.bind(this,t,e)),e}onClickSortButton(t,e){this._activeSortButton&&this._activeSortButton!==e&&(this._activeSortButton.dataset.sort="");let n=this.getNextSortOrder(e.dataset.sort||""),l=this.sortData(t,n),i=this.sortDataByColumnOrder(l);e.dataset.sort=n,this.tableController.renderTbody(i),this._activeSortButton=e}getNextSortOrder(t){return t===""?"ascending":t==="ascending"?"descending":""}sortData(t,e){return e?[...this.dataModel.records].sort((n,l)=>n[t]<l[t]?e==="ascending"?-1:1:n[t]>l[t]?e==="ascending"?1:-1:0):[...this.dataModel.records]}sortDataByColumnOrder(t){return t.map(e=>{let n={};return this._headerOrders.forEach(l=>{if(l in e){let i=e[l];n[l]=i}}),n})}};var D=class{constructor(t,e){this.dataGrid=t,this.dataModel=t.dataModel,this.selection=t.selection,this.sortItem=e,this.theadController=null,this._fieldDefinitions=q,this._selectedTr=null,this.render()}render(){this.checkAndCreateDatalists(),this.renderTable(this.dataModel.records)}renderTable(t){var e;this.theadController=new L(this._fieldDefinitions.map(n=>n.key),this.dataGrid,this),(e=this.dataGrid.thead)==null||e.appendChild(this.theadController.theadTr),this.renderTbody(t)}renderTbody(t){let e=this.createTbody(t);!this.dataGrid.tbody||(this.dataGrid.tbody.innerHTML="",this.dataGrid.tbody.appendChild(e))}createTbody(t){let e=new DocumentFragment;return t.forEach((n,l)=>{let i=this.createRow(n,l);e.appendChild(i)}),e}createRow(t,e){var i;let n=document.createElement("tr"),l=this.createRowHeader(e);return n.appendChild(l),(i=this.theadController)==null||i.headerOrders.forEach((o,a)=>{let r=this._fieldDefinitions.find(f=>f.key===o),h=r?r.type:"string",c={row:e,col:a,key:o,type:h,value:t[o]},u=new S(this,c);u.cellElement&&n.appendChild(u.cellElement)}),n}createRowHeader(t){let e=document.createElement("th");return e.tabIndex=0,e.textContent=(t+1).toString(),e.addEventListener("click",this.onClickRowHeader.bind(this)),e}onClickRowHeader(t){let e=t.target.closest("tr");this._selectedTr&&this._selectedTr.classList.remove("selected-tr"),this._selectedTr!==e?(this._selectedTr=e,this._selectedTr.classList.add("selected-tr")):this._selectedTr=null}checkAndCreateDatalists(){return this._fieldDefinitions.filter(({type:t})=>t==="datalist").reduce((t,{key:e})=>(t[e]=this.createDataList(e),t),{})}createDataList(t){let e=this.dataModel.records.map(l=>l[t]),n=document.createElement("datalist");return n.id=`datalist-${t}`,e.forEach(l=>{let i=document.createElement("option");i.value=l.toString(),n.appendChild(i)}),this.dataGrid.appendChild(n),n}};function U(s,t){let e=$(s.selectedCells),{rows:n,selectedCols:l}=j(e),i=z(n),o=J(i,l,this);X(o,"data.csv"),t.hidden=!0}function $(s){return[...s].sort((t,e)=>{let n=t.instance.row,l=t.instance.col,i=e.instance.row,o=e.instance.col;return n===i?l-o:n-i})}function j(s){let t=[],e=new Set;return s.forEach(n=>{let l=n.instance.row,i=n.instance.col,o=n.instance.value;n.instance.type==="checkbox"&&(typeof o=="boolean"?o=o?"true":"false":o==="on"?o="true":o="false"),t[l]||(t[l]=[]),o!==""&&(t[l][i]=o,e.add(i))}),{rows:t,selectedCols:e}}function z(s){return s.filter(t=>t!==void 0&&t.some(e=>e!==void 0))}function J(s,t,e){let n=Q(t,e),l=s.map((i,o)=>[o+1,...Array.from(t).sort((a,r)=>a-r).map(a=>i[a]||"")].join(","));return[n.join(","),...l].join(`
`)}function Q(s,t){let e=Array.from(t.querySelectorAll("thead th")).map(n=>n.textContent||"");return["",...Array.from(s).sort((n,l)=>n-l).map(n=>e[n+1])]}function X(s,t){let e=new Blob([s],{type:"text/csv"}),n=document.createElement("a");n.download=t,n.href=window.URL.createObjectURL(e),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n)}var V={onCsvButtonClick:U};function Y(s){let{copiedCell:t,selectedCells:e}=s;t.length>0&&K(s);let n=e.size===1?[...e][0].instance.value:s.currentSelectionRange.map(l=>l.map(i=>i.instance.value).join("	")).join(`
`);navigator.clipboard.writeText(n).then(()=>console.log("Data copied to clipboard")).catch(l=>console.error("Failed to copy data to clipboard: ",l)),e.forEach(l=>l.classList.add("copiedCell")),s.copiedCell=[...e]}function K(s){s.copiedCell.forEach(t=>t.classList.remove("copiedCell")),s.copiedCell=[]}function Z(s,t,e){K(e),navigator.clipboard.readText().then(n=>{let[l]=e.selectedCells,i=Number(l.dataset.row),o=Number(l.dataset.col);ee(n).forEach((r,h)=>{let m=i+h,c={id:le(s,m)||"",name:"",description:"",quantity:0,food:"",vegetable:"",option:!1,ref:""};r.forEach((u,f)=>{let p=te(s,m,o+f);if(!p||!p.instance)return;p.instance.value=u;let T=p.instance.value;if(T){let v=p.instance.key;c[v]=T.toString()}ne(p,e.selectedCells)}),c.id&&t.updateRecordFields(c)})}).catch(n=>console.error("Failed to read clipboard contents: ",n))}function ee(s){return s.split(`
`).map(t=>t.split("	"))}function te(s,t,e){return s.querySelector(`tbody td[data-row="${t}"][data-col="${e}"]`)}function ne(s,t){t.add(s),s.classList.add("selected")}function le(s,t){let e=s.querySelectorAll("tbody tr")[t];return(e==null?void 0:e.querySelector("td[data-id]")).dataset.id}var x={copyCells:Y,pasteCells:Z};var w=class extends HTMLElement{constructor(){super();this.dataModel=new M,this.selection=new I(this),this.table=this.querySelector("table"),this.thead=this.querySelector("thead"),this.tbody=this.querySelector("tbody"),this.csvButton=this.querySelector(".csv-button"),this.dataButton=this.querySelector(".data-button"),this.isComposing=!1,this.tableCP=null}connectedCallback(){return k(this,null,function*(){var e;try{this.dataModel.records=yield this.loadData();let n=["id","name"];this.tableCP=new D(this,n);let l=(e=this.tbody)==null?void 0:e.querySelector("td");l&&this.selection.selectCell(l),this.bindEvents()}catch(n){console.error("Data loading failed",n)}})}set csvButtonVisible(e){this.csvButton&&(this.csvButton.hidden=!e)}loadData(){return k(this,null,function*(){return new Promise(e=>{setTimeout(()=>{e(G)},100)})})}bindEvents(){document.addEventListener("copy",this.onCopy.bind(this)),document.addEventListener("paste",this.onPaste.bind(this)),this.csvButton&&this.csvButton.addEventListener("click",V.onCsvButtonClick.bind(this,this.selection,this.csvButton)),this.dataButton&&this.dataButton.addEventListener("click",this.onClickShowButton.bind(this)),document.addEventListener("keydown",this.onKeydown.bind(this)),this.addEventListener("click",this.onClickDocument.bind(this))}onKeydown(e){if(e.key==="f"&&(e.ctrlKey||e.metaKey)){e.preventDefault();let n=prompt("Enter text to search:");n&&this.highlightSearchResults(n)}}onCopy(e){e.preventDefault(),x.copyCells(this.selection)}onPaste(e){e.preventDefault(),x.pasteCells(this.table,this.dataModel,this.selection)}onClickShowButton(e){let n=this.querySelector("#data-area pre");n&&(n.textContent=JSON.stringify(this.dataModel.records,null,2))}onClickDocument(e){let n=e.target.closest("td");if(!n)return;n.classList.contains("highlight")||this.clearHighlights()}highlightSearchResults(e){var l;this.clearHighlights();let n=(l=this.tbody)==null?void 0:l.querySelectorAll("td");n==null||n.forEach(i=>{var a;let o=i.instance;(a=o==null?void 0:o.value)!=null&&a.toString().includes(e)&&i.classList.add("highlight")})}clearHighlights(){var n;let e=(n=this.tbody)==null?void 0:n.querySelectorAll(".highlight");e==null||e.forEach(l=>{l.classList.remove("highlight")})}};customElements.define("data-grid",w);customElements.define("string-cell",C);customElements.define("text-number-cell",E);customElements.define("select-cell",y);customElements.define("checkbox-cell",g);customElements.define("datalist-cell",b);})();
//# sourceMappingURL=data-grid.js.map
