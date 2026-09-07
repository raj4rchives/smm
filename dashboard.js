const modal=document.getElementById("orderModal");
const closeModal=()=>modal.classList.remove("show");
function openOrder(mode){
  modal.classList.add("show");
  if(mode==="AI") document.getElementById("idea").focus();
}
document.getElementById("createOrder").onclick=()=>openOrder();
document.getElementById("modalClose").onclick=closeModal;
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.querySelectorAll("#types button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#types button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")});
document.getElementById("menuBtn").onclick=()=>document.getElementById("mobileMenu").classList.toggle("show");
document.getElementById("closeTop").onclick=()=>document.querySelector(".topbar").remove();

let orders=JSON.parse(localStorage.getItem("webnest_orders")||"[]");
function renderOrders(){
  const list=document.getElementById("ordersList");
  document.getElementById("activeCount").textContent=orders.filter(o=>o.status!=="Completed").length;
  document.getElementById("pendingCount").textContent=orders.filter(o=>o.status==="Pending").length;
  if(!orders.length){list.innerHTML=`<div class="empty"><div class="empty-icon">＋</div><h3>No projects yet.</h3><p>Your first professional website is just a few clicks away.</p><button class="btn primary" onclick="openOrder()">Create your first order →</button></div>`;return}
  list.innerHTML=orders.slice().reverse().map(o=>`<div class="order-item">
    <div class="order-symbol">✦</div><div><h3>${o.name}</h3><p>${o.id} · ${o.type} · ${o.date}</p></div>
    <span class="status">${o.status}</span><span class="view">View order →</span>
  </div>`).join("");
}
document.getElementById("submitOrder").onclick=()=>{
  const type=document.querySelector("#types button.selected")?.textContent||"Business";
  const idea=document.getElementById("idea").value.trim();
  const order={id:"WN-"+Math.floor(100000+Math.random()*900000),name:idea?idea.slice(0,34)+(idea.length>34?"…":""):"New website project",type,status:"Pending",date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})};
  orders.push(order);localStorage.setItem("webnest_orders",JSON.stringify(orders));renderOrders();closeModal();document.getElementById("idea").value="";
  alert("Order created successfully: "+order.id);
};
renderOrders();
