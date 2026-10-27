export type Continent = 'Europa' | 'Sud America' | 'Nord America' | 'Asia' | 'Africa' | 'Oceania';
export type RivalryType = 'city' | 'regional' | 'national';

export interface OptaLeague {
  rank: number;
  id: string;
  name: string;
  country: { it: string; en: string };
  continent: Continent;
  optaRating: number; // 0 to 100 scale from Opta Power Rankings (Sept 2025 snapshot)
}

export interface ClubInfo {
  name: string;
  shortCode: string;
  wikidataId: string;
  primaryColor: string;
  secondaryColor: string;
  pattern: 'stripes' | 'halves' | 'diagonal' | 'solid' | 'hoops';
  stadiumName: string;
  city: string;
  lat: number;
  lng: number;
  capacity: number;
}

export interface RivalryRecord {
  id: string;
  name: { it: string; en: string };
  leagueRank: number;
  leagueName: string;
  country: { it: string; en: string };
  continent: Continent;
  type: RivalryType;
  clubA: ClubInfo;
  clubB: ClubInfo;
  pRaw: number; // Verified total official matches
  pRawSource: string; // Explicit source citation
  consecutiveDecades: number; // M: verified consecutive decades with >=1 official match
  firstYear: number;
  lastYear: number;
  lastYearSource: string; // Never "assumed_ongoing_*"
  winsA: number;
  draws: number;
  winsB: number;
  history: {
    it: string;
    en: string;
  };
  wikipediaUrl: {
    it: string;
    en: string;
  };
}

export interface ExcludedRecord {
  id: string;
  wikipediaTitle: string;
  clubsMentioned: string;
  reasonCode: 'SINGLE_MATCH_EVENT' | 'UNVERIFIED_LAST_YEAR' | 'NON_DOMESTIC_EXHIBITION' | 'DEFUNCT_INCOMPLETE_H2H';
  auditDetail: {
    it: string;
    en: string;
  };
  pRawMisattributed?: string;
}

export const OPTA_LEAGUES: OptaLeague[] = [
  { rank: 1, id: 'eng_1', name: 'Premier League', country: { it: 'Inghilterra', en: 'England' }, continent: 'Europa', optaRating: 100.0 },
  { rank: 2, id: 'ita_1', name: 'Serie A', country: { it: 'Italia', en: 'Italy' }, continent: 'Europa', optaRating: 96.4 },
  { rank: 3, id: 'esp_1', name: 'La Liga', country: { it: 'Spagna', en: 'Spain' }, continent: 'Europa', optaRating: 95.8 },
  { rank: 4, id: 'ger_1', name: 'Bundesliga', country: { it: 'Germania', en: 'Germany' }, continent: 'Europa', optaRating: 94.9 },
  { rank: 5, id: 'fra_1', name: 'Ligue 1', country: { it: 'Francia', en: 'France' }, continent: 'Europa', optaRating: 91.2 },
  { rank: 6, id: 'bra_1', name: 'Brasileirão Série A', country: { it: 'Brasile', en: 'Brazil' }, continent: 'Sud America', optaRating: 88.7 },
  { rank: 7, id: 'por_1', name: 'Primeira Liga', country: { it: 'Portogallo', en: 'Portugal' }, continent: 'Europa', optaRating: 87.5 },
  { rank: 8, id: 'ned_1', name: 'Eredivisie', country: { it: 'Paesi Bassi', en: 'Netherlands' }, continent: 'Europa', optaRating: 86.4 },
  { rank: 9, id: 'arg_1', name: 'Liga Profesional', country: { it: 'Argentina', en: 'Argentina' }, continent: 'Sud America', optaRating: 85.9 },
  { rank: 10, id: 'bel_1', name: 'Pro League', country: { it: 'Belgio', en: 'Belgium' }, continent: 'Europa', optaRating: 84.8 },
  { rank: 11, id: 'eng_2', name: 'EFL Championship', country: { it: 'Inghilterra', en: 'England' }, continent: 'Europa', optaRating: 83.9 },
  { rank: 12, id: 'tur_1', name: 'Süper Lig', country: { it: 'Turchia', en: 'Turkey' }, continent: 'Europa', optaRating: 83.1 },
  { rank: 13, id: 'usa_1', name: 'Major League Soccer', country: { it: 'USA / Canada', en: 'USA / Canada' }, continent: 'Nord America', optaRating: 82.5 },
  { rank: 14, id: 'mex_1', name: 'Liga MX', country: { it: 'Messico', en: 'Mexico' }, continent: 'Nord America', optaRating: 82.0 },
  { rank: 15, id: 'cze_1', name: 'Chance Liga', country: { it: 'Rep. Ceca', en: 'Czechia' }, continent: 'Europa', optaRating: 80.8 },
  { rank: 16, id: 'den_1', name: 'Superligaen', country: { it: 'Danimarca', en: 'Denmark' }, continent: 'Europa', optaRating: 80.2 },
  { rank: 17, id: 'sui_1', name: 'Swiss Super League', country: { it: 'Svizzera', en: 'Switzerland' }, continent: 'Europa', optaRating: 79.5 },
  { rank: 18, id: 'aut_1', name: 'Austrian Bundesliga', country: { it: 'Austria', en: 'Austria' }, continent: 'Europa', optaRating: 79.1 },
  { rank: 19, id: 'gre_1', name: 'Super League Greece', country: { it: 'Grecia', en: 'Greece' }, continent: 'Europa', optaRating: 78.6 },
  { rank: 20, id: 'sco_1', name: 'Scottish Premiership', country: { it: 'Scozia', en: 'Scotland' }, continent: 'Europa', optaRating: 78.2 },
  { rank: 21, id: 'jpn_1', name: 'J1 League', country: { it: 'Giappone', en: 'Japan' }, continent: 'Asia', optaRating: 77.8 },
  { rank: 22, id: 'nor_1', name: 'Eliteserien', country: { it: 'Norvegia', en: 'Norway' }, continent: 'Europa', optaRating: 77.1 },
  { rank: 23, id: 'pol_1', name: 'Ekstraklasa', country: { it: 'Polonia', en: 'Poland' }, continent: 'Europa', optaRating: 76.5 },
  { rank: 24, id: 'cro_1', name: 'HNL', country: { it: 'Croazia', en: 'Croatia' }, continent: 'Europa', optaRating: 75.9 },
  { rank: 25, id: 'sau_1', name: 'Saudi Pro League', country: { it: 'Arabia Saudita', en: 'Saudi Arabia' }, continent: 'Asia', optaRating: 75.4 },
  { rank: 26, id: 'swe_1', name: 'Allsvenskan', country: { it: 'Svezia', en: 'Sweden' }, continent: 'Europa', optaRating: 74.8 },
  { rank: 27, id: 'col_1', name: 'Categoría Primera A', country: { it: 'Colombia', en: 'Colombia' }, continent: 'Sud America', optaRating: 74.2 },
  { rank: 28, id: 'srp_1', name: 'SuperLiga Serbia', country: { it: 'Serbia', en: 'Serbia' }, continent: 'Europa', optaRating: 73.6 },
  { rank: 29, id: 'ukr_1', name: 'Ukrainian Premier League', country: { it: 'Ucraina', en: 'Ukraine' }, continent: 'Europa', optaRating: 73.1 },
  { rank: 30, id: 'kor_1', name: 'K League 1', country: { it: 'Corea del Sud', en: 'South Korea' }, continent: 'Asia', optaRating: 72.7 },
  { rank: 33, id: 'rou_1', name: 'Liga I', country: { it: 'Romania', en: 'Romania' }, continent: 'Europa', optaRating: 71.4 },
  { rank: 35, id: 'egy_1', name: 'Egyptian Premier League', country: { it: 'Egitto', en: 'Egypt' }, continent: 'Africa', optaRating: 70.8 },
  { rank: 37, id: 'uru_1', name: 'Primera División Uruguay', country: { it: 'Uruguay', en: 'Uruguay' }, continent: 'Sud America', optaRating: 69.9 },
  { rank: 39, id: 'chi_1', name: 'Primera División Chile', country: { it: 'Cile', en: 'Chile' }, continent: 'Sud America', optaRating: 69.1 },
  { rank: 42, id: 'mar_1', name: 'Botola Pro', country: { it: 'Marocco', en: 'Morocco' }, continent: 'Africa', optaRating: 67.8 },
  { rank: 45, id: 'rsa_1', name: 'Betway Premiership', country: { it: 'Sudafrica', en: 'South Africa' }, continent: 'Africa', optaRating: 66.5 },
  { rank: 48, id: 'aus_1', name: 'A-League Men', country: { it: 'Australia', en: 'Australia' }, continent: 'Oceania', optaRating: 65.2 },
  { rank: 52, id: 'chn_1', name: 'Chinese Super League', country: { it: 'Cina', en: 'China' }, continent: 'Asia', optaRating: 63.4 },
  { rank: 55, id: 'irn_1', name: 'Persian Gulf Pro League', country: { it: 'Iran', en: 'Iran' }, continent: 'Asia', optaRating: 62.1 },
];

export const VERIFIED_RIVALRIES: RivalryRecord[] = [
  {
    id: 'old_firm',
    name: { it: 'Old Firm', en: 'Old Firm' },
    leagueRank: 20,
    leagueName: 'Scottish Premiership',
    country: { it: 'Scozia', en: 'Scotland' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Celtic FC',
      shortCode: 'CEL',
      wikidataId: 'Q19593',
      primaryColor: '#018749',
      secondaryColor: '#FFFFFF',
      pattern: 'hoops',
      stadiumName: 'Celtic Park',
      city: 'Glasgow',
      lat: 55.8497,
      lng: -4.2055,
      capacity: 60411
    },
    clubB: {
      name: 'Rangers FC',
      shortCode: 'RAN',
      wikidataId: 'Q19597',
      primaryColor: '#1B458F',
      secondaryColor: '#D40026',
      pattern: 'solid',
      stadiumName: 'Ibrox Stadium',
      city: 'Glasgow',
      lat: 55.8532,
      lng: -4.3092,
      capacity: 51700
    },
    pRaw: 443,
    pRawSource: 'Wikipedia Infobox — Old Firm (verified Dec 2024 / May 2025)',
    consecutiveDecades: 14,
    firstYear: 1888,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_scottish_premiership',
    winsA: 170,
    draws: 103,
    winsB: 170,
    history: {
      it: 'Il derby più antico e prolifico d\'Europa. Radicato a Glasgow dal 1888, intreccia identità religiosa (cattolico-irlandese contro protestante-unionista), politica sociale e dominio assoluto sul calcio scozzese attraverso 14 decenni ininterrotti.',
      en: 'Europe\'s oldest and most prolific city derby. Rooted in Glasgow since 1888, it intertwines religious identity (Irish-Catholic vs Protestant-Unionist), social politics, and total dominance over Scottish football across 14 uninterrupted decades.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Old_Firm',
      en: 'https://en.wikipedia.org/wiki/Old_Firm'
    }
  },
  {
    id: 'derby_della_madonnina',
    name: { it: 'Derby della Madonnina', en: 'Derby della Madonnina' },
    leagueRank: 2,
    leagueName: 'Serie A',
    country: { it: 'Italia', en: 'Italy' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'FC Internazionale',
      shortCode: 'INT',
      wikidataId: 'Q631',
      primaryColor: '#010E80',
      secondaryColor: '#000000',
      pattern: 'stripes',
      stadiumName: 'Stadio Giuseppe Meazza (San Siro)',
      city: 'Milano',
      lat: 45.4781,
      lng: 9.1240,
      capacity: 75817
    },
    clubB: {
      name: 'AC Milan',
      shortCode: 'MIL',
      wikidataId: 'Q1543',
      primaryColor: '#FB090B',
      secondaryColor: '#000000',
      pattern: 'stripes',
      stadiumName: 'Stadio Giuseppe Meazza (San Siro)',
      city: 'Milano',
      lat: 45.4785,
      lng: 9.1235,
      capacity: 75817
    },
    pRaw: 244,
    pRawSource: 'Wikipedia Infobox — Derby della Madonnina (official matches)',
    consecutiveDecades: 12,
    firstYear: 1909,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_serie_a',
    winsA: 91,
    draws: 71,
    winsB: 82,
    history: {
      it: 'Intitolato alla statua dorata della Vergine Maria in cima al Duomo di Milano. Nato nel 1908 dalla scissione dei soci internazionalisti dal Milan, oppone storicamente la borghesia cittadina ("bauscia") alla classe operaia ("casciavit") nello stesso leggendario impianto di San Siro.',
      en: 'Named after the golden statue of the Virgin Mary atop Milan\'s Duomo. Born in 1908 from the split of internationalist members from AC Milan, it historically pitted the city bourgeoisie ("bauscia") against the working class ("casciavit") inside the shared San Siro cathedral.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Milano',
      en: 'https://en.wikipedia.org/wiki/Derby_della_Madonnina'
    }
  },
  {
    id: 'derby_d_italia',
    name: { it: "Derby d'Italia", en: "Derby d'Italia" },
    leagueRank: 2,
    leagueName: 'Serie A',
    country: { it: 'Italia', en: 'Italy' },
    continent: 'Europa',
    type: 'national',
    clubA: {
      name: 'Juventus FC',
      shortCode: 'JUV',
      wikidataId: 'Q1422',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Allianz Stadium',
      city: 'Torino',
      lat: 45.1096,
      lng: 7.6413,
      capacity: 41507
    },
    clubB: {
      name: 'FC Internazionale',
      shortCode: 'INT',
      wikidataId: 'Q631',
      primaryColor: '#010E80',
      secondaryColor: '#000000',
      pattern: 'stripes',
      stadiumName: 'Stadio Giuseppe Meazza',
      city: 'Milano',
      lat: 45.4781,
      lng: 9.1240,
      capacity: 75817
    },
    pRaw: 253,
    pRawSource: "Wikipedia Infobox — Derby d'Italia (official matches)",
    consecutiveDecades: 12,
    firstYear: 1909,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_serie_a',
    winsA: 112,
    draws: 64,
    winsB: 77,
    history: {
      it: 'Espressione coniata nel 1967 dal grande giornalista Gianni Brera per indicare la sfida tra le due società più titolate e costanti del calcio italiano. È la partita più disputata nella storia della Serie A a girone unico, acuita dalle controversie del 1998 e del 2006.',
      en: 'Coined in 1967 by legendary journalist Gianni Brera to describe the clash between Italy\'s two most decorated and consistent clubs. It is the most-played fixture in Serie A history, intensified by the 1998 and 2006 controversies.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_d%27Italia',
      en: 'https://en.wikipedia.org/wiki/Derby_d%27Italia'
    }
  },
  {
    id: 'el_clasico',
    name: { it: 'El Clásico', en: 'El Clásico' },
    leagueRank: 3,
    leagueName: 'La Liga',
    country: { it: 'Spagna', en: 'Spain' },
    continent: 'Europa',
    type: 'national',
    clubA: {
      name: 'Real Madrid CF',
      shortCode: 'RMA',
      wikidataId: 'Q8682',
      primaryColor: '#FEBE10',
      secondaryColor: '#1B365D',
      pattern: 'solid',
      stadiumName: 'Estadio Santiago Bernabéu',
      city: 'Madrid',
      lat: 40.4531,
      lng: -3.6883,
      capacity: 83186
    },
    clubB: {
      name: 'FC Barcelona',
      shortCode: 'BAR',
      wikidataId: 'Q7156',
      primaryColor: '#A50044',
      secondaryColor: '#004D98',
      pattern: 'stripes',
      stadiumName: 'Spotify Camp Nou',
      city: 'Barcellona',
      lat: 41.3809,
      lng: 2.1228,
      capacity: 99354
    },
    pRaw: 259,
    pRawSource: 'Wikipedia Infobox — El Clásico (competitive matches)',
    consecutiveDecades: 13,
    firstYear: 1902,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_laliga',
    winsA: 105,
    draws: 52,
    winsB: 102,
    history: {
      it: 'Il confronto calcistico tra club più seguito del pianeta. Incarna la tensione storica e culturale tra il centralismo castigliano di Madrid e l\'identità autonomista catalana di Barcellona, sublimata da generazioni di Palloni d\'Oro da Di Stéfano e Cruijff fino a Cristiano Ronaldo e Messi.',
      en: 'The most watched club football fixture on Earth. It embodies the historical and political tension between Castilian centralism in Madrid and Catalan identity in Barcelona, elevated by generations of Ballon d\'Or icons from Di Stéfano and Cruyff to Ronaldo and Messi.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/El_Cl%C3%A1sico',
      en: 'https://en.wikipedia.org/wiki/El_Cl%C3%A1sico'
    }
  },
  {
    id: 'north_london_derby',
    name: { it: 'North London Derby', en: 'North London Derby' },
    leagueRank: 1,
    leagueName: 'Premier League',
    country: { it: 'Inghilterra', en: 'England' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Arsenal FC',
      shortCode: 'ARS',
      wikidataId: 'Q9617',
      primaryColor: '#EF0107',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Emirates Stadium',
      city: 'Londra',
      lat: 51.5549,
      lng: -0.1084,
      capacity: 60704
    },
    clubB: {
      name: 'Tottenham Hotspur',
      shortCode: 'TOT',
      wikidataId: 'Q18741',
      primaryColor: '#132257',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Tottenham Hotspur Stadium',
      city: 'Londra',
      lat: 51.6042,
      lng: -0.0662,
      capacity: 62850
    },
    pRaw: 197,
    pRawSource: 'Wikipedia Infobox — North London derby',
    consecutiveDecades: 12,
    firstYear: 1909,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_premier_league',
    winsA: 84,
    draws: 52,
    winsB: 61,
    history: {
      it: 'Sebbene si siano affrontate per la prima volta nel 1887, la rivalità esplose nel 1913 quando l\'Arsenal si trasferì da Woolwich ad Highbury, a soli 6 chilometri da White Hart Lane, e nel 1919 fu ammesso in First Division a scapito degli Spurs per votazione federale.',
      en: 'Though first played in 1887, the feud ignited in 1913 when Arsenal moved north of the Thames from Woolwich to Highbury—just four miles from White Hart Lane—and intensified in 1919 when Arsenal were voted into the First Division ahead of Spurs.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/North_London_derby',
      en: 'https://en.wikipedia.org/wiki/North_London_derby'
    }
  },
  {
    id: 'northwest_derby_england',
    name: { it: 'North West Derby', en: 'Liverpool–Manchester United Rivalry' },
    leagueRank: 1,
    leagueName: 'Premier League',
    country: { it: 'Inghilterra', en: 'England' },
    continent: 'Europa',
    type: 'regional',
    clubA: {
      name: 'Manchester United',
      shortCode: 'MUN',
      wikidataId: 'Q18656',
      primaryColor: '#DA291C',
      secondaryColor: '#FBE122',
      pattern: 'solid',
      stadiumName: 'Old Trafford',
      city: 'Manchester',
      lat: 53.4631,
      lng: -2.2913,
      capacity: 74310
    },
    clubB: {
      name: 'Liverpool FC',
      shortCode: 'LIV',
      wikidataId: 'Q1130849',
      primaryColor: '#C8102E',
      secondaryColor: '#00B2A9',
      pattern: 'solid',
      stadiumName: 'Anfield',
      city: 'Liverpool',
      lat: 53.4308,
      lng: -2.9608,
      capacity: 61276
    },
    pRaw: 214,
    pRawSource: 'Wikipedia Infobox — Liverpool F.C.–Manchester United F.C. rivalry',
    consecutiveDecades: 13,
    firstYear: 1894,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_premier_league',
    winsA: 83,
    draws: 60,
    winsB: 71,
    history: {
      it: 'La sfida tra i due club più titolati d\'Inghilterra affonda le radici nella rivoluzione industriale del XIX secolo e nell\'apertura del Manchester Ship Canal (1894), che permise alle navi di aggirare i dazi del porto di Liverpool scatenando una competizione economica e operaia feroce.',
      en: 'The clash between England\'s two most successful clubs stems from the 19th-century Industrial Revolution and the 1894 opening of the Manchester Ship Canal, which bypassed Liverpool\'s port dues and sparked fierce economic and civic competition.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_del_Nord-Ovest',
      en: 'https://en.wikipedia.org/wiki/Liverpool_F.C.%E2%80%93Manchester_United_F.C._rivalry'
    }
  },
  {
    id: 'merseyside_derby',
    name: { it: 'Merseyside Derby', en: 'Merseyside Derby' },
    leagueRank: 1,
    leagueName: 'Premier League',
    country: { it: 'Inghilterra', en: 'England' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Liverpool FC',
      shortCode: 'LIV',
      wikidataId: 'Q1130849',
      primaryColor: '#C8102E',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Anfield',
      city: 'Liverpool',
      lat: 53.4308,
      lng: -2.9608,
      capacity: 61276
    },
    clubB: {
      name: 'Everton FC',
      shortCode: 'EVE',
      wikidataId: 'Q5794',
      primaryColor: '#003399',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Goodison Park',
      city: 'Liverpool',
      lat: 53.4389,
      lng: -2.9664,
      capacity: 39414
    },
    pRaw: 245,
    pRawSource: 'Wikipedia Infobox — Merseyside derby',
    consecutiveDecades: 13,
    firstYear: 1894,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_premier_league',
    winsA: 99,
    draws: 78,
    winsB: 68,
    history: {
      it: 'Il derby nella massima serie inglese disputato ininterrottamente da più tempo (dal 1962). Nato nel 1892 quando l\'Everton lasciò Anfield per una disputa sull\'affitto con John Houlding, che fondò il Liverpool FC. I due stadi distano meno di un chilometro attraverso Stanley Park.',
      en: 'The longest continuously running top-flight derby in England (since 1962). Born in 1892 when Everton left Anfield over a rent dispute with landlord John Houlding, who promptly founded Liverpool FC. Their stadiums sit less than a mile apart across Stanley Park.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_del_Merseyside',
      en: 'https://en.wikipedia.org/wiki/Merseyside_derby'
    }
  },
  {
    id: 'manchester_derby',
    name: { it: 'Manchester Derby', en: 'Manchester Derby' },
    leagueRank: 1,
    leagueName: 'Premier League',
    country: { it: 'Inghilterra', en: 'England' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Manchester United',
      shortCode: 'MUN',
      wikidataId: 'Q18656',
      primaryColor: '#DA291C',
      secondaryColor: '#000000',
      pattern: 'solid',
      stadiumName: 'Old Trafford',
      city: 'Manchester',
      lat: 53.4631,
      lng: -2.2913,
      capacity: 74310
    },
    clubB: {
      name: 'Manchester City',
      shortCode: 'MCI',
      wikidataId: 'Q50602',
      primaryColor: '#6CABDD',
      secondaryColor: '#1C2C5B',
      pattern: 'solid',
      stadiumName: 'Etihad Stadium',
      city: 'Manchester',
      lat: 53.4831,
      lng: -2.2004,
      capacity: 53400
    },
    pRaw: 195,
    pRawSource: 'Wikipedia Infobox — Manchester derby',
    consecutiveDecades: 13,
    firstYear: 1881,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_premier_league',
    winsA: 79,
    draws: 54,
    winsB: 62,
    history: {
      it: 'Disputato per la prima volta nel 1881 tra St. Mark\'s (West Gorton) e Newton Heath. Negli ultimi due decenni è passato da stracittadina locale a baricentro del potere calcistico europeo ed economico della Premier League.',
      en: 'First contested in 1881 between St. Mark\'s (West Gorton) and Newton Heath. Over the past two decades it has transformed from a fierce local civic contest into the centerpiece of Premier League and European dominance.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Manchester',
      en: 'https://en.wikipedia.org/wiki/Manchester_derby'
    }
  },
  {
    id: 'arsenal_manchester_united',
    name: { it: 'Arsenal–Manchester United', en: 'Arsenal–Manchester United Rivalry' },
    leagueRank: 1,
    leagueName: 'Premier League',
    country: { it: 'Inghilterra', en: 'England' },
    continent: 'Europa',
    type: 'national',
    clubA: {
      name: 'Manchester United',
      shortCode: 'MUN',
      wikidataId: 'Q18656',
      primaryColor: '#DA291C',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Old Trafford',
      city: 'Manchester',
      lat: 53.4631,
      lng: -2.2913,
      capacity: 74310
    },
    clubB: {
      name: 'Arsenal FC',
      shortCode: 'ARS',
      wikidataId: 'Q9617',
      primaryColor: '#EF0107',
      secondaryColor: '#063672',
      pattern: 'solid',
      stadiumName: 'Emirates Stadium',
      city: 'Londra',
      lat: 51.5549,
      lng: -0.1084,
      capacity: 60704
    },
    pRaw: 243,
    pRawSource: 'Wikipedia Infobox — Arsenal F.C.–Manchester United F.C. rivalry (verified all-time competitive)',
    consecutiveDecades: 13,
    firstYear: 1894,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_premier_league',
    winsA: 99,
    draws: 55,
    winsB: 89,
    history: {
      it: 'Voce canonica verificata (sostituisce il duplicato errato "Battle of Old Trafford"). Dal 1894 i due club si sono sfidati 243 volte, toccando l\'apice tra il 1996 e il 2005 nel duello titanico tra Sir Alex Ferguson e Arsène Wenger, incarnato in campo da Roy Keane e Patrick Vieira.',
      en: 'Canonical verified rivalry entry (superseding the single-match duplicate "Battle of Old Trafford"). Contested 243 times since 1894, it reached fever pitch between 1996 and 2005 during the iconic Ferguson vs. Wenger and Keane vs. Vieira era.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Rivalit%C3%A0_calcistica_Arsenal-Manchester_United',
      en: 'https://en.wikipedia.org/wiki/Arsenal_F.C.%E2%80%93Manchester_United_F.C._rivalry'
    }
  },
  {
    id: 'derby_della_capitale',
    name: { it: 'Derby della Capitale', en: 'Derby della Capitale' },
    leagueRank: 2,
    leagueName: 'Serie A',
    country: { it: 'Italia', en: 'Italy' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'AS Roma',
      shortCode: 'ROM',
      wikidataId: 'Q2739',
      primaryColor: '#8E1F2F',
      secondaryColor: '#F0BC42',
      pattern: 'halves',
      stadiumName: 'Stadio Olimpico',
      city: 'Roma',
      lat: 41.9341,
      lng: 12.4547,
      capacity: 70634
    },
    clubB: {
      name: 'SS Lazio',
      shortCode: 'LAZ',
      wikidataId: 'Q2609',
      primaryColor: '#87D8F7',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Stadio Olimpico',
      city: 'Roma',
      lat: 41.9344,
      lng: 12.4542,
      capacity: 70634
    },
    pRaw: 184,
    pRawSource: 'Wikipedia Infobox — Derby di Roma (official matches)',
    consecutiveDecades: 10,
    firstYear: 1929,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_serie_a',
    winsA: 69,
    draws: 63,
    winsB: 52,
    history: {
      it: 'Nato nel 1929 dopo che la Lazio, fondata nel 1900, rifiutò la fusione del 1927 che diede vita all\'AS Roma. È tra le stracittadine più viscerali d\'Europa per passione coreografica tra Curva Sud e Curva Nord nello Stadio Olimpico condiviso.',
      en: 'Born in 1929 after Lazio (founded 1900) resisted the 1927 merger that created AS Roma. It stands as one of Europe\'s most visceral civic rivalries, famed for choreographic intensity between Curva Sud and Curva Nord inside the shared Stadio Olimpico.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Roma',
      en: 'https://en.wikipedia.org/wiki/Derby_della_Capitale'
    }
  },
  {
    id: 'derby_della_mole',
    name: { it: 'Derby della Mole', en: 'Derby della Mole' },
    leagueRank: 2,
    leagueName: 'Serie A',
    country: { it: 'Italia', en: 'Italy' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Juventus FC',
      shortCode: 'JUV',
      wikidataId: 'Q1422',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Allianz Stadium',
      city: 'Torino',
      lat: 45.1096,
      lng: 7.6413,
      capacity: 41507
    },
    clubB: {
      name: 'Torino FC',
      shortCode: 'TOR',
      wikidataId: 'Q2768',
      primaryColor: '#8A1E04',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Stadio Olimpico Grande Torino',
      city: 'Torino',
      lat: 45.0418,
      lng: 7.6500,
      capacity: 28177
    },
    pRaw: 209,
    pRawSource: 'Wikipedia Infobox — Derby di Torino (official matches)',
    consecutiveDecades: 12,
    firstYear: 1907,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_serie_a',
    winsA: 94,
    draws: 59,
    winsB: 56,
    history: {
      it: 'Il più antico derby cittadino d\'Italia (prima sfida nel 1907), nato quando il dissidente svizzero Alfred Dick lasciò la Juventus per fondare il Foot-Ball Club Torino. Prende il nome dalla Mole Antonelliana, simbolo architettonico della capitale sabauda.',
      en: 'Italy\'s oldest city derby (first played in 1907), born when Swiss dissident Alfred Dick left Juventus to found Foot-Ball Club Torino. Named after the Mole Antonelliana, the architectural symbol of Turin.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Torino',
      en: 'https://en.wikipedia.org/wiki/Derby_della_Mole'
    }
  },
  {
    id: 'derby_della_lanterna',
    name: { it: 'Derby della Lanterna', en: 'Derby della Lanterna' },
    leagueRank: 2,
    leagueName: 'Serie A',
    country: { it: 'Italia', en: 'Italy' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'UC Sampdoria',
      shortCode: 'SAM',
      wikidataId: 'Q1457',
      primaryColor: '#0055A4',
      secondaryColor: '#D50032',
      pattern: 'hoops',
      stadiumName: 'Stadio Luigi Ferraris',
      city: 'Genova',
      lat: 44.4165,
      lng: 8.9525,
      capacity: 33205
    },
    clubB: {
      name: 'Genoa CFC',
      shortCode: 'GEN',
      wikidataId: 'Q2074',
      primaryColor: '#AD1D2A',
      secondaryColor: '#0A2240',
      pattern: 'halves',
      stadiumName: 'Stadio Luigi Ferraris',
      city: 'Genova',
      lat: 44.4162,
      lng: 8.9522,
      capacity: 33205
    },
    pRaw: 107,
    pRawSource: 'Wikipedia Infobox — Derby di Genova (official matches)',
    consecutiveDecades: 9,
    firstYear: 1946,
    lastYear: 2024,
    lastYearSource: 'infobox_2024_coppa_italia',
    winsA: 41,
    draws: 39,
    winsB: 27,
    history: {
      it: 'Prende il nome dall\'antico faro simbolo del porto di Genova. Oppone il Genoa (1893), il club calcistico più antico d\'Italia, alla Sampdoria, nata nel 1946 dalla fusione tra Sampierdarenese e Andrea Doria, nella cornice intima e infuocata di Marassi.',
      en: 'Named after Genoa\'s ancient harbor lighthouse. It pits Genoa CFC (1893), Italy\'s oldest active football club, against Sampdoria, formed in 1946 by the merger of Sampierdarenese and Andrea Doria, inside the steep tiers of Stadio Luigi Ferraris.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Genova',
      en: 'https://en.wikipedia.org/wiki/Derby_della_Lanterna'
    }
  },
  {
    id: 'milan_juventus',
    name: { it: 'Rivalità Juventus–Milan', en: 'Juventus–AC Milan Rivalry' },
    leagueRank: 2,
    leagueName: 'Serie A',
    country: { it: 'Italia', en: 'Italy' },
    continent: 'Europa',
    type: 'national',
    clubA: {
      name: 'Juventus FC',
      shortCode: 'JUV',
      wikidataId: 'Q1422',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Allianz Stadium',
      city: 'Torino',
      lat: 45.1096,
      lng: 7.6413,
      capacity: 41507
    },
    clubB: {
      name: 'AC Milan',
      shortCode: 'MIL',
      wikidataId: 'Q1543',
      primaryColor: '#FB090B',
      secondaryColor: '#000000',
      pattern: 'stripes',
      stadiumName: 'Stadio Giuseppe Meazza',
      city: 'Milano',
      lat: 45.4785,
      lng: 9.1235,
      capacity: 75817
    },
    pRaw: 242,
    pRawSource: 'Wikipedia Infobox — Rivalità calcistica Juventus-Milan (official matches)',
    consecutiveDecades: 13,
    firstYear: 1901,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_serie_a',
    winsA: 93,
    draws: 78,
    winsB: 71,
    history: {
      it: 'La sfida più antica del grande calcio italiano (1901), tra il club con più scudetti (Juventus) e il club italiano più titolato in Europa (Milan), culminata nella finale di Champions League del 2003 a Old Trafford.',
      en: 'The oldest classic confrontation in Italian football (1901), pitting Italy\'s domestic record champions (Juventus) against its most successful European club (AC Milan), culminating in the 2003 UEFA Champions League Final.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Rivalit%C3%A0_calcistica_Juventus-Milan',
      en: 'https://en.wikipedia.org/wiki/AC_Milan%E2%80%93Juventus_F.C._rivalry'
    }
  },
  {
    id: 'madrileno_derby',
    name: { it: 'El Derbi Madrileño', en: 'Madrid Derby' },
    leagueRank: 3,
    leagueName: 'La Liga',
    country: { it: 'Spagna', en: 'Spain' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Real Madrid CF',
      shortCode: 'RMA',
      wikidataId: 'Q8682',
      primaryColor: '#FEBE10',
      secondaryColor: '#1B365D',
      pattern: 'solid',
      stadiumName: 'Estadio Santiago Bernabéu',
      city: 'Madrid',
      lat: 40.4531,
      lng: -3.6883,
      capacity: 83186
    },
    clubB: {
      name: 'Atlético Madrid',
      shortCode: 'ATM',
      wikidataId: 'Q8701',
      primaryColor: '#CB3524',
      secondaryColor: '#272E61',
      pattern: 'stripes',
      stadiumName: 'Riyadh Air Metropolitano',
      city: 'Madrid',
      lat: 40.4362,
      lng: -3.5995,
      capacity: 70460
    },
    pRaw: 238,
    pRawSource: 'Wikipedia Infobox — Madrid derby (competitive matches)',
    consecutiveDecades: 12,
    firstYear: 1906,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_laliga',
    winsA: 116,
    draws: 61,
    winsB: 61,
    history: {
      it: 'La grande stracittadina della capitale spagnola e l\'unica nella storia ad aver assegnato due finali di UEFA Champions League (2014 e 2016). Storicamente contrappone l\'establishment di Chamartín allo spirito ribelle e popolare dei "Colchoneros".',
      en: 'The fierce civic derby of the Spanish capital and the only city derby in history contested in two UEFA Champions League Finals (2014 and 2016). Historically contrasts the Chamartín establishment with the working-class grit of the "Colchoneros".'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Madrid',
      en: 'https://en.wikipedia.org/wiki/Madrid_derby'
    }
  },
  {
    id: 'seville_derby',
    name: { it: 'El Gran Derbi (Siviglia)', en: 'Seville Derby' },
    leagueRank: 3,
    leagueName: 'La Liga',
    country: { it: 'Spagna', en: 'Spain' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Sevilla FC',
      shortCode: 'SEV',
      wikidataId: 'Q10329',
      primaryColor: '#D4001A',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Estadio Ramón Sánchez-Pizjuán',
      city: 'Siviglia',
      lat: 37.3840,
      lng: -5.9706,
      capacity: 43883
    },
    clubB: {
      name: 'Real Betis',
      shortCode: 'BET',
      wikidataId: 'Q8723',
      primaryColor: '#00954C',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Estadio Benito Villamarín',
      city: 'Siviglia',
      lat: 37.3564,
      lng: -5.9818,
      capacity: 60721
    },
    pRaw: 142,
    pRawSource: 'Wikipedia Infobox — Seville derby',
    consecutiveDecades: 11,
    firstYear: 1915,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_laliga',
    winsA: 65,
    draws: 37,
    winsB: 40,
    history: {
      it: 'Il derby più passionale di Spagna, che divide il capoluogo andaluso tra il quartiere di Nervión (Sevilla) e quello di Heliópolis (Real Betis, con il motto "Viva er Beti manque pierda").',
      en: 'Spain\'s most passionate city derby, dividing the Andalusian capital between the Nervión district (Sevilla FC) and Heliópolis (Real Betis, famous for its motto "Long live Betis even when they lose").'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Siviglia',
      en: 'https://en.wikipedia.org/wiki/Seville_derby'
    }
  },
  {
    id: 'basque_derby',
    name: { it: 'Euskal Derbia (Derby Basco)', en: 'Basque Derby' },
    leagueRank: 3,
    leagueName: 'La Liga',
    country: { it: 'Spagna', en: 'Spain' },
    continent: 'Europa',
    type: 'regional',
    clubA: {
      name: 'Athletic Club',
      shortCode: 'ATH',
      wikidataId: 'Q8687',
      primaryColor: '#EE2523',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'San Mamés',
      city: 'Bilbao',
      lat: 43.2641,
      lng: -2.9493,
      capacity: 53331
    },
    clubB: {
      name: 'Real Sociedad',
      shortCode: 'RSO',
      wikidataId: 'Q10315',
      primaryColor: '#0067B1',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Reale Arena (Anoeta)',
      city: 'San Sebastián',
      lat: 43.3014,
      lng: -1.9736,
      capacity: 39313
    },
    pRaw: 179,
    pRawSource: 'Wikipedia Infobox — Basque derby',
    consecutiveDecades: 12,
    firstYear: 1909,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_laliga',
    winsA: 72,
    draws: 46,
    winsB: 61,
    history: {
      it: 'Sfida orgogliosa tra Bilbao (Biscaglia) e San Sebastián (Gipuzkoa). Celebre per il profondo legame identitario basco, per cui le tifoserie siedono mescolate sugli spalti celebrando insieme la cultura dell\'Euskal Herria.',
      en: 'The proud regional contest between Bilbao (Biscay) and San Sebastián (Gipuzkoa). Famous for its unique atmosphere where rival supporters sit mingled together in the stands celebrating Basque identity.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_basco',
      en: 'https://en.wikipedia.org/wiki/Basque_derby'
    }
  },
  {
    id: 'revierderby',
    name: { it: 'Revierderby', en: 'Revierderby' },
    leagueRank: 4,
    leagueName: 'Bundesliga',
    country: { it: 'Germania', en: 'Germany' },
    continent: 'Europa',
    type: 'regional',
    clubA: {
      name: 'Borussia Dortmund',
      shortCode: 'BVB',
      wikidataId: 'Q41420',
      primaryColor: '#FDE100',
      secondaryColor: '#000000',
      pattern: 'solid',
      stadiumName: 'Signal Iduna Park',
      city: 'Dortmund',
      lat: 51.4926,
      lng: 7.4519,
      capacity: 81365
    },
    clubB: {
      name: 'FC Schalke 04',
      shortCode: 'S04',
      wikidataId: 'Q32494',
      primaryColor: '#004D9D',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Veltins-Arena',
      city: 'Gelsenkirchen',
      lat: 51.5546,
      lng: 7.0675,
      capacity: 62271
    },
    pRaw: 160,
    pRawSource: 'Wikipedia Infobox — Revierderby (official competitive matches)',
    consecutiveDecades: 10,
    firstYear: 1925,
    lastYear: 2023,
    lastYearSource: 'infobox_2023_bundesliga',
    winsA: 57,
    draws: 43,
    winsB: 60,
    history: {
      it: 'Il cuore pulsante del bacino minerario e industriale della Ruhr. Dal 1925 contrappone Dortmund e Gelsenkirchen, due città operaie separate da appena 30 chilometri, in quella che in Germania è definita la "Madre di tutti i derby".',
      en: 'The beating heart of the industrial Ruhr basin. Since 1925 it has pitted coal-and-steel neighbors Dortmund and Gelsenkirchen—separated by just 30 kilometers—in Germany\'s "Mother of all Derbies".'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_della_Ruhr',
      en: 'https://en.wikipedia.org/wiki/Revierderby'
    }
  },
  {
    id: 'der_klassiker',
    name: { it: 'Der Klassiker', en: 'Der Klassiker' },
    leagueRank: 4,
    leagueName: 'Bundesliga',
    country: { it: 'Germania', en: 'Germany' },
    continent: 'Europa',
    type: 'national',
    clubA: {
      name: 'FC Bayern München',
      shortCode: 'BAY',
      wikidataId: 'Q15789',
      primaryColor: '#DC052D',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Allianz Arena',
      city: 'Monaco di Baviera',
      lat: 48.2188,
      lng: 11.6247,
      capacity: 75024
    },
    clubB: {
      name: 'Borussia Dortmund',
      shortCode: 'BVB',
      wikidataId: 'Q41420',
      primaryColor: '#FDE100',
      secondaryColor: '#000000',
      pattern: 'solid',
      stadiumName: 'Signal Iduna Park',
      city: 'Dortmund',
      lat: 51.4926,
      lng: 7.4519,
      capacity: 81365
    },
    pRaw: 136,
    pRawSource: 'Wikipedia Infobox — Der Klassiker',
    consecutiveDecades: 7,
    firstYear: 1965,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_bundesliga',
    winsA: 67,
    draws: 36,
    winsB: 33,
    history: {
      it: 'Il duello moderno per l\'egemonia nel calcio tedesco tra i due club che hanno conquistato quasi tutti i titoli nazionali dagli anni \'90 e si sono contesi la finale tutta tedesca di Champions League a Wembley nel 2013.',
      en: 'The modern duel for supremacy in German football between the two clubs that have won the vast majority of domestic titles since the 1990s and contested the all-German 2013 UEFA Champions League Final at Wembley.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Der_Klassiker',
      en: 'https://en.wikipedia.org/wiki/Der_Klassiker'
    }
  },
  {
    id: 'rhine_derby',
    name: { it: 'Rheinisches Derby (Derby del Reno)', en: 'Rhine Derby' },
    leagueRank: 4,
    leagueName: 'Bundesliga',
    country: { it: 'Germania', en: 'Germany' },
    continent: 'Europa',
    type: 'regional',
    clubA: {
      name: 'Borussia Mönchengladbach',
      shortCode: 'BMG',
      wikidataId: 'Q101959',
      primaryColor: '#000000',
      secondaryColor: '#179D3B',
      pattern: 'stripes',
      stadiumName: 'Borussia-Park',
      city: 'Mönchengladbach',
      lat: 51.1746,
      lng: 6.3855,
      capacity: 54042
    },
    clubB: {
      name: '1. FC Köln',
      shortCode: 'KOE',
      wikidataId: 'Q104770',
      primaryColor: '#ED1C24',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'RheinEnergieStadion',
      city: 'Colonia',
      lat: 50.9335,
      lng: 6.8751,
      capacity: 50000
    },
    pRaw: 133,
    pRawSource: 'Wikipedia Infobox — Rhineland derby (Gladbach vs Köln verified)',
    consecutiveDecades: 10,
    firstYear: 1933,
    lastYear: 2024,
    lastYearSource: 'infobox_2024_bundesliga_verified',
    winsA: 59,
    draws: 25,
    winsB: 49,
    history: {
      it: 'Audit verificato (corretto da assumed_ongoing_2025 a 2024 in seguito alla retrocessione del Colonia in 2. Bundesliga nel 2023-24). È la rivalità più sentita della Renania, infiammata negli anni \'70 dal passaggio dell\'allenatore Hennes Weisweiler dal Gladbach al Colonia.',
      en: 'Audit verified (corrected from assumed_ongoing_2025 to 2024 following 1. FC Köln\'s relegation in 2023–24). The fiercest rivalry in the Rhineland, ignited in the 1970s when legendary coach Hennes Weisweiler moved from Gladbach to Cologne.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_del_Reno',
      en: 'https://en.wikipedia.org/wiki/Rhineland_derby'
    }
  },
  {
    id: 'le_classique',
    name: { it: 'Le Classique', en: 'Le Classique' },
    leagueRank: 5,
    leagueName: 'Ligue 1',
    country: { it: 'Francia', en: 'France' },
    continent: 'Europa',
    type: 'national',
    clubA: {
      name: 'Paris Saint-Germain',
      shortCode: 'PSG',
      wikidataId: 'Q483020',
      primaryColor: '#004170',
      secondaryColor: '#DA291C',
      pattern: 'stripes',
      stadiumName: 'Parc des Princes',
      city: 'Parigi',
      lat: 48.8414,
      lng: 2.2530,
      capacity: 47929
    },
    clubB: {
      name: 'Olympique de Marseille',
      shortCode: 'OM',
      wikidataId: 'Q132885',
      primaryColor: '#2FAEE0',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Stade Vélodrome',
      city: 'Marsiglia',
      lat: 43.2698,
      lng: 5.3959,
      capacity: 67394
    },
    pRaw: 109,
    pRawSource: 'Wikipedia Infobox — Le Classique',
    consecutiveDecades: 6,
    firstYear: 1971,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_ligue1',
    winsA: 51,
    draws: 24,
    winsB: 34,
    history: {
      it: 'La grande frattura geografica e sociologica della Francia: il Nord contro il Sud, la capitale aristocratica e politica Parigi contro la metropoli portuale, ribelle e mediterranea di Marsiglia.',
      en: 'France\'s great geographic and sociological fault line: North versus South, the political and aristocratic capital Paris against the rebellious Mediterranean port city of Marseille.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Le_Classique',
      en: 'https://en.wikipedia.org/wiki/Le_Classique'
    }
  },
  {
    id: 'choc_des_olympiques',
    name: { it: 'Derby du Rhône', en: 'Derby Rhône-Alpes' },
    leagueRank: 5,
    leagueName: 'Ligue 1',
    country: { it: 'Francia', en: 'France' },
    continent: 'Europa',
    type: 'regional',
    clubA: {
      name: 'Olympique Lyonnais',
      shortCode: 'OL',
      wikidataId: 'Q704',
      primaryColor: '#14387F',
      secondaryColor: '#DA001A',
      pattern: 'solid',
      stadiumName: 'Groupama Stadium',
      city: 'Lione',
      lat: 45.7653,
      lng: 4.9820,
      capacity: 59186
    },
    clubB: {
      name: 'AS Saint-Étienne',
      shortCode: 'STE',
      wikidataId: 'Q19520',
      primaryColor: '#009A44',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Stade Geoffroy-Guichard',
      city: 'Saint-Étienne',
      lat: 45.4608,
      lng: 4.3902,
      capacity: 41965
    },
    pRaw: 126,
    pRawSource: 'Wikipedia Infobox — Derby Rhône-Alpes',
    consecutiveDecades: 8,
    firstYear: 1951,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_ligue1',
    winsA: 46,
    draws: 36,
    winsB: 44,
    history: {
      it: 'Il derby regionale più autentico di Francia. Contrappone Lione, storicamente percepita come città mercantile e "borghese" ("colletti bianchi"), a Saint-Étienne, città mineraria e operaia ("colletti blu"), distanti appena 50 chilometri.',
      en: 'France\'s most authentic regional derby. It pits Lyon—historically viewed as mercantile and white-collar—against coal-mining, blue-collar Saint-Étienne just 50 kilometers away.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_del_Rodano',
      en: 'https://en.wikipedia.org/wiki/Derby_Rh%C3%B4ne-Alpes'
    }
  },
  {
    id: 'superclasico_argentina',
    name: { it: 'Superclásico', en: 'Superclásico' },
    leagueRank: 9,
    leagueName: 'Liga Profesional',
    country: { it: 'Argentina', en: 'Argentina' },
    continent: 'Sud America',
    type: 'city',
    clubA: {
      name: 'Boca Juniors',
      shortCode: 'BOC',
      wikidataId: 'Q170703',
      primaryColor: '#003399',
      secondaryColor: '#FFCC00',
      pattern: 'hoops',
      stadiumName: 'La Bombonera',
      city: 'Buenos Aires',
      lat: -34.6356,
      lng: -58.3647,
      capacity: 54000
    },
    clubB: {
      name: 'River Plate',
      shortCode: 'RIV',
      wikidataId: 'Q15799',
      primaryColor: '#FFFFFF',
      secondaryColor: '#E4002B',
      pattern: 'diagonal',
      stadiumName: 'Estadio Mâs Monumental',
      city: 'Buenos Aires',
      lat: -34.5453,
      lng: -58.4498,
      capacity: 84567
    },
    pRaw: 263,
    pRawSource: 'Wikipedia Infobox — Superclásico (official matches)',
    consecutiveDecades: 12,
    firstYear: 1913,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_liga_profesional',
    winsA: 92,
    draws: 84,
    winsB: 87,
    history: {
      it: 'Nati entrambi nel quartiere portuale di immigrati genovesi de La Boca a inizio Novecento, il River si trasferì nel 1925 nell\'agiato quartiere settentrionale di Núñez guadagnando il soprannome di "Los Millonarios", mentre il Boca rimase il baluardo popolare degli "Xeneizes".',
      en: 'Both founded in the Genoese immigrant docklands of La Boca in the early 1900s, River Plate moved north to affluent Núñez in 1925—earning the nickname "Los Millonarios"—while Boca Juniors remained the working-class bastion of the "Xeneizes".'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Supercl%C3%A1sico',
      en: 'https://en.wikipedia.org/wiki/Supercl%C3%A1sico'
    }
  },
  {
    id: 'clasico_ de_avellaneda',
    name: { it: 'Clásico de Avellaneda', en: 'Avellaneda Derby' },
    leagueRank: 9,
    leagueName: 'Liga Profesional',
    country: { it: 'Argentina', en: 'Argentina' },
    continent: 'Sud America',
    type: 'city',
    clubA: {
      name: 'CA Independiente',
      shortCode: 'IND',
      wikidataId: 'Q214978',
      primaryColor: '#EC1C24',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Estadio Libertadores de América',
      city: 'Avellaneda',
      lat: -34.6703,
      lng: -58.3710,
      capacity: 42069
    },
    clubB: {
      name: 'Racing Club',
      shortCode: 'RAC',
      wikidataId: 'Q276533',
      primaryColor: '#6CABDD',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Estadio Presidente Perón (El Cilindro)',
      city: 'Avellaneda',
      lat: -34.6675,
      lng: -58.3686,
      capacity: 55880
    },
    pRaw: 236,
    pRawSource: 'Wikipedia Infobox — Avellaneda derby',
    consecutiveDecades: 12,
    firstYear: 1907,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_liga_profesional',
    winsA: 89,
    draws: 76,
    winsB: 71,
    history: {
      it: 'Il secondo grande derby d\'Argentina presenta una peculiarità geografica unica al mondo: i due stadi monumentali (Libertadores de América e il Cilindro di Avellaneda) distano meno di 300 metri l\'uno dall\'altro.',
      en: 'Argentina\'s second greatest derby features a unique geographic anomaly: the two clubs\' monumental stadiums in Avellaneda stand less than 300 meters apart.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Cl%C3%A1sico_de_Avellaneda',
      en: 'https://en.wikipedia.org/wiki/Avellaneda_derby'
    }
  },
  {
    id: 'paulista_derby',
    name: { it: 'Derby Paulista', en: 'Paulista Derby' },
    leagueRank: 6,
    leagueName: 'Brasileirão Série A',
    country: { it: 'Brasile', en: 'Brazil' },
    continent: 'Sud America',
    type: 'city',
    clubA: {
      name: 'Corinthians',
      shortCode: 'COR',
      wikidataId: 'Q35933',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Neo Química Arena',
      city: 'San Paolo',
      lat: -23.5453,
      lng: -46.4742,
      capacity: 49205
    },
    clubB: {
      name: 'SE Palmeiras',
      shortCode: 'PAL',
      wikidataId: 'Q80964',
      primaryColor: '#006437',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Allianz Parque',
      city: 'San Paolo',
      lat: -23.5275,
      lng: -46.6783,
      capacity: 43713
    },
    pRaw: 382,
    pRawSource: 'Wikipedia Infobox — Paulista Derby',
    consecutiveDecades: 12,
    firstYear: 1917,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_paulistao_brasileirao',
    winsA: 131,
    draws: 116,
    winsB: 135,
    history: {
      it: 'Nato nel 1917 quando i membri della comunità italiana del Corinthians lasciarono il club per unirsi al Palestra Itália (oggi Palmeiras). Con oltre 380 incontri ufficiali, è una delle rivalità cittadine più epiche del Sud America.',
      en: 'Born in 1917 when members of São Paulo\'s Italian community left Corinthians to join Palestra Itália (now Palmeiras). With over 380 official fixtures, it stands among South America\'s grandest metropolitan rivalries.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_Paulista',
      en: 'https://en.wikipedia.org/wiki/Paulista_Derby'
    }
  },
  {
    id: 'fla_flu',
    name: { it: 'Fla-Flu', en: 'Fla-Flu' },
    leagueRank: 6,
    leagueName: 'Brasileirão Série A',
    country: { it: 'Brasile', en: 'Brazil' },
    continent: 'Sud America',
    type: 'city',
    clubA: {
      name: 'CR Flamengo',
      shortCode: 'FLA',
      wikidataId: 'Q17479',
      primaryColor: '#C52613',
      secondaryColor: '#000000',
      pattern: 'hoops',
      stadiumName: 'Estádio do Maracanã',
      city: 'Rio de Janeiro',
      lat: -22.9121,
      lng: -43.2302,
      capacity: 78838
    },
    clubB: {
      name: 'Fluminense FC',
      shortCode: 'FLU',
      wikidataId: 'Q80987',
      primaryColor: '#8A1538',
      secondaryColor: '#006233',
      pattern: 'stripes',
      stadiumName: 'Estádio do Maracanã',
      city: 'Rio de Janeiro',
      lat: -22.9125,
      lng: -43.2305,
      capacity: 78838
    },
    pRaw: 452,
    pRawSource: 'Wikipedia Infobox — Fla–Flu',
    consecutiveDecades: 12,
    firstYear: 1912,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_carioca_brasileirao',
    winsA: 165,
    draws: 146,
    winsB: 141,
    history: {
      it: 'Nato nel 1911 quando nove giocatori dissidenti del Fluminense lasciarono il club per fondare la sezione calcistica della società di canottaggio del Flamengo. Nel 1963 stabilì al Maracanã il record mondiale di spettatori per una partita tra club (194.603 presenti).',
      en: 'Born in 1911 when nine dissatisfied Fluminense players left to establish the football department of the Flamengo rowing club. In 1963 at the Maracanã, it set the world attendance record for a club football match (194,603 spectators).'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Fla-Flu',
      en: 'https://en.wikipedia.org/wiki/Fla%E2%80%93Flu'
    }
  },
  {
    id: 'grenal',
    name: { it: 'Grenal', en: 'Grenal' },
    leagueRank: 6,
    leagueName: 'Brasileirão Série A',
    country: { it: 'Brasile', en: 'Brazil' },
    continent: 'Sud America',
    type: 'city',
    clubA: {
      name: 'SC Internacional',
      shortCode: 'SCI',
      wikidataId: 'Q80845',
      primaryColor: '#E5050F',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Estádio Beira-Rio',
      city: 'Porto Alegre',
      lat: -30.0656,
      lng: -51.2358,
      capacity: 50842
    },
    clubB: {
      name: 'Grêmio FBPA',
      shortCode: 'GRE',
      wikidataId: 'Q80866',
      primaryColor: '#0D80BF',
      secondaryColor: '#000000',
      pattern: 'stripes',
      stadiumName: 'Arena do Grêmio',
      city: 'Porto Alegre',
      lat: -29.9740,
      lng: -51.1949,
      capacity: 55662
    },
    pRaw: 444,
    pRawSource: 'Wikipedia Infobox — Grenal',
    consecutiveDecades: 13,
    firstYear: 1909,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_gauchao',
    winsA: 164,
    draws: 139,
    winsB: 141,
    history: {
      it: 'Il classico che polarizza l\'intero stato del Rio Grande do Sul dal 1909. Il Grêmio fu fondato dalla comunità di origine tedesca, mentre l\'Internacional nacque dai fratelli Poppe come club aperto a tutte le etnie e classi sociali di Porto Alegre.',
      en: 'The derby that polarizes the entire state of Rio Grande do Sul since 1909. Grêmio was founded by German-Brazilians, while Internacional was created by the Poppe brothers as an inclusive club open to all ethnicities in Porto Alegre.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Grenal',
      en: 'https://en.wikipedia.org/wiki/Grenal'
    }
  },
  {
    id: 'o_classico_portugal',
    name: { it: 'O Clássico', en: 'O Clássico' },
    leagueRank: 7,
    leagueName: 'Primeira Liga',
    country: { it: 'Portogallo', en: 'Portugal' },
    continent: 'Europa',
    type: 'national',
    clubA: {
      name: 'SL Benfica',
      shortCode: 'BEN',
      wikidataId: 'Q131499',
      primaryColor: '#E83030',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Estádio da Luz',
      city: 'Lisbona',
      lat: 38.7527,
      lng: -9.1847,
      capacity: 64642
    },
    clubB: {
      name: 'FC Porto',
      shortCode: 'POR',
      wikidataId: 'Q128446',
      primaryColor: '#00428C',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Estádio do Dragão',
      city: 'Porto',
      lat: 41.1618,
      lng: -8.5836,
      capacity: 50033
    },
    pRaw: 256,
    pRawSource: 'Wikipedia Infobox — O Clássico',
    consecutiveDecades: 11,
    firstYear: 1912,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_primeira_liga',
    winsA: 91,
    draws: 63,
    winsB: 102,
    history: {
      it: 'Riflette la rivalità storica, culturale e politica tra le due maggiori metropoli del Portogallo: la capitale imperiale Lisbona a sud e l\'operosa città mercantile di Porto ("A Invicta") a nord.',
      en: 'Reflects the historical, cultural, and political rivalry between Portugal\'s two largest metropolitan areas: the imperial capital Lisbon in the south and the industrious northern port city of Porto ("A Invicta").'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/O_Cl%C3%A1ssico',
      en: 'https://en.wikipedia.org/wiki/O_Cl%C3%A1ssico'
    }
  },
  {
    id: 'derby_de_lisboa',
    name: { it: 'Dérbi de Lisboa', en: 'Lisbon Derby' },
    leagueRank: 7,
    leagueName: 'Primeira Liga',
    country: { it: 'Portogallo', en: 'Portugal' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'SL Benfica',
      shortCode: 'BEN',
      wikidataId: 'Q131499',
      primaryColor: '#E83030',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Estádio da Luz',
      city: 'Lisbona',
      lat: 38.7527,
      lng: -9.1847,
      capacity: 64642
    },
    clubB: {
      name: 'Sporting CP',
      shortCode: 'SCP',
      wikidataId: 'Q75729',
      primaryColor: '#008057',
      secondaryColor: '#FFFFFF',
      pattern: 'hoops',
      stadiumName: 'Estádio José Alvalade',
      city: 'Lisbona',
      lat: 38.7612,
      lng: -9.1609,
      capacity: 50095
    },
    pRaw: 322,
    pRawSource: 'Wikipedia Infobox — Derby de Lisboa',
    consecutiveDecades: 13,
    firstYear: 1907,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_primeira_liga',
    winsA: 139,
    draws: 69,
    winsB: 114,
    history: {
      it: 'Iniziato nel 1907 quando otto calciatori del Benfica passarono allo Sporting CP, club fondato dall\'aristocrazia lisbonese. I due stadi di Segunda Circular distano appena tre chilometri.',
      en: 'Ignited in 1907 when eight Benfica players defected to wealthier Sporting CP, founded by Lisbon aristocracy. Their two stadiums along the Segunda Circular highway sit barely three kilometers apart.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Lisbona',
      en: 'https://en.wikipedia.org/wiki/Derby_de_Lisboa'
    }
  },
  {
    id: 'de_klassieker',
    name: { it: 'De Klassieker', en: 'De Klassieker' },
    leagueRank: 8,
    leagueName: 'Eredivisie',
    country: { it: 'Paesi Bassi', en: 'Netherlands' },
    continent: 'Europa',
    type: 'national',
    clubA: {
      name: 'AFC Ajax',
      shortCode: 'AJA',
      wikidataId: 'Q81888',
      primaryColor: '#D2122E',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Johan Cruyff Arena',
      city: 'Amsterdam',
      lat: 52.3144,
      lng: 4.9419,
      capacity: 55865
    },
    clubB: {
      name: 'Feyenoord',
      shortCode: 'FEY',
      wikidataId: 'Q134241',
      primaryColor: '#EE1C25',
      secondaryColor: '#FFFFFF',
      pattern: 'halves',
      stadiumName: 'De Kuip',
      city: 'Rotterdam',
      lat: 51.8939,
      lng: 4.5231,
      capacity: 47500
    },
    pRaw: 206,
    pRawSource: 'Wikipedia Infobox — De Klassieker',
    consecutiveDecades: 11,
    firstYear: 1921,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_eredivisie',
    winsA: 94,
    draws: 50,
    winsB: 62,
    history: {
      it: 'Oppone le due più grandi città dei Paesi Bassi: Amsterdam, capitale artistica, creativa e finanziaria ("dove si sogna"), e Rotterdam, il gigantesco porto operaio ricostruito dopo la guerra ("dove si lavora").',
      en: 'Pits the two largest Dutch cities against each other: Amsterdam, the cultural and financial capital ("where people dream"), and Rotterdam, the working-class port city rebuilt from wartime rubble ("where people work").'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/De_Klassieker',
      en: 'https://en.wikipedia.org/wiki/De_Klassieker'
    }
  },
  {
    id: 'kitalararasi_derbi',
    name: { it: 'Kıtalararası Derbi (Derby Intercontinentale)', en: 'Intercontinental Derby' },
    leagueRank: 12,
    leagueName: 'Süper Lig',
    country: { it: 'Turchia', en: 'Turkey' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Fenerbahçe SK',
      shortCode: 'FEN',
      wikidataId: 'Q6601875',
      primaryColor: '#FFED00',
      secondaryColor: '#00205B',
      pattern: 'stripes',
      stadiumName: 'Şükrü Saracoğlu Stadium',
      city: 'Istanbul (Asia)',
      lat: 40.9876,
      lng: 29.0369,
      capacity: 50530
    },
    clubB: {
      name: 'Galatasaray SK',
      shortCode: 'GAL',
      wikidataId: 'Q495299',
      primaryColor: '#A90432',
      secondaryColor: '#FDB912',
      pattern: 'halves',
      stadiumName: 'RAMS Park',
      city: 'Istanbul (Europa)',
      lat: 41.1034,
      lng: 28.9910,
      capacity: 52600
    },
    pRaw: 401,
    pRawSource: 'Wikipedia Infobox — The Intercontinental Derby',
    consecutiveDecades: 13,
    firstYear: 1909,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_super_lig',
    winsA: 149,
    draws: 125,
    winsB: 127,
    history: {
      it: 'L\'unico derby cittadino al mondo diviso dallo stretto del Bosforo tra due continenti: il Galatasaray, fondato nel prestigioso liceo francofono di Beyoğlu nella parte europea di Istanbul, e il Fenerbahçe, espressione popolare di Kadıköy sulla sponda asiatica.',
      en: 'The world\'s only city derby split across two continents by the Bosphorus Strait: Galatasaray, founded inside the prestigious French-speaking Lycée in European Beyoğlu, against Fenerbahçe, rooted in Asian Kadıköy.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_intercontinentale_(calcio)',
      en: 'https://en.wikipedia.org/wiki/The_Intercontinental_Derby_(football)'
    }
  },
  {
    id: 'eternal_enemies_greece',
    name: { it: 'Derby degli Eterni Nemici', en: 'Derby of the Eternal Enemies' },
    leagueRank: 19,
    leagueName: 'Super League Greece',
    country: { it: 'Grecia', en: 'Greece' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'Olympiacos CFP',
      shortCode: 'OLY',
      wikidataId: 'Q19628',
      primaryColor: '#D81E05',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Georgios Karaiskakis Stadium',
      city: 'Il Pireo / Atene',
      lat: 37.9466,
      lng: 23.6644,
      capacity: 33334
    },
    clubB: {
      name: 'Panathinaikos FC',
      shortCode: 'PAO',
      wikidataId: 'Q4122219',
      primaryColor: '#007934',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Stadio Apostolos Nikolaidis',
      city: 'Atene',
      lat: 37.9872,
      lng: 23.7542,
      capacity: 16003
    },
    pRaw: 225,
    pRawSource: 'Wikipedia Infobox — Derby of the eternal enemies',
    consecutiveDecades: 11,
    firstYear: 1925,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_super_league_greece',
    winsA: 89,
    draws: 78,
    winsB: 58,
    history: {
      it: 'La madre di tutte le battaglie del calcio greco oppone il centro storico borghese di Atene (Panathinaikos) ai lavoratori marittimi del porto del Pireo (Olympiacos) sin dal 1925.',
      en: 'The mother of all battles in Greek football pits the old Athenian urban center (Panathinaikos) against the working-class maritime port of Piraeus (Olympiacos) since 1925.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_degli_eterni_nemici',
      en: 'https://en.wikipedia.org/wiki/Derby_of_the_eternal_enemies'
    }
  },
  {
    id: 'vienna_derby',
    name: { it: 'Wiener Derby (Derby di Vienna)', en: 'Vienna Derby' },
    leagueRank: 18,
    leagueName: 'Austrian Bundesliga',
    country: { it: 'Austria', en: 'Austria' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'SK Rapid Wien',
      shortCode: 'RAP',
      wikidataId: 'Q131215',
      primaryColor: '#00854A',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Allianz Stadion',
      city: 'Vienna',
      lat: 48.1981,
      lng: 16.2653,
      capacity: 28600
    },
    clubB: {
      name: 'FK Austria Wien',
      shortCode: 'FAK',
      wikidataId: 'Q131209',
      primaryColor: '#522583',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Generali Arena',
      city: 'Vienna',
      lat: 48.1624,
      lng: 16.3879,
      capacity: 17656
    },
    pRaw: 344,
    pRawSource: 'Wikipedia Infobox — Vienna derby (344th Wiener Derby verified)',
    consecutiveDecades: 12,
    firstYear: 1911,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_austrian_bundesliga_344th_match',
    winsA: 139,
    draws: 85,
    winsB: 120,
    history: {
      it: 'Audit verificato (sostituito assumed_ongoing_2025 con 344° Wiener Derby ufficiale). È il derby cittadino più giocato d\'Europa dopo l\'Old Firm di Glasgow: dal 1911 contrappone l\'anima operaia di Hütteldorf (Rapid) ai caffè letterari borghesi viennesi (Austria Wien).',
      en: 'Audit verified (replaced assumed_ongoing_2025 with verified 344th official Wiener Derby). Europe\'s second most-played city derby after Glasgow\'s Old Firm, pitting working-class Hütteldorf (Rapid) against Viennese coffeehouse intellectual culture (Austria Wien) since 1911.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Vienna',
      en: 'https://en.wikipedia.org/wiki/Vienna_derby'
    }
  },
  {
    id: 'eternal_derby_serbia',
    name: { it: 'Večiti Derbi (Derby Eterno di Belgrado)', en: 'Eternal Derby (Belgrade)' },
    leagueRank: 28,
    leagueName: 'SuperLiga Serbia',
    country: { it: 'Serbia', en: 'Serbia' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'FK Crvena Zvezda',
      shortCode: 'CZV',
      wikidataId: 'Q173009',
      primaryColor: '#E3000F',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Stadion Rajko Mitić (Marakana)',
      city: 'Belgrado',
      lat: 44.7833,
      lng: 20.4647,
      capacity: 51755
    },
    clubB: {
      name: 'FK Partizan',
      shortCode: 'PAR',
      wikidataId: 'Q188656',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Partizan Stadium',
      city: 'Belgrado',
      lat: 44.7886,
      lng: 20.4592,
      capacity: 29775
    },
    pRaw: 268,
    pRawSource: 'Wikipedia Infobox — Eternal derby (Serbia) (league + cup)',
    consecutiveDecades: 9,
    firstYear: 1947,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_superliga_serbia',
    winsA: 117,
    draws: 71,
    winsB: 80,
    history: {
      it: 'Nato nel 1945 a Belgrado tra la Stella Rossa (fondata dalla gioventù antifascista serba) e il Partizan (fondato dall\'Armata Popolare Jugoslava). I due stadi sulla collina di Topčider distano appena 600 metri.',
      en: 'Born in 1945 in Belgrade between Red Star (founded by Serbian youth antifascist associations) and Partizan (founded by the Yugoslav People\'s Army). Their two stadiums on Topčider Hill sit just 600 meters apart.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_eterno_(Belgrado)',
      en: 'https://en.wikipedia.org/wiki/Eternal_derby_(Serbia)'
    }
  },
  {
    id: 'eternal_derby_croatia',
    name: { it: 'Vječni Derbi (Derby Eterno di Croazia)', en: 'Eternal Derby (Croatia)' },
    leagueRank: 24,
    leagueName: 'HNL',
    country: { it: 'Croazia', en: 'Croatia' },
    continent: 'Europa',
    type: 'national',
    clubA: {
      name: 'GNK Dinamo Zagreb',
      shortCode: 'DIN',
      wikidataId: 'Q172890',
      primaryColor: '#00479A',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Stadion Maksimir',
      city: 'Zagabria',
      lat: 45.8189,
      lng: 16.0181,
      capacity: 24851
    },
    clubB: {
      name: 'HNK Hajduk Split',
      shortCode: 'HAJ',
      wikidataId: 'Q181217',
      primaryColor: '#FFFFFF',
      secondaryColor: '#0054A6',
      pattern: 'halves',
      stadiumName: 'Stadion Poljud',
      city: 'Spalato',
      lat: 43.5200,
      lng: 16.4317,
      capacity: 33987
    },
    pRaw: 244,
    pRawSource: 'Wikipedia Infobox — Eternal derby (Croatia)',
    consecutiveDecades: 9,
    firstYear: 1946,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_hnl',
    winsA: 106,
    draws: 64,
    winsB: 74,
    history: {
      it: 'Contrappone la capitale continentale Zagabria (Bad Blue Boys) al cuore marittimo della Dalmazia a Spalato (Torcida Split, il più antico gruppo organizzato d\'Europa fondato nel 1950).',
      en: 'Contrasts the continental capital Zagreb (Bad Blue Boys) against the Adriatic heart of Dalmatia in Split (Torcida Split, Europe\'s oldest organized supporters\' group, founded in 1950).'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_eterno_(Croazia)',
      en: 'https://en.wikipedia.org/wiki/Eternal_derby_(Croatia)'
    }
  },
  {
    id: 'prague_derby',
    name: { it: 'Pražské "S" (Derby di Praga)', en: 'Prague Derby' },
    leagueRank: 15,
    leagueName: 'Chance Liga',
    country: { it: 'Rep. Ceca', en: 'Czechia' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'AC Sparta Praha',
      shortCode: 'SPA',
      wikidataId: 'Q193481',
      primaryColor: '#A6192E',
      secondaryColor: '#FDB913',
      pattern: 'solid',
      stadiumName: 'epet ARENA (Letná)',
      city: 'Praga',
      lat: 50.0998,
      lng: 14.4159,
      capacity: 18944
    },
    clubB: {
      name: 'SK Slavia Praha',
      shortCode: 'SLA',
      wikidataId: 'Q194393',
      primaryColor: '#E2001A',
      secondaryColor: '#FFFFFF',
      pattern: 'halves',
      stadiumName: 'Fortuna Arena (Eden)',
      city: 'Praga',
      lat: 50.0675,
      lng: 14.4716,
      capacity: 19370
    },
    pRaw: 312,
    pRawSource: 'Wikipedia Infobox — Prague derby',
    consecutiveDecades: 14,
    firstYear: 1896,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_chance_liga',
    winsA: 138,
    draws: 75,
    winsB: 99,
    history: {
      it: 'Uno dei derby più antichi del continente europeo: il primo incontro il 29 marzo 1896 sull\'Isola Imperiale di Praga vide un gol dello Slavia annullato perché uno dei due capitani non era d\'accordo con la decisione arbitrale, come prevedeva il regolamento dell\'epoca.',
      en: 'One of continental Europe\'s oldest derbies: the inaugural match on 29 March 1896 saw a Slavia goal disallowed because, under the rules of the era, both team captains had to agree with the referee\'s decision.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Praga',
      en: 'https://en.wikipedia.org/wiki/Prague_derby'
    }
  },
  {
    id: 'canadian_classique',
    name: { it: 'Canadian Classique (401 Derby)', en: 'Canadian Classique (401 Derby)' },
    leagueRank: 13,
    leagueName: 'Major League Soccer',
    country: { it: 'USA / Canada', en: 'USA / Canada' },
    continent: 'Nord America',
    type: 'national',
    clubA: {
      name: 'Toronto FC',
      shortCode: 'TOR',
      wikidataId: 'Q188450',
      primaryColor: '#E31937',
      secondaryColor: '#455560',
      pattern: 'solid',
      stadiumName: 'BMO Field',
      city: 'Toronto',
      lat: 43.6332,
      lng: -79.4186,
      capacity: 30991
    },
    clubB: {
      name: 'CF Montréal',
      shortCode: 'MTL',
      wikidataId: 'Q1140568',
      primaryColor: '#003DA5',
      secondaryColor: '#000000',
      pattern: 'stripes',
      stadiumName: 'Stade Saputo',
      city: 'Montréal',
      lat: 45.5631,
      lng: -73.5526,
      capacity: 19619
    },
    pRaw: 84,
    pRawSource: 'Wikipedia Infobox — Canadian Classique (MLS + Canadian Championship + CONCACAF)',
    consecutiveDecades: 3,
    firstYear: 2008,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_mls_canadian_championship',
    winsA: 39,
    draws: 16,
    winsB: 29,
    history: {
      it: 'Voce canonica aggiunta al posto della pagina-evento singolo "Miracle in Montreal" (partita del 2009). Prende il nome dall\'autostrada Ontario Highway 401 ed esprime lo storico dualismo linguistico e culturale tra il Canada anglofono (Ontario) e quello francofono (Québec).',
      en: 'Canonical rivalry added to replace the single-match page "Miracle in Montreal" (2009 fixture). Named after Ontario Highway 401, it embodies the historic linguistic and cultural duality between English-speaking Ontario and French-speaking Québec.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Canadian_Classique',
      en: 'https://en.wikipedia.org/wiki/Canadian_Classique'
    }
  },
  {
    id: 'el_trafico',
    name: { it: 'El Tráfico (Los Angeles Derby)', en: 'El Tráfico' },
    leagueRank: 13,
    leagueName: 'Major League Soccer',
    country: { it: 'USA / Canada', en: 'USA / Canada' },
    continent: 'Nord America',
    type: 'city',
    clubA: {
      name: 'LA Galaxy',
      shortCode: 'LAG',
      wikidataId: 'Q204357',
      primaryColor: '#00245D',
      secondaryColor: '#FFD200',
      pattern: 'diagonal',
      stadiumName: 'Dignity Health Sports Park',
      city: 'Los Angeles (Carson)',
      lat: 33.8644,
      lng: -118.2611,
      capacity: 27000
    },
    clubB: {
      name: 'Los Angeles FC',
      shortCode: 'LAFC',
      wikidataId: 'Q18390066',
      primaryColor: '#000000',
      secondaryColor: '#C39E6D',
      pattern: 'solid',
      stadiumName: 'BMO Stadium',
      city: 'Los Angeles (Exposition Park)',
      lat: 34.0127,
      lng: -118.2841,
      capacity: 22000
    },
    pRaw: 24,
    pRawSource: 'Wikipedia Infobox — El Tráfico',
    consecutiveDecades: 2,
    firstYear: 2018,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_mls',
    winsA: 10,
    draws: 5,
    winsB: 9,
    history: {
      it: 'Battezzato ironicamente dai tifosi in onore del leggendario traffico autostradale di Los Angeles. Sin dall\'esordio del 2018 (4-3 con doppietta di Ibrahimović), contrappone la dinastia storica dei Galaxy al nuovo club del centro cittadino LAFC.',
      en: 'Playfully named by supporters after Los Angeles\' notorious freeway congestion. Since its explosive 2018 debut (a 4–3 comeback featuring Zlatan Ibrahimović\'s brace), it pits the historic Galaxy dynasty against downtown newcomers LAFC.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/El_Tr%C3%A1fico',
      en: 'https://en.wikipedia.org/wiki/El_Tr%C3%A1fico'
    }
  },
  {
    id: 'cascadia_cup_seattle_portland',
    name: { it: 'Portland Timbers–Seattle Sounders', en: 'Portland Timbers–Seattle Sounders Rivalry' },
    leagueRank: 13,
    leagueName: 'Major League Soccer',
    country: { it: 'USA / Canada', en: 'USA / Canada' },
    continent: 'Nord America',
    type: 'regional',
    clubA: {
      name: 'Seattle Sounders FC',
      shortCode: 'SEA',
      wikidataId: 'Q309095',
      primaryColor: '#5D9741',
      secondaryColor: '#005595',
      pattern: 'solid',
      stadiumName: 'Lumen Field',
      city: 'Seattle',
      lat: 47.5952,
      lng: -122.3316,
      capacity: 68740
    },
    clubB: {
      name: 'Portland Timbers',
      shortCode: 'POR',
      wikidataId: 'Q639463',
      primaryColor: '#004812',
      secondaryColor: '#EBE72B',
      pattern: 'solid',
      stadiumName: 'Providence Park',
      city: 'Portland',
      lat: 45.5216,
      lng: -122.6918,
      capacity: 25218
    },
    pRaw: 121,
    pRawSource: 'Wikipedia Infobox — Portland Timbers–Seattle Sounders rivalry (NASL + USL + MLS)',
    consecutiveDecades: 6,
    firstYear: 1975,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_mls',
    winsA: 60,
    draws: 26,
    winsB: 35,
    history: {
      it: 'La rivalità più longeva e radicata del calcio nordamericano, nata nel 1975 nella storica NASL e proseguita attraverso USL e MLS per 50 anni nella cornice della Cascadia Cup.',
      en: 'The longest-running and deepest rivalry in North American soccer, born in 1975 in the original NASL and contested continuously across USL and MLS eras as the centerpiece of the Cascadia Cup.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Cascadia_Cup',
      en: 'https://en.wikipedia.org/wiki/Portland_Timbers%E2%80%93Seattle_Sounders_rivalry'
    }
  },
  {
    id: 'dc_united_new_england',
    name: { it: 'D.C. United–New England Revolution', en: 'D.C. United–New England Revolution Rivalry' },
    leagueRank: 13,
    leagueName: 'Major League Soccer',
    country: { it: 'USA / Canada', en: 'USA / Canada' },
    continent: 'Nord America',
    type: 'regional',
    clubA: {
      name: 'D.C. United',
      shortCode: 'DCU',
      wikidataId: 'Q238593',
      primaryColor: '#000000',
      secondaryColor: '#EF3E42',
      pattern: 'solid',
      stadiumName: 'Audi Field',
      city: 'Washington, D.C.',
      lat: 38.8689,
      lng: -77.0129,
      capacity: 20000
    },
    clubB: {
      name: 'New England Revolution',
      shortCode: 'NER',
      wikidataId: 'Q309098',
      primaryColor: '#0A2240',
      secondaryColor: '#CE0E2D',
      pattern: 'solid',
      stadiumName: 'Gillette Stadium',
      city: 'Foxborough (Boston)',
      lat: 42.0909,
      lng: -71.2643,
      capacity: 65878
    },
    pRaw: 100,
    pRawSource: 'Wikipedia Infobox — D.C. United–New England Revolution rivalry (MLS Charter clubs)',
    consecutiveDecades: 4,
    firstYear: 1996,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_mls_eastern_conference',
    winsA: 45,
    draws: 18,
    winsB: 37,
    history: {
      it: 'Audit verificato (corretto da assumed_ongoing_2025 al centesimo incontro ufficiale MLS Eastern Conference). Confronto tra due dei dieci club fondatori ("Charter Clubs") della MLS nel 1996.',
      en: 'Audit verified (updated from assumed_ongoing_2025 to verified 100th all-time MLS fixture). A classic Eastern Conference matchup between two original 1996 MLS Charter Clubs.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Major_League_Soccer',
      en: 'https://en.wikipedia.org/wiki/D.C._United%E2%80%93New_England_Revolution_rivalry'
    }
  },
  {
    id: 'super_clasico_mexico',
    name: { it: 'El Súper Clásico (Messico)', en: 'El Súper Clásico (Mexico)' },
    leagueRank: 14,
    leagueName: 'Liga MX',
    country: { it: 'Messico', en: 'Mexico' },
    continent: 'Nord America',
    type: 'national',
    clubA: {
      name: 'Club América',
      shortCode: 'AME',
      wikidataId: 'Q459153',
      primaryColor: '#F5D033',
      secondaryColor: '#002D62',
      pattern: 'solid',
      stadiumName: 'Estadio Azteca',
      city: 'Città del Messico',
      lat: 19.3029,
      lng: -99.1505,
      capacity: 83264
    },
    clubB: {
      name: 'CD Guadalajara (Chivas)',
      shortCode: 'GUA',
      wikidataId: 'Q503321',
      primaryColor: '#E3001B',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Estadio Akron',
      city: 'Guadalajara',
      lat: 20.6817,
      lng: -103.4628,
      capacity: 46232
    },
    pRaw: 258,
    pRawSource: 'Wikipedia Infobox — El Súper Clásico (Mexico)',
    consecutiveDecades: 9,
    firstYear: 1943,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_liga_mx_concacaf',
    winsA: 98,
    draws: 80,
    winsB: 80,
    history: {
      it: 'Il classico nazionale messicano oppone due filosofie agli antipodi: il Club América della capitale, di proprietà del colosso televisivo Televisa e famoso per l\'ingaggio di stelle straniere, contro il Chivas di Guadalajara, che per statuto schiera esclusivamente calciatori messicani.',
      en: 'Mexico\'s national derby contrasts two opposite philosophies: capital giants Club América, backed by media conglomerate Televisa and renowned for foreign stars, against Guadalajara\'s Chivas, which fields exclusively Mexican players by tradition.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/S%C3%BAper_Cl%C3%A1sico_(Messico)',
      en: 'https://en.wikipedia.org/wiki/El_S%C3%BAper_Cl%C3%A1sico_(Mexico)'
    }
  },
  {
    id: 'cairo_derby',
    name: { it: 'Derby del Cairo', en: 'Cairo Derby' },
    leagueRank: 35,
    leagueName: 'Egyptian Premier League',
    country: { it: 'Egitto', en: 'Egypt' },
    continent: 'Africa',
    type: 'city',
    clubA: {
      name: 'Al Ahly SC',
      shortCode: 'AHL',
      wikidataId: 'Q223566',
      primaryColor: '#E30613',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Cairo International Stadium',
      city: 'Il Cairo',
      lat: 30.0691,
      lng: 31.3123,
      capacity: 75000
    },
    clubB: {
      name: 'Zamalek SC',
      shortCode: 'ZAM',
      wikidataId: 'Q286504',
      primaryColor: '#FFFFFF',
      secondaryColor: '#E30613',
      pattern: 'hoops',
      stadiumName: 'Cairo International Stadium',
      city: 'Il Cairo (Giza)',
      lat: 30.0688,
      lng: 31.3128,
      capacity: 75000
    },
    pRaw: 251,
    pRawSource: 'Wikipedia Infobox — Cairo derby (official matches)',
    consecutiveDecades: 11,
    firstYear: 1917,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_egyptian_premier_league',
    winsA: 110,
    draws: 82,
    winsB: 59,
    history: {
      it: 'Il vertice assoluto del calcio africano e arabo. Nato nel 1917 tra l\'Al Ahly ("Il Nazionale", simbolo del movimento anticoloniale egiziano) e lo Zamalek (fondato come Qasr El Nil durante il protettorato britannico e poi associato alla corona di Re Farouk).',
      en: 'The pinnacle of African and Arab club football. Contested since 1917 between Al Ahly ("The National", symbol of Egyptian anticolonial nationalism) and Zamalek (founded as Qasr El Nil and historically linked to King Farouk\'s royal court).'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_del_Cairo',
      en: 'https://en.wikipedia.org/wiki/Cairo_derby'
    }
  },
  {
    id: 'soweto_derby',
    name: { it: 'Soweto Derby', en: 'Soweto Derby' },
    leagueRank: 45,
    leagueName: 'Betway Premiership',
    country: { it: 'Sudafrica', en: 'South Africa' },
    continent: 'Africa',
    type: 'city',
    clubA: {
      name: 'Kaizer Chiefs',
      shortCode: 'KZC',
      wikidataId: 'Q222879',
      primaryColor: '#FDB913',
      secondaryColor: '#000000',
      pattern: 'solid',
      stadiumName: 'FNB Stadium (Soccer City)',
      city: 'Johannesburg (Soweto)',
      lat: -26.2348,
      lng: 27.9826,
      capacity: 94736
    },
    clubB: {
      name: 'Orlando Pirates',
      shortCode: 'ORP',
      wikidataId: 'Q606160',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Orlando Stadium',
      city: 'Johannesburg (Soweto)',
      lat: -26.2317,
      lng: 27.9228,
      capacity: 37313
    },
    pRaw: 181,
    pRawSource: 'Wikipedia Infobox — Soweto derby',
    consecutiveDecades: 6,
    firstYear: 1970,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_psl_nedbank_cup',
    winsA: 74,
    draws: 58,
    winsB: 49,
    history: {
      it: 'Nato il 24 gennaio 1970 a Soweto quando l\'attaccante stella Kaizer Motaung lasciò gli Orlando Pirates per fondare i Kaizer Chiefs. Durante gli anni dell\'apartheid rappresentò il più potente luogo di aggregazione e orgoglio della comunità nera sudafricana.',
      en: 'Born on 24 January 1970 in Soweto when star forward Kaizer Motaung left Orlando Pirates to form Kaizer Chiefs. Throughout the apartheid era, the match served as a massive cultural gathering of pride and solidarity.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Soweto',
      en: 'https://en.wikipedia.org/wiki/Soweto_derby'
    }
  },
  {
    id: 'casablanca_derby',
    name: { it: 'Derby di Casablanca', en: 'Casablanca Derby' },
    leagueRank: 42,
    leagueName: 'Botola Pro',
    country: { it: 'Marocco', en: 'Morocco' },
    continent: 'Africa',
    type: 'city',
    clubA: {
      name: 'Wydad AC',
      shortCode: 'WAC',
      wikidataId: 'Q849797',
      primaryColor: '#E30613',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Stade Mohammed V',
      city: 'Casablanca',
      lat: 33.5829,
      lng: -7.6468,
      capacity: 45891
    },
    clubB: {
      name: 'Raja CA',
      shortCode: 'RCA',
      wikidataId: 'Q818916',
      primaryColor: '#00843D',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Stade Mohammed V',
      city: 'Casablanca',
      lat: 33.5826,
      lng: -7.6465,
      capacity: 45891
    },
    pRaw: 155,
    pRawSource: 'Wikipedia Infobox — Casablanca derby',
    consecutiveDecades: 8,
    firstYear: 1956,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_botola_pro',
    winsA: 40,
    draws: 69,
    winsB: 46,
    history: {
      it: 'Disputato dal 1956, anno dell\'indipendenza del Marocco, nello Stade Mohammed V condiviso. Celebre a livello mondiale per i canti corali e i giganteschi tifo artistici delle curve "Winners" (Wydad) e "Green Boys" (Raja).',
      en: 'Contested since 1956—the year of Moroccan independence—inside the shared Stade Mohammed V. Globally renowned for the thunderous choral anthems and artistic stadium-wide tifos of Wydad and Raja ultras.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Casablanca',
      en: 'https://en.wikipedia.org/wiki/Casablanca_derby'
    }
  },
  {
    id: 'superclasico_uruguayo',
    name: { it: 'Superclásico Uruguayo', en: 'Uruguayan Clásico' },
    leagueRank: 37,
    leagueName: 'Primera División Uruguay',
    country: { it: 'Uruguay', en: 'Uruguay' },
    continent: 'Sud America',
    type: 'city',
    clubA: {
      name: 'CA Peñarol',
      shortCode: 'PEN',
      wikidataId: 'Q16320',
      primaryColor: '#FFCC00',
      secondaryColor: '#000000',
      pattern: 'stripes',
      stadiumName: 'Estadio Campeón del Siglo',
      city: 'Montevideo',
      lat: -34.7969,
      lng: -56.0672,
      capacity: 40700
    },
    clubB: {
      name: 'Club Nacional de Football',
      shortCode: 'NAC',
      wikidataId: 'Q211872',
      primaryColor: '#FFFFFF',
      secondaryColor: '#0038A8',
      pattern: 'solid',
      stadiumName: 'Gran Parque Central',
      city: 'Montevideo',
      lat: -34.8844,
      lng: -56.1589,
      capacity: 34000
    },
    pRaw: 569,
    pRawSource: 'Wikipedia Infobox — Uruguayan Clásico (all-time record matches)',
    consecutiveDecades: 14,
    firstYear: 1900,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_primera_uruguay',
    winsA: 197,
    draws: 185,
    winsB: 187,
    history: {
      it: 'La rivalità calcistica più antica al mondo al di fuori delle isole britanniche (15 luglio 1900) e il record globale del dataset con 569 incontri documentati. Nacque tra il CURCC/Peñarol (fondato da ferrovieri inglesi) e il Nacional (primo club puramente creolo dell\'America Latina).',
      en: 'The oldest football rivalry in the world outside the British Isles (15 July 1900) and the global dataset maximum with 569 documented matches. Born between CURCC/Peñarol (English railway workers) and Nacional (Latin America\'s first purely Creole club).'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Supercl%C3%A1sico_(Uruguay)',
      en: 'https://en.wikipedia.org/wiki/Uruguayan_Cl%C3%A1sico'
    }
  },
  {
    id: 'beijing_shandong_jinglu',
    name: { it: 'Jing-Lu Derby (Beijing–Shandong)', en: 'Jing–Lu Derby' },
    leagueRank: 52,
    leagueName: 'Chinese Super League',
    country: { it: 'Cina', en: 'China' },
    continent: 'Asia',
    type: 'national',
    clubA: {
      name: 'Beijing Guoan FC',
      shortCode: 'BJG',
      wikidataId: 'Q509084',
      primaryColor: '#006838',
      secondaryColor: '#FFD200',
      pattern: 'solid',
      stadiumName: 'Workers\' Stadium',
      city: 'Pechino',
      lat: 39.9304,
      lng: 116.4468,
      capacity: 68000
    },
    clubB: {
      name: 'Shandong Taishan FC',
      shortCode: 'SDT',
      wikidataId: 'Q1046367',
      primaryColor: '#F37021',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Jinan Olympic Sports Center',
      city: 'Jinan',
      lat: 36.6567,
      lng: 117.1219,
      capacity: 56808
    },
    pRaw: 76,
    pRawSource: 'Wikipedia Infobox — Beijing Guoan F.C.–Shandong Taishan F.C. rivalry',
    consecutiveDecades: 4,
    firstYear: 1994,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_csl_verified',
    winsA: 22,
    draws: 25,
    winsB: 29,
    history: {
      it: 'Audit verificato (sostituito assumed_ongoing_2025 con calendario ufficiale CSL). È l\'unica rivalità del calcio professionistico cinese disputata ininterrottamente sin dalla stagione inaugurale della Jia-A League nel 1994 tra due club mai retrocessi.',
      en: 'Audit verified (replaced assumed_ongoing_2025 with verified CSL fixture record). The only rivalry in Chinese professional football played in every single top-flight season since the inaugural 1994 Jia-A League.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Chinese_Super_League',
      en: 'https://en.wikipedia.org/wiki/Beijing_Guoan_F.C.%E2%80%93Shandong_Taishan_F.C._rivalry'
    }
  },
  {
    id: 'gothenburg_derby_gais_ifk',
    name: { it: 'Göteborgsklassikern (IFK–GAIS)', en: 'Gothenburg Classique (IFK–GAIS)' },
    leagueRank: 26,
    leagueName: 'Allsvenskan',
    country: { it: 'Svezia', en: 'Sweden' },
    continent: 'Europa',
    type: 'city',
    clubA: {
      name: 'IFK Göteborg',
      shortCode: 'IFK',
      wikidataId: 'Q201567',
      primaryColor: '#00529B',
      secondaryColor: '#FFFFFF',
      pattern: 'stripes',
      stadiumName: 'Gamla Ullevi',
      city: 'Göteborg',
      lat: 57.7061,
      lng: 11.9806,
      capacity: 18454
    },
    clubB: {
      name: 'GAIS',
      shortCode: 'GAI',
      wikidataId: 'Q211887',
      primaryColor: '#006B3F',
      secondaryColor: '#000000',
      pattern: 'stripes',
      stadiumName: 'Gamla Ullevi',
      city: 'Göteborg',
      lat: 57.7064,
      lng: 11.9809,
      capacity: 18454
    },
    pRaw: 132,
    pRawSource: 'Wikipedia Infobox — GAIS–IFK Göteborg rivalry (Allsvenskan + Cup)',
    consecutiveDecades: 11,
    firstYear: 1911,
    lastYear: 2025,
    lastYearSource: 'infobox_2024_2025_allsvenskan_verified',
    winsA: 64,
    draws: 36,
    winsB: 32,
    history: {
      it: 'Audit verificato (confermato ritorno del GAIS in Allsvenskan nel 2024-2025 dopo 12 anni). Entrambi i club condividono lo stadio Gamla Ullevi a Göteborg.',
      en: 'Audit verified (confirmed GAIS return to Allsvenskan in 2024–2025). Both Gothenburg clubs share Gamla Ullevi and represent one of Scandinavia\'s oldest civic rivalries.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Allsvenskan',
      en: 'https://en.wikipedia.org/wiki/GAIS%E2%80%93IFK_G%C3%B6teborg_rivalry'
    }
  },
  {
    id: 'skanederbyt',
    name: { it: 'Skånederbyt (Malmö–Helsingborg)', en: 'Scanian Derby (Malmö–Helsingborg)' },
    leagueRank: 26,
    leagueName: 'Allsvenskan',
    country: { it: 'Svezia', en: 'Sweden' },
    continent: 'Europa',
    type: 'regional',
    clubA: {
      name: 'Malmö FF',
      shortCode: 'MFF',
      wikidataId: 'Q189361',
      primaryColor: '#6EC4E8',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Eleda Stadion',
      city: 'Malmö',
      lat: 55.5836,
      lng: 12.9875,
      capacity: 22500
    },
    clubB: {
      name: 'Helsingborgs IF',
      shortCode: 'HIF',
      wikidataId: 'Q207512',
      primaryColor: '#E30613',
      secondaryColor: '#003882',
      pattern: 'solid',
      stadiumName: 'Olympia',
      city: 'Helsingborg',
      lat: 56.0497,
      lng: 12.7069,
      capacity: 16500
    },
    pRaw: 124,
    pRawSource: 'Wikipedia Infobox — Helsingborgs IF–Malmö FF rivalry (Allsvenskan matches)',
    consecutiveDecades: 10,
    firstYear: 1931,
    lastYear: 2022,
    lastYearSource: 'infobox_2022_allsvenskan_verified',
    winsA: 56,
    draws: 29,
    winsB: 39,
    history: {
      it: 'Audit verificato (corretto da assumed_ongoing_2025 a 2022, ultimo confronto ufficiale in Allsvenskan prima della discesa dell\'Helsingborg in Superettan). Il grande derby della regione meridionale della Scania.',
      en: 'Audit verified (corrected from assumed_ongoing_2025 to 2022, last official Allsvenskan clash prior to Helsingborg\'s relegation to Superettan). The premier regional derby of southern Sweden\'s Scania province.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Allsvenskan',
      en: 'https://en.wikipedia.org/wiki/Helsingborgs_IF%E2%80%93Malm%C3%B6_FF_rivalry'
    }
  },
  {
    id: 'tehran_derby',
    name: { it: 'Derby di Teheran (Sorkhabi)', en: 'Tehran Derby' },
    leagueRank: 55,
    leagueName: 'Persian Gulf Pro League',
    country: { it: 'Iran', en: 'Iran' },
    continent: 'Asia',
    type: 'city',
    clubA: {
      name: 'Persepolis FC',
      shortCode: 'PER',
      wikidataId: 'Q242260',
      primaryColor: '#DA291C',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Azadi Stadium',
      city: 'Teheran',
      lat: 35.7242,
      lng: 51.2756,
      capacity: 78116
    },
    clubB: {
      name: 'Esteghlal FC',
      shortCode: 'EST',
      wikidataId: 'Q191137',
      primaryColor: '#004B87',
      secondaryColor: '#FFFFFF',
      pattern: 'solid',
      stadiumName: 'Azadi Stadium',
      city: 'Teheran',
      lat: 35.7245,
      lng: 51.2752,
      capacity: 78116
    },
    pRaw: 105,
    pRawSource: 'Wikipedia Infobox — Tehran derby',
    consecutiveDecades: 7,
    firstYear: 1968,
    lastYear: 2025,
    lastYearSource: 'infobox_2025_persian_ gulf_pro_league',
    winsA: 29,
    draws: 50,
    winsB: 26,
    history: {
      it: 'Il derby più imponente dell\'Asia per partecipazione popolare, che contrappone i "Rossi" del Persepolis ai "Blu" dell\'Esteghlal (ex Taj) davanti agli 80.000 spettatori dello Stadio Azadi.',
      en: 'Asia\'s largest city derby by crowd attendance, pitting the "Reds" of Persepolis against the "Blues" of Esteghlal (formerly Taj) inside the colossal Azadi Stadium.'
    },
    wikipediaUrl: {
      it: 'https://it.wikipedia.org/wiki/Derby_di_Teheran',
      en: 'https://en.wikipedia.org/wiki/Tehran_derby'
    }
  }
];

export const EXCLUDED_AUDIT_RECORDS: ExcludedRecord[] = [
  {
    id: 'battle_of_old_trafford',
    wikipediaTitle: 'Battle of Old Trafford',
    clubsMentioned: 'Manchester United vs Arsenal FC (21 September 2003)',
    reasonCode: 'SINGLE_MATCH_EVENT',
    pRawMisattributed: 'p_raw: 49 ("...brought Arsenal\'s unbeaten run to an end after 49 matches...")',
    auditDetail: {
      it: 'ESCLUSO DAL RANKING: Pagina Wikipedia dedicata a una singola partita (21 settembre 2003, 0-0), non a una rivalità storica. Duplicava la voce canonica "arsenal_manchester_united" (p_raw: 243). Inoltre il valore p_raw=49 era stato estratto per errore dalla striscia di 49 partite imbattute dell\'Arsenal in campionato.',
      en: 'EXCLUDED FROM RANKING: Single-match Wikipedia article (21 Sept 2003, 0–0) mistaken for an ongoing rivalry. Duplicated canonical entry "arsenal_manchester_united" (p_raw: 243). Furthermore, p_raw=49 was misattributed from Arsenal\'s 49-match unbeaten league run.'
    }
  },
  {
    id: 'miracle_in_montreal',
    wikipediaTitle: 'Miracle in Montreal',
    clubsMentioned: 'Montreal Impact vs Toronto FC (18 June 2009)',
    reasonCode: 'SINGLE_MATCH_EVENT',
    pRawMisattributed: 'p_raw: 6 (goal margin 1–6 misparsed as match count)',
    auditDetail: {
      it: 'ESCLUSO DAL RANKING: Pagina Wikipedia su una singola partita del Canadian Championship (18 giugno 2009, Montreal Impact 1-6 Toronto FC). Sostituita nel ranking dalla voce canonica verificata "canadian_classique" (401 Derby, p_raw: 84).',
      en: 'EXCLUDED FROM RANKING: Single-match article on the 18 June 2009 Canadian Championship fixture (Montreal Impact 1–6 Toronto FC). Replaced in the ranking by canonical verified entry "canadian_classique" (401 Derby, p_raw: 84).'
    }
  },
  {
    id: 'dirty_river_derby',
    wikipediaTitle: 'Dirty River Derby',
    clubsMentioned: 'Louisville City FC vs FC Cincinnati',
    reasonCode: 'UNVERIFIED_LAST_YEAR',
    auditDetail: {
      it: 'ESCLUSO DAL RANKING (Triage assumed_ongoing_2025): Disputato nella USL tra il 2015 e il 2018 prima del passaggio di FC Cincinnati in MLS. La pagina sorgente non riporta scontri regolari di campionato nel decennio corrente e aveva ricevuto il flag vietato "assumed_ongoing_2025".',
      en: 'EXCLUDED FROM RANKING (assumed_ongoing_2025 triage): Contested in the USL from 2015–2018 before FC Cincinnati joined MLS. Lacks verified ongoing league continuity and was flagged under the prohibited "assumed_ongoing_2025" heuristic.'
    }
  },
  {
    id: 'west_lancashire_derby',
    wikipediaTitle: 'West Lancashire derby',
    clubsMentioned: 'Blackpool FC vs Preston North End',
    reasonCode: 'UNVERIFIED_LAST_YEAR',
    auditDetail: {
      it: 'ESCLUSO DAL RANKING (Triage assumed_ongoing_2025): La voce conteneva il flag "assumed_ongoing_2025" nonostante i due club militassero in categorie diverse (Championship vs League One) nella stagione 2024-25. Esclusa in applicazione della regola rigorosa anti-stima.',
      en: 'EXCLUDED FROM RANKING (assumed_ongoing_2025 triage): Flagged with "assumed_ongoing_2025" despite the clubs competing in separate divisions (Championship vs League One) in 2024–25. Excluded under the zero-estimation rule.'
    }
  }
];
