import './wcalogo.less';

export function WcaLogo() {
  const logo_path = "https://www.worldcubeassociation.org/files/WCAlogo_notext.svg";
  return <div className='wca-logo'>
      <img src={logo_path}/>
    </div>
}
