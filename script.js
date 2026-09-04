document.querySelectorAll('.filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.example-card').forEach(card=>{card.classList.toggle('hidden',f!=='all'&&card.dataset.category!==f);});});});

const quoteForm=document.getElementById('quoteForm');
quoteForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const msg=document.getElementById('formMessage');
  const button=form.querySelector('button[type="submit"]');
  const originalButton=button.innerHTML;

  msg.className='form-message';
  msg.textContent='Enviando tu solicitud...';
  button.disabled=true;
  button.innerHTML='Enviando...';

  try{
    const data=Object.fromEntries(new FormData(form).entries());
    const response=await fetch(form.action,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(data)
    });
    const result=await response.json().catch(()=>({}));
    if(!response.ok || result.success===false) throw new Error('No se pudo enviar');

    msg.className='form-message success';
    msg.textContent='¡Gracias! Recibimos tu solicitud. Te contactaremos muy pronto.';
    form.reset();
  }catch(error){
    msg.className='form-message error';
    msg.textContent='No pudimos enviar tu solicitud. Inténtalo nuevamente o escríbenos a apps@enla.mx.';
  }finally{
    button.disabled=false;
    button.innerHTML=originalButton;
  }
});
