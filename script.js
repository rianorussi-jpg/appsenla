const examples = {
  clinic: {tag:'CLÍNICA / BELLEZA',title:'Tu clínica, siempre en el bolsillo de tus clientes.',text:'Agenda citas, administra paquetes, muestra sucursales, envía recordatorios y mantén a tus clientes conectados contigo.',list:['Reservaciones y citas','Paquetes y membresías','Notificaciones push','Perfil del cliente'],brand:'HAUT',heroSmall:'Tu próxima cita',heroTitle:'Depilación láser',heroMeta:'Viernes · 5:30 PM',button:'Reservar cita',bg:'linear-gradient(135deg,#ece3ff,#d9f0ff)',btn:'#7257e5'},
  restaurant: {tag:'RESTAURANTE / DELIVERY',title:'Tus pedidos, promociones y clientes en una sola app.',text:'Muestra tu menú, recibe pedidos, permite pagos y mantén al cliente informado desde que compra hasta que recibe.',list:['Menú digital','Pedidos y pagos','Seguimiento','Promociones push'],brand:'KYO',heroSmall:'Tu pedido favorito',heroTitle:'Sushi Box',heroMeta:'Entrega estimada · 35 min',button:'Pedir ahora',bg:'linear-gradient(135deg,#ffe8df,#fff4dc)',btn:'#ef6d4f'},
  fitness: {tag:'FITNESS / WELLNESS',title:'Clases, membresías y comunidad en una experiencia simple.',text:'Permite que tus clientes reserven clases, compren membresías, sigan su agenda y reciban novedades.',list:['Reserva de clases','Membresías','Agenda personal','Notificaciones'],brand:'MUSCLE',heroSmall:'Próxima clase',heroTitle:'Full Body',heroMeta:'Hoy · 7:00 PM',button:'Reservar lugar',bg:'linear-gradient(135deg,#e7f0ff,#e5fff5)',btn:'#2f77de'},
  nightlife: {tag:'EVENTOS / NIGHTLIFE',title:'Eventos, mesas y reservaciones desde una sola app.',text:'Publica eventos, recibe reservaciones, organiza mesas y conecta a tus clientes con lo que está pasando hoy.',list:['Eventos','Reservaciones de mesa','Promociones','Acceso y boletos'],brand:'EMPÉDATE',heroSmall:'Esta noche',heroTitle:'Faunna',heroMeta:'DJ Set · 11:30 PM',button:'Reservar mesa',bg:'linear-gradient(135deg,#e9e2ff,#ffdff0)',btn:'#7b4ef0'}
};

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const e=examples[btn.dataset.example];
  document.getElementById('exTag').textContent=e.tag;document.getElementById('exTitle').textContent=e.title;document.getElementById('exText').textContent=e.text;
  document.getElementById('exList').innerHTML=e.list.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('demoBrand').textContent=e.brand;const h=document.getElementById('demoHero');h.style.background=e.bg;h.innerHTML=`<small>${e.heroSmall}</small><strong>${e.heroTitle}</strong><span>${e.heroMeta}</span>`;
  const db=document.getElementById('demoButton');db.textContent=e.button;db.style.background=e.btn;
}));

document.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.choice').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));

document.getElementById('quoteForm').addEventListener('submit',e=>{e.preventDefault();const btn=e.currentTarget.querySelector('button[type="submit"]');btn.textContent='¡Gracias! Te contactaremos pronto';btn.disabled=true;});
