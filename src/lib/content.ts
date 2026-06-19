export const profile = {
  name: 'Femida Handy',
  role: 'Professor, School of Social Policy & Practice',
  institution: 'University of Pennsylvania',
  email: 'fhandy@upenn.edu',
  address: '3701 Locust Walk, Philadelphia, PA 19104',
  orcid: 'https://orcid.org/0000-0003-3200-8042',
  pennProfile: 'https://sp2.upenn.edu/person/femida-handy/',
} as const;

export const stats = [
  { value: 5, suffix: '', label: 'decades of scholarship' },
  { value: 100, suffix: '+', label: 'articles and chapters' },
  { value: 9, suffix: '', label: 'authored and edited books' },
  { value: 26, suffix: '', label: 'nations and regions in one handbook' },
  { value: 6, suffix: '', label: 'years as NVSQ Editor-in-Chief' },
] as const;

export const ideas = [
  {
    index: '01',
    year: '1995',
    title: 'Reputation as collateral',
    body: 'Trustees place their personal reputations behind nonprofit organizations. That reputational stake can function like collateral by giving donors a reason to trust the institution.',
    note: 'Outstanding Published Article Award, NVSQ, 1996',
  },
  {
    index: '02',
    year: '1996',
    title: 'Who counts as a volunteer',
    body: 'The net-cost approach defines volunteering through what a person gives up relative to what they receive. Later cross-national work tested how that judgment changes across cultures.',
    note: 'Defining who is a volunteer',
  },
  {
    index: '03',
    year: '1998',
    title: 'Getting more by paying less',
    body: 'Nonprofit wage differentials can reflect labor donation. Some workers accept lower pay because the organization’s mission is part of the value they receive from the job.',
    note: 'Nonprofit wage differentials and labor donation',
  },
  {
    index: '04',
    year: '2018',
    title: 'The Motives to Donate Scale',
    body: 'Developed with Sara Konrath, the validated scale measures distinct reasons people give, including trust, social influence, tax considerations, and concern for others.',
    note: 'AFP Skystone Partners Research Prize, 2020',
  },
  {
    index: '05',
    year: '2021',
    title: 'Giving and the giver',
    body: 'Later work examines how volunteering and civic participation relate to wellbeing, social perception, and health, including how giving is perceived and how civic life connects to longevity.',
    note: 'The Good-looking Giver Effect and related health research',
  },
] as const;

export const books = [
  {
    title: 'The Invisible Caring Hand',
    year: 2002,
    note: 'American congregations and the provision of welfare.',
    color: '#17366f',
  },
  {
    title: 'Grass-roots NGOs by Women for Women',
    year: 2006,
    note: 'Women-led organizations and development in India.',
    color: '#264f83',
  },
  {
    title: 'Sense and Sustainability',
    year: 2009,
    note: 'Integrating knowledge in environmental studies.',
    color: '#436c8f',
  },
  {
    title: "Sandy's Incredible Shrinking Footprint",
    year: 2010,
    note: 'A children’s book about ecological footprint, also published in French, Dutch, and Korean.',
    color: '#8f342e',
  },
  {
    title: 'From Seva to Cyberspace',
    year: 2011,
    note: 'The changing face of volunteering in India.',
    color: '#345d79',
  },
  {
    title: 'The Palgrave Handbook on Global Philanthropy',
    year: 2016,
    note: 'Comparative philanthropy across twenty-six nations and regions.',
    color: '#132f62',
  },
  {
    title: 'Philanthropy in India',
    year: 2016,
    note: 'Practice and promise in Indian philanthropy.',
    color: '#67573f',
  },
  {
    title: 'Ethical Decision-Making for Social Impact',
    year: 2018,
    note: 'A framework for ethical decisions in social-impact organizations.',
    color: '#722e35',
  },
  {
    title: 'Philanthropy in a Different Perspective',
    year: 2022,
    note: 'Voices from Ethiopia, Nigeria, and Serbia.',
    color: '#203e69',
  },
] as const;

export const recognition = [
  { year: '2020', honor: 'AFP Skystone Partners Research Prize', work: 'The Development and Validation of the Motives to Donate Scale' },
  { year: '2016', honor: 'Virginia A. Hodgkinson Research Book Prize', work: 'The Palgrave Handbook on Global Philanthropy' },
  { year: '2016', honor: 'Emerald Best International Symposium Award', work: 'Academy of Management' },
  { year: '2012', honor: 'Citizens Movement for Environmental Justice Commendation', work: "Korean edition of Sandy's Incredible Shrinking Footprint" },
  { year: '2011', honor: 'Best Books for Kids and Teens', work: "Canadian Children's Book Centre" },
  { year: '2010', honor: 'Editors’ Prize for Best Scholarly Paper', work: 'Nonprofit Management & Leadership' },
  { year: '1997', honor: 'Honorable Mention for an Outstanding Published Article', work: 'Defining who is a volunteer' },
  { year: '1996', honor: 'Outstanding Published Article Award', work: 'Reputation as collateral' },
  { year: '1996', honor: 'Outstanding Dissertation Award', work: 'Association for Research on Nonprofit Organizations and Voluntary Action' },
] as const;
