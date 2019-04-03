export const FILTERS_CONTAINER = document.querySelector(`.trip-filter`);
export const TRIP_DAY_CONTAINER = document.querySelector(`.trip-points`);
export const MAIN_CONTAINER = document.querySelector(`.main`);
export const STATISTICS_CONTAINER = document.querySelector(`.statistic`);
export const VIEW_SWICTHER = document.querySelector(`.view-switch`);
export const MONEY_STATISTICS_CONTAINER = document.querySelector(`.statistic__money`).getContext(`2d`);
export const TRANSPORT_STATISTICS_CONTAINER = document.querySelector(`.statistic__transport`).getContext(`2d`);
export const TIME_STATISTICS_CONTAINER = document.querySelector(`.statistic__time-spend`).getContext(`2d`);
export const SERVICE_MESSAGE_CONTAINER = document.querySelector(`.service-message`);

export const Methods = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const SERVER_ADDRESS = `https://es8-demo-srv.appspot.com/big-trip`;
export const AUTHORIZATION = `Basic er883jdzbdw1372777`;

export const POINTS_LIST = {
  'taxi': {
    icon: `🚕`,
    title: `Taxi to`,
  },
  'bus': {
    icon: `🚌`,
    title: `Bus to`,
  },
  'train': {
    icon: `🚂`,
    title: `Train to`,
  },
  'ship': {
    icon: `🛳️`,
    title: `Ship to`,
  },
  'transport': {
    icon: `🚊`,
    title: `Other transport to`,
  },
  'drive': {
    icon: `🚗`,
    title: `Drive to`,
  },
  'flight': {
    icon: `✈️`,
    title: `Flight to`,
  },
  'check-in': {
    icon: `🏨`,
    title: `Check into`,
  },
  'sightseeing': {
    icon: `🏛️`,
    title: `Sightseeing to`,
  },
  'restaurant': {
    icon: `🍴`,
    title: `Eat in`,
  },
};

export const FILTER_NAMES = [`everything`, `future`, `past`];

export const Message = {
  LOADING_MESSAGE: `Loading route...`,
  ERROR_MESSAGE: `Something went wrong while loading your route info. Check your connection or try again later.`,
  SAVING_MESSAGE: `Saving...`,
  DELETING_MESSAGE: `Deleting...`,
  SAVE_MESSAGE: `Save`,
  DELETE_MESSAGE: `Delete`,
};
