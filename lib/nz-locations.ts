/* ------------------------------------------------------------------ */
/*  NZ regions → cities → central postcodes                            */
/*                                                                     */
/*  Demo mapping of New Zealand's 16 regions and their main urban      */
/*  centres. Postcodes are each city's central (CBD) postcode —        */
/*  individual suburbs differ, so the checkout keeps the postcode      */
/*  field editable after auto-fill.                                    */
/* ------------------------------------------------------------------ */

export interface NzCity {
  name: string;
  /** Central / CBD postcode used for auto-fill & rate quotes */
  postcode: string;
}

export interface NzRegion {
  name: string;
  cities: NzCity[];
}

export const NZ_REGIONS: NzRegion[] = [
  {
    name: 'Auckland',
    cities: [
      { name: 'Auckland Central', postcode: '1010' },
      { name: 'North Shore', postcode: '0622' },
      { name: 'Waitakere', postcode: '0612' },
      { name: 'Manukau', postcode: '2104' },
      { name: 'Albany', postcode: '0632' },
      { name: 'Papakura', postcode: '2110' },
      { name: 'Pukekohe', postcode: '2120' },
    ],
  },
  {
    name: 'Northland',
    cities: [
      { name: 'Whangārei', postcode: '0110' },
      { name: 'Kerikeri', postcode: '0230' },
      { name: 'Paihia', postcode: '0200' },
      { name: 'Kaitaia', postcode: '0410' },
      { name: 'Dargaville', postcode: '0310' },
    ],
  },
  {
    name: 'Waikato',
    cities: [
      { name: 'Hamilton', postcode: '3204' },
      { name: 'Cambridge', postcode: '3432' },
      { name: 'Taupō', postcode: '3330' },
      { name: 'Thames', postcode: '3500' },
      { name: 'Te Kuiti', postcode: '3910' },
    ],
  },
  {
    name: 'Bay of Plenty',
    cities: [
      { name: 'Tauranga', postcode: '3110' },
      { name: 'Mount Maunganui', postcode: '3116' },
      { name: 'Rotorua', postcode: '3010' },
      { name: 'Whakatāne', postcode: '3120' },
    ],
  },
  {
    name: 'Gisborne',
    cities: [{ name: 'Gisborne', postcode: '4010' }],
  },
  {
    name: "Hawke's Bay",
    cities: [
      { name: 'Napier', postcode: '4110' },
      { name: 'Hastings', postcode: '4122' },
      { name: 'Havelock North', postcode: '4130' },
    ],
  },
  {
    name: 'Taranaki',
    cities: [
      { name: 'New Plymouth', postcode: '4310' },
      { name: 'Hāwera', postcode: '4610' },
    ],
  },
  {
    name: 'Manawatū-Whanganui',
    cities: [
      { name: 'Palmerston North', postcode: '4410' },
      { name: 'Whanganui', postcode: '4500' },
      { name: 'Feilding', postcode: '4702' },
      { name: 'Levin', postcode: '5510' },
    ],
  },
  {
    name: 'Wellington',
    cities: [
      { name: 'Wellington Central', postcode: '6011' },
      { name: 'Lower Hutt', postcode: '5010' },
      { name: 'Upper Hutt', postcode: '5018' },
      { name: 'Porirua', postcode: '5022' },
      { name: 'Paraparaumu', postcode: '5032' },
      { name: 'Masterton', postcode: '5810' },
    ],
  },
  {
    name: 'Nelson',
    cities: [{ name: 'Nelson', postcode: '7010' }],
  },
  {
    name: 'Tasman',
    cities: [
      { name: 'Richmond', postcode: '7020' },
      { name: 'Motueka', postcode: '7120' },
    ],
  },
  {
    name: 'Marlborough',
    cities: [
      { name: 'Blenheim', postcode: '7201' },
      { name: 'Picton', postcode: '7220' },
    ],
  },
  {
    name: 'West Coast',
    cities: [
      { name: 'Greymouth', postcode: '7805' },
      { name: 'Hokitika', postcode: '7810' },
      { name: 'Westport', postcode: '7825' },
    ],
  },
  {
    name: 'Canterbury',
    cities: [
      { name: 'Christchurch Central', postcode: '8011' },
      { name: 'Riccarton', postcode: '8041' },
      { name: 'Rangiora', postcode: '7400' },
      { name: 'Rolleston', postcode: '7614' },
      { name: 'Ashburton', postcode: '7700' },
      { name: 'Timaru', postcode: '7910' },
    ],
  },
  {
    name: 'Otago',
    cities: [
      { name: 'Dunedin', postcode: '9016' },
      { name: 'Queenstown', postcode: '9300' },
      { name: 'Wānaka', postcode: '9305' },
      { name: 'Oamaru', postcode: '9400' },
    ],
  },
  {
    name: 'Southland',
    cities: [
      { name: 'Invercargill', postcode: '9810' },
      { name: 'Gore', postcode: '9710' },
    ],
  },
];
