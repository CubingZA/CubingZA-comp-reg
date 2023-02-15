import React, { useState } from 'react';

import { getToken as getWcaToken } from './services/wca'
import { getToken as getQuicketToken } from './services/quicket'

import WCALogin from './components/login/wca';
import QuicketLogin from './components/login/quicket';

import WCACompSelector from './components/competition-selector/wca-comp-selector';
import QuicketCompSelector from './components/competition-selector/quicket-comp-selector';
import GuestList from './components/guest-list';

export default function App() {

  const isLoggedIn = (getWcaToken() && getQuicketToken().token) ? true : false;

  const [wcaComps, setWcaComps] = useState({selected: {id: null, name: ""}, list: []});
  const [quicketEvents, setQuicketEvents] = useState({selected: {id: null, name: ""}, list: []});

  const [tickets, setTickets] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  let stateContainer = {
    tickets: tickets, 
    setTickets: setTickets,
    registrations, registrations, 
    setRegistrations: setRegistrations
  };
  
  const clearData = () => {
    setTickets([]);
    setRegistrations([]);
  }

  return <>
    <div className='banner'>
      <h1>
        <img className='logo' src="https://cubingza.org/assets/images/logo_web-4d86d0f10f.svg" />
        <span>Comp Registration Admin</span>
      </h1>

      <div className='login-container'>
        <WCALogin/>
        <QuicketLogin/>
      </div>
    </div>


    {!isLoggedIn ? null : <>
        <div className='comp-selector-bar'>
          <WCACompSelector comps={wcaComps} setComps={setWcaComps} clearData={clearData}/>
          <QuicketCompSelector comps={quicketEvents} setComps={setQuicketEvents} clearData={clearData}/>
        </div>
        <div className='body-container'>
          {(wcaComps.selected.name === quicketEvents.selected.name) ? null : 
            <div className='warning-alert'>
              <strong>Danger: </strong>
              Selected competition names do not match. ({wcaComps.selected.name} and {quicketEvents.selected.name})
            </div>
          }
          <GuestList quicketEvent={quicketEvents.selected} wcaComp={wcaComps.selected} stateContainer={stateContainer} />
        </div>
        
      </>
    }

    <div className='footer'>
      <a href="https://github.com/AlphaSheep/CubingZA-comp-reg" target="_blank">GitHub</a>
    </div>
  </>
 
}
