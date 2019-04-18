export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const SERVER_ADDRESS = `https://es8-demo-srv.appspot.com/big-trip`;
export const AUTHORIZATION = `Basic er883jdzbdw13777`;
export const POINTS_STORE_KEY = `points`;
export const OFFERS_HANDBOOK_STORE_KEY = `offers`;
export const DESTINATIONS_HANDBOOK_STORE_KEY = `destinations`;

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
export const SORT_NAMES = [`price`, `time`, `event`];

export const Message = {
  LOADING: `Loading route...`,
  ERROR: `Something went wrong while loading your route info. Check your connection or try again later.`,
  SAVING: `Saving...`,
  DELETING: `Deleting...`,
  SAVE: `Save`,
  DELETE: `Delete`,
};

export const chartName = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME`,
};
