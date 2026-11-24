const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

// Execute the real application in an isolated state/DOM stub. These tests check
// workflow rules; they do not claim browser layout or event-wiring coverage.
function app(saved) {
  const nodes = new Map();
  const element = key => {
    if (!nodes.has(key)) {
      const classes = new Set(key === '#modal' ? ['hidden'] : key === '#home' ? ['active'] : []);
      nodes.set(key, { value: '', textContent: '', innerHTML: '', disabled: false,
        isConnected: true, dataset: {}, setAttribute() {}, focus() {},
        addEventListener() {}, querySelectorAll: () => [], getClientRects: () => [1],
        classList: { contains: c => classes.has(c), add: c => classes.add(c),
          remove: c => classes.delete(c), toggle(c,on) { on ??= !classes.has(c); on ? classes.add(c) : classes.delete(c); } }
      });
    }
    return nodes.get(key);
  };
  const values = new Map(saved ? [['smdc-v1-final-demo', JSON.stringify(saved)]] : []);
  const storage = { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v), removeItem: k => values.delete(k) };
  let now = new Date('2026-11-24T12:00:00').getTime();
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
  const sandbox = { document: { querySelector: element, querySelectorAll: () => [], addEventListener() {}, activeElement: null },
    localStorage: storage, sessionStorage: {getItem:()=>null,setItem(){},removeItem(){}},
    Date: Clock, FormData: class { constructor(form) {this.form=form;} get(k) {return this.form[k] ?? null;} },
    setInterval(){},setTimeout(){},clearTimeout(){},history:{replaceState(){}},scrollTo(){},location:{hash:''},confirm:()=>true };
  let source = fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
  const end = source.lastIndexOf('})();');
  source = source.slice(0,end) + `globalThis.api={seed,clean,chooseSeat,seatScreen,checkout,pay,retryPayment,cancelSeat,cancelPending,submitAuth,unlockDemo,renderStaff,renderBookings,routeAction,submitEdit,addNewRoute,cancelAdminPayment,close,updateHoldClock, get db(){return db},get selection(){return selection},set selection(v){selection=v},login(id){current=id},staffTab(v){staffTab=v},search(v){search=v}};` + source.slice(end);
  vm.runInNewContext(source,sandbox,{filename:'app.js'});
  return {a:sandbox.api,el:element,advance:ms=>{now+=ms;},saved:()=>JSON.parse(values.get('smdc-v1-final-demo'))};
}
function select(a,el,seats=['S1','S2']) {
  a.search({from:'Delhi',to:'Jaipur',date:'2026-11-25'});
  a.seatScreen('R1');
  for (const s of seats) {const button=el('seat-'+s);button.dataset.seat=s;a.chooseSeat(button);}
}
const payment = {passenger:'Test Passenger',pin:'246810',bank:'online'};

test('new app starts with five routes and compatible payment/notification storage',()=>{
  const {a}=app(); assert.equal(a.db.routes.length,5);assert.equal(a.db.payments.length,0);assert.equal(a.db.notifications.length,0);
});
test('legacy browser records gain new fields without losing bookings',()=>{
  const {a:old}=app();const saved=JSON.parse(JSON.stringify(old.db));delete saved.payments;delete saved.notifications;
  saved.bookings.push({id:'legacy',seats:['S1'],total:620,status:'confirmed'});
  const {a}=app(saved);assert.equal(a.db.bookings[0].id,'legacy');assert.equal(a.db.bookings[0].unitPrice,620);assert.equal(a.db.payments.length,0);
});
test('guest and staff cannot reserve customer seats',()=>{
  const {a,el}=app();a.seatScreen('R1');assert.equal(a.selection,null);assert.match(el('#modalTitle').textContent,/Sign in/);
  a.login('mg1');a.seatScreen('R1');assert.equal(a.selection,null);
});
test('seat selection creates an immediate hold, fixed expiry, and four-seat limit',()=>{
  const {a,el,advance}=app();a.login('cu1');select(a,el,['S1']);const until=a.db.holds[0].until;
  advance(1000);for(const s of ['S2','S3','S4','S5']){const b=el(s);b.dataset.seat=s;a.chooseSeat(b);}
  assert.equal(a.db.holds.length,1);assert.equal(a.db.holds[0].seats.length,4);assert.equal(a.db.holds[0].until,until);
  assert.match(el('#holdClock').textContent,/4:59/);
});
test('closing unpaid selection releases its hold',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.close();assert.equal(a.db.holds.length,0);
});
test('wrong PIN records a rejected event without confirming or recording the PIN',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.checkout();a.pay({...payment,pin:'111111'});
  assert.equal(a.db.bookings.length,0);assert.equal(a.db.payments[0].event,'rejected');assert.ok(!JSON.stringify(a.db.payments).includes('111111'));
});
test('valid payment confirms two seats, removes hold and adds receipt/notification',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.checkout();a.pay(payment);const b=a.db.bookings[0];
  assert.equal(b.status,'confirmed');assert.equal(b.total,1240);assert.equal(b.paidAmount,1240);assert.match(b.receipt,/SIM-/);
  assert.equal(a.db.holds.length,0);assert.equal(a.db.notifications[0].userId,'cu1');
});
test('bank outage stays pending and retry confirms the same booking exactly once',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.checkout();a.pay({...payment,bank:'offline'});const id=a.db.bookings[0].id;
  assert.equal(a.db.bookings[0].status,'pending');assert.equal(a.db.bookings[0].paidAmount,0);assert.equal(a.db.holds.length,1);
  a.close();assert.equal(a.db.holds.length,1);a.retryPayment(id);a.pay(payment);
  assert.equal(a.db.bookings.length,1);assert.equal(a.db.bookings[0].id,id);assert.equal(a.db.bookings[0].status,'confirmed');
  assert.equal(a.db.payments.filter(p=>p.event==='confirmed').length,1);
});
test('pending hold expires at exactly five minutes and cannot be paid afterward',()=>{
  const {a,el,advance}=app();a.login('cu1');select(a,el);a.checkout();a.pay({...payment,bank:'offline'});const id=a.db.bookings[0].id;
  advance(299999);a.clean();assert.equal(a.db.bookings[0].status,'pending');
  advance(1);a.clean();assert.equal(a.db.bookings[0].status,'expired');assert.equal(a.db.holds.length,0);a.retryPayment(id);assert.equal(a.selection,null);
});
test('partial cancellation refunds exactly one fare and preserves the other seat',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.checkout();a.pay(payment);const b=a.db.bookings[0];a.cancelSeat(b.id,'S1');
  assert.equal(b.seats.join(','),'S2');assert.equal(b.status,'confirmed');assert.equal(b.total,620);assert.equal(b.refundedAmount,620);
  a.cancelSeat(b.id,'S1');assert.equal(b.refundedAmount,620);a.cancelSeat(b.id,'S2');assert.equal(b.status,'cancelled');assert.equal(b.refundedAmount,1240);
});
test('another customer cannot cancel a reservation',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.checkout();a.pay(payment);const b=a.db.bookings[0];a.login('other');a.cancelSeat(b.id,'S1');assert.equal(b.seats.length,2);
});
test('customer can cancel pending booking without a charge or refund',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.checkout();a.pay({...payment,bank:'offline'});const b=a.db.bookings[0];a.cancelPending(b.id);
  assert.equal(b.status,'cancelled');assert.equal(a.db.holds.length,0);assert.equal(b.refundedAmount,0);assert.equal(a.db.payments[0].amount,0);
});
test('fifth wrong login locks account; correct sixth blocked; targeted unlock restores login',()=>{
  const {a,el}=app();for(let i=0;i<5;i++)a.submitAuth({mode:'login',email:'customer@demo.test',password:'Wrong123!'});
  assert.equal(a.db.users[0].locked,true);a.submitAuth({mode:'login',email:'customer@demo.test',password:'Demo123!'});assert.match(el('#authError').textContent,/locked/);
  a.unlockDemo('cu1');assert.equal(a.db.users[0].locked,false);assert.equal(a.db.users[0].failures,0);
  a.submitAuth({mode:'login',email:'customer@demo.test',password:'Demo123!'});assert.match(el('#who').textContent,/Customer/);
});
test('registration saves fictional ID and rejects duplicate email',()=>{
  const {a}=app();const form={mode:'register',name:'Test User',email:'new@demo.test',password:'Demo123!',govid:'DEMO-001'};a.submitAuth(form);
  assert.equal(a.db.users.length,4);assert.equal(a.db.users[3].govid,'DEMO-001');a.submitAuth(form);assert.equal(a.db.users.length,4);
});
test('registration rejects malformed fictional ID',()=>{
  const {a}=app();a.submitAuth({mode:'register',name:'Test User',email:'new@demo.test',password:'Demo123!',govid:'x'});assert.equal(a.db.users.length,3);
});
test('manager cannot open payment tab; admin can see events without customer credentials',()=>{
  const {a,el}=app();a.login('mg1');a.staffTab('payments');a.renderStaff();assert.ok(!el('#staffPanel').innerHTML.includes('Payment event log'));
  a.login('ad1');a.staffTab('payments');a.renderStaff();assert.match(el('#staffPanel').innerHTML,/Payment event log/);assert.ok(!el('#staffPanel').innerHTML.includes('Demo123!'));
});
test('admin can review a pending payment; manager cannot approve it',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.checkout();a.pay({...payment,bank:'offline'});const b=a.db.bookings[0];a.close();
  a.login('mg1');a.retryPayment(b.id);assert.equal(a.selection,null);a.login('ad1');a.retryPayment(b.id);a.pay(payment);assert.equal(b.status,'confirmed');assert.match(a.db.audit[0].action,/Payment/);
});
test('admin payment cancellation requires a reason, refunds all seats and audits action',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.checkout();a.pay(payment);const b=a.db.bookings[0];a.login('ad1');
  a.cancelAdminPayment({bid:b.id,reason:' '});assert.equal(b.status,'confirmed');a.cancelAdminPayment({bid:b.id,reason:'Demo bank reversal'});
  assert.equal(b.status,'cancelled');assert.equal(b.refundedAmount,1240);assert.equal(a.db.audit.length,2);
});
test('route deletion is blocked for selected holds and confirmed bookings',()=>{
  const {a,el}=app();a.login('cu1');select(a,el);a.login('ad1');a.routeAction('R1','delete');assert.ok(a.db.routes.find(r=>r.id==='R1'));
});
test('capacity cannot shrink below a held seat',()=>{
  const {a,el}=app();a.login('cu1');select(a,el,['S16']);a.login('ad1');a.submitEdit({rid:'R1',capacity:'4',bus:'Changed',time:'08:00'});
  assert.equal(a.db.routes[0].capacity,16);assert.match(el('#editError').textContent,/Capacity/);
});
