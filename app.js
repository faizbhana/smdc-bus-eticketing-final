/* SMDC Travels: educational browser-only prototype. Never use real credentials. */
(()=>{'use strict';
const STORE='smdc-v1-final-demo',SESSION='smdc-v1-session',HOLD_MS=5*60*1000;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const seed=()=>({users:[{id:'cu1',name:'Demo Customer',email:'customer@demo.test',password:'Demo123!',role:'customer',failures:0,locked:false},{id:'mg1',name:'Demo Manager',email:'manager@demo.test',password:'Demo123!',role:'manager',failures:0,locked:false},{id:'ad1',name:'Demo Admin',email:'admin@demo.test',password:'Demo123!',role:'admin',failures:0,locked:false}],routes:[{id:'R1',from:'Delhi',to:'Jaipur',time:'07:30',duration:'5h 15m',price:620,bus:'SMDC Comfort AC',capacity:16,active:true},{id:'R2',from:'Delhi',to:'Jaipur',time:'16:00',duration:'5h 30m',price:780,bus:'SMDC Premium',capacity:16,active:true},{id:'R3',from:'Jaipur',to:'Agra',time:'09:15',duration:'4h 20m',price:480,bus:'SMDC Express',capacity:16,active:true},{id:'R4',from:'Mumbai',to:'Pune',time:'06:45',duration:'3h 50m',price:550,bus:'SMDC Comfort AC',capacity:16,active:true},{id:'R5',from:'Bengaluru',to:'Mysuru',time:'10:00',duration:'3h 10m',price:390,bus:'SMDC Express',capacity:16,active:true}],bookings:[],holds:[],audit:[],payments:[],notifications:[]});
let db;
try {
  db=JSON.parse(localStorage.getItem(STORE))||seed();
  if(!Array.isArray(db.users)||!Array.isArray(db.routes)) db=seed();
} catch(_) { db=seed(); }
for(const key of ['bookings','holds','audit','payments','notifications']) {
  if(!Array.isArray(db[key])) db[key]=[];
}
for(const b of db.bookings) {
  if(b.unitPrice==null) b.unitPrice=b.seats.length?b.total/b.seats.length:0;
  if(b.refundedAmount==null) b.refundedAmount=0;
}
let returnFocus=null;
const notify=(userId,subject,body)=>{
  db.notifications.unshift({id:id('n'),userId,subject,body,at:when()});
  save();
};
const paymentEvent=(b,event,amount,note='')=>{
  db.payments.unshift({id:id('p'),bookingId:b?.id||'Unconfirmed attempt',
    customerRef:b?.userId||current,event,amount,by:user()?.role||'system',at:when(),note});
  save();
};
const departurePassed=(r,date)=>new Date(date+'T'+r.time).getTime()<=Date.now();
let current=sessionStorage.getItem(SESSION),search={from:'',to:'',date:''},selection=null,staffTab='records',timer=null;
const today=()=>new Date().toLocaleDateString('en-CA');const dateTomorrow=()=>{let d=new Date();d.setDate(d.getDate()+1);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const clean=()=>{
  const expired=db.holds.filter(h=>h.until<=Date.now());
  if(!expired.length) return;
  db.holds=db.holds.filter(h=>h.until>Date.now());
  for(const h of expired) {
    const b=db.bookings.find(b=>b.id===h.bookingId&&b.status==='pending');
    if(b) {
      b.status='expired';
      paymentEvent(b,'expired',0,'Bank approval was not completed before hold expiry.');
      notify(b.userId,'Reservation expired','Booking '+b.id+' expired without a charge. Search again to reserve.');
    }
  }
  save();
};
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(db))}catch(_){toast('Storage unavailable; changes may not persist.')}};
const user=()=>db.users.find(u=>u.id===current)||null;const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const money=x=>'₹'+Number(x).toLocaleString('en-IN');const route=id=>db.routes.find(r=>r.id===id);const when=()=>new Date().toISOString();const id=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const audit=(action,details)=>{db.audit.unshift({id:id('a'),by:user()?.email||'system',action,details,at:when()});save()};
function toast(msg){let el=$('#toast');el.textContent=msg;el.classList.remove('hidden');clearTimeout(timer);timer=setTimeout(()=>el.classList.add('hidden'),4000)}
function modal(title,html){
  if($('#modal').classList.contains('hidden')) returnFocus=document.activeElement;
  $('#modalTitle').textContent=title;
  $('#modalBody').innerHTML=html;
  $('#modal').classList.remove('hidden');
  $('#modalBody input:not([type="hidden"]), #modalBody select, #modalBody button')?.focus();
}
function releaseSelection(){
  if(selection?.holdId) db.holds=db.holds.filter(h=>h.id!==selection.holdId||h.bookingId);
  selection=null;
  save();
}
function close(){
  $('#modal').classList.add('hidden');
  releaseSelection();
  returnFocus?.isConnected&&returnFocus.focus();
  renderRoutes();
}
function page(name){if(!['home','bookings','staff','about'].includes(name))name='home';$$('.page').forEach(el=>el.classList.toggle('active',el.id===name));$$('[data-page]').forEach(el=>el.classList.toggle('selected',el.dataset.page===name));if(name==='bookings')renderBookings();if(name==='staff')renderStaff();history.replaceState(null,'','#'+name);scrollTo({top:0,behavior:'instant'});}
function authState(){const u=user();$('#who').textContent=u?u.name:'Guest';$('#authBtn').classList.toggle('hidden',!!u);$('#logoutBtn').classList.toggle('hidden',!u);}
function locOptions(){let cities=[...new Set(db.routes.filter(r=>r.active).flatMap(r=>[r.from,r.to]))].sort();let oldFrom=$('#from').value,oldTo=$('#to').value;$('#from').innerHTML='<option value="">Origin city</option>'+cities.map(x=>`<option>${esc(x)}</option>`).join('');$('#to').innerHTML='<option value="">Destination city</option>'+cities.map(x=>`<option>${esc(x)}</option>`).join('');$('#from').value=cities.includes(oldFrom)?oldFrom:'Delhi';$('#to').value=cities.includes(oldTo)?oldTo:'Jaipur';}
function occupancy(rid,date){clean();let booked=db.bookings.filter(b=>b.routeId===rid&&b.date===date&&b.status==='confirmed').flatMap(b=>b.seats);let held=db.holds.filter(h=>h.routeId===rid&&h.date===date).flatMap(h=>h.seats);return {booked,held}}
function renderRoutes(){clean();const list=db.routes.filter(r=>r.active&&!departurePassed(r,search.date||dateTomorrow())&&(!search.from||r.from===search.from)&&(!search.to||r.to===search.to));$('#resultNote').textContent=`${list.length} departure${list.length===1?'':'s'} • ${search.date||'Select a travel date'}`;$('#routes').innerHTML=list.length?list.map(r=>{let o=occupancy(r.id,search.date||dateTomorrow()),left=Math.max(0,r.capacity-o.booked.length-o.held.length);return `<article class="route"><div class="routehead"><div><span class="tag">${esc(r.bus)}</span><h3 style="margin-top:12px">${esc(r.from)} → ${esc(r.to)}</h3><span class="muted">Departure ${esc(r.time)} • ${esc(r.duration)}</span></div><div style="text-align:right"><strong class="big">${money(r.price)}</strong><div class="help">per seat</div></div></div><div class="routefoot"><span class="muted">${left} of ${r.capacity} seats available</span><button class="btn small" data-select-route="${r.id}" ${left===0?'disabled':''}>Choose seats</button></div></article>`}).join(''):'<div class="panel empty">No buses match this route. Try another origin or destination.</div>'}
function showAuth(register=false){
  modal(register?'Create demo account':'Sign in to SMDC',
    '<div class="notice">Classroom simulation: use fictional details only. No real password, ID, or email service.</div>'+
    '<div class="tabs" style="margin-top:14px"><button type="button" class="tab" data-auth-mode="login">Log in</button><button type="button" class="tab" data-auth-mode="register">Register</button></div>'+
    '<form id="authForm"><input type="hidden" name="mode" value="'+(register?'register':'login')+'">'+
    (register?'<label>Full name<input name="name" required minlength="2" maxlength="60"></label><label>Fictional ID reference (demo only)<input name="govid" placeholder="DEMO-ID-001" required pattern="[A-Za-z0-9-]{4,24}" minlength="4" maxlength="24"></label>':'')+
    '<label>Email<input type="email" name="email" required autocomplete="username"></label>'+
    '<label>Password<input type="password" name="password" required minlength="8" autocomplete="'+(register?'new-password':'current-password')+'"></label>'+
    '<button class="btn primary wide">'+(register?'Create account':'Log in')+'</button><p class="error" id="authError" aria-live="polite"></p></form>'+
    '<button type="button" class="btn ghost wide" id="showRecovery">Demo account recovery</button>'+
    '<p class="help">Demo accounts: customer@demo.test, manager@demo.test, admin@demo.test · Password: Demo123!</p>');
}
function recoveryForm(){
  modal('Demo account recovery','<div class="notice">This is an on-screen recovery simulation. No email is sent and this does not provide secure authentication.</div><form id="recoveryForm"><label>Demo account email<input name="email" type="email" required></label><button class="btn wide">Show simulated unlock email</button><p class="error" id="recoveryError"></p></form>');
}
function recoverAccount(form){
  const email=String(new FormData(form).get('email')).trim().toLowerCase();
  const u=db.users.find(x=>x.email===email);
  if(!u){$('#recoveryError').textContent='No local demo account matches this email.';return;}
  modal('Simulated recovery email','<div class="notice">DEMO EMAIL · Displayed here instead of being sent to '+esc(email)+'.</div><p>Use the demo link below to unlock this account. Your password remains unchanged.</p><button class="btn wide" data-unlock-demo="'+esc(u.id)+'">Use demo unlock link</button>');
}
function unlockDemo(uid){
  const u=db.users.find(x=>x.id===uid);
  if(!u)return;
  u.locked=false;u.failures=0;save();
  showAuth();
  $('#authError').textContent='Demo account unlocked. Sign in with your existing password.';
}
function submitAuth(form){let d=new FormData(form),email=String(d.get('email')||'').toLowerCase().trim(),password=String(d.get('password')||''),existing=db.users.find(u=>u.email===email),err=$('#authError');if(d.get('mode')==='register'){if(existing){err.textContent='An account with this email already exists.';return}if(password.length<8){err.textContent='Use a password of at least 8 characters.';return}let name=String(d.get('name')||'').trim();if(name.length<2){err.textContent='Enter a name.';return}const govid=String(d.get('govid')||'').trim();if(!/^[A-Za-z0-9-]{4,24}$/.test(govid)){err.textContent='Use a fictional ID of 4–24 letters, numbers, or hyphens.';return}let u={id:id('u'),name,email,govid,password,role:'customer',failures:0,locked:false};db.users.push(u);save();current=u.id;sessionStorage.setItem(SESSION,current);close();authState();toast('Demo account created. You can now book.');renderRoutes();return}if(!existing){err.textContent='Incorrect email or password.';return}if(existing.locked){err.textContent='Account locked after five unsuccessful attempts. Use Demo account recovery to unlock this local account.';return}if(password!==existing.password){existing.failures++;if(existing.failures>=5)existing.locked=true;save();err.textContent=existing.locked?'Account locked after five failed attempts. Use Demo account recovery to view a simulated unlock email.':`Incorrect email or password. ${5-existing.failures} tries remaining.`;return}existing.failures=0;save();current=existing.id;sessionStorage.setItem(SESSION,current);close();authState();toast(`Welcome, ${existing.name}!`);if(existing.role!=='customer')page('staff');else page('home')}
function getSelected(){let chosen=$$('.seat.selected').map(x=>x.dataset.seat);return chosen}
function seatScreen(rid){
  const r=route(rid),u=user();
  if(!r||!r.active)return;
  if(!u){toast('Please sign in before booking. Browsing is available to guests.');showAuth();return;}
  if(u.role!=='customer'){toast('Only customer accounts can reserve tickets.');return;}
  const date=search.date||dateTomorrow();
  if(date<today()||departurePassed(r,date)){toast('Choose a departure that has not passed.');return;}
  releaseSelection();
  selection={rid,date,seats:[]};
  const o=occupancy(rid,date);
  const seats=Array.from({length:r.capacity},(_,i)=>{
    const s='S'+(i+1),busy=o.booked.includes(s)||o.held.includes(s);
    const pref=i%4===0||i%4===3?'window':'aisle';
    return '<button class="seat '+(busy?'occupied':'')+'" type="button" data-seat="'+s+'" '+(busy?'disabled':'')+' aria-pressed="false" aria-label="Seat '+s+(busy?' unavailable':'')+'" title="'+pref+' seat">'+s+'<small>'+pref[0].toUpperCase()+'</small></button>'+(i%4===1?'<span class="aisle" aria-hidden="true"></span>':'');
  }).join('');
  modal('Choose your seats','<p><b>'+esc(r.from)+' → '+esc(r.to)+'</b> · '+esc(date)+' at '+esc(r.time)+' · '+money(r.price)+' per seat</p><div class="notice">Choose up to 4 seats. Each selection is held immediately in this browser only. W = window; A = aisle.</div><p id="holdClock" class="hold-clock" role="timer">Select a seat to start the five-minute hold.</p><div class="seats">'+seats+'</div><div class="legend">Available · Selected · Unavailable</div><hr><div class="row"><b id="selSummary">No seats selected</b><button id="continueCheckout" class="btn" disabled>Continue →</button></div>');
}
function chooseSeat(el){
  if(!selection)return;
  clean();
  const h=db.holds.find(h=>h.id===selection.holdId);
  if(selection.holdId&&!h){toast('Hold expired. Close this dialog and choose seats again.');return;}
  const chosen=[...selection.seats],s=el.dataset.seat,index=chosen.indexOf(s);
  if(index>=0)chosen.splice(index,1);
  else {
    if(chosen.length>=4){toast('Select up to four seats.');return;}
    const o=occupancy(selection.rid,selection.date);
    if(o.booked.includes(s)||o.held.includes(s)){toast('That seat is unavailable.');return;}
    chosen.push(s);
  }
  if(chosen.length) {
    if(h)h.seats=chosen;
    else { const newHold={id:id('h'),routeId:selection.rid,date:selection.date,seats:chosen,owner:current,until:Date.now()+HOLD_MS};db.holds.push(newHold);selection.holdId=newHold.id; }
  } else {db.holds=db.holds.filter(x=>x.id!==selection.holdId);delete selection.holdId;}
  selection.seats=chosen;
  save();
  el.classList.toggle('selected',index<0);el.setAttribute('aria-pressed',String(index<0));
  $('#selSummary').textContent=chosen.length?chosen.length+' seat(s) · '+money(chosen.length*route(selection.rid).price):'No seats selected';
  $('#continueCheckout').disabled=!chosen.length;
  updateHoldClock();renderRoutes();
}
function updateHoldClock(){
  const clock=$('#holdClock');
  if(!clock)return;
  const h=db.holds.find(h=>h.id===selection?.holdId);
  if(!selection?.holdId){clock.textContent='Select a seat to start the five-minute hold.';return;}
  const seconds=h?Math.max(0,Math.ceil((h.until-Date.now())/1000)):0;
  clock.textContent=seconds?'Seats held: '+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0'):'Hold expired. Close this dialog and choose seats again.';
  if(!seconds){const button=$('#continueCheckout')||$('#checkoutForm button');if(button)button.disabled=true;}
}
function checkout(){
  clean();
  const h=db.holds.find(h=>h.id===selection?.holdId&&h.owner===current);
  if(!h||!h.seats.length){toast('Your hold expired. Choose seats again.');return;}
  checkoutModal(h);
}
function checkoutModal(h){
  const r=route(h.routeId),b=db.bookings.find(b=>b.id===h.bookingId);
  modal(b?'Retry pending payment':'Finish your reservation',
    '<div class="notice">SIMULATED payment only. No money transfer, bank connection, or real email.</div><p><b>'+esc(r.from)+' → '+esc(r.to)+'</b><br>'+esc(h.date)+', '+esc(r.time)+' · Seats '+esc(h.seats.join(', '))+'</p><h3>Total: '+money(h.seats.length*(b?.unitPrice||r.price))+'</h3><p id="holdClock" class="hold-clock" role="timer"></p>'+
    '<form id="checkoutForm"><label>Passenger full name<input name="passenger" required minlength="2" maxlength="70" value="'+esc(b?.passenger||user().name)+'"></label><label>Payment verification PIN (demo only)<input name="pin" pattern="[0-9]{6}" inputmode="numeric" minlength="6" maxlength="6" placeholder="246810" required></label><label>Bank simulation status<select name="bank"><option value="online">Bank available</option><option value="offline">Bank unavailable — pending booking</option></select></label><button class="btn wide primary">Verify payment and reserve</button><p class="error" id="payError" aria-live="polite"></p></form><p class="help">Approved demo PIN: 246810. Cancelling confirmed seats simulates a full per-seat refund to the original demo payment. No real refund occurs.</p>');
  updateHoldClock();
}
function retryPayment(bid){
  clean();
  const b=db.bookings.find(b=>b.id===bid),u=user();
  if(!b||b.status!=='pending'||!(b.userId===current||u?.role==='admin'))return;
  const h=db.holds.find(h=>h.bookingId===bid&&h.until>Date.now());
  const r=route(b.routeId);
  if(!h||!r?.active||departurePassed(r,b.date)){toast('This pending reservation can no longer be paid. Search again.');return;}
  releaseSelection();selection={rid:h.routeId,date:h.date,seats:[...h.seats],holdId:h.id,staff:u.role==='admin'};
  checkoutModal(h);
}

function pay(form){
  clean();
  const h=db.holds.find(h=>h.id===selection?.holdId),u=user();
  const staff=selection?.staff&&u?.role==='admin';
  if(!h||(!staff&&h.owner!==current)){$('#payError').textContent='Seat hold expired. Search and select seats again.';return;}
  const r=route(h.routeId);
  if(!r?.active||departurePassed(r,h.date)||h.seats.some(s=>Number(s.slice(1))>r.capacity)){
    $('#payError').textContent='This service changed or departed. Close this dialog and search again.';return;
  }
  const d=new FormData(form),bank=d.get('bank'),pin=d.get('pin'),passenger=String(d.get('passenger')||'').trim();
  if(passenger.length<2){$('#payError').textContent='Enter a passenger name of at least two characters.';return;}
  let b=db.bookings.find(b=>b.id===h.bookingId);
  if(b&&b.status!=='pending'){$('#payError').textContent='This payment has already been resolved.';return;}
  if(bank==='online'&&pin!=='246810'){
    paymentEvent(b,'rejected',0,'Incorrect demo PIN; no charge.');
    $('#payError').textContent='The demo bank did not approve this PIN. Try 246810.';return;
  }
  if(!b){b={id:id('BK'),userId:h.owner,routeId:h.routeId,date:h.date,seats:[...h.seats],unitPrice:r.price,total:h.seats.length*r.price,status:'pending',created:when(),receipt:'',refundedAmount:0,paidAmount:0};db.bookings.unshift(b);h.bookingId=b.id;}
  b.passenger=passenger;
  b.status=bank==='offline'?'pending':'confirmed';
  if(b.status==='confirmed'){b.receipt='SIM-'+Date.now();b.paidAmount=b.total;db.holds=db.holds.filter(x=>x.id!==h.id);}
  paymentEvent(b,b.status,b.status==='confirmed'?b.total:0,b.status==='pending'?'No charge. Retry before the hold expires.':'Demo bank approved the PIN.');
  notify(b.userId,b.status==='confirmed'?'Booking confirmed':'Reservation pending','Booking '+b.id+': '+b.status+'. '+(b.status==='confirmed'?'Receipt '+b.receipt:'Retry payment before the hold expires.'));
  if(staff)audit('Payment reviewed','Booking '+b.id+' set to '+b.status);
  save();close();
  modal(b.status==='pending'?'Reservation pending':'Reservation confirmed','<div class="notice">'+(b.status==='pending'?'No charge. Retry payment from My bookings before the hold expires.':'Demo payment confirmed. The receipt and notification are on-screen simulations.')+'</div><p><b>Booking reference:</b> '+esc(b.id)+'</p><p><b>Seats:</b> '+esc(b.seats.join(', '))+'</p><p><b>Status:</b> '+esc(b.status)+'</p>'+(b.receipt?'<p><b>On-screen receipt:</b> '+esc(b.receipt)+'</p>':'')+'<button class="btn wide" id="'+(staff?'seePayments':'seeBookings')+'">'+(staff?'Return to payments':'View my bookings')+'</button>');
  renderRoutes();
}
function renderBookings(){
  clean();const u=user();
  if(!u){$('#bookingsList').innerHTML='<div class="panel empty">Log in as a customer to view reservations.<p><button class="btn" id="bookingsLogin">Log in</button></p></div>';return;}
  if(u.role!=='customer'){$('#bookingsList').innerHTML='<div class="panel empty">Staff accounts use the staff dashboard.</div>';return;}
  const books=db.bookings.filter(b=>b.userId===u.id);
  $('#bookingsList').innerHTML=books.length?books.map(b=>{
    const r=route(b.routeId);
    return '<article class="panel"><div class="space"><h3>'+esc(r?.from||'Route')+' → '+esc(r?.to||'Unavailable route')+'</h3><span class="pill '+esc(b.status)+'">'+esc(b.status)+'</span></div><p class="muted">'+esc(b.date)+' · '+esc(r?.time||'')+' · Reference '+esc(b.id)+'</p><p><b>Passenger:</b> '+esc(b.passenger)+'<br><b>Seats:</b> '+esc(b.seats.join(', ')||'None')+'<br><b>Current booking amount:</b> '+money(b.total)+'<br><b>Simulated refunds:</b> '+money(b.refundedAmount||0)+'</p>'+
    (b.status==='confirmed'?'<div class="toolbar"><button class="btn ghost small" data-receipt="'+esc(b.id)+'">Show receipt</button>'+b.seats.map(s=>'<button class="btn danger small" data-cancel-book="'+esc(b.id)+'" data-cancel-seat="'+esc(s)+'">Cancel '+esc(s)+'</button>').join('')+'</div>':'')+
    (b.status==='pending'?'<p class="help">No charge. Retry before your five-minute hold expires, or cancel the pending reservation.</p><div class="toolbar"><button class="btn small" data-retry="'+esc(b.id)+'">Retry payment</button><button class="btn danger small" data-cancel-pending="'+esc(b.id)+'">Cancel pending reservation</button></div>':'')+'</article>';
  }).join(''):'<div class="panel empty">You have no reservations yet.</div>';
  const messages=db.notifications.filter(n=>n.userId===u.id);
  $('#bookingsList').innerHTML+='<section class="panel"><h3>Demo notifications</h3><p class="help">Displayed here instead of being sent by email.</p>'+ (messages.length?messages.map(n=>'<article class="demo-message"><b>'+esc(n.subject)+'</b><small>'+esc(new Date(n.at).toLocaleString())+'</small><p>'+esc(n.body)+'</p></article>').join(''):'<p>No notifications yet.</p>')+'</section>';
}
function cancelPending(bid,reason='Cancelled before bank approval.'){
  const b=db.bookings.find(b=>b.id===bid),u=user();
  if(!b||b.status!=='pending'||!(b.userId===current||u?.role==='admin'))return;
  b.status='cancelled';db.holds=db.holds.filter(h=>h.bookingId!==bid);
  paymentEvent(b,'cancelled',0,reason);
  notify(b.userId,'Pending reservation cancelled','Booking '+bid+' was cancelled without a charge.');
  if(u.role==='admin')audit('Payment cancelled','Booking '+bid+': '+reason);
  save();renderBookings();renderStaff();renderRoutes();toast('Pending reservation cancelled. No charge.');
}
function cancelSeat(bid,seat,staff=false,reason='Customer cancellation'){
  const b=db.bookings.find(x=>x.id===bid),u=user();
  if(!b||b.status!=='confirmed')return;
  if(!staff&&b.userId!==u?.id)return;
  if(staff&&!['manager','admin'].includes(u?.role))return;
  if(!b.seats.includes(seat))return;
  const refund=b.unitPrice??(b.seats.length?b.total/b.seats.length:0);
  b.seats=b.seats.filter(x=>x!==seat);
  b.total=b.seats.length*refund;b.refundedAmount=(b.refundedAmount||0)+refund;
  if(!b.seats.length)b.status='cancelled';
  paymentEvent(b,'refunded',refund,reason+'; seat '+seat+'. Simulated refund to original demo payment.');
  notify(b.userId,'Demo refund processed','Booking '+bid+': seat '+seat+' cancelled; '+money(refund)+' simulated refund. No real money moved.');
  if(staff)audit('Booking cancellation','Booking '+bid+' seat '+seat+': '+reason);
  save();toast('Seat '+seat+' cancelled. Demo refund: '+money(refund)+'.');
  renderBookings();renderStaff();renderRoutes();
}
function metricCard(label,value){return `<div class="metric"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`}
function renderStaff(){clean();let u=user(),staff=u&&['manager','admin'].includes(u.role);$('#staffGate').classList.toggle('hidden',!!staff);$('#staffContent').classList.toggle('hidden',!staff);if(!staff)return;$('#staffRole').textContent=u.role==='manager'?'Manager access':'Admin access';$$('.admin-only').forEach(x=>x.classList.toggle('hidden',u.role!=='admin'));if(u.role==='manager'&&['administration','audit','payments'].includes(staffTab))staffTab='records';$$('[data-stafftab]').forEach(x=>x.classList.toggle('active',x.dataset.stafftab===staffTab));$('#metrics').innerHTML=metricCard('Confirmed bookings',db.bookings.filter(x=>x.status==='confirmed').length)+metricCard('Seats sold',db.bookings.filter(x=>x.status==='confirmed').reduce((a,b)=>a+b.seats.length,0))+metricCard('Active routes',db.routes.filter(r=>r.active).length)+metricCard('Confirmed revenue (demo)',money(db.bookings.filter(x=>x.status==='confirmed').reduce((a,b)=>a+b.total,0)));let panel=$('#staffPanel');if(staffTab==='payments'){renderPayments(panel);return}if(staffTab==='records'){panel.innerHTML='<div class="panel"><h3>Reservation records & utilization</h3><p class="help">This dashboard summarizes only the sample records in this browser. Manager can cancel bookings; admin can view summary without customer account access.</p><div class="tablewrap"><table><thead><tr><th>Booking</th><th>Route</th><th>Date</th><th>Seats</th><th>Status</th><th>Action</th></tr></thead><tbody>'+db.bookings.map(b=>`<tr><td>${esc(b.id)}</td><td>${esc(route(b.routeId)?.from||'')} → ${esc(route(b.routeId)?.to||'')}</td><td>${esc(b.date)}</td><td>${esc(b.seats.join(', '))}</td><td><span class="pill ${esc(b.status)}">${esc(b.status)}</span></td><td>${u.role==='manager'&&b.status==='confirmed'?`<button class="btn danger small" data-manager-cancel="${esc(b.id)}">Cancel booking</button>`:'—'}</td></tr>`).join('')+'</tbody></table></div></div>'}else if(staffTab==='schedules'){panel.innerHTML='<div class="panel"><h3>Bus schedules</h3><p class="help">Managers may edit departure times; administrators may modify routes and vehicle capacity.</p><div class="tablewrap"><table><thead><tr><th>Route</th><th>Departure</th><th>Bus</th><th>Seats</th><th>Status</th><th>Manage</th></tr></thead><tbody>'+db.routes.map(r=>`<tr><td>${esc(r.from)} → ${esc(r.to)}</td><td>${esc(r.time)}</td><td>${esc(r.bus)}</td><td>${r.capacity}</td><td>${r.active?'Active':'Inactive'}</td><td><button class="btn small ghost" data-editroute="${r.id}">Edit</button></td></tr>`).join('')+'</tbody></table></div></div>'}else if(staffTab==='administration'){panel.innerHTML='<div class="panel"><h3>Route & vehicle administration</h3><p class="help">Admins can add routes, edit vehicles, and deactivate services. A route with confirmed bookings cannot be deleted. Admin does not access customer passwords or accounts.</p><button class="btn" id="addRoute">+ Add route</button><div class="tablewrap"><table><thead><tr><th>Route</th><th>Vehicle</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead><tbody>'+db.routes.map(r=>`<tr><td>${esc(r.from)} → ${esc(r.to)}</td><td>${esc(r.bus)}</td><td>${r.capacity}</td><td>${r.active?'Active':'Inactive'}</td><td><button class="btn small ghost" data-editroute="${r.id}">Edit</button> <button class="btn small danger" data-toggle-route="${r.id}">${r.active?'Deactivate':'Reactivate'}</button> <button class="btn small danger" data-delete-route="${r.id}">Delete</button></td></tr>`).join('')+'</tbody></table></div></div>'}else if(staffTab==='audit'){panel.innerHTML='<div class="panel"><h3>Administrative audit trail</h3><p class="help">Sample audit records include the user, action, timestamp, and details. Not a secure tamper-proof audit log.</p><div class="tablewrap"><table><thead><tr><th>When</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>'+db.audit.map(x=>`<tr><td>${esc(new Date(x.at).toLocaleString())}</td><td>${esc(x.by)}</td><td>${esc(x.action)}</td><td>${esc(x.details)}</td></tr>`).join('')+'</tbody></table></div></div>'}}

function renderPayments(panel){
  if(user()?.role!=='admin'){panel.innerHTML='Admin access required.';return;}
  const gross=db.payments.filter(p=>p.event==='confirmed').reduce((n,p)=>n+p.amount,0);
  const refunds=db.payments.filter(p=>p.event==='refunded').reduce((n,p)=>n+p.amount,0);
  panel.innerHTML='<div class="panel"><h3>Simulated payment management</h3><p class="notice">Admin only. No bank, real money, or customer account details are connected. Legacy bookings may predate this event log.</p><p><b>Recorded gross:</b> '+money(gross)+' · <b>Recorded refunds:</b> '+money(refunds)+' · <b>Recorded net:</b> '+money(gross-refunds)+'</p><div class="tablewrap"><table><thead><tr><th>Booking</th><th>Status</th><th>Current amount</th><th>Refunded</th><th>Actions</th></tr></thead><tbody>'+db.bookings.map(b=>'<tr><td>'+esc(b.id)+'</td><td>'+esc(b.status)+'</td><td>'+money(b.total)+'</td><td>'+money(b.refundedAmount||0)+'</td><td>'+(b.status==='pending'?'<button class="btn small" data-retry="'+esc(b.id)+'">Review payment</button> ':'')+(['pending','confirmed'].includes(b.status)?'<button class="btn danger small" data-admin-payment="'+esc(b.id)+'">Cancel payment</button>':'—')+'</td></tr>').join('')+'</tbody></table></div><h3>Payment event log</h3><div class="tablewrap"><table><thead><tr><th>When</th><th>Booking</th><th>Event</th><th>Amount</th><th>Actor role</th><th>Details</th></tr></thead><tbody>'+db.payments.map(p=>'<tr><td>'+esc(new Date(p.at).toLocaleString())+'</td><td>'+esc(p.bookingId)+'</td><td>'+esc(p.event)+'</td><td>'+money(p.amount)+'</td><td>'+esc(p.by)+'</td><td>'+esc(p.note)+'</td></tr>').join('')+'</tbody></table></div></div>';
}
function adminPaymentForm(bid){
  if(user()?.role!=='admin')return;
  const b=db.bookings.find(b=>b.id===bid);
  if(!b||!['pending','confirmed'].includes(b.status))return;
  modal('Cancel simulated payment','<div class="notice">This cancels booking '+esc(bid)+'. Confirmed seats receive a full simulated refund; pending seats have no charge. No real funds move.</div><form id="cancelPaymentForm"><input type="hidden" name="bid" value="'+esc(bid)+'"><label>Reason<input name="reason" required minlength="3" maxlength="120"></label><button class="btn danger wide">Confirm demo cancellation</button><p class="error" id="cancelError"></p></form>');
}
function cancelAdminPayment(form){
  if(user()?.role!=='admin')return;
  const d=new FormData(form),reason=String(d.get('reason')||'').trim(),bid=d.get('bid');
  if(reason.length<3){$('#cancelError').textContent='Enter a reason of at least three characters.';return;}
  const b=db.bookings.find(b=>b.id===bid);
  if(!b)return;
  if(b.status==='pending')cancelPending(bid,reason);
  else if(b.status==='confirmed')for(const s of [...b.seats])cancelSeat(bid,s,true,reason);
  close();staffTab='payments';renderStaff();
}

function editRoute(rid){let u=user(),r=route(rid),admin=u?.role==='admin';if(!r||!['manager','admin'].includes(u?.role))return;modal('Edit schedule and vehicle',`<form id="editRouteForm"><input type="hidden" name="rid" value="${rid}"><p><b>${esc(r.from)} → ${esc(r.to)}</b></p><label>Departure time<input type="time" name="time" required value="${esc(r.time)}"></label>${admin?`<label>Vehicle name<input name="bus" maxlength="55" required value="${esc(r.bus)}"></label><label>Capacity (4–40)<input type="number" name="capacity" min="4" max="40" required value="${r.capacity}"></label>`:''}<button class="btn wide">Save changes</button><p class="error" id="editError"></p></form>`)}
function submitEdit(form){let d=new FormData(form),r=route(d.get('rid')),u=user();if(!r||!['manager','admin'].includes(u?.role))return;let cap=u.role==='admin'?Number(d.get('capacity')):r.capacity;if(!Number.isInteger(cap)||cap<4||cap>40){$('#editError').textContent='Capacity must be a whole number from 4 to 40.';return;}let maxSeat=db.bookings.filter(b=>b.routeId===r.id&&['confirmed','pending'].includes(b.status)).flatMap(b=>b.seats).reduce((n,s)=>Math.max(n,parseInt(s.slice(1),10)||0),0);const heldMax=db.holds.filter(h=>h.routeId===r.id&&h.until>Date.now()).flatMap(h=>h.seats).reduce((n,s)=>Math.max(n,Number(s.slice(1))||0),0);if(cap<Math.max(maxSeat,heldMax)){$('#editError').textContent='Capacity cannot be less than an already-booked or pending seat number.';return}const time=String(d.get('time')||'');if(!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time)){$('#editError').textContent='Enter a valid departure time.';return;}r.time=time;if(u.role==='admin'){r.bus=String(d.get('bus')).trim();r.capacity=cap}audit('Schedule changed',`Route ${r.id} changed by ${u.role}`);for(const b of db.bookings.filter(b=>b.routeId===r.id&&['confirmed','pending'].includes(b.status)))notify(b.userId,'Schedule updated','Booking '+b.id+': departure updated to '+r.time+'. This is an on-screen notice; real customer contact is not connected.');close();renderStaff();locOptions();renderRoutes();toast('Schedule updated in this demo.')}
function addRouteForm(){modal('Add a bus route',`<form id="addRouteForm"><div class="grid2"><label>From<input name="from" required maxlength="40"></label><label>To<input name="to" required maxlength="40"></label><label>Departure<input type="time" name="time" required value="08:00"></label><label>Trip duration<input name="duration" required value="4h 00m" maxlength="20"></label><label>Price (INR)<input type="number" name="price" required min="1" max="100000" value="500"></label><label>Seat capacity<input type="number" name="capacity" min="4" max="40" value="16" required></label></div><label>Bus name<input name="bus" required maxlength="55" value="SMDC Express"></label><button class="btn wide">Create route</button><p id="addError" class="error"></p></form>`)}
function addNewRoute(form){if(user()?.role!=='admin')return;let d=new FormData(form),from=String(d.get('from')).trim(),to=String(d.get('to')).trim();if(from.toLowerCase()===to.toLowerCase()){$('#addError').textContent='Origin and destination must be different.';return}let r={id:id('R'),from,to,time:String(d.get('time')),duration:String(d.get('duration')),price:Number(d.get('price')),bus:String(d.get('bus')),capacity:Number(d.get('capacity')),active:true};db.routes.push(r);audit('Route created',`${r.id}: ${from} to ${to}`);close();renderStaff();locOptions();renderRoutes();toast('Route added.')}
function routeAction(rid,action){if(user()?.role!=='admin')return;let r=route(rid);if(!r)return;if(action==='delete'){if(db.bookings.some(b=>b.routeId===rid&&['confirmed','pending'].includes(b.status))||db.holds.some(h=>h.routeId===rid&&h.until>Date.now())){toast('Cannot delete a route with active bookings. Deactivate it instead.');return}if(!confirm(`Delete route ${r.from} → ${r.to} from local demo?`))return;db.routes=db.routes.filter(x=>x.id!==rid);audit('Route deleted',rid)}else{r.active=!r.active;audit(r.active?'Route reactivated':'Route deactivated',rid)}renderStaff();locOptions();renderRoutes()}
function reset(){if(!confirm('Reset all local demo accounts, bookings, routes and logs?'))return;db=seed();current=null;sessionStorage.removeItem(SESSION);save();authState();locOptions();renderRoutes();renderBookings();renderStaff();toast('Sample data reset.')}
$('#searchForm').addEventListener('submit',e=>{e.preventDefault();const nextSearch={from:$('#from').value,to:$('#to').value,date:$('#date').value};if(nextSearch.from===nextSearch.to){toast('Choose two different cities.');return}if(nextSearch.date<today()){toast('Choose a current or future date.');return}search=nextSearch;renderRoutes()});$('#authBtn').addEventListener('click',()=>showAuth());$('#logoutBtn').addEventListener('click',()=>{current=null;sessionStorage.removeItem(SESSION);authState();page('home');toast('Logged out.')});$('#closeModal').addEventListener('click',close);$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')close()});$('#resetDemo').addEventListener('click',reset);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').classList.contains('hidden'))close()});
document.addEventListener('click',e=>{
  const extra=e.target.closest('#showRecovery,[data-unlock-demo],[data-retry],[data-cancel-pending],[data-admin-payment],#seePayments');
  if(extra){
    if(extra.id==='showRecovery')recoveryForm();
    else if(extra.dataset.unlockDemo)unlockDemo(extra.dataset.unlockDemo);
    else if(extra.dataset.retry)retryPayment(extra.dataset.retry);
    else if(extra.dataset.cancelPending)cancelPending(extra.dataset.cancelPending);
    else if(extra.dataset.adminPayment)adminPaymentForm(extra.dataset.adminPayment);
    else if(extra.id==='seePayments'){close();staffTab='payments';page('staff');}
    return;
  }
let el=e.target.closest('[data-page], [data-select-route], [data-auth-mode], [data-seat], #continueCheckout, #seeBookings, #bookingsLogin, [data-receipt], [data-cancel-book], [data-manager-cancel], [data-stafftab], [data-editroute], #addRoute, [data-toggle-route], [data-delete-route]');if(!el)return;if(el.dataset.page){page(el.dataset.page);return}if(el.dataset.selectRoute){seatScreen(el.dataset.selectRoute);return}if(el.dataset.authMode){showAuth(el.dataset.authMode==='register');return}if(el.dataset.seat){chooseSeat(el);return}if(el.id==='continueCheckout'){checkout();return}if(el.id==='seeBookings'){close();page('bookings');return}if(el.id==='bookingsLogin'){showAuth();return}if(el.dataset.receipt){let b=db.bookings.find(x=>x.id===el.dataset.receipt&&x.userId===current);if(b)modal('On-screen receipt',`<p><b>Reference:</b> ${esc(b.id)}</p><p><b>Receipt:</b> ${esc(b.receipt)}</p><p><b>Seats:</b> ${esc(b.seats.join(', '))}</p><p><b>Total:</b> ${money(b.total)}</p><p class="notice">Simulated receipt — no real payment or email sent.</p>`);return}if(el.dataset.cancelBook){cancelSeat(el.dataset.cancelBook,el.dataset.cancelSeat);return}if(el.dataset.managerCancel){let b=db.bookings.find(x=>x.id===el.dataset.managerCancel);if(b&&confirm('Cancel this booking? This is a simulated action.')){[...b.seats].forEach(s=>cancelSeat(b.id,s,true))}return}if(el.dataset.stafftab){staffTab=el.dataset.stafftab;renderStaff();return}if(el.dataset.editroute){editRoute(el.dataset.editroute);return}if(el.id==='addRoute'){addRouteForm();return}if(el.dataset.toggleRoute){routeAction(el.dataset.toggleRoute,'toggle');return}if(el.dataset.deleteRoute){routeAction(el.dataset.deleteRoute,'delete');return}});
document.addEventListener('submit',e=>{if(['authForm','checkoutForm','editRouteForm','addRouteForm','recoveryForm','cancelPaymentForm'].includes(e.target.id)){e.preventDefault();if(!e.target.reportValidity())return;if(e.target.id==='recoveryForm')recoverAccount(e.target);if(e.target.id==='cancelPaymentForm')cancelAdminPayment(e.target);if(e.target.id==='authForm')submitAuth(e.target);if(e.target.id==='checkoutForm')pay(e.target);if(e.target.id==='editRouteForm')submitEdit(e.target);if(e.target.id==='addRouteForm')addNewRoute(e.target)}});
document.addEventListener('keydown',e=>{
  if(e.key!=='Tab'||$('#modal').classList.contains('hidden'))return;
  const nodes=[...$('#modal').querySelectorAll('button:not([disabled]),input:not([type="hidden"]),select,a[href]')].filter(el=>el.getClientRects().length);
  if(!nodes.length)return;
  const first=nodes[0],last=nodes[nodes.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
$('#date').min=today();$('#date').value=dateTomorrow();search.date=$('#date').value;locOptions();authState();renderRoutes();page(location.hash.slice(1)||'home');setInterval(()=>{clean();updateHoldClock();},1000);setInterval(()=>{clean();if($('#home').classList.contains('active'))renderRoutes();if($('#bookings').classList.contains('active'))renderBookings();if($('#staff').classList.contains('active'))renderStaff()},15000);
})();
