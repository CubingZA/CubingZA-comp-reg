import { WcaLogo, QuicketLogo } from '../logos';
import './event-link.less';

export default function EventLinks({ wcaComp, quicketEvent }) {
  return <div className='event-link-container'>
    <WCARegLink wcaComp={wcaComp} />
    <QuicketEventLink quicketEvent={quicketEvent} />
  </div>
}

export function WCARegLink({ wcaComp }) {
  return wcaComp.id ? <a href={getWcaRegistrationURL(wcaComp.id)} target='_blank' className='event-link'>
      <WcaLogo/>
      <div className='event-link-label'>WCA Registrations</div>
    </a> : null;
}

export function QuicketEventLink({ quicketEvent }) {
  return quicketEvent.id ? <a href={getGuestListonURL(quicketEvent.id)} target='_blank' className='event-link'>
      <QuicketLogo/>
      <div className='event-link-label'>Quicket Guest List</div>
    </a> : null;
}

function getWcaRegistrationURL(id) {
  const base = process.env.REACT_APP_WCA_URL;
  return `${base}/competitions/${id}/edit/registrations`;
}

function getGuestListonURL(id) {
  const base = 'https://www.quicket.co.za';
  return `${base}/account/events/manage/guests/guestlist.aspx?y=${id}`;
}
