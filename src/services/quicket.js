import axios from 'axios';

export function getToken() {
  return {
    api_key: localStorage.getItem('quicket_api_key'),
    token: localStorage.getItem('quicket_api_token'),
  }
}

export function getEvents() {
  const token = getToken();
  if (!token.token) {return Promise.resolve()}

  const url = "https://api.quicket.co.za/api/users/me/events";
  return axios.get(url, {
    headers: {
      usertoken: token.token
    },
    params: {
      api_key: token.api_key
    },
  });
}

export function getGuestList(event) {
  const token = getToken();
  if (!token.token || !event.id) {return Promise.resolve()}

  const url = `https://api.quicket.co.za/api/events/${event.id}/guests`;
  return axios.get(url, {
    headers: {
      usertoken: token.token
    },
    params: {
      api_key: token.api_key
    },
  })
  .then(convertGuestlistResponseTable);
}

export function convertGuestlistResponseTable(response) {
  let guestList = [];
  for (let i in response.data.results) {
    let ticket = extractTicketInfo(response.data.results[i]);
    if (ticket) {
      guestList.push(ticket);
    }
  }
  return guestList;
}

function extractTicketInfo(ticket) {
  if (ticket["Valid"]) {
    const info = ticket["TicketInformation"];
    const name = info["First name"].trim() + " " + info["Surname"];
    const email = info["Email"].toLowerCase();
    const order_email = info["Purchaser Email"].toLowerCase();
    const wcaid = getWCAIDfield(info);
    return {
      name: name,
      email: email,
      order_email: order_email,
      wcaid: wcaid,    
    }

  }
}

function getWCAIDfield(info) {
  const key = Object.keys(info).filter(prop => prop.toLowerCase().startsWith("wcaid"))[0];
  return info[key];
}
