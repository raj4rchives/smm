/* GitHub Pages static controller: navigation + demo-only interactions */
(function(){
  'use strict';
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const toast=(msg)=>{
    let el=document.getElementById('ghp-toast');
    if(!el){el=document.createElement('div');el.id='ghp-toast';document.body.appendChild(el);}
    el.textContent=msg; el.classList.add('show'); clearTimeout(window.__ghpToast);
    window.__ghpToast=setTimeout(()=>el.classList.remove('show'),2600);
  };
  const go=(url)=>{ if(url && url!=='#') location.href=url; };

  // Convert remaining internal non-.html hrefs to static equivalents.
  const routeMap={
    './':'index.html','resetpassword':'resetpassword.html','logout.html':'logout.html',
    'orders_pending.html':'orders.html','orders_inprogress.html':'orders.html','orders_completed.html':'orders.html','orders_partial.html':'orders.html','orders_processing.html':'orders.html','orders_canceled.html':'orders.html',
    'dripfeeds':'dripfeeds.html','dripfeeds/active':'dripfeeds.html','dripfeeds/canceled':'dripfeeds.html','dripfeeds/completed':'dripfeeds.html',
    'subscriptions':'subscriptions.html','subscriptions/active':'subscriptions.html','subscriptions/paused':'subscriptions.html','subscriptions/completed':'subscriptions.html','subscriptions/expired':'subscriptions.html','subscriptions/canceled':'subscriptions.html',
    'tickets/':'tickets.html','tickets':'tickets.html','orders/refill/':'orders.html','orders/cancel/':'orders.html','updates//?search=':'updates.html','dripfeeds//?search=':'dripfeeds.html','orders//?search=':'orders.html','subscriptions//?search=':'subscriptions.html'
  };
  document.querySelectorAll('a[href]').forEach(a=>{
    const h=a.getAttribute('href');
    if(routeMap[h]) a.setAttribute('href',routeMap[h]);
    if(h && h.startsWith('/') && !h.startsWith('//')) a.setAttribute('href', routeMap[h.slice(1)] || 'index.html');
  });

  // Highlight current navigation item.
  document.querySelectorAll('a[href]').forEach(a=>{
    const h=(a.getAttribute('href')||'').split('?')[0].replace(/^\.\//,'');
    if(h===page) a.classList.add('active');
  });

  // Login/signup are local demo only. Never store passwords.
  document.querySelectorAll('form').forEach(form=>{
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const action=(this.getAttribute('action')||'').toLowerCase();
      const inputs=[...this.querySelectorAll('input,textarea,select')];
      const values={}; inputs.forEach(i=>{if(i.name) values[i.name]=i.value;});

      if(page==='login.html'){
        const identifier=values.username||values.email||'';
        if(!identifier){toast('Please enter your username or email.');return;}
        localStorage.setItem('smm_demo_logged_in','1');
        localStorage.setItem('smm_demo_user',identifier);
        toast('Login successful (demo mode).');
        setTimeout(()=>go('index.html'),500); return;
      }
      if(page==='signup.html'){
        const user=values.username||values.email||'demo-user';
        localStorage.setItem('smm_demo_logged_in','1'); localStorage.setItem('smm_demo_user',user);
        toast('Account created (demo mode).'); setTimeout(()=>go('index.html'),500); return;
      }
      if(page==='resetpassword.html' || page==='setnewpassword.html'){
        toast('Password reset request saved locally (demo mode).'); return;
      }
      if(page==='neworder.html' || page==='index.html'){
        localStorage.setItem('smm_demo_last_order',Date.now().toString());
        toast('Order submitted in demo mode.'); setTimeout(()=>go('success.html'),500); return;
      }
      if(page==='addfunds.html'){
        toast('Payment flow is demo-only on GitHub Pages.'); setTimeout(()=>go('payment.html'),500); return;
      }
      if(page==='massorder.html'){
        toast('Mass order submitted in demo mode.'); setTimeout(()=>go('success.html'),500); return;
      }
      if(page==='open_ticket.html' || page==='tickets.html'){
        toast('Ticket created in demo mode.'); setTimeout(()=>go('tickets.html'),500); return;
      }
      if(page==='account.html'){
        toast('Account settings saved locally.'); return;
      }
      if(page==='child-panels.html' || page==='kupon.html'){
        toast('Action completed in demo mode.'); return;
      }
      if(page==='payment.html'){
        toast('Payment gateway is not available on static GitHub Pages.'); return;
      }
      toast('This action is available in demo mode only.');
    });
  });

  // Logout links.
  document.querySelectorAll('a[href="logout.html"]').forEach(a=>a.addEventListener('click',()=>{
    localStorage.removeItem('smm_demo_logged_in'); localStorage.removeItem('smm_demo_user');
  }));

  // Prevent dead # links from jumping to top unless they are intended anchors.
  document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>{
    if(a.getAttribute('data-toggle') || a.getAttribute('role')==='button') return;
    e.preventDefault();
  }));

  // Basic search forms stay on their own static page.
  document.querySelectorAll('form').forEach(form=>{
    const action=form.getAttribute('action')||'';
    if(form.id==='history-search' || form.id==='history-search-mobile'){
      form.addEventListener('submit',e=>{e.preventDefault();toast('Search applied in demo mode.');});
    }
  });

  // Add a small static-mode badge only when useful.
  const badge=document.createElement('div'); badge.className='ghp-static-badge'; badge.textContent='GitHub Pages • Demo Mode'; document.body.appendChild(badge);
})();
