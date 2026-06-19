// Research clusters. All titles & years traceable to the CV / dossier.
// Families inform colour weight and grouping only; they are never labelled on the site.
export type Family = 'foundations' | 'giving' | 'impact';

export type Leaf = { title: string; year?: number; status?: string; doi?: string };

export type Cluster = {
  id: string;
  label: string;
  family: Family;
  blurb: string;
  leaves: Leaf[];
};

export const HUB = { label: 'Femida Handy', sub: 'Measuring generosity' };

export const FAMILY_LABEL: Record<Family, string> = {
  foundations: 'Foundations',
  giving: 'Giving and volunteering',
  impact: 'Impact and place',
};

export const CLUSTERS: Cluster[] = [
  {
    id: 'econ',
    label: 'Economics of nonprofits',
    family: 'foundations',
    blurb: 'Why nonprofits exist, why they are trusted, what their labor is worth.',
    leaves: [
      { title: 'Reputation as collateral: trustees in nonprofits', year: 1995 },
      { title: 'Getting more by paying less? Nonprofit wage differentials', year: 1998 },
      { title: 'Coexistence of nonprofit, for-profit and public sectors', year: 1997 },
      { title: 'Interchangeability of paid staff and volunteers', year: 2008 },
    ],
  },
  {
    id: 'csr',
    label: 'Corporate social responsibility',
    family: 'foundations',
    blurb: 'Mandatory versus voluntary corporate giving.',
    leaves: [
      { title: 'CSR: voluntary or mandated, does it matter?', year: 2018 },
      { title: 'CSR and COVID-19: Fortune 100 companies', year: 2021 },
      { title: 'Attractiveness of CSR in job choice decisions in India', year: 2020 },
    ],
  },
  {
    id: 'vol',
    label: 'Volunteering',
    family: 'giving',
    blurb: 'Who counts as a volunteer, and what volunteering costs and returns.',
    leaves: [
      { title: 'Defining who is a volunteer', year: 1996 },
      { title: 'Public perception of who is a volunteer', year: 2000 },
      { title: 'Valuing volunteers: net benefits of hospital volunteers', year: 2004 },
      { title: 'Is it all about resume building? Student volunteering', year: 2010 },
    ],
  },
  {
    id: 'phil',
    label: 'Philanthropy and giving',
    family: 'giving',
    blurb: 'Why people give, and how norms and information shape giving.',
    leaves: [
      { title: 'The Motives to Donate Scale', year: 2018 },
      { title: 'Keeping up with the Joneses: norms and giving', year: 2009 },
      { title: 'The good-looking giver effect', year: 2021 },
      { title: 'Gendered giving', year: 2010 },
    ],
  },
  {
    id: 'global',
    label: 'Global philanthropy',
    family: 'giving',
    blurb: 'Giving across cultures and institutions, twenty-six nations and regions.',
    leaves: [
      { title: 'The Palgrave Handbook of Global Philanthropy', year: 2016 },
      { title: 'Does institutional context matter for giving?', year: 2021 },
      { title: 'Cross-national student volunteering studies', year: 2010 },
    ],
  },
  {
    id: 'health',
    label: 'Volunteering and health',
    family: 'impact',
    blurb: 'Generosity as a factor in wellbeing and longevity.',
    leaves: [
      { title: 'Volunteering as intervention for young adults on the autism spectrum (TUNE In)', year: 2014 },
      { title: 'Does retirement from volunteering affect wellbeing?', year: 2023 },
      { title: 'Voting predicts lower mortality risk: Is it a social determinant of health?', status: 'Current research' },
      { title: 'Volunteering and wellbeing among aging adults', year: 2019 },
    ],
  },
  {
    id: 'india',
    label: 'India and microfinance',
    family: 'impact',
    blurb: 'Women-led NGOs, self-help groups, and the traditions of seva and daan.',
    leaves: [
      { title: 'From Seva to Cyberspace: volunteering in India', year: 2011 },
      { title: 'Grass-roots NGOs by women for women', year: 2006 },
      { title: 'Self-Help Group bank linkage and ancillary employment', year: 2024 },
      { title: 'Jasmine growers of coastal Karnataka', year: 2011 },
    ],
  },
  {
    id: 'env',
    label: 'Environmental habitus',
    family: 'impact',
    blurb: 'How pro-environmental behavior is transmitted across generations.',
    leaves: [
      { title: 'Intergenerational transmission of environmental behavior, US, Israel, Korea', year: 2020 },
      { title: 'Environmental philanthropy', year: 2012 },
      { title: "Sandy's Incredible Shrinking Footprint, children's book", year: 2010 },
    ],
  },
];
