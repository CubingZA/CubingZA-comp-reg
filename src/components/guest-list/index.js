import { useState } from 'react';
import { getGuestList } from '../../services/quicket';
import { getRegistrations } from '../../services/wca';
import { matchRegistrationsToPayments } from '../../services/payments-matcher';
import EventLinks from '../event-link';

import './guest-list.less';

export default function GuestList({quicketEvent, wcaComp, stateContainer}) {

  const {tickets, setTickets, registrations, setRegistrations} = stateContainer;
  const [loadingQuicket, setLoadingQuicket] = useState(false);
  const [loadingWCA, setLoadingWCA] = useState(false);

  if (quicketEvent.id && tickets.length === 0 && !loadingQuicket) {
    getGuestList(quicketEvent)
    .then(data => {
      if (data) {
        setTickets(data);
        setLoadingQuicket(false);
      }
    })
    setLoadingQuicket(true);
  }

  if (wcaComp.id && registrations.length === 0 && !loadingWCA) {    
    getRegistrations(wcaComp)
    .then(data => {
      if (data) {
        setRegistrations(data);
        setLoadingWCA(false);
      }
    })
    setLoadingWCA(true);
  }

  return <div>

    {tickets.length ? null : <div>Loading tickets...</div>}
    {registrations.length ? null : <div>Loading registration...</div>}

    <EventLinks wcaComp={wcaComp} quicketEvent={quicketEvent}/>

    {tickets.length && registrations.length ? 
    <RegistrationTables tickets={tickets} registrations={registrations} compId={wcaComp.id}/>
    : null}
  </div>
}

function RegistrationTables({ tickets, registrations, compId}) {
  const {pending, unregistered, unpaid, acceptedMissingPayment, acceptedPaid, deleted} = matchRegistrationsToPayments(tickets, registrations);
  return <div className='guest-list'>
    <h3>Pending</h3>
    <RegistrationTable data={pending} className="pending"/>
    <h3>Awaiting payment</h3>
    <RegistrationTable data={unpaid} className="awaiting"/>
    <h3>Not yet registered</h3>
    <RegistrationTable data={unregistered} className="unregistered" showRegisterButton={true} compId={compId}/>
    <h3>Accepted but no payment matched</h3>
    <RegistrationTable data={acceptedMissingPayment} className="accepted-not-paid"/>
    <h3>Accepted</h3>
    <RegistrationTable data={acceptedPaid} className="accepted-paid"/>
    <h3>Deleted</h3>
    <RegistrationTable data={deleted} className="deleted"/>
  </div>
}

function RegistrationTable({data, className, showRegisterButton, compId}) {
  return <div> 
      <table className={className}>
        <thead>
          <tr>
            <th>WCAID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => <tr key={row.wcaid+row.name+row.email}>
            <td>{row.wcaid}</td>
            <td>{showRegisterButton ? <RegisterButton data={row} compId={compId}/> : null} {row.name}</td>
            <td>{row.email}</td>
            <td className='status-column'><StatusTags data={row}/></td>
          </tr>)}
        </tbody>
      </table>
    
  </div>
}

function StatusTags({data}) {
  return <>
    {data.paid ? <span className='status-tag'>Paid</span> : null}
    {data.organizer ? <span className='status-tag'>Organiser</span> : null}
    {data.delegate ? <span className='status-tag'>Delegate</span> : null}
  </>
}

function RegisterButton({data, compId}) {
  return <a href={getAddRegistrationLink(data, compId)} target='_blank' className='add-registration-button'>Add</a>
}

function getAddRegistrationLink(data, compId) {
  const base = process.env.REACT_APP_WCA_URL;
  const wcaId = data.wcaid ? data.wcaid : "";
  const params = `registration_data[name]=${data.name}&registration_data[email]=${data.ticket_email}&registration_data[wca_id]=${wcaId}`;
  return `${base}/competitions/${compId}/registrations/add?${params}`;
}
