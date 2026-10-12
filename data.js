// Tüm sayfalardan erişilen global veri.
// ingredients ve amounts dizileri aynı sırada eşleşir; amounts: [miktar, birim] (basePortion için).
const recipes = [
  {
    id: 1,
    name: "Salçalı Makarna",
    image: "images/salcali-makarna.jpg",
    
    tags: ["Akşam", "Öğle", "Tek Tencere", "10 Dakika"],
    ingredients: ["Makarna", "Salça", "Sıvı Yağ"],
    amounts: [[200, "g"], [2, "yemek kaşığı"], [2, "yemek kaşığı"]],
    basePortion: 2,
    steps: ["Suyu kaynat ve tuzla", "Makarnayı at, 9 dakika haşla", "Tavada yağda salçayı kavur", "Süzdüğün makarnayı salçayla karıştır"]
  },
  {
    id: 2,
    name: "Menemen",
    image: "images/menemen.jpg",
    tags: ["Sabah", "10 Dakika", "Tek Tavada"],
    ingredients: ["Yumurta", "Domates", "Biber", "Sıvı Yağ"],
    amounts: [[3, "adet"], [2, "adet"], [2, "adet"], [1, "yemek kaşığı"]],
    basePortion: 2,
    steps: ["Biberleri doğrayıp yağda soteler", "Rendelenmiş domatesi ekle, suyunu çekene kadar pişir", "Yumurtaları kır ve hafifçe karıştır", "Tuz ekle, yumurtalar kıvam alınca ocaktan al"]
  },
  {
    id: 3,
    name: "Mercimek Çorbası",
    image: "images/mercimek-corbasi.jpg",
    tags: ["Akşam", "Öğle", "Tek Tencere", "Vejetaryen", "Sağlıklı & Pratik"],
    ingredients: ["Kırmızı Mercimek", "Soğan", "Havuç", "Sıvı Yağ", "Salça"],
    amounts: [[1, "su bardağı"], [1, "adet"], [1, "adet"], [2, "yemek kaşığı"], [1, "yemek kaşığı"]],
    basePortion: 4,
    steps: ["Soğan ve havucu küçük doğrayıp yağda kavur", "Salçayı ve yıkanmış mercimeği ekle", "6 su bardağı su ekleyip 25 dakika kaynat", "Blenderdan geçir, tuz ve baharat ekle"]
  },
  {
    id: 4,
    image: "images/muzlu-yulaf.jpg",
    name: "Muzlu Yulaf Lapası",
    tags: ["Sabah", "10 Dakika", "Vejetaryen", "Sağlıklı & Pratik"],
    ingredients: ["Yulaf", "Süt", "Muz"],
    amounts: [[50, "g"], [200, "ml"], [1, "adet"]],
    basePortion: 1,
    steps: ["Yulafı ve sütü küçük bir tencerede ısıt", "Kısık ateşte 5 dakika karıştırarak pişir", "Üzerine dilimlenmiş muzu ekle"]
  },
  {
    id: 5,
    image: "images/tavuklu-pilav.jpg",
    name: "Tavuklu Pilav",
    tags: ["Akşam", "Öğle", "Protein", "Tek Tencere", "Sağlıklı & Pratik"],
    ingredients: ["Pirinç", "Tavuk Göğsü", "Soğan", "Sıvı Yağ"],
    amounts: [[1.5, "su bardağı"], [250, "g"], [1, "adet"], [2, "yemek kaşığı"]],
    basePortion: 3,
    steps: ["Tavuğu küp küp doğra, yağda mühürle", "Soğanı ekle, pembeleşene kadar kavur", "Yıkanmış pirinci ekle, 2 dakika çevir", "Pirincin 1,5 katı sıcak su ekle, kısık ateşte 15 dakika demle"]
  },
  {
    id: 6,
    name: "Kuru Fasulye",
    image: "images/kuru-fasulye.jpg",
    tags: ["Akşam", "Öğle", "Tek Tencere", "Vejetaryen", "Doyurucu"],
    ingredients: ["Kuru Fasulye", "Soğan", "Salça", "Sıvı Yağ"],
    amounts: [[250, "g"], [1, "adet"], [1, "yemek kaşığı"], [2, "yemek kaşığı"]],
    basePortion: 4,
    steps: ["Fasulyeyi bir gece önceden suda beklet", "Soğanı ve salçayı yağda kavur", "Fasulyeyi ve suyunu ekle", "Düdüklüde 25 dakika pişir, tuzla"]
  },
  {
    id: 7,
    name: "Soğanlı Patates Yemeği",
    image: "images/soganli-patates.jpg",
    tags: ["Akşam", "Tek Tencere", "Vejetaryen", "Doyurucu"],
    ingredients: ["Patates", "Soğan", "Salça", "Sıvı Yağ"],
    amounts: [[3, "adet"], [1, "adet"], [1, "yemek kaşığı"], [2, "yemek kaşığı"]],
    basePortion: 3,
    steps: ["Patatesleri küp küp doğra", "Soğanı yağda kavur, salçayı ekle", "Patatesleri ekleyip karıştır", "Üstünü geçecek kadar su ekle, 20 dakika pişir"]
  },
  {
    id: 8,
    image: "images/peynirli-omlet.jpg",
    name: "Peynirli Omlet",
    tags: ["Sabah", "10 Dakika", "Tek Tavada", "Sağlıklı & Pratik"],
    ingredients: ["Yumurta", "Beyaz Peynir", "Sıvı Yağ"],
    amounts: [[3, "adet"], [50, "g"], [1, "yemek kaşığı"]],
    basePortion: 2,
    steps: ["Yumurtaları çırp, ezilmiş peyniri ekle", "Tavayı yağla ısıt", "Karışımı dök, kısık ateşte pişir", "Ortadan katla ve servis et"]
  },
  {
    id: 9,
    name: "Nohutlu Salata",
    image: "images/nohutlu-salata.jpg",
    tags: ["Öğle", "10 Dakika", "Vejetaryen", "Pişirmesiz", "Sağlıklı & Pratik"],
    ingredients: ["Haşlanmış Nohut", "Domates", "Soğan", "Limon"],
    amounts: [[200, "g"], [2, "adet"], [1, "adet"], [1, "adet"]],
    basePortion: 2,
    steps: ["Nohudu süzüp kaseye al", "Domates ve soğanı doğra", "Limon sıkıp tuz ekle", "İyice karıştır, 5 dakika dinlendir"]
  },
  {
    id: 10,
    name: "Kıymalı Makarna",
    image: "images/kiymali-makarna.jpg",
    tags: ["Akşam", "Protein", "Tek Tencere", "Doyurucu"],
    ingredients: ["Makarna", "Kıyma", "Soğan", "Salça"],
    amounts: [[300, "g"], [200, "g"], [1, "adet"], [1, "yemek kaşığı"]],
    basePortion: 3,
    steps: ["Soğanı ve kıymayı kendi suyunda kavur", "Salçayı ekle, birkaç dakika çevir", "Makarnayı haşlayıp süz", "Kıymalı sosla karıştır"]
  }
];

// bilgi.html için temel gıdalar (100 g başına değerler).
const foods = [
  { name: "Yumurta", calories: 143, protein: 12.6 },
  { name: "Yulaf", calories: 389, protein: 16.9 },
  { name: "Makarna", calories: 371, protein: 13 },
  { name: "Tavuk Göğsü", calories: 165, protein: 31 },
  { name: "Kırmızı Mercimek", calories: 352, protein: 24.6 },
  { name: "Kuru Fasulye", calories: 337, protein: 21 },
  { name: "Nohut", calories: 364, protein: 19 },
  { name: "Pirinç", calories: 365, protein: 7 },
  { name: "Patates", calories: 77, protein: 2 },
  { name: "Süt", calories: 61, protein: 3.2 },
  { name: "Beyaz Peynir", calories: 264, protein: 14 },
  { name: "Muz", calories: 89, protein: 1.1 }
];
