import React, {Component} from "react";
import {Constants, getDegreeSymbol, getWindSpeedSymbol, IconMap} from "../config";

class CurrentBoard extends Component {
    constructor(props) {
        super(props);
        let current = this.props.current;

        this.state = {
            current: {
                icon: this.getCurrentIcon(current.weather),
                temp: this.getFormattedTemp(current.temp),
                feelsLike: this.getFormattedTemp(current.feels_like),
                chanceOfRain: this.getChanceOfRain(current),
                windSpeed: this.getFormattedWindSpeed(current),
                windStyle: this.getWindDegStyle(current.wind_deg),
                humidity: current.humidity,
                pressure: current.pressure,
                summary: "Partly cloudy throughout the day. Light rain on Sunday through Thursday.",
                date: this.getFormattedDate(),
                time: this.getFormattedTime()
            }
        }
    }

    getCurrentIcon(currentWeather) {
        const weatherMainName = currentWeather[0].main;
        if (weatherMainName in IconMap) {
            console.log(weatherMainName);
            return IconMap['weatherMainName'];
        } else {
            return IconMap.notFound;
        }
    }

    getChanceOfRain(current) {
        if ('pop' in current) {
            return current.pop;
        } else {
            return 0;
        }
    }

    getFormattedTemp(temp) {
        return Math.round(temp) + getDegreeSymbol(Constants.units);
    }

    getFormattedWindSpeed(current) {
        return <span>
            {Math.round(current.wind_speed) + getWindSpeedSymbol(Constants.units)}
        </span>
    }

    getWindDegStyle(wind_deg) {
        return {transform: `rotate(${wind_deg}deg)`}
    }

    getFormattedDate() {
        const now = new Date();
        const options = {weekday: 'long', month: 'long', day: 'numeric'};
        return new Intl.DateTimeFormat('en-GB', options).format(now);
    }

    getFormattedTime() {
        const now = new Date();
        const options = {
            hour: 'numeric', minute: 'numeric',
        };
        return new Intl.DateTimeFormat('en-GB', options).format(now);
    }

    render() {
        const {current} = this.state;

        return <table cellSpacing={1} style={{margin: "5px 35px 15px 0px"}}>
            <tr>
                <td>
                    <img id="currentIcon" src={current.icon} alt="Current icon"/>
                </td>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}>
                    <table className="observations">
                        <tr>
                            <td id="currentTemp" colSpan="2">{current.temp}</td>
                            <td className="legend top" style={{paddingLeft: "15px"}}>prob.</td>
                            <td className="top">
                                <span style={{float: 'left', marginLeft: '10px'}}>
                                    <span id="currentPrec">{current.chanceOfRain}</span>%
                                </span>
                            </td>
                            <td className="legend top" style={{paddingLeft: "15px"}}>humidity</td>
                            <td className="top">
                                <span style={{float: 'left', marginLeft: '10px'}}>
                                    <span id="currentHumidity">{current.humidity}%</span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td id="apparentTempLabel" className="observations legend bottom">feels like</td>
                            <td id="currentApparentTemp">{current.feelsLike}</td>
                            <td id="windLabel" className="observations legend bottom"
                                style={{paddingLeft: "15px"}}>wind
                            </td>
                            <td id="currentWind">
                                <span className="windContainer">{current.windSpeed}
                                    <span className="wind" style={current.windStyle}>↑</span>
                                </span>
                            </td>
                            <td id="pressureLabel" className="observations legend bottom"
                                style={{paddingLeft: "15px"}}>pressure
                            </td>
                            <td id="currentPressure" className="observations">
                                <span style={{float: 'left', marginLeft: '10px'}}>{current.pressure} hPa</span>
                            </td>
                        </tr>
                    </table>
                </td>
                <td id="currentSummary">{current.summary}</td>
                <td>
                    <span className="currentDateTime">
                        <span id="currentDate">{current.date}</span><br/>
                        <span id="currentTime">{current.time}</span>
                    </span>
                </td>
            </tr>
        </table>
    }
}

export default CurrentBoard;
