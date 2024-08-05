//
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { detecIcon, detecType, setStorage } from "./helpers.js";
// ! HTML gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");
console.log(list);

// ! Olay izleyicileri
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

//! ortak kullanm alanı
var map;
var layerGroup = [];
var notes = JSON.parse(localStorage.getItem("notes")) || [];
var coords = [];
/* kişinin konumunu almamız lazım
 windon.navigation.geoLocation.getCurrentPosition ile alıyoruz.
 bizden iki oarametre istiyor.
 1. konuma izin verince çalıştırılacak olan fonksiyon
 2. konuma izin verilmeyince çalıştırılacak fonksiyon.
*/

// !konumu iznini kullanıcıdan alma
navigator.geolocation.getCurrentPosition(loadMap, errorFunction);
//! konum izni verilmezse
function errorFunction() {
  console.log("hata");
}

//! haritaya tıklanınca çalışır.
function onMapClick(e) {
  // haritaya tıklandığında form bileşenini display özelliğini flex yaptık.
  form.style.display = "flex";
  //haritada tıkladığımız yerin kordinatlarını coords dizisi içerisine aktardık.
  console.log(e); //latlng içerisindeki lat ve lng değerlerini görmek için
  coords = [e.latlng.lat, e.latlng.lng];
  console.log("kordinatlar:" + coords);
}
//! konum izni verilincef
// *kullanıcının konumuna göre haritayı ekrana aktarır.
//bunun içerisine yapılacak fonksiyonlar çağırılır.Ana fonksiyonlar dışarıda tanımlanır.
function loadMap(e) {
  //* e ile getCurrentPosition içinden değerler gelir ve buradan bize lazım olan coords içindeki latitude ve longitude değerlerini dinamik olarak ekleyeceğiz

  //   console.log(e); bununla enlem boylamı kontrol ettik

  //* 1.Haritanın kurulumu
  map = L.map("map").setView([e.coords.latitude, e.coords.longitude], 10);

  L.control;
  //* 2.Haritanın nasıl gözükeceğini belirler.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  //*3.Harita da ekrana basılacak imleçleri tutacağımız katman
  layerGroup = L.layerGroup().addTo(map);

  //*localden gelen notesları listeleme
  renderNoteList(notes);

  //* haritada tıklanma olunca çalışacak fonksiyon
  map.on("click", onMapClick);
}

function renderMarker(item) {
  //*marker oluşturur
  L.marker(item.coords, { icon: detecIcon(item.status) })
    .addTo(layerGroup) //imleçlerin olduğu katmana ekler
    .bindPopup(`${item.desc}`); //üzerine tıklanınca açılacak popup ekleme
}

function handleSubmit(e) {
  e.preventDefault();
  console.log(e); //buradan form gönder yapılınca olay izleyiciden gelen değerleri görmek için baktık
  const desc = e.target[0].value; //formun içerisindeki text değerini alma
  const date = e.target[1].value; //formun içerisindeki date değerini alma
  const status = e.target[2].value; //formun içerisindeki select yapısının değerini alma
  //console.log(desc, date, status);
  notes.push({
    id: uuidv4(),
    desc,
    date,
    status,
    coords,
  });

  //* local storage güncelleme
  setStorage(notes);

  //*renderNoteList fonksiyonuna parametre olarak notes dizisini gönderdik.
  renderNoteList(notes);

  //form gönderildiğinde kapat
  form.style.display = "none";
}

//* Ekrana notları aktaracak fonksiyon
function renderNoteList(item) {
  console.log(item);
  //*notlar (list) alanını temizler
  list.innerHTML = "";
  //markerları temizler
  layerGroup.clearLayers();
  //*herbir not için li etiketi oluşturur ve içerisini günceller.
  item.forEach((item) => {
    const listElement = document.createElement("li"); //* li etiketi oluşturur
    listElement.dataset.id = item.id; //*li etiketine data id özelliği ekleme

    listElement.innerHTML = `
            <div>
              <p>${item.desc}</p>
              <p><span>Tarih:</span>${item.date}</p>
              <p><span>Durum:</span>${detecType(item.status)}</p>
            </div>
            <i class="bi bi-x" id="delete"></i>
            <i class="bi bi-airplane-fill" id="fly"></i>
    `;
    //ilk parametre nereye ekleneceği, ikinci neyi ekleyeceğini istiyor.
    list.insertAdjacentElement("afterbegin", listElement);

    renderMarker(item);
  });
}
// *notes alanında tıklanma olayını izler
function handleClick(e) {
  //güncellenecek elemanın idsini öğrenmek için parentElement yöntemini kullandık.
  const id = e.target.parentElement.dataset.id;
  if (e.target.id === "delete") {
    //*idsini bildiğimiz elemanı diziden filter ile kaldırdık.
    notes = notes.filter((note) => note.id != id);
    setStorage(notes); //localstorage  güncelle
    renderNoteList(notes); //ekranı günceller
  }
  if (e.target.id === "fly") {
    const note = notes.find((note) => note.id == id);
    map.flyTo(note.coords); //*haritayı bulduğumuz elemana yönlendirmesi için kullandık.
  }
}
