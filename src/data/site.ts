export const img = (name: string, small = false) => `/img/${name}${small ? '-sm' : ''}.webp`

export const contact = {
  phone: '+39 391 340 0095',
  phoneHref: 'tel:+393913400095',
  email: 'info@agriturismobraciami.com',
  address: 'Strada Cimina 21, 01100 Viterbo',
  vat: '02381520564',
  mapsDirections:
    'https://www.google.com/maps/dir/?api=1&destination=Agriturismo+Braciami,+Strada+Cimina+21,+Viterbo',
  mapsEmbed: 'https://maps.google.com/maps?q=Agriturismo%20Braciami%20Viterbo&ll=42.397904,12.1400762&z=14&output=embed',
}

export const links = {
  table: 'https://octotable.com/book/restaurant/546047/booking/new',
  pool: 'https://octotable.com/book/restaurant/1002632/welcome',
  rooms: 'https://book.octorate.com/octobook/site/reservation/index.xhtml?codice=401733',
  room: (id: number) =>
    `https://book.octorate.com/octobook/site/reservation/calendar.xhtml?codice=401733&lang=IT&room=${id}`,
  menuPdf: 'https://www.agriturismobraciami.com/wp-content/uploads/2026/09/MENU-AUTUNNO-2026.pdf',
  instagram: 'https://www.instagram.com/agriturismobraciami/',
  facebook: 'https://www.facebook.com/AgriturismoBraciami/',
  tripadvisor:
    'https://www.tripadvisor.it/Restaurant_Review-g194950-d8428001-Reviews-Agriturismo_Braciami-Viterbo_Province_of_Viterbo_Lazio.html',
  privacy: 'https://www.agriturismobraciami.com/privacy-e-cookie-policy/',
  terms: 'https://www.agriturismobraciami.com/condizioni-generali-di-vendita/',
}

export const rating = { score: '4,3', count: 694, rank: 26, of: 334 }

export type Room = {
  id: string
  name: string
  tag: string
  octorate: number
  price: number
  sqm: number
  guests: number
  beds: string
  blurb: string
  features: string[]
  photos: string[]
}

export const rooms: Room[] = [
  {
    id: 'matrimoniale',
    name: 'Matrimoniale',
    tag: '02',
    octorate: 598144,
    price: 95,
    sqm: 22,
    guests: 2,
    beds: 'Letto matrimoniale',
    blurb: 'Soffitto in legno, pareti a due colori e una stampa vintage sopra il letto. Ognuna ha il suo carattere.',
    features: ['Bagno privato', 'Colazione inclusa', 'Accesso alla piscina'],
    photos: ['matrimoniale-1', 'matrimoniale-4', 'matrimoniale-7', 'matrimoniale-3', 'bagno-1'],
  },
  {
    id: 'tripla',
    name: 'Tripla',
    tag: '04',
    octorate: 595121,
    price: 125,
    sqm: 22,
    guests: 3,
    beds: 'Matrimoniale + singolo',
    blurb: 'Pensata per tre: un letto matrimoniale, un singolo e lo stesso spazio delle doppie.',
    features: ['Bagno privato', 'Colazione inclusa', 'Accesso alla piscina'],
    photos: ['tripla-1', 'tripla-3', 'tripla-2', 'tripla-4', 'bagno-2'],
  },
  {
    id: 'family',
    name: 'Family',
    tag: '06',
    octorate: 598139,
    price: 135,
    sqm: 25,
    guests: 4,
    beds: 'Matrimoniale + letto a castello',
    blurb: 'Il letto a castello vince sempre con i bambini. Voi vi tenete il matrimoniale.',
    features: ['Bagno privato', 'Colazione inclusa', 'Menu bimbi in mezza pensione'],
    photos: ['family-1', 'family-2', 'family-3', 'spazio-comune'],
  },
  {
    id: 'suite',
    name: 'Suite',
    tag: '07',
    octorate: 598143,
    price: 145,
    sqm: 54,
    guests: 2,
    beds: 'Letto a baldacchino',
    blurb: 'Cinquantaquattro metri quadri: baldacchino, salotto, camino e una vasca in cemento e resina.',
    features: ['Camino', 'Vasca in cemento e resina', 'Zona salotto'],
    photos: ['suite-letto', 'suite-2', 'suite-vasca', 'suite-loft', 'suite-5'],
  },
]

export const amenities = [
  { icon: 'ri-wifi-line', label: 'Wi‑fi' },
  { icon: 'ri-temp-cold-line', label: 'Aria condizionata' },
  { icon: 'ri-cup-line', label: 'Macchina da caffè' },
  { icon: 'ri-fridge-line', label: 'Frigobar' },
  { icon: 'ri-tv-2-line', label: 'TV 32"' },
  { icon: 'ri-speaker-2-line', label: 'Speaker bluetooth' },
  { icon: 'ri-t-shirt-air-line', label: 'Phon' },
  { icon: 'ri-drop-line', label: 'Cortesia bagno' },
]

export const stayInfo = [
  {
    title: 'Orari',
    items: [
      'Check-in dalle 14:00 alle 18:00. Avvisateci un’ora prima dell’arrivo.',
      'Check-out entro le 10:30.',
      'Check-in anticipato o posticipato su richiesta: € 15/h.',
      'Late check-out su richiesta: € 50 a camera per 2 ore.',
    ],
  },
  {
    title: 'Colazione e mezza pensione',
    items: [
      'Colazione dolce e salata fatta da noi, dalle 9:00 alle 10:00 in Sala Ash.',
      'Mezza pensione: un pasto al giorno scelto dal menu stagionale. Antipasto, primo o secondo, dolce.',
      'Bambini: due portate dal menu bimbi.',
    ],
  },
  {
    title: 'Piscina salina',
    items: [
      'Aperta circa dal 20 giugno al 7 settembre.',
      'Inclusa dal check-in al check-out. Oltre: € 15 a persona su prenotazione.',
      'Telo piscina: € 5.',
    ],
  },
  {
    title: 'Modifiche e cancellazioni',
    items: [
      'Conferma con pagamento a saldo.',
      'Fino a 15 giorni prima: cambi date, entro 3 mesi.',
      'Fino a 72 ore prima: buono del 30% da usare entro 3 mesi.',
      'Da 71 ore prima: tariffa non rimborsabile.',
    ],
  },
  {
    title: 'Extra',
    items: [
      'Animali: € 15 a soggiorno per la pulizia.',
      'Cambio asciugamani ogni tre giorni, lenzuola ogni settimana.',
      'Riordino extra della camera: € 15.',
    ],
  },
]

export type Experience = {
  title: string
  text: string
  notice: number
  where: 'Braciami' | 'Dintorni'
  partners?: string[]
}

export const experiences: Experience[] = [
  {
    title: 'Pasta fatta in casa con zia Francesca',
    text: 'Fettuccine, lombrichelli, pappardelle, ravioli e gnocchi. Li impasti tu, poi li mangi con il sugo che scegli.',
    notice: 5,
    where: 'Braciami',
  },
  {
    title: 'Workshop floreale',
    text: 'Ghirlande, centrotavola e composizioni con fiori freschi e secchi, con Milvia Botanical Designs.',
    notice: 7,
    where: 'Braciami',
  },
  { title: 'Massaggi', text: 'Trattamenti benessere su richiesta, in struttura.', notice: 5, where: 'Braciami' },
  {
    title: 'Yoga aereo',
    text: 'Pose sospese su un’amaca, guidate da un’istruttrice.',
    notice: 7,
    where: 'Braciami',
  },
  {
    title: 'Pilates all’aria aperta',
    text: 'Sessioni da 45 minuti nel giardino, nei mesi caldi.',
    notice: 7,
    where: 'Braciami',
  },
  {
    title: 'Cantine della Tuscia',
    text: 'Visite e degustazioni dai produttori che trovi nella nostra carta.',
    notice: 5,
    where: 'Dintorni',
    partners: ['Cantina Leonardi', 'Tre Botti', 'Paolo e Noemia d’Amico'],
  },
  {
    title: 'Sport al Lago di Vico',
    text: 'Kayak, tiro con l’arco, MTB, free climbing, ponte tibetano e teleferica.',
    notice: 10,
    where: 'Dintorni',
    partners: ['Green Adventure'],
  },
  { title: 'Pesca sul lago', text: 'Uscite per esperti e principianti.', notice: 7, where: 'Dintorni', partners: ['Bolsena Fishing Adventure'] },
  {
    title: 'E-bike nella Tuscia',
    text: 'Sentieri e borghi con guide MTB certificate.',
    notice: 7,
    where: 'Dintorni',
    partners: ['Tuscia Bike Travel'],
  },
  {
    title: 'Ceramica a Viterbo',
    text: 'Lezioni per coppie e gruppi da Elena, nel laboratorio Lab33 in centro storico.',
    notice: 7,
    where: 'Dintorni',
    partners: ['Ceramiche Lab33'],
  },
  {
    title: 'Terme di Viterbo',
    text: 'Grotta naturale, cascate di acqua sulfurea, trattamenti. Meglio in autunno e inverno.',
    notice: 5,
    where: 'Dintorni',
    partners: ['Terme dei Papi', 'Hotel Salus Terme', 'Therma Oasi', 'Tuscia Terme'],
  },
  {
    title: 'Animali della fattoria',
    text: 'Qualche ora all’aria aperta per i più piccoli, alla Giostra Ecologica.',
    notice: 3,
    where: 'Dintorni',
    partners: ['La Giostra Ecologica'],
  },
]

export const giftCards = [
  {
    name: 'Braceria',
    price: 114,
    text: 'Pranzo o cena per due in braceria.',
    href: 'https://www.agriturismobraciami.com/prodotto/gift-card-braceria/',
    tone: 'from-ember to-flame',
  },
  {
    name: 'Soggiorno',
    price: 149,
    text: 'Una notte per due in agriturismo, colazione inclusa.',
    href: 'https://www.agriturismobraciami.com/prodotto/gift-card-soggiorno/',
    tone: 'from-bottle to-[#3d6b55]',
  },
  {
    name: 'Soggiorno Super',
    price: 189,
    text: 'Una notte per due con la cena in braceria.',
    href: 'https://www.agriturismobraciami.com/prodotto/gift-card/',
    tone: 'from-ash to-soot',
  },
]

export const reviews = [
  {
    author: 'Charmy',
    source: 'Tripadvisor',
    title: 'Braciami... ancora!',
    text: 'All’arrivo l’impressione di un ranch in un’oasi di pace. Super consigliate le empanadas con ragù di cinghiale e le pappardelle, sublimi!',
  },
  {
    author: 'Manuel Bartolomeo',
    source: 'Tripadvisor',
    title: 'Una scoperta fantastica',
    text: 'Gran bella scoperta a 50 minuti da Roma. Cibo letteralmente ottimo, parola di ristoratore.',
  },
  {
    author: 'Girasole81',
    source: 'Tripadvisor',
    title: 'Cielo stellato',
    text: 'La sera abbiamo ammirato un cielo stellato che non vedevamo da anni. Cibo a dir poco ottimo, porzioni abbondanti.',
  },
  {
    author: 'Steele',
    source: 'Tripadvisor',
    title: 'Ottima esperienza',
    text: 'Prodotti a km 0 dei loro allevamenti, salumi e carni davvero buone. Assolutamente consigliato.',
  },
  {
    author: 'Monica C',
    source: 'Tripadvisor',
    title: 'Una giornata in piscina',
    text: 'Consiglio la giornata in piscina con pranzo per chi desidera rilassarsi in un bel posto.',
  },
  {
    author: 'Claudia',
    source: 'Booking',
    title: 'Eccezionale · 10',
    text: 'L’ambiente, lo staff, la cura dei dettagli. Ci dispiace essere stati solo una notte.',
  },
]
