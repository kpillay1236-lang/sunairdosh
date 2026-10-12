// Edit this list to add, remove or reorder events. Prices are placeholders (rand).
// status: "on" = On Sale, "sold" = Sold Out. pos = which part of a tall poster shows on the card.
const events=[
 {title:"Full Bloom",date:"Wed 23rd Sep 2026",place:"The Greenhouse, Sandton",price:1550,img:"full-bloom.jpg",pos:"center",feat:true,status:"on"},
 {title:"KRAAKTAFEL",date:"Fri 9th Oct 2026",place:"R301, Wellington, 7655, South Africa, Wellington",price:650,img:"kraaktafel.jpg",pos:"center",feat:true,status:"on"},
 {title:"OPEN / SOURCE",date:"Fri 9th Oct 2026",place:"OPEN / SOURCE, Cape Town",price:5150,img:"open-source.jpg",pos:"top",feat:false,status:"on"},
 {title:"DESTINATION SATURN",date:"Sat 10th Oct 2026",place:"OPEN / SOURCE, Cape Town",price:1350,img:"destination-saturn.jpg",pos:"center",feat:false,status:"on"},
 {title:"RECESS @ TEXAS",date:"Fri 16th Oct 2026",place:"Texas, Cape Town",price:3120,img:"recess-texas.jpg",pos:"top",feat:false,status:"on"},
 {title:"SONAR",date:"Fri 16th Oct 2026",place:"OPEN / SOURCE, Cape Town",price:1180,img:"sonar.jpg",pos:"center",feat:false,status:"on"},
 {title:"Clicks Beauty Playground 2026",date:"Sun 18th Oct 2026",place:"Gallagher Convention Centre, Midrand",price:3250,img:"clicks-beauty-playground.jpg",pos:"center",feat:false,status:"sold",resale:[{seller:"Mbatha.",qty:2,price:650},{seller:"Mbatha",qty:1,price:650}]},
 {title:"Opaque: Halloween",date:"Sat 17th Oct 2026",place:"Biblio, Cape Town",price:4200,img:"opaque-halloween.jpg",pos:"center",feat:false,status:"on"},
 {title:"MINIMAL",date:"Sat 17th Oct 2026",place:"OPEN / SOURCE, Cape Town",price:1150,img:"minimal.jpg",pos:"top",feat:false,status:"on"},
 {title:"HALF HALF Club",date:"Fri 23rd Oct 2026",place:"Penthouse, Stellenbosch",price:2100,img:"half-half-club.jpg",pos:"center",feat:false,status:"on"},
 {title:"FAVELA CAPE TOWN",date:"Fri 23rd Oct 2026",place:"Club Paradise, Cape Town",price:1080,img:"favela-cape-town.jpg",pos:"center",feat:false,status:"on"},
 {title:"04PADEL",date:"Sat 24th Oct 2026",place:"Valley Padel, Gqeberha",price:4400,img:"04padel.jpg",pos:"center",feat:false,status:"on"}
];
const $=s=>document.querySelector(s);
let filter="all",cur=null,qty=1;
function render(){
  const q=$("#q").value.trim().toLowerCase();
  const list=events.map((e,i)=>({e,i})).filter(({e})=>(filter==="all"||(filter==="featured"&&e.feat)||(filter==="onsale"&&e.status==="on"))&&(e.title+" "+e.place).toLowerCase().includes(q));
  $("#grid").innerHTML=list.map(({e,i})=>`<article class="card" tabindex="0" data-i="${i}" aria-label="${e.title}, ${e.date}">
    <div class="art"><img src="${e.img}" alt="${e.title} poster" style="object-position:center ${e.pos}" loading="lazy">
    <div class="badges">${e.status==="sold"?'<span class="badge sold">Sold Out</span>':'<span class="badge on">On Sale</span>'}${e.feat?'<span class="badge feat">Featured</span>':''}</div></div>
    <div class="info"><h2>${e.title}</h2><div class="date">${e.date}</div><div class="place">${e.place}</div>${e.status==="sold"?'<button class="resale-btn" type="button">View resale tickets</button>':'<span class="go" aria-hidden="true">&rarr;</span>'}</div></article>`).join("");
  $("#empty").hidden=list.length>0;
}
function open_(i){
  if($("#dlg").open)return;
  cur=events[i];qty=1;
  $("#dTitle").textContent=cur.title;$("#dDate").textContent=cur.date;$("#dPlace").textContent=cur.place;$("#dPrice").textContent=cur.price;
  const sold=cur.status==="sold";
  $("#buy").hidden=sold;$("#resale").hidden=!sold;
  if(sold)showResale();
  upd();$("#dlg").showModal();
}
function showResale(){
  const l=cur.resale||[];
  $("#resaleList").innerHTML=l.map((r,k)=>`<li><div><b>${r.qty} ticket${r.qty>1?"s":""} · R${r.price} each</b><small>Seller: ${r.seller}</small></div><button class="btn sm" data-k="${k}">Buy · R${(r.qty*r.price).toLocaleString("en-ZA")}</button></li>`).join("");
  $("#resaleEmpty").hidden=l.length>0;
}
$("#resaleList").addEventListener("click",e=>{
  const b=e.target.closest("button[data-k]");if(!b)return;
  const r=cur.resale[+b.dataset.k];
  $("#dlg").close();openCode(r);
});
// Practice ticket codes, one per ticket. (Anyone can read these in the browser, so they are for practice only.)
const TICKETS=[
  {code:"aD7k9x2m4Q8p",data:()=>TICKET_DATA,file:"airdosh-ticket-1.png"},
  {code:"xjpeXGNhBPgB",data:()=>TICKET_DATA_2,file:"airdosh-ticket-2.png"}
];
let codeN=1;
function openCode(r){
  codeN=Math.min(r.qty,TICKETS.length);
  $("#codeFor").textContent=r.qty+" ticket"+(r.qty>1?"s":"")+" for "+cur.title;
  $("#codeFields").innerHTML=Array.from({length:codeN},(_,i)=>`<div class="cf"><label class="place" for="code${i}">${codeN>1?"Ticket "+(i+1)+" code":"Ticket code"}</label><input id="code${i}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ticket code"><p class="soldnote" id="err${i}" role="alert" hidden>That code isn't valid. Check it and try again.</p></div>`).join("");
  $("#codeFields").querySelectorAll("input").forEach(inp=>inp.addEventListener("keydown",e=>{if(e.key==="Enter")checkCode()}));
  $("#ticketsOut").innerHTML="";$("#codeGo").hidden=false;
  $("#codeDlg").showModal();$("#code0").focus();
}
function checkCode(){
  let ok=0;$("#ticketsOut").innerHTML="";
  for(let i=0;i<codeN;i++){
    const good=$("#code"+i).value.trim()===TICKETS[i].code;
    $("#err"+i).hidden=good;
    if(good){
      ok++;
      $("#ticketsOut").insertAdjacentHTML("beforeend",`<div class="tbox"><p class="okmsg">${codeN>1?"Ticket "+(i+1)+" is ready":"Code accepted. Your ticket is ready."}</p><img src="${TICKETS[i].data()}" alt="Ticket ${i+1} for ${cur.title}"><a class="btn dlbtn" href="#" data-i="${i}">Download ticket${codeN>1?" "+(i+1):""}</a></div>`);
    }
  }
  if(ok===codeN)$("#codeGo").hidden=true;
}
function dataToBlob(d){
  const [head,b64]=d.split(",");
  const bin=atob(b64),arr=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
  return new Blob([arr],{type:head.match(/:(.*?);/)[1]});
}
$("#ticketsOut").addEventListener("click",e=>{
  const l=e.target.closest(".dlbtn");if(!l)return;
  e.preventDefault();
  const t=TICKETS[+l.dataset.i];
  const u=URL.createObjectURL(dataToBlob(t.data()));
  const a=document.createElement("a");a.href=u;a.download=t.file;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),1000);
});
$("#codeGo").onclick=checkCode;
$("#codeClose").onclick=()=>$("#codeDlg").close();
function upd(){$("#n").textContent=qty;$("#tot").textContent=(qty*cur.price).toLocaleString("en-ZA")}
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
$("#grid").addEventListener("click",e=>{const c=e.target.closest(".card");if(c)open_(+c.dataset.i)});
$("#grid").addEventListener("keydown",e=>{if(e.key==="Enter"){const c=e.target.closest(".card");if(c)open_(+c.dataset.i)}});
document.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.f;document.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x===b));render()}));
$("#q").addEventListener("input",render);
$("#plus").onclick=()=>{if(qty<10){qty++;upd()}};
$("#minus").onclick=()=>{if(qty>1){qty--;upd()}};
$("#close").onclick=()=>$("#dlg").close();
$("#reserve").onclick=()=>{$("#dlg").close();toast(qty+" ticket"+(qty>1?"s":"")+" reserved for "+cur.title)};
$("#buyTop").onclick=()=>$("#grid").scrollIntoView({behavior:"smooth"});
render();
