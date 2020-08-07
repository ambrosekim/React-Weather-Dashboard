import React, {Component} from "react";
import {api_url, Constants, getDegreeSymbol, getWindSpeedSymbol, IconMap} from "./config" ;

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            hasAlerts: false,
            alerts: [],
            resp: [],
            currentIcon: null
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    fetchData = () => {
        fetch(api_url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        hasAlerts: true,
                        alerts: ["It's the end of the world as we know it"],
                        resp: result,
                        current: {
                            icon: this.getCurrentIcon(result.current.weather),
                            temp: this.getFormattedTemp(result.current.temp),
                            feelsLike: this.getFormattedTemp(result.current.feels_like),
                            chanceOfRain: this.getChanceOfRain(result.current),
                            windSpeed: this.getFormattedWindSpeed(result.current.wind_speed)
                        }
                    });
                    this.intervalID = setTimeout(this.fetchData.bind(this), Constants.refresh);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    };

    // async fetchData() {
    //     try {
    //         const rs = await fetch(api_url);
    //         const result = await rs.json();
    //
    //         console.log(result.current.dt);
    //
    //         this.setState({
    //             isLoaded: true,
    //             hasAlerts: true,
    //             alerts: ["It's the end of the world as we know it"],
    //             resp: result,
    //             current: {
    //                 icon: this.getCurrentIcon(result.current.weather),
    //                 temp: this.getFormattedTemp(result.current.temp),
    //                 feelsLike: this.getFormattedTemp(result.current.feels_like),
    //                 chanceOfRain: this.getChanceOfRain(result.current),
    //                 windSpeed: this.getFormattedWindSpeed(result.current.wind_speed)
    //             }
    //         });
    //
    //         this.intervalID = setTimeout(this.fetchData.bind(this), 10000);
    //
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

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

    getFormattedWindSpeed(wind_speed) {
        return Math.round(wind_speed) + getWindSpeedSymbol(Constants.units);
    }

    render() {
        const {error, isLoaded, resp, alerts, current} = this.state;

        if (error) {
            return <div>Error contacting API</div>
        } else if (!isLoaded) {
            return <div>Fetching results...</div>
        } else
            return <div>
                <div id="alerts" className="marquee">{alerts[0]}</div>
                <table cellSpacing={20}
                    // style={{margin: "-30px -10px -40px -30px"}}
                >
                    <tr>
                        <td>{current.icon}
                            <img src={current.icon} alt="Current icon"/>
                        </td>
                        <td style={{"vertical-align": "middle", "white-space": "nowrap"}}>
                            <table className="observations">
                                <tr>
                                    <td id="currentTemp" colSpan="2">{current.temp}</td>
                                    <td className="legend top" style={{"padding-left": "15px"}}>prob. of rain</td>
                                    <td className="top"><span id="currentPrec">{current.chanceOfRain}</span>%</td>
                                </tr>
                                <tr>
                                    <td id="apparentTempLabel" className="observations legend bottom">feels like</td>
                                    <td id="currentApparentTemp">{current.feelsLike}</td>
                                    <td id="windLabel" className="observations legend bottom"
                                        style={{"padding-left": "15px"}}>wind
                                    </td>
                                    <td id="currentWind"><span>{current.windSpeed}</span></td>
                                    <td id="humidityLabel" className="observations legend bottom"
                                        style={{
                                            "padding-left": "15px",
                                            "padding-right": "5px",
                                            "text-align": "right"
                                        }}>rh
                                    </td>
                                    <td id="currentHumidity"></td>
                                </tr>
                            </table>
                        </td>
                        <td id="currentSummary"></td>
                        <td className="currentDateTime">
                            <span id="currentDate"></span><br/>
                            <span id="currentTime"></span>
                        </td>
                    </tr>
                </table>
                <table id="tableHourlyForecast" cellSpacing="0">
                    <tr id="hourlyHours"></tr>
                    <tr id="hourlyIcons"></tr>
                    <tr id="hourlyTemp"></tr>
                    <tr id="hourlyWind"></tr>
                    <tr id="hourlyHumidity"></tr>
                    <tr id="hourlyAcc"></tr>
                    <tr id="hourlyPrec"></tr>
                </table>
                <table id="forecast">
                    <tr id="forecastTitles"></tr>
                    <tr id="forecastIcons"></tr>
                    <tr id="forecastSummaries"></tr>
                    <tr id="forecastMaxTemps"></tr>
                    <tr id="forecastMinTemps"></tr>
                    <tr id="forecastWind"></tr>
                    <tr id="forecastHumidity"></tr>
                    <tr id="forecastAccumulations"></tr>
                    <tr id="forecastPrecipitations"></tr>
                </table>
            </div>
    }

}

export default Dashboard;
