(() => {
 const cfg=window.CONTACT_CONFIG||{}, loginBox=document.getElementById('loginBox'), dashboard=document.getElementById('dashboard');
 if(!cfg.SUPABASE_URL||cfg.SUPABASE_URL.includes('YOUR-PROJECT')||!cfg.SUPABASE_ANON_KEY||cfg.SUPABASE_ANON_KEY.includes('YOUR_')){document.getElementById('loginStatus').textContent='Configure config.js first.';return;}
 const sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
 const status=document.getElementById('dashStatus');
 const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function refresh(){
   status.textContent='Loading messages…';
   const {data,error}=await sb.from('contact_messages').select('id,name,email,message,created_at,is_read').order('created_at',{ascending:false}).limit(300);
   if(error){status.textContent='Could not load messages: '+error.message;return;}
   status.textContent=`${data.length} latest messages`;
   document.getElementById('rows').innerHTML=data.map(m=>`<tr><td>${m.is_read?'Read':'New'}</td><td>${escapeHTML(m.name)}</td><td><a href="mailto:${escapeHTML(m.email)}">${escapeHTML(m.email)}</a></td><td class="msg">${escapeHTML(m.message)}</td><td>${escapeHTML(new Date(m.created_at).toLocaleString())}</td><td><div class="actions">${m.is_read?'':`<button data-read="${m.id}">Mark read</button>`}<button class="delete" data-delete="${m.id}">Delete</button></div></td></tr>`).join('');
 }
 async function showSession(){
  const {data}=await sb.auth.getSession();const signed=!!data.session;
  loginBox.hidden=signed;dashboard.hidden=!signed;if(signed)await refresh();
 }
 document.getElementById('loginForm').addEventListener('submit',async e=>{e.preventDefault();const out=document.getElementById('loginStatus');out.textContent='Signing in…';const {error}=await sb.auth.signInWithPassword({email:document.getElementById('loginEmail').value,password:document.getElementById('loginPassword').value});out.textContent=error?error.message:'';if(!error)await showSession();});
 document.getElementById('logoutBtn').addEventListener('click',async()=>{await sb.auth.signOut();await showSession();});
 document.getElementById('rows').addEventListener('click',async e=>{
  const r=e.target.dataset.read,d=e.target.dataset.delete;if(!r&&!d)return;
  if(d&&!confirm('Permanently delete this message?'))return;
  const result=r?await sb.from('contact_messages').update({is_read:true}).eq('id',r):await sb.from('contact_messages').delete().eq('id',d);
  if(result.error)status.textContent=result.error.message;else await refresh();
 });
 showSession();
})();
