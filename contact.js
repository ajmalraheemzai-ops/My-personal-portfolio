(() => {
  const form=document.getElementById('contactForm');
  const notice=document.getElementById('notice');
  const button=document.getElementById('sendBtn');
  const show=(text,type)=>{notice.textContent=text;notice.className='notice show '+type;};
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const cfg=window.CONTACT_CONFIG||{};
    if(!cfg.SUPABASE_URL||cfg.SUPABASE_URL.includes('YOUR-PROJECT')||!cfg.SUPABASE_ANON_KEY||cfg.SUPABASE_ANON_KEY.includes('YOUR_')){
      show('Please configure config.js with your Supabase project URL and public anon key.','error');return;
    }
    const name=document.getElementById('name').value.trim();
    const email=document.getElementById('email').value.trim();
    const message=document.getElementById('message').value.trim();
    if(!name||!email||!message){show('Please complete all fields.','error');return;}
    if(message.length>10000){show('Message is too long.','error');return;}
    button.disabled=true;button.textContent='Sending…';
    try{
      const client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
      const {error}=await client.from('contact_messages').insert([{name,email,message}]);
      if(error)throw error;
      form.reset();show('Thank you! Your message has been received.','success');
    }catch(err){console.error(err);show('Could not send your message. Please check setup or try again later.','error');}
    finally{button.disabled=false;button.textContent='Send Message';}
  });
})();
