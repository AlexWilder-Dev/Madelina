// Everything the site says about Madelina lives here, split by branch.
// Menus are transcribed from madelina.co.uk/menu-brixton and /menu-dulwich (descriptions verbatim).
// Hours, events and hire details come from public listings; see research/notes.md for sources.

import plateAvocado from '../assets/photos/plate-avocado.webp';
import plateBenedict from '../assets/photos/plate-benedict.webp';
import plateEnglish from '../assets/photos/plate-english.webp';
import plateBagel from '../assets/photos/plate-bagel.webp';
import plateCoffee from '../assets/photos/plate-coffee.webp';
import plateCroissant from '../assets/photos/plate-croissant.webp';

export type BranchId = 'brixton' | 'dulwich';

export type Dish = {
  id: string;
  name: string;
  price: number;
  description: string;
  vegan?: boolean;
};

export type MenuSection = {
  id: 'sandwiches' | 'brunch';
  title: string;
  note?: string;
  dishes: Dish[];
};

/** A single opening window in minutes from midnight, London time. */
export type Session = { open: number; close: number; kind: 'day' | 'wine' };

/** Index 0 = Sunday … 6 = Saturday, matching Date#getDay. */
export type WeekHours = [Session[], Session[], Session[], Session[], Session[], Session[], Session[]];

export type Branch = {
  id: BranchId;
  name: string;
  short: string;
  area: string;
  /** What's on the black fascia above the door: Brixton has their gold M, Dulwich has "No. 75". */
  fascia: 'monogram' | string;
  address: { line1: string; line2?: string; postcode: string };
  phone: { display: string; tel: string };
  geo: { lat: number; lng: number };
  gettingThere: string[];
  outside: string;
  inside?: string;
  hours: WeekHours;
  menu: MenuSection[];
};

const h = (hh: number, mm = 0) => hh * 60 + mm;
const day = (open: number, close: number): Session => ({ open, close, kind: 'day' });
const wine = (open: number, close: number): Session => ({ open, close, kind: 'wine' });

export const brand = {
  name: 'Madelina',
  strap: 'Breakfast, brunch, all day everyday',
  smiles: 'Vibrant foods brought to you with vibrant smiles',
  about:
    'The cozy green cafe has your favourite classic breakfast or the boozy brunch, vegan bagel sandwiches, amazing coffee and teas with gluten-free and vegan treats.',
  lifestyle: 'A Brunch is not a meal. It’s a lifestyle.',
  instagram: { handle: '@madelinalondon', url: 'https://www.instagram.com/madelinalondon/' },
  facebook: { handle: 'madelinalondon', url: 'https://www.facebook.com/madelinalondon/' },
};

/* ------------------------------------------------------------------ menus */

const brixtonMenu: MenuSection[] = [
  {
    id: 'sandwiches',
    title: 'Sandwiches',
    note: 'Bagels and focaccias',
    dishes: [
      { id: 'breakfast-bagel', name: 'Breakfast Bagel', price: 11, description: 'Bacon, Egg, Avocado, Spinach & Garlic Mayo' },
      { id: 'vegan-bagel', name: 'Vegan Bagel', price: 9, description: 'Falafel, Hummus, Tomatoes, Rocket & Vegan Garlic Mayo' },
      { id: 'salmon-bagel', name: 'Salmon Bagel', price: 11, description: 'Smoked Salmon, Herbal Cream cheese, Cucumber, Dill & Lemon' },
      { id: 'festive-bagel', name: 'Festive Bagel', price: 10, description: 'Melted Brie, Bacon, Cranberry Sauce & Toasted Walnuts' },
      { id: 'halloumi-focaccia', name: 'Halloumi Focaccia', price: 11, description: 'Halloumi, Black Olives Tapenade, Avocado & Tomato Focaccia' },
      { id: 'chorizo-focaccia', name: 'Chorizo Focaccia', price: 10, description: 'Egg, Cheese, Spicy Chorizo & Chilli Flakes' },
      { id: 'mozzarella-focaccia', name: 'Mozzarella Focaccia', price: 9, description: 'Mozzarella, Tomatoes, Rocket, House-made Pesto & Balsamic Glaze' },
    ],
  },
  {
    id: 'brunch',
    title: 'Brunch',
    dishes: [
      { id: 'full-english', name: 'Full English Breakfast', price: 15, description: 'Bacon, Sausage, Eggs, Tomato, Baked Beans, Sautéed Mushrooms with Onions & Garlic, Sourdough & Butter' },
      { id: 'veggie-breakfast', name: 'Veggie Breakfast', price: 15, description: 'Halloumi, Falafel, Egg, Tomato, Baked Beans, Sautéed Mushrooms with Onions & Garlic, Spinach Sourdough & Butter' },
      { id: 'garden-bliss', name: 'Garden Bliss', price: 14, vegan: true, description: 'Sweet Potatoes, Falafel, Hummus, Fresh Spinach, Avocado & Mushrooms, Garnished with Mint and Pomegranate seeds, Drizzled with Vegan Garlic Sauce' },
      { id: 'eggs-royal', name: 'Eggs Royal', price: 14, description: 'English Muffin, Smoked Salmon, wilted spinach , 2 Poached Eggs topped with Hollandaise Sauce' },
      { id: 'eggs-benedict', name: 'Eggs Benedict', price: 14, description: '2 Poached eggs on English muffin, wilted spinach, 2 Bacon topped with hollandaise sauce garnished with edible flowers & side salad' },
      { id: 'avocado-toast', name: 'Avocado on Toast', price: 14, description: 'Poached Egg, Avocado on Sourdough with Grilled Cherry Tomatoes, Garnished with Feta, Pomegranate & Pumpkin Seeds' },
      { id: 'soup', name: 'Soup of the Day', price: 8, description: 'Served with toasted sourdough and butter' },
    ],
  },
];

const dulwichMenu: MenuSection[] = [
  {
    id: 'sandwiches',
    title: 'Sandwiches',
    note: 'Bagels and focaccias',
    dishes: [
      { id: 'breakfast-bagel', name: 'Breakfast Bagel', price: 11, description: 'Bacon, Egg, Avocado, Spinach & Garlic Mayo.' },
      { id: 'vegan-bagel', name: 'Vegan Bagel', price: 9, description: 'Falafel, Hummus, Tomatoes, Rocket & Vegan Garlic Mayo' },
      { id: 'salmon-bagel', name: 'Salmon Bagel', price: 11, description: 'Smoked Salmon, Herbal Cream cheese, Cucumber, Dill & Lemon' },
      { id: 'festive-bagel', name: 'Festive Bagel', price: 10, description: 'Melted Brie, Bacon, Cranberry Sauce & Toasted Walnuts' },
      { id: 'halloumi-focaccia', name: 'Halloumi Focaccia', price: 11, description: 'Halloumi, Black Olive tapenade, Avocado, Tomatoes & Rocket with Vegan garlic mayo' },
      { id: 'chorizo-focaccia', name: 'Chorizo Focaccia', price: 10, description: 'Spicy Chorizo, Eggs & Cheese topped with rocket' },
      { id: 'mozzarella-focaccia', name: 'Mozzarella Focaccia', price: 9, description: 'Mozzarella, Tomatoes, Rocket, House-made Pesto & Balsamic Glaze' },
    ],
  },
  {
    id: 'brunch',
    title: 'Brunch',
    dishes: [
      { id: 'full-english', name: 'Full English Breakfast', price: 15, description: 'Bacon, Sausage, Eggs, Tomato, Baked Beans, Sautéed Mushrooms with Onions & Garlic, Sourdough & Butter' },
      { id: 'veggie-breakfast', name: 'Veggie Breakfast', price: 15, description: 'Halloumi, Falafel, Egg, Tomato, Baked Beans, Sautéed Mushrooms with Onions & Garlic, Spinach Sourdough & Butter' },
      { id: 'garden-bliss', name: 'Garden Bliss', price: 14, vegan: true, description: 'Sweet Potatoes, Falafel, Hummus, Fresh Spinach, Avocado & Mushrooms, Garnished with Mint and Pomegranate seeds, Drizzled with Vegan Garlic Sauce' },
      { id: 'eggs-royal', name: 'Eggs Royal', price: 15, description: 'English Muffin, Smoked Salmon, Wilted Spinach, 2 Poached Eggs, topped with Hollandaise Sauce.' },
      { id: 'eggs-benedict', name: 'Eggs Benedict', price: 14, description: 'English Muffin, Bacon, Wilted Spinach, 2 Poached Eggs, topped with Hollandaise sauce' },
      { id: 'avocado-toast', name: 'Avocado on Toast', price: 13, description: 'Poached Egg, Avocado on Sourdough with Grilled Cherry Tomatoes, Garnished with Feta, Pomegranate & Pumpkin Seeds' },
      { id: 'soup', name: 'Soup of the Day', price: 8, description: 'Served with toasted sourdough and butter' },
    ],
  },
];

/* ------------------------------------------------------------------ branches */

export const branches: Record<BranchId, Branch> = {
  brixton: {
    id: 'brixton',
    name: 'Madelina Brixton',
    short: 'Brixton',
    area: 'Acre Lane',
    fascia: 'monogram',
    address: { line1: '105 Acre Lane', line2: 'Brixton Hill', postcode: 'SW2 5TU' },
    phone: { display: '020 7326 1560', tel: '+442073261560' },
    geo: { lat: 51.45947, lng: -0.1255581 },
    gettingThere: [
      'On Acre Lane between Brixton and Clapham North; Clapham North station is about 650m away.',
      'Look for the black corner shopfront with the gold M, and the tables out under the awnings.',
    ],
    outside:
      'Madelina Brixton: a black-painted corner shopfront with a gold M on the fascia, awnings and folding tables outside',
    // Daytime: their Google listing, 17 Oct 2026. Wine nights: Thatsup (June 2026) and DineAwards;
    // Google lists no evening hours, so these are the first thing to confirm with the owners.
    hours: [
      [day(h(10), h(16))],
      [day(h(8), h(15))],
      [day(h(8), h(15))],
      [day(h(8), h(15))],
      [day(h(8), h(15))],
      [day(h(8), h(16)), wine(h(18), h(23))],
      [day(h(9), h(16)), wine(h(18), h(23))],
    ],
    menu: brixtonMenu,
  },
  dulwich: {
    id: 'dulwich',
    name: 'Madelina Dulwich',
    short: 'Dulwich',
    area: 'East Dulwich Grove',
    fascia: 'No. 75',
    address: { line1: '75 East Dulwich Grove', postcode: 'SE22 8PR' },
    phone: { display: '020 8693 7733', tel: '+442086937733' },
    geo: { lat: 51.458855, lng: -0.079241 },
    gettingThere: [
      'Five minutes’ walk from East Dulwich station, close to Lordship Lane.',
      'Look for No. 75 and the grey awning; the garden is through the back.',
    ],
    outside: 'Madelina Dulwich at No. 75: black fascia with gold lettering, a grey awning and bistro tables outside',
    inside:
      'A front room with a piano in the corner, leafy plants, armchairs and shelves of books, vases and trinkets.',
    // Restaurant Guru (Sept 2026), InTravel (Sept 2026), Homegirl London (Aug 2025). Thatsup's older listing omits Sunday.
    hours: [
      [day(h(10), h(15))],
      [day(h(8), h(15))],
      [day(h(8), h(15))],
      [day(h(8), h(15))],
      [day(h(8), h(15))],
      [day(h(8), h(15))],
      [day(h(9), h(15))],
    ],
    menu: dulwichMenu,
  },
};

export function directionsUrl(b: Branch): string {
  const q = encodeURIComponent(`Madelina, ${b.address.line1}, London ${b.address.postcode}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function appleMapsUrl(b: Branch): string {
  const q = encodeURIComponent(`Madelina, ${b.address.line1}, London ${b.address.postcode}`);
  return `https://maps.apple.com/?q=${q}&ll=${b.geo.lat},${b.geo.lng}`;
}

/* ------------------------------------------------------------------ the counter */

// Not on their website. Names only: the drinks are from the counter chalkboard photographed for
// Volcano Coffee Works (March 2024); pastries and cakes from Homegirl London (Aug 2025), DineAwards,
// Restaurant Guru and spinach.guide. Prices on that board are out of date, so none are shown.
export const counter = {
  note: 'Coffee from Volcano Coffee Works. Prices and today’s cakes are on the board at the counter.',
  groups: [
    { title: 'Coffee', items: ['Espresso', 'Cafe Latte', 'Cafe Americano', 'Cappuccino', 'Macchiato', 'Flat White'] },
    { title: 'Tea & lattes', items: ['English breakfast tea', 'Earl Grey tea', 'Herb tea', 'Chai Latte', 'Matcha Latte'] },
    { title: 'Smoothies', items: ['Big 5', 'Mother Earth', 'Royal Berries'] },
    { title: 'Pastries & cakes', items: ['Croissant', 'Almond croissant', 'Pain au chocolat', 'Cinnamon bun', 'Pastel de nata', 'Carrot cake', 'Banana bread', 'Blondies'] },
  ],
};

/* ------------------------------------------------------------------ featured plates */


export type Featured = {
  photo: string;
  alt: string;
  /** Pulls name, price and description from the chosen branch's menu */
  dishId?: string;
  title?: string;
  priceNote?: string;
  line?: string;
};

export const featured: Featured[] = [
  {
    dishId: 'avocado-toast',
    photo: plateAvocado,
    alt: 'Avocado on toast with cherry tomatoes, pomegranate, pumpkin seeds and edible flowers on a painted plate',
  },
  {
    dishId: 'eggs-benedict',
    photo: plateBenedict,
    alt: 'Eggs Benedict with bacon, hollandaise, edible flowers and a side salad on a blue painted plate',
  },
  {
    dishId: 'full-english',
    photo: plateEnglish,
    alt: 'Full English breakfast: bacon, sausages, fried eggs, beans, mushrooms, grilled tomato and sourdough',
  },
  {
    dishId: 'breakfast-bagel',
    photo: plateBagel,
    alt: 'Breakfast bagel with bacon, fried egg, avocado and spinach on a green painted plate',
  },
  {
    photo: plateCoffee,
    alt: 'A latte with a heart in a terracotta cup',
    title: 'Coffee',
    priceNote: 'Volcano',
    line: 'From Volcano Coffee Works, five minutes’ walk from Acre Lane. The owners’ favourite to make: an oat flat white.',
  },
  {
    photo: plateCroissant,
    alt: 'A croissant with butter and jam on a green napkin and painted plate',
    title: 'From the counter',
    priceNote: '',
    line: 'Croissants, almond croissants, pain au chocolat, cinnamon buns.',
  },
];

/* ------------------------------------------------------------------ enquiries */

export type EnquiryTypeId = 'table' | 'wine' | 'garden' | 'hire';

export type EnquiryType = {
  id: EnquiryTypeId;
  label: string;
  icon: 'people' | 'glass' | 'sail' | 'book';
  branches: BranchId[];
  slots: 'day' | 'wine' | 'any';
  blurb: string;
  reply: string;
  occasions?: string[];
};

export const enquiryTypes: EnquiryType[] = [
  {
    id: 'table',
    label: 'A table',
    icon: 'people',
    branches: ['brixton', 'dulwich'],
    slots: 'day',
    blurb: 'Walk-ins are always welcome. Weekends get busy, so it’s worth asking ahead.',
    reply: 'They’ll confirm by phone or email. Walk-ins are still welcome.',
  },
  {
    id: 'wine',
    label: 'Wine night',
    icon: 'glass',
    branches: ['brixton'],
    slots: 'wine',
    blurb: 'Brixton, Friday and Saturday evenings from 6pm.',
    reply: 'They’ll confirm your table for the evening by phone or email.',
  },
  {
    id: 'garden',
    label: 'Garden table',
    icon: 'sail',
    branches: ['dulwich'],
    slots: 'day',
    blurb: 'The decked garden behind the Dulwich café, under the sun sail.',
    reply: 'They’ll confirm a garden table by phone or email, weather permitting.',
  },
  {
    id: 'hire',
    label: 'Private hire',
    icon: 'book',
    branches: ['brixton', 'dulwich'],
    slots: 'any',
    blurb: 'Birthdays, kids’ parties and private functions. Tell them roughly what you have in mind.',
    reply: 'They’ll be in touch to talk through the date, numbers and food.',
    occasions: ['Birthday', 'Kids’ party', 'Private function', 'Something else'],
  },
];

/* ------------------------------------------------------------------ what's on */

export const events = {
  wine: {
    title: 'Wine nights',
    // Fri/Sat 6–11pm per Thatsup (updated June 2026) and DineAwards; boards per a TripAdvisor reviewer
    body: 'On Friday and Saturday evenings the Brixton café stays open late for wine, with cheese boards and cured meats.',
    when: 'Friday & Saturday, 6pm–11pm',
  },
  hire: {
    brixton: {
      title: 'Hire the Brixton café',
      body: 'The corner café on Acre Lane can be booked for private events, birthdays included. Tell them the date and how many of you there are.',
    },
    dulwich: {
      // Venuescanner listing for the Dulwich café
      title: 'Hire the Dulwich café',
      body: 'Two rooms with ten tables for 25 or more, plus the garden. Kids’ birthday parties and private functions, with catering if you want it.',
    },
  },
  garden: {
    title: 'The back garden',
    body: 'Behind the front room in East Dulwich there’s a quiet decked garden with a sun sail overhead and a privacy wall. Alfresco dining, as the sign says.',
  },
};

/* ------------------------------------------------------------------ story */

// From their interview with Volcano Coffee Works, March 2024
export const story = {
  title: 'Family-run, from Romania to East Dulwich',
  paragraphs: [
    'Madelina is Eugen and Mady’s. They moved to London from Romania, spent almost a year working in a local coffee shop learning how London drinks its coffee, then opened their first café on East Dulwich Grove in October 2013. Brixton followed in 2016.',
    'The coffee has been Volcano’s from the start: it’s what they first trained on, and Volcano’s Brixton HQ is a five-minute walk from Acre Lane.',
  ],
};

/* ------------------------------------------------------------------ reviews */

export type Review = { quote: string; who: string; where: string; when?: string; branch: BranchId };

// Only real, credited reviews, quoted exactly. Sources in research/notes.md.
export const reviews: Review[] = [
  {
    quote: 'Delicious food and drink, with a wide selection (vegetarian-friendly), at very reasonable prices. The décor is lovely too, and the waitresses are very friendly.',
    who: 'Lola B.',
    where: 'Google review',
    when: '2026',
    branch: 'brixton',
  },
  {
    quote: 'My fiancé and I have just moved around the corner and thought we’d check it out and wow! Food, service and coffee were unreal.',
    who: 'Jack V.',
    where: 'Google review',
    when: '2026',
    branch: 'brixton',
  },
  {
    quote: 'It’s a lovely place and the cups and plates are really nice hand made stuff.',
    who: 'willowisp',
    where: 'HappyCow',
    when: 'July 2024',
    branch: 'brixton',
  },
  {
    quote: 'A lovely cafe with amazing food. I took my daughter here and she loved the egg and avocado salad.',
    who: 'Jonathan W.',
    where: 'Google review',
    when: '2026',
    branch: 'dulwich',
  },
  {
    quote: 'The vegan banana bread was so delicious! Chai latte was very big and also good',
    who: 'ARN14',
    where: 'HappyCow',
    when: 'April 2025',
    branch: 'brixton',
  },
  {
    quote: 'It feels more like someone’s front parlour than a café, and that’s precisely what makes it so appealing.',
    who: 'Homegirl London',
    where: 'blog',
    when: 'August 2025',
    branch: 'dulwich',
  },
  {
    quote: 'Homely Brixton café Madelina is a popular spot for brunch.',
    who: 'Thatsup',
    where: 'The best cafés in Brixton',
    when: 'July 2025',
    branch: 'brixton',
  },
  {
    quote: 'Chorizo focaccia was fantastic!!',
    who: 'Cookie',
    where: 'Venuescanner',
    when: 'July 2025',
    branch: 'dulwich',
  },
];
