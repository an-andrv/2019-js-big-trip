const events = new Map([ // for..of
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`], 
  [`Train`, `🚂`],
  [`Ship`, `🛳️`], 
  [`Transport`, `🚊`], 
  [`Drive`, `🚗`], 
  [`Flight`, `✈️`],
  [`Check-in`, `🏨`], 
  [`Sightseeing`, `🏛️`], 
  [`Restaurant`, `🍴`],
]);

const eventDescription = [`Taxi to`, `Flight to`, `Drive to`, `Check into`];
const cityPoints = [`hotel`, `airport`];

// города
const cities = new Map([ // for..of
  [`AMS`, `Amsterdam`], 
  [`GVA`, `Geneva`], 
  [`CHX`, `Chamonix`]
]);

const offers = new Map([ // for..of
  [`Add luggage`, `30`], 
  [`Switch to comfort class`, `100`], 
  [`Add meal`, `15`], 
  [`Choose seats`, `5`], 
  [`Travel by train`, `40`], 
  [`Order UBER`, `20`], 
  [`Rent a car`, `200`], 
  [`Add breakfast`, `50`]
]);

const chooseSights = () => `http://picsum.photos/300/150?r=${Math.random()}`;

// массив предложений. И случайным образом объединяйте от одного до трех предложений
const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

export const eventData = {
  event: {
    icon: `🚕`,
    title: `Taxi to Airport`,
  },
  time: {
    from: `10:00`,
    to: `11:30`,
    duration: `1h 30m`, //  функция рассчета
  },
  price: `20`,
  offers: new Map(), // `Order UBER` 20, `Upgrade to business` 20
};
