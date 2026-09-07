const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
let state=JSON.parse(localStorage.getItem('cloudnest_demo')||'{"balance":0,"orders":[],"invoices":[]}');
function save(){localStorage.setItem('cloudnest_demo',JSON.stringify(state));render()}
function money(n){return '₹'+Number(n).toLocaleString('en-IN')}
function render(){
  $('#balance').textContent=money(state.balance); $('#drawerBalance').textContent=money(state.balance); $('#orderCount').textContent=`${state.orders.length} order${state.orders.length===1?'':'s'}`;
  $('#ordersList').innerHTML=state.orders.length?state.orders.map(o=>`<div class="order-row"><div><strong>${o.plan}</strong><br><span class="muted">#${o.id}</span></div><div>${o.domain}</div><div>${money(o.price)}</div><div><span class="badge">Active</span></div><button class="outline" onclick="toast('Panel details opened')">View</button></div>`).join(''):`<div class="empty"><span>☁</span><b>No panels yet</b><small>Your new orders will appear here.</small></div>`;
  $('#invoiceList').innerHTML=state.invoices.length?state.invoices.map(i=>`<div class="order-row"><div><strong>${i.id}</strong></div><div>${i.plan}</div><div>${money(i.amount)}</div><div><span class="badge">Paid</span></div><button class="outline" onclick="toast('Invoice downloaded in demo mode')">PDF</button></div>`).join(''):`<div class="empty"><span>▥</span><b>No invoices</b><small>Invoices generated from your orders will show here.</small></div>`;
}
function showView(view){$$('.view').forEach(v=>v.classList.remove('active-view')); $('#'+view)?.classList.add('active-view'); $$('.nav-item,.quick-card').forEach(x=>x.classList.toggle('active',x.dataset.view===view)); closeDrawer(); window.scrollTo({top:0,behavior:'smooth'});}
$$('[data-view]').forEach(x=>x.addEventListener('click',()=>showView(x.dataset.view)));
$('#menuBtn').onclick=()=>{$('#drawer').classList.add('open');$('#backdrop').classList.add('open')};
function closeDrawer(){$('#drawer').classList.remove('open');$('#backdrop').classList.remove('open')} window.closeDrawer=closeDrawer;
$('#closeDrawer').onclick=closeDrawer; $('#backdrop').onclick=closeDrawer; $('#accountBtn').onclick=()=>showView('account');
let selectedPlan='';let selectedPrice=0;
$$('.order-btn').forEach(btn=>btn.onclick=()=>{selectedPlan=btn.dataset.plan;selectedPrice=+btn.dataset.price;$('#modalTitle').textContent=selectedPlan;$('#modalTotal').textContent=money(selectedPrice);$('#orderDomain').value='';$('#orderModal').classList.add('show')});
$('#closeModal').onclick=()=>$('#orderModal').classList.remove('show');
$('#billing').onchange=()=>$('#modalTotal').textContent=money(selectedPrice*+$('#billing').value);
$('#confirmOrder').onclick=()=>{const domain=$('#orderDomain').value.trim();if(!domain||!domain.includes('.'))return toast('Enter a valid domain');const months=+$('#billing').value;const total=selectedPrice*months;if(state.balance<total)return toast('Not enough wallet balance — add funds first');state.balance-=total;const id='CN'+Date.now().toString().slice(-7);state.orders.unshift({id,plan:selectedPlan,domain,price:total});state.invoices.unshift({id:'INV-'+id,plan:selectedPlan,amount:total});$('#orderModal').classList.remove('show');save();showView('panels');toast('Order created successfully')};
$$('.fund-options button').forEach(b=>b.onclick=()=>$('#fundAmount').value=b.dataset.amount);
$('#addFundBtn').onclick=()=>{const n=+$('#fundAmount').value;if(!n||n<1)return toast('Enter an amount');state.balance+=n;$('#fundAmount').value='';save();toast(`${money(n)} added to demo wallet`)};
$('#domainBtn').onclick=()=>{const d=prompt('Enter domain name');if(d&&d.includes('.')){toast('Domain connected in demo mode');$('#domainList').innerHTML=`<div class="domain"><div><b>${d}</b><small class="muted">Connected domain</small></div><span class="badge">Active</span></div>`}};
$('#refreshBtn').onclick=()=>{render();toast('Orders refreshed')};
window.toast=(msg)=>{const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove('show'),2200)};
render();
