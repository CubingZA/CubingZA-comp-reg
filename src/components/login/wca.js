import React from 'react';
import './wca.less';

function logout() {
  sessionStorage.removeItem('wca_token');
  window.location.replace('/');
}

function getWCALoginURL() {
  const scope = "public email manage_competitions";
  const baseURL = process.env.REACT_APP_WCA_URL;
  const endpoint = "/oauth/authorize"

  let params = {
    client_id: process.env.REACT_APP_WCA_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_WCA_AUTH_REDIRECT,
    response_type: "token",
    scope: scope
  }

  let url = baseURL + endpoint + '?' + new URLSearchParams(params).toString(); 

  return url;
}

function getOrSaveToken() {  
  const params = new URLSearchParams(window.location.hash.replace('#', ''));

  let wcaToken = params.get('access_token');
  if (wcaToken) {
    sessionStorage.setItem('wca_token', wcaToken);
    window.location.replace('/');
  } else {
    wcaToken = sessionStorage.getItem('wca_token');
  }

  return wcaToken ? true : false;
}

function WcaLoginButton() {
  return <a href={getWCALoginURL()} className='login-button'>WCA Login</a>
}

function WcaConnectedMessage() {
  return <>WCA Connected <button onClick={logout} className='login-button'>Disconnect WCA</button></>
}

export default function WCALogin() {
  const isConnected = getOrSaveToken();

  return <div className='wca-login-container'>
    {isConnected ? <WcaConnectedMessage/> : <WcaLoginButton/>}
  </div>
}

