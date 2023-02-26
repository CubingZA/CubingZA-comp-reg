import './wcalogo.less';

export function WcaLogo() {
  const logo_path = "https://www.worldcubeassociation.org/files/WCAlogo_notext.svg";
  return <div className='little-logo'>
      <img src={logo_path}/>
    </div>
}

export function QuicketLogo() {
  const logo_path = new URL('./assets/QuicketIcon.png', import.meta.url);
  return <div className='little-logo'>
      <img src={logo_path}/>
    </div>
}
