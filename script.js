document.querySelectorAll('.filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.example-card').forEach(card=>{card.classList.toggle('hidden',f!=='all'&&card.dataset.category!==f);});});});

const quoteForm=document.getElementById('quoteForm');
const quoteSubmit=document.getElementById('quoteSubmit');
const formMessage=document.getElementById('formMessage');
let turnstileWidgetId=null;
let turnstileToken='';

function setSecurityMessage(text,type=''){
  if(!formMessage)return;
  formMessage.className=`form-message${type?` ${type}`:''}`;
  formMessage.textContent=text;
}

async function initTurnstile(){
  if(!quoteForm||!quoteSubmit)return;
  try{
    const response=await fetch('/api/turnstile-config',{cache:'no-store'});
    const config=await response.json();
    if(!response.ok||!config.siteKey)throw new Error('Turnstile no configurado');

    // El script se carga con defer; esperamos brevemente si aún no está listo.
    for(let i=0;i<50&&!window.turnstile;i++)await new Promise(r=>setTimeout(r,100));
    if(!window.turnstile)throw new Error('Turnstile no cargó');

    turnstileWidgetId=window.turnstile.render('#turnstileWidget',{
      sitekey:config.siteKey,
      theme:'light',
      size:'flexible',
      action:'contact_form',
      callback(token){
        turnstileToken=token;
        quoteSubmit.disabled=false;
        if(formMessage?.classList.contains('error'))setSecurityMessage('');
      },
      'expired-callback'(){
        turnstileToken='';
        quoteSubmit.disabled=true;
        setSecurityMessage('La verificación expiró. Confírmala nuevamente.','error');
      },
      'error-callback'(){
        turnstileToken='';
        quoteSubmit.disabled=true;
        setSecurityMessage('No pudimos cargar la verificación. Recarga la página e inténtalo de nuevo.','error');
      }
    });
  }catch(error){
    console.error(error);
    quoteSubmit.disabled=true;
    setSecurityMessage('La verificación de seguridad no está disponible en este momento.','error');
  }
}

initTurnstile();

quoteForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const msg=formMessage;
  const button=quoteSubmit||form.querySelector('button[type="submit"]');
  const originalButton=button.innerHTML;

  if(!turnstileToken){
    setSecurityMessage('Confirma la verificación de seguridad antes de enviar.','error');
    button.disabled=true;
    return;
  }

  msg.className='form-message';
  msg.textContent='Enviando tu solicitud...';
  button.disabled=true;
  button.innerHTML='Enviando...';

  try{
    const data=Object.fromEntries(new FormData(form).entries());
    data.turnstileToken=turnstileToken;
    const response=await fetch('/api/contact',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)
    });
    const result=await response.json().catch(()=>({}));
    if(!response.ok||!result.success)throw new Error(result.error||'No se pudo enviar');

    msg.className='form-message success';
    msg.textContent='¡Gracias! Recibimos tu solicitud. Te contactaremos muy pronto.';
    form.reset();
    turnstileToken='';
    if(window.turnstile&&turnstileWidgetId!==null)window.turnstile.reset(turnstileWidgetId);
  }catch(error){
    console.error(error);
    msg.className='form-message error';
    msg.textContent=error.message==='Verificación de seguridad inválida o expirada'
      ? 'La verificación expiró. Confírmala nuevamente e intenta enviar otra vez.'
      : 'No pudimos enviar tu solicitud. Inténtalo nuevamente en unos segundos.';
    turnstileToken='';
    if(window.turnstile&&turnstileWidgetId!==null)window.turnstile.reset(turnstileWidgetId);
  }finally{
    button.innerHTML=originalButton;
    // Tras cada intento Turnstile debe generar un token nuevo.
    button.disabled=true;
  }
});
