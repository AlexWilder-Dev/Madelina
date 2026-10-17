// Everything the site says about Madelina lives here, split by branch.
// Menus are transcribed from madelina.co.uk/menu-brixton and /menu-dulwich (descriptions verbatim).
// Hours, events, hire and room details come from public listings and reviews; sources in research/notes.md.

import dishBenedict from '../assets/photos/dish-benedict.webp';
import dishEnglish from '../assets/photos/dish-english.webp';
import dishAvocado from '../assets/photos/dish-avocado.webp';
import dishBagel from '../assets/photos/dish-bagel.webp';

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
  dishes: Dish[];
};

/** A single opening window in minutes from midnight, London time. */
export type Session = { open: number; close: number; kind: 'day' | 'wine' };

/** Index 0 = Sunday … 6 = Saturday, matching Date#getDay. */
export type WeekHours = [Session[], Session[], Session[], Session[], Session[], Session[], Session[]];

export type Quote = { text: string; who: string; where: string; when: string };

export type Branch = {
  id: BranchId;
  name: string;
  short: string;
  street: string;
  address: { line1: string; line2?: string; postcode: string };
  phone: { display: string; tel: string };
  geo: { lat: number; lng: number };
  /** How to find it, in a line */
  findUs: string;
  /** What the room is like, from their photos and visitors' accounts */
  room: string;
  quote: Quote;
  photoAlt: string;
  hours: WeekHours;
  menu: MenuSection[];
};

const h = (hh: number, mm = 0) => hh * 60 + mm;
const day = (open: number, close: number): Session => ({ open, close, kind: 'day' });
const wine = (open: number, close: number): Session => ({ open, close, kind: 'wine' });

export const brand = {
  strap: 'Breakfast, brunch, all day everyday',
  /** Their own phrases, for the running line */
  phrases: ['Breakfast', 'Brunch', 'All day', 'Everyday', 'The boozy brunch', 'Vegan bagel sandwiches', 'Gluten-free & vegan treats', 'Amazing coffee and teas'],
  smiles: 'Vibrant foods brought to you with vibrant smiles',
  about:
    'Cafe Madelina, the cozy green cafe has your favourite classic breakfast or the boozy brunch, vegan bagel sandwiches, amazing coffee and teas with gluten-free and vegan treats.',
  lifestyle: 'A Brunch is not a meal. It’s a lifestyle.',
  instagram: { handle: '@madelinalondon', url: 'https://www.instagram.com/madelinalondon/' },
  facebook: { url: 'https://www.facebook.com/madelinalondon/' },
};

/* ------------------------------------------------------------------ menus */

const brixtonMenu: MenuSection[] = [
  {
    id: 'sandwiches',
    title: 'Sandwiches',
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
    street: 'Acre Lane',
    address: { line1: '105 Acre Lane', line2: 'Brixton Hill', postcode: 'SW2 5TU' },
    phone: { display: '020 7326 1560', tel: '+442073261560' },
    geo: { lat: 51.45947, lng: -0.1255581 },
    findUs: 'On the corner, between Brixton and Clapham North; Clapham North station is about 650m away.',
    room: 'A black corner shopfront with a gold M over the door and tables out on the pavement under the awnings. On Friday and Saturday evenings it stays open for wine.',
    quote: {
      text: 'Delicious food and drink, with a wide selection (vegetarian-friendly), at very reasonable prices. The décor is lovely too, and the waitresses are very friendly.',
      who: 'Lola B.',
      where: 'Google review',
      when: '2026',
    },
    photoAlt: 'Madelina Brixton: a black-painted corner shopfront with a gold M on the fascia, a Pride flag over the door and people at tables outside',
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
    street: 'East Dulwich Grove',
    address: { line1: '75 East Dulwich Grove', postcode: 'SE22 8PR' },
    phone: { display: '020 8693 7733', tel: '+442086937733' },
    geo: { lat: 51.458855, lng: -0.079241 },
    findUs: 'At No. 75, five minutes’ walk from East Dulwich station and close to Lordship Lane.',
    room: 'Quiet from the street; inside, a front room with a piano in the corner, armchairs, plants and shelves of books, vases and trinkets. Out the back, a decked garden under a sun sail.',
    quote: {
      text: 'It feels more like someone’s front parlour than a café, and that’s precisely what makes it so appealing.',
      who: 'Homegirl London',
      where: 'blog',
      when: 'August 2025',
    },
    photoAlt: 'Madelina Dulwich at No. 75: black fascia with gold lettering, a grey scalloped awning and bistro tables outside',
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

/* ------------------------------------------------------------------ the counter */

// Not on their website. Names only: the drinks are from the counter chalkboard photographed for
// Volcano Coffee Works (March 2024); pastries and cakes from Homegirl London (Aug 2025), HappyCow,
// DineAwards and Restaurant Guru. Prices on that board are out of date, so none are shown.
export const counter = {
  note: 'Coffee from Volcano Coffee Works. Prices and today’s cakes are on the board.',
  groups: [
    { title: 'Coffee', items: ['Espresso', 'Cafe Latte', 'Cafe Americano', 'Cappuccino', 'Macchiato', 'Flat White'] },
    { title: 'Tea & lattes', items: ['English breakfast tea', 'Earl Grey tea', 'Herb tea', 'Chai Latte', 'Matcha Latte'] },
    { title: 'Smoothies', items: ['Big 5', 'Mother Earth', 'Royal Berries'] },
    { title: 'Pastries & cakes', items: ['Croissant', 'Almond croissant', 'Pain au chocolat', 'Cinnamon bun', 'Pastel de nata', 'Carrot cake', 'Banana bread', 'Blondies'] },
  ],
};

/* ------------------------------------------------------------------ what's on */

export const events = {
  wine: {
    title: 'Wine nights',
    // Fri/Sat 6–11pm per Thatsup (June 2026) and DineAwards; boards per a TripAdvisor reviewer
    body: 'Friday and Saturday evenings at Brixton, 6 till 11: wine, cheese boards and cured meats.',
  },
  garden: {
    title: 'The garden',
    body: 'A decked garden behind the Dulwich café, under a sun sail. Alfresco dining, as the sign says.',
  },
  hire: {
    title: 'Private hire',
    // Dulwich: Venuescanner listing. Brixton: earlier ma.to text and a birthday review.
    body: 'Both cafés take private bookings. Dulwich has two rooms and ten tables for 25 or more, plus the garden, with catering if you want it: kids’ birthdays included.',
  },
};

/* ------------------------------------------------------------------ dish photographs */

// Only dishes we have a real photo of; keyed by dish id so prices come from the chosen café's menu
export const dishPhotos: Record<string, { src: string; alt: string }> = {
  'full-english': { src: dishEnglish, alt: 'Full English breakfast: bacon, sausages, fried eggs, beans, mushrooms, grilled tomato and sourdough, with a latte' },
  'eggs-benedict': { src: dishBenedict, alt: 'Eggs Benedict with bacon, hollandaise, edible flowers and a side salad on a blue painted plate' },
  'avocado-toast': { src: dishAvocado, alt: 'Avocado on toast with cherry tomatoes, pomegranate, pumpkin seeds and violas on a painted plate' },
  'breakfast-bagel': { src: dishBagel, alt: 'Breakfast bagel with bacon, fried egg, avocado and spinach on a green painted plate' },
};

/* ------------------------------------------------------------------ enquiries */

export type EnquiryTypeId = 'table' | 'wine' | 'garden' | 'hire';

export type EnquiryType = {
  id: EnquiryTypeId;
  label: string;
  branches: BranchId[];
  slots: 'day' | 'wine' | 'any';
  reply: string;
};

export const enquiryTypes: EnquiryType[] = [
  { id: 'table', label: 'A table', branches: ['brixton', 'dulwich'], slots: 'day', reply: 'We’ll confirm by phone or email. Walk-ins are always welcome too.' },
  { id: 'wine', label: 'Wine night', branches: ['brixton'], slots: 'wine', reply: 'We’ll confirm your table for the evening by phone or email.' },
  { id: 'garden', label: 'A garden table', branches: ['dulwich'], slots: 'day', reply: 'We’ll confirm a garden table by phone or email, weather permitting.' },
  { id: 'hire', label: 'Private hire', branches: ['brixton', 'dulwich'], slots: 'any', reply: 'We’ll be in touch to talk through the date, numbers and food.' },
];

/* ------------------------------------------------------------------ story */

// From their interview with Volcano Coffee Works, March 2024
export const story = {
  title: 'Eugen and Mady’s',
  paragraphs: [
    'Madelina is family-run. Eugen and Mady moved to London from Romania, spent almost a year working in a local coffee shop, then opened their first café on East Dulwich Grove in October 2013. Brixton followed in 2016.',
    'The coffee has been Volcano’s from the start: it’s what they first trained on, and Volcano’s Brixton HQ is a five-minute walk from Acre Lane.',
  ],
};

/* ------------------------------------------------------------------ a word from visitors */

export const plateQuote: Quote = {
  text: 'It’s a lovely place and the cups and plates are really nice hand made stuff.',
  who: 'willowisp',
  where: 'HappyCow',
  when: 'July 2024',
};
