// Countries appearing in her empirical work. `id` is the ISO numeric code
// used by the world-atlas TopoJSON (countries-110m). India is the emphasis.
export type Place = {
  id: string; // ISO 3166-1 numeric (as string, matching topojson ids)
  name: string;
  note: string;
  emphasis?: boolean;
};

export const PLACES: Place[] = [
  {
    id: '356',
    name: 'India',
    emphasis: true,
    note: 'The emphasis country. Seva and daan, women-led NGOs, self-help groups, and the Karnataka jasmine growers.',
  },
  { id: '840', name: 'United States', note: 'Congregations and welfare, fundraising careers, CSR among Fortune 100 firms.' },
  { id: '124', name: 'Canada', note: 'Volunteering, charity trust, and immigrant integration through service.' },
  { id: '376', name: 'Israel', note: 'Intergenerational transmission of environmental behaviour; trust in welfare organisations.' },
  { id: '410', name: 'South Korea', note: 'Environmental habitus across generations; the K-Pop cosmopolitanism studies.' },
  { id: '276', name: 'Germany', note: 'Cross-national giving; visiting work at Mannheim and Osnabrück.' },
  { id: '528', name: 'Netherlands', note: 'Comparative philanthropy and food-insecurity social innovation.' },
  { id: '040', name: 'Austria', note: 'Determinants of charitable giving across causes.' },
  { id: '191', name: 'Croatia', note: 'Cross-national volunteering and giving comparisons.' },
  { id: '156', name: 'China', note: 'Comparative philanthropy within the global giving project.' },
  { id: '076', name: 'Brazil', note: 'Aesthetic cosmopolitanism among youth (Paris, São Paulo, Seoul).' },
  { id: '250', name: 'France', note: 'Symbolic boundaries and cultural participation among young adults.' },
  { id: '826', name: 'United Kingdom', note: 'External expertise at the LSE; comparative voluntary-sector work.' },
];

export const EMPHASIS_ID = '356';
export const HIGHLIGHT_IDS = PLACES.map((p) => p.id);
