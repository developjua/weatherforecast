import { WiThermometer, WiDaySunny, WiFog } from "react-icons/wi";


const WeatherIcon = ({ icon, color }) => {
  const iconStyle = {
    color: color || "inherit", // default color is 'inherit'
  };

  switch (icon) {
    case "WiDaySunny":
      return <WiDaySunny style={iconStyle} />;
    case "WiFog":
      return <WiFog style={iconStyle} />;
    case "WiThermometer":
      return <WiThermometer style={iconStyle} />;
    default:
      return null;
  }
};


export default WeatherIcon;