import { RivalryRecord } from './rivalriesData';

export const ADDITIONAL_RIVALRIES: RivalryRecord[] = [
  {
    id: 'eternal_derby_romania',
    name: { it: 'Eternul Derby (Bucarest)', en: 'Eternal Derby (Romania)' },
    leagueRank: 33,
    leagueName: 'Liga I',
    country: { it: 'Romania', en: 'Romania' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'FCSB (Steaua)',
      shortCode: 'FCS',
      wikidataId: 'Q179658',
      primaryColor: '#E30613',
      secondaryColor: '#0038A8',
      pattern: 'stripes',
      stadiumName: 'Arena Națională',
      city: 'Bucarest',
      lat: 44.4372,
      lng: 26.1525,
      capacity: 55634
    },
    clubB: {
      name: 'FC Dinamo București',
      shortCode: 'DIN',
      wikidataId: 'Q204237',
      primaryColor: '#E30613',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Stadionul Arcul de Triumf',
      city: 'Bucarest',
      lat: 44.4689,
      lng: 26.0744,
      capacity: 8207
    },
    pRaw: 186,
    pRawSource: 'Wikipedia Infobox — Eternal derby (Romania)',
    consecutiveDecades: 9,
    firstYear: 1948,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_liga_i',
    winsA: 68,
    draws: 58,
    winsB: 60,
    history: {
      it: 'Nato nel 1948 nel pieno del regime comunista rumeno tra il club dell\'Esercito (Steaua/FCSB) e quello del Ministero degli Interni (Dinamo Bucarest).',
      en: 'Born in 1948 between the club of the Romanian Army (Steaua/FCSB) and the club of the Ministry of Internal Affairs (Dinamo București).'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_eterno_(Romania)',
      en: 'https://en.wikipedia.org/wiki/Eternal_derby_(Romania)'
    }
  },
  {
    id: 'holy_war_krakow',
    name: { it: 'Święta Wojna (Guerra Santa di Cracovia)', en: 'Holy War (Kraków)' },
    leagueRank: 23,
    leagueName: 'Ekstraklasa',
    country: { it: 'Polonia', en: 'Poland' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Wisła Kraków',
      shortCode: 'WIS',
      wikidataId: 'Q190943',
      primaryColor: '#E30613',
      secondaryColor: '#004B87',
      pattern: 'solid',
      stadiumName: 'Stadion Miejski im. Henryka Reymana',
      city: 'Cracovia',
      lat: 50.0636,
      lng: 19.9119,
      capacity: 33130
    },
    clubB: {
      name: 'KS Cracovia',
      shortCode: 'CRA',
      wikidataId: 'Q240741',
      primaryColor: '#E30613',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Stadion Cracovii im. Józefa Piłsudskiego',
      city: 'Cracovia',
      lat: 50.0581,
      lng: 19.9206,
      capacity: 15114
    },
    pRaw: 204,
    pRawSource: 'Wikipedia Infobox — Holy War (Kraków)',
    consecutiveDecades: 12,
    firstYear: 1908,
    lastYear: 2022,
    lastYearSource: 'infobox_2022_ekstraklasa',
    winsA: 91,
    draws: 49,
    winsB: 64,
    history: {
      it: 'Il più antico derby della Polonia (1906/1908). I due stadi di Cracovia sono separati unicamente dal prato del parco cittadino Błonia (meno di 700 metri in linea d\'aria).',
      en: 'Poland\'s oldest football derby. The two stadiums in Kraków sit on opposite sides of the Błonia Park meadow, less than 700 meters apart.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Cracovia',
      en: 'https://en.wikipedia.org/wiki/Holy_War_(Krak%C3%B3w)'
    }
  },
  {
    id: 'copenhagen_derby',
    name: { it: 'Slaget om København (Derby di Copenaghen)', en: 'Copenhagen Derby' },
    leagueRank: 16,
    leagueName: 'Superligaen',
    country: { it: 'Danimarca', en: 'Denmark' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'FC København',
      shortCode: 'FCK',
      wikidataId: 'Q188430',
      primaryColor: '#FFFFFF',
      secondaryColor: '#0038A8',
      pattern: 'solid',
      stadiumName: 'Parken Stadium',
      city: 'Copenaghen',
      lat: 55.7028,
      lng: 12.5722,
      capacity: 38065
    },
    clubB: {
      name: 'Brøndby IF',
      shortCode: 'BIF',
      wikidataId: 'Q211906',
      primaryColor: '#FFCC00',
      secondaryColor: '#003399',
      pattern: 'solid',
      stadiumName: 'Brøndby Stadion',
      city: 'Brøndby (Copenaghen)',
      lat: 55.6486,
      lng: 12.4186,
      capacity: 28000
    },
    pRaw: 123,
    pRawSource: 'Wikipedia Infobox — Copenhagen Derby',
    consecutiveDecades: 4,
    firstYear: 1992,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_superligaen',
    winsA: 60,
    draws: 29,
    winsB: 34,
    history: {
      it: 'La sfida più accesa della Scandinavia per affluenza, nata nel 1992 con la fondazione dell\'FC København nel centro elegante di Østerbro in opposizione ai sobborghi operai occidentali di Brøndby.',
      en: 'Scandinavia\'s fiercest modern rivalry by attendance, born in 1992 when inner-city FC Copenhagen was formed in affluent Østerbro to challenge working-class suburban powerhouse Brøndby IF.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/New_Firm_(Danimarca)',
      en: 'https://en.wikipedia.org/wiki/Copenhagen_Derby'
    }
  },
  {
    id: 'zurich_derby',
    name: { it: 'Zürcher Derby (Derby di Zurigo)', en: 'Zürich Derby' },
    leagueRank: 17,
    leagueName: 'Swiss Super League',
    country: { it: 'Svizzera', en: 'Switzerland' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Grasshopper Club Zürich',
      shortCode: 'GCZ',
      wikidataId: 'Q201360',
      primaryColor: '#004B87',
      secondaryColor: '#FFFFFF',
      pattern: 'halves',
      stadiumName: 'Stadion Letzigrund',
      city: 'Zurigo',
      lat: 47.3828,
      lng: 8.5042,
      capacity: 26104
    },
    clubB: {
      name: 'FC Zürich',
      shortCode: 'FCZ',
      wikidataId: 'Q206309',
      primaryColor: '#FFFFFF',
      secondaryColor: '#0055A4',
      pattern: 'solid',
      stadiumName: 'Stadion Letzigrund',
      city: 'Zurigo',
      lat: 47.3825,
      lng: 8.5038,
      capacity: 26104
    },
    pRaw: 286,
    pRawSource: 'Wikipedia Infobox — Zürich derby',
    consecutiveDecades: 13,
    firstYear: 1897,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_swiss_super_league',
    winsA: 121,
    draws: 60,
    winsB: 105,
    history: {
      it: 'Inaugurato nel 1897, oppone il club più titolato di Svizzera (Grasshoppers, storicamente legato all\'élite studentesca e finanziaria) all\'FC Zürich, espressione storica dei quartieri operai cittadini.',
      en: 'Inaugurated in 1897, it pits Switzerland\'s record champions Grasshoppers—historically tied to university and financial elites—against FC Zürich, rooted in the city\'s working-class districts.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Zurigo',
      en: 'https://en.wikipedia.org/wiki/Z%C3%BCrich_derby'
    }
  },
  {
    id: 'superclasico_chileno',
    name: { it: 'Superclásico del Fútbol Chileno', en: 'Chilean Superclásico' },
    leagueRank: 39,
    leagueName: 'Primera División Chile',
    country: { it: 'Cile', en: 'Chile' },
    continent: 'Sud America',
    type: 'city',
    clubA: {
      name: 'Colo-Colo',
      shortCode: 'COL',
      wikidataId: 'Q207373',
      primaryColor: '#FFFFFF',
      secondaryColor: '#000000',
      pattern: 'solid',
      stadiumName: 'Estadio Monumental David Arellano',
      city: 'Santiago del Cile',
      lat: -33.5067,
      lng: -70.6058,
      capacity: 47347
    },
    clubB: {
      name: 'Universidad de Chile',
      shortCode: 'UCH',
      wikidataId: 'Q739952',
      primaryColor: '#0038A8',
      secondaryColor: '#E30613',
      pattern: 'solid',
      stadiumName: 'Estadio Nacional Julio Martínez Prádanos',
      city: 'Santiago del Cile',
      lat: -33.4653,
      lng: -70.6106,
      capacity: 48665
    },
    pRaw: 245,
    pRawSource: 'Wikipedia Infobox — Chilean Superclásico',
    consecutiveDecades: 10,
    firstYear: 1938,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_primera_chile',
    winsA: 110,
    draws: 71,
    winsB: 64,
    history: {
      it: 'La sfida che ferma il Cile dal 1938 tra il "Cacique" (Colo-Colo, il club più popolare e unico campione cileno della Libertadores) e il "Romántico Viajero" nato nelle aule dell\'Università del Cile.',
      en: 'The match that stops Chile since 1938 between "El Cacique" (Colo-Colo, Chile\'s most decorated club and sole Libertadores winner) and Universidad de Chile.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Supercl%C3%A1sico_(Cile)',
      en: 'https://en.wikipedia.org/wiki/Chilean_Supercl%C3%A1sico'
    }
  },
  {
    id: 'super_match_korea',
    name: { it: 'Super Match (Corea del Sud)', en: 'Super Match (FC Seoul–Suwon)' },
    leagueRank: 30,
    leagueName: 'K League 1',
    country: { it: 'Corea del Sud', en: 'South Korea' },
    continent: 'Asia',
    type: 'regional',
    clubA: {
      name: 'FC Seoul',
      shortCode: 'FCS',
      wikidataId: 'Q482449',
      primaryColor: '#B5191D',
      secondaryColor: '#000000',
      pattern: 'stripes',
      stadiumName: 'Seoul World Cup Stadium',
      city: 'Seul',
      lat: 37.5683,
      lng: 126.8972,
      capacity: 66704
    },
    clubB: {
      name: 'Suwon Samsung Bluewings',
      shortCode: 'SSB',
      wikidataId: 'Q483107',
      primaryColor: '#004A99',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Suwon World Cup Stadium (Big Bird)',
      city: 'Suwon',
      lat: 37.2864,
      lng: 127.0369,
      capacity: 44031
    },
    pRaw: 103,
    pRawSource: 'Wikipedia Infobox — Super Match',
    consecutiveDecades: 4,
    firstYear: 1996,
    lastYear: 2023,
    lastYearSource: 'infobox_2023_kleague_1',
    winsA: 42,
    draws: 25,
    winsB: 36,
    history: {
      it: 'Il classico del calcio sudcoreano, nato anche come duello industriale tra i due giganti tecnologici del Paese: LG Group (FC Seoul) e Samsung Group (Suwon Bluewings).',
      en: 'South Korea\'s premier football rivalry, historically fueled by corporate competition between tech giants LG Group (FC Seoul) and Samsung Group (Suwon Bluewings).'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/K_League_1',
      en: 'https://en.wikipedia.org/wiki/Super_Match'
    }
  },
  {
    id: 'sydney_derby',
    name: { it: 'Sydney Derby', en: 'Sydney Derby' },
    leagueRank: 48,
    leagueName: 'A-League Men',
    country: { it: 'Australia', en: 'Australia' },
    continent: 'Oceania',
    type: 'city',
    clubA: {
      name: 'Sydney FC',
      shortCode: 'SYD',
      wikidataId: 'Q330148',
      primaryColor: '#75AADB',
      secondaryColor: '#002B5C',
      pattern: 'solid',
      stadiumName: 'Allianz Stadium (Moore Park)',
      city: 'Sydney (East)',
      lat: -33.8892,
      lng: 151.2253,
      capacity: 42500
    },
    clubB: {
      name: 'Western Sydney Wanderers',
      shortCode: 'WSW',
      wikidataId: 'Q1195535',
      primaryColor: '#E30613',
      secondaryColor: '#000000',
      pattern: 'hoops',
      stadiumName: 'CommBank Stadium',
      city: 'Sydney (Parramatta)',
      lat: -33.8081,
      lng: 150.9994,
      capacity: 30000
    },
    pRaw: 40,
    pRawSource: 'Wikipedia Infobox — Sydney Derby',
    consecutiveDecades: 2,
    firstYear: 2012,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_aleague',
    winsA: 19,
    draws: 9,
    winsB: 12,
    history: {
      it: 'Riflette la celebre linea di faglia geografica e socio-culturale di Sydney ("Latte Line") tra le spiagge benestanti dell\'Est (Sydney FC) e i sobborghi multiculturali e operai dell\'Ovest (Parramatta / Wanderers).',
      en: 'Reflects Sydney\'s socio-cultural "Latte Line" fault between the affluent eastern harbor suburbs (Sydney FC) and the multicultural working-class west in Parramatta (Wanderers).'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Sydney_Derby',
      en: 'https://en.wikipedia.org/wiki/Sydney_Derby'
    }
  }
];
