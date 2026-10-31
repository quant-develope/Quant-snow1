// Site-wide settings. Change values here and rebuild (`npm run build`).
export const site = {
  brand: 'Toronto Snow Removal',
  // Production URL, used for canonical links, sitemap and structured data.
  url: 'https://snow-remove.com',
  phone: { display: '(437) 535-2069', tel: '+14375352069' },
  // WhatsApp chat for the floating button (international format, digits only).
  whatsapp: '14375352069',
  // Partner sites promoted on the thank-you and "You may be interested" pages.
  lightsUrl: 'https://lights-toronto.unknwn-creation.workers.dev/',
  guttersUrl: 'https://gutters-toronto.unknwn-creation.workers.dev/',
  hours: 'Phones answered 24 hours, 7 days',
  area: 'Toronto and the GTA',
  // Google Tag Manager container ID, e.g. 'GTM-XXXXXXX'. Empty = no GTM.
  // Conversions are pushed to dataLayer: generate_lead, phone_click, quote_click.
  gtmId: '',
};

// Services with `img` get a photo card (public/assets/img/work/, .jpg + .webp);
// the rest are listed with an icon under "Other winter jobs".
export const services = [
  {
    id: 'driveways',
    title: 'Driveway Snow Clearing',
    text: 'Single, double or shared driveways shovelled or snow-blown down to the surface, with the packed tire ruts scraped and the edges squared off.',
    img: 'job-driveway',
    alt: 'Toronto driveway beside a brick house after snow clearing',
  },
  {
    id: 'walkways',
    title: 'Walkways, Steps & Porches',
    text: 'The front walk, porch, stairs and city sidewalk in front of your home cleared by hand, so the mail carrier and your guests have safe footing.',
    img: 'job-walkway',
    alt: 'Freshly shovelled front walkway leading to a house door',
  },
  {
    id: 'flat-roofs',
    title: 'Flat Roof Snow Removal',
    text: 'Heavy, wet snow taken off garage roofs, additions and flat-roofed homes before the load causes sagging or leaks. Plastic shovels only, membrane left intact.',
    img: 'job-flat-roof',
    alt: 'Flat roof over Toronto row houses with the snow shovelled off',
  },
  {
    id: 'decks',
    title: 'Decks, Terraces & Balconies',
    text: 'Rooftop patios, back decks and condo balconies cleared and carried down, with doorways and drains opened so meltwater has somewhere to go.',
    img: 'job-roof-deck',
    alt: 'Rooftop terrace next to a door after the snow was cleared',
  },
  {
    id: 'icicles',
    title: 'Icicles & Ice Dams',
    text: 'Dangerous icicles knocked down over entrances and driveways, and channels cut through ice dams at the eaves to stop water backing up under the shingles.',
    img: 'winter-icicles',
    alt: 'Large icicles hanging from a snow-covered roof edge',
  },
  {
    id: 'tight-spots',
    title: 'Narrow Ledges & Tight Spots',
    text: 'Side yards, roof ledges, laneway garages and back gates where a machine cannot fit. Our crew does these spots with hand tools.',
    img: 'job-roof-ledge',
    alt: 'Snow shovel on a narrow roof ledge cleared next to a brick wall',
  },
  {
    id: 'salting',
    title: 'Salting & Ice Melt',
    text: 'Rock salt or a pet-safe melter spread on stairs, ramps and walks after clearing.',
    icon: 'drop',
  },
  {
    id: 'cars',
    title: 'Car Dig-Outs',
    text: 'Vehicles brushed off and shovelled free, street or driveway.',
    icon: 'truck',
  },
  {
    id: 'windrow',
    title: 'Plow Ridge at the Curb',
    text: 'The hard bank left by the city plow broken up and moved.',
    icon: 'road',
  },
  {
    id: 'commercial',
    title: 'Small Business Lots',
    text: 'Store entrances, plazas and parking pads cleared, piles hauled away.',
    icon: 'building',
  },
];

// Service area for the form, the areas list and structured data.
export const cities = [
  'Toronto', 'North York', 'Scarborough', 'Etobicoke', 'East York', 'York', 'Mississauga', 'Brampton',
  'Vaughan', 'Markham', 'Richmond Hill', 'Thornhill', 'Woodbridge', 'Oakville', 'Burlington',
  'Pickering', 'Ajax', 'Whitby', 'Oshawa', 'Newmarket', 'Aurora', 'Stouffville', 'Milton', 'Caledon',
];

// Before / after pairs from real jobs. Files live in public/assets/img/work/
// as ba-<name>.jpg + .webp; pass the name without the ba- prefix or extension.
export const beforeAfter = [
  { before: 'front-path-before', after: 'front-path-after', alt: 'garden path between snowbanks and a small evergreen, first knee-deep and then shovelled through' },
  { before: 'car-drive-before', after: 'car-drive-after', alt: 'car in a driveway in front of a garage, snowed under and then dug out' },
  { before: 'garage-before', after: 'garage-after', alt: 'driveway to a double garage blocked by a plow ridge, then cleared at dusk' },
  { before: 'roof-before', after: 'roof-after', alt: 'low flat roof between brick walls, covered in snow and then cleared' },
];
