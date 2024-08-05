// * Tipi analiz edip ona göre fonsiyonun çağrıldığı yere tipe denk gelen açıklamayı gönderir.

export const detecType = (type) => {
  switch (type) {
    case "park":
      return "Park Yeri";
    case "home":
      return "Ev";
    case "job":
      return "İş";
    case "goto":
      return "Ziyaret";
    default:
      break;
  }
};
//* local storage güncelleyecek fonksiyon
export const setStorage = (data) => {
  //*veri local gönderme için string çevirme
  const strData = JSON.stringify(data);
  console.log(strData);
  //* localStorage veriyi gönderdik.
  localStorage.setItem("notes", strData);
};

var carIcon = L.icon({
  iconUrl: "./images/car.png",
  iconSize: [50, 60],
});
var homeIcon = L.icon({
  iconUrl: "./images/home-marker.png",
  iconSize: [50, 60],
});
var jobIcon = L.icon({
  iconUrl: "./images/job.png",
  iconSize: [50, 60],
});
var visitIcon = L.icon({
  iconUrl: "./images/visit.png",
  iconSize: [50, 60],
});

export const detecIcon = (type) => {
  switch (type) {
    case "park":
      return carIcon;
    case "job":
      return jobIcon;
    case "home":
      return homeIcon;
    case "goto":
      return visitIcon;
  }
};
