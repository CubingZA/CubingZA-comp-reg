import axios from 'axios';

export function getToken() {
  return sessionStorage.getItem('wca_token');
}

export function getCompetitions() {
  const token = getToken();
  if (!token) {return Promise.resolve()}

  const numDaysBack = 14;

  const urlBase = process.env.REACT_APP_WCA_URL;
  const endpoint = "/api/v0/competitions";
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - numDaysBack);

  return axios.get(urlBase + endpoint, {
    headers: {
      Authorization: `Bearer ${token}`
    },  
    params: {
      managed_by_me: true,
      start: startDate.toISOString(),
    },
  })
}

export function getRegistrations(comp) {  
  const token = getToken();
  if (!token || !comp.id) {return Promise.resolve()}

  const urlBase = process.env.REACT_APP_WCA_URL;
  const endpoint = `/api/v0/competitions/${comp.id}/wcif`;

  console.log(urlBase + endpoint);

  return axios.get(urlBase + endpoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(extractRegistrations)
}

function extractRegistrations(response) {
  const persons = response.data.persons;
  let regList = [];
  for (let i in persons) {
    let registration = extractRegInfo(persons[i]);
    if (registration) {
      regList.push(registration);
    }
  }
  return regList;  
}

function extractRegInfo(info) {
  if (!info["registration"]) {
    return;
  }

  const name = info["name"].trim();
  const email = info["email"].toLowerCase();
  const status = info["registration"]["status"];
  const wcaid = info["wcaId"];
  const organizer = info["roles"].indexOf("organizer") >= 0;
  const delegate = info["roles"].indexOf("delegate") >= 0;

  return {
    name: name,
    email: email,
    status: status,
    wcaid: wcaid,    
    organizer: organizer,
    delegate: delegate,    
  }
}