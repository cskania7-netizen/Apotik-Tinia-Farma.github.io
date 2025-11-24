//variabel yg gaboleh diganti nilai/isinya
const medicines = [
  {id:1,name:'Paracetamol 500mg',category:'Analgesik',desc:'Pereda demam & nyeri',price:4500,stock:120},
  {id:2,name:'Amoxicillin 500mg',category:'Antibiotik',desc:'Antibiotik spektrum luas',price:12000,stock:40},
  {id:3,name:'Vitamin C 1000mg',category:'Suplemen',desc:'Meningkatkan daya tahan',price:8000,stock:200},
  {id:4,name:'Tetes Telinga Pediatrik',category:'Pediatrik',desc:'Untuk infeksi ringan',price:15000,stock:25},
  {id:5,name:'Antasida Chewable',category:'Gastro',desc:'Redakan maag',price:6000,stock:90},
  {id:6,name:'Salep Luka',category:'Topikal',desc:'Antiseptik untuk kulit',price:7000,stock:60},
  {id:7,name:'OBH Combi 60ml',category:'Cough',desc:'Obat batuk & flu',price:11000,stock:75},
  {id:8,name:'Ksiol 50mg (contoh resep)',category:'Obat Keras',desc:'Harus dengan resep',price:45000,stock:10}
];

//buat variabel yg nilainya bisa berubah
let cart = [];
const tbody = document.querySelector('#medTableBody'); //document buat ngehubungin js dgn html
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');

//membuat blok kode yg bisa dijalankan kapan aj
function formatRupiah(num){ //formatrupiah buat ngubah angka ke format rupiah
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

//untuk menampilkan daftar obat ke html
function renderTable(){
  const q = (searchInput.value||'').toLowerCase();
  const sortBy = sortSelect.value;

  let list = medicines.filter(m => (m.name + ' ' + m.category + ' ' + m.desc).toLowerCase().includes(q));

  if(sortBy==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  if(sortBy==='price') list.sort((a,b)=>a.price - b.price);
  if(sortBy==='stock') list.sort((a,b)=>b.stock - a.stock);

  tbody.innerHTML = ''; //utk mengisi isi html
  list.forEach(m => { //foreach utk looping daftar obat
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.name}</td>
      <td>${m.category}</td>
      <td class="muted">${m.desc}</td>
      <td>${formatRupiah(m.price)}</td>
      <td>${m.stock}</td>
      <td><button class="btn" onclick="addToCart(${m.id})">Tambah</button></td>`;
    tbody.appendChild(tr);
  });
}

//kepanggil klo user menambahkan obat
function addToCart(id){
  const med = medicines.find(m=>m.id===id);
  //percabangan logika kak
  if(!med) return;

  const existing = cart.find(c=>c.id===id);
  if(existing){
    if(existing.qty < med.stock) existing.qty++;
    else alert('Stok tidak cukup'); //alert itu pop up bawaan
  } else {
    cart.push({id:med.id,name:med.name,price:med.price,qty:1});
  }

  renderCart(); //menampilkan isi keranjang
}

function renderCart(){
  const cartList = document.getElementById('cartList'); 
  cartList.innerHTML = '';

  if(cart.length === 0){
    cartList.innerHTML = '<div class="muted">Belum ada item di keranjang.</div>';
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong> 
        <div class="muted">${formatRupiah(item.price)} x ${item.qty}</div>
      </div>
      <div>
        <button class="btn" onclick="removeOne(${item.id})">-</button> 
        <button class="btn" onclick="addToCart(${item.id})">+</button>
      </div>`; // ${...} utk melakukan string yg bisa utk variabel
    cartList.appendChild(div);
  });

  const total = cart.reduce((s,i)=>s + i.price * i.qty,0);
  const summary = document.createElement('div');
  summary.style.marginTop = '12px';
  summary.innerHTML = `<strong>Total: ${formatRupiah(total)}</strong>`;
  cartList.appendChild(summary);
}

//ngurangin jumlah item obat yg ud ditambahin
function removeOne(id){
  const idx = cart.findIndex(c=>c.id===id);
  if(idx===-1) return;

  cart[idx].qty--;
  if(cart[idx].qty===0) cart.splice(idx,1);
  renderCart();
}

//hapus semua isi keranjang
function clearCart(){
  cart = [];
  renderCart();
}

//simulasi pembayaran
function checkout(){
  if(cart.length === 0){
    alert('Keranjang kosong. Tambahkan produk terlebih dahulu.');
    return;
  }

  const total = cart.reduce((s,i)=>s + i.price * i.qty,0);
  alert('Terima kasih! Total pembayaran: ' + formatRupiah(total) + '. (Demo)');
  clearCart();
}

//ketika user milih salah satu kategori ntar tabel akan ke render ulang dan nampilin kotak pencarian dengan kategori itu
function filterCategory(cat){ searchInput.value = cat; renderTable(); }
//mengembalikan daftar obat seperti semula
function resetFilter(){ searchInput.value=''; renderTable(); }

//utk mendeteksi aksi/apa yg sedang dilakukan user
searchBtn.addEventListener('click',()=>renderTable());
searchInput.addEventListener('keypress',e=>{ if(e.key==='Enter') renderTable(); });

//utk form hubungi kami
function submitContact(){
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();

  if(!name || !email || !msg){
    alert('Isi semua kolom.');
    return;
  }

  alert('Pesan terkirim! Terima kasih, ' + name + '. (Demo)');
  document.getElementById('name').value='';
  document.getElementById('email').value='';
  document.getElementById('message').value='';
}

// init awal
document.getElementById('year').textContent = new Date().getFullYear();
renderCart();
renderTable();

