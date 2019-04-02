export const Methods = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const SERVER_ADDRESS = `https://es8-demo-srv.appspot.com/big-trip`;
export const AUTHORIZATION = `Basic er883jdzbdw1372777`;

export const pointsList = {
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

export const Message = {
  LOADING_MESSAGE: `Loading route...`,
  ERROR_MESSAGE: `Something went wrong while loading your route info. Check your connection or try again later.`,
  SAVING_MESSAGE: `Saving...`,
  DELETING_MESSAGE: `Deleting...`,
  SAVE_MESSAGE: `Save`,
  DELETE_MESSAGE: `Delete`,
};

export const SERVICE_MESSAGE_CONTAINER = document.querySelector(`.service-message`);
