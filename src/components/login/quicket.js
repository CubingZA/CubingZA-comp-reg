import React from 'react';
import './quicket.less';

function logout() {
  localStorage.removeItem('quicket_api_token');
  window.location.replace('/');
}

function getOrSaveToken() {  
  const params = new URLSearchParams(window.location.search.replace('?', ''));

  let quicketToken = params.get('quicket_api_token');
  
  if (quicketToken) {
    localStorage.setItem('quicket_api_token', quicketToken);
    window.location.replace('/');
  } else {
    quicketToken = localStorage.getItem('quicket_api_token');
  }
  
  return quicketToken ? true : false;
}

function QuicketLoginForm() {
  return <div className='quicket-login'>
    <form>
      <label htmlFor="quicket_api_token">
        API Token <i>(Get this <a href="https://www.quicket.co.za/app/#/account/user/api" target="_blank">here</a>)
        </i>
        <input type="password" id="quicket_api_token" name="quicket_api_token" />
      </label>
      <button type='submit' className='login-button'>Connect Quicket</button>
    </form>
  </div>
}

function QuicketConnectedMessage() {
  return <>Quicket Connected <button onClick={logout} className='login-button'>Disconnect Quicket</button></>
}

export default function QuicketLogin() {
  const isConnected = getOrSaveToken();
  return <div className='quicket-login-container'>
    {isConnected ? <QuicketConnectedMessage/> : <QuicketLoginForm/>}
  </div>
}

