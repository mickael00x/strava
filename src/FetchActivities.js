import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet';
import "./Polyline.leaflet";
import 'leaflet/dist/leaflet.css';  
import CustomChartJS from "./ChartJS";
import Input from "./Input";

const AuthorizeAPI = () => {
    const [error, setError] = useState(null);
    const [auth, setAuth] = useState(); 
    const [isAuth, setIsAuth] = useState(false); 
    const [areActivitiesLoaded, setAreActivitiesLoaded] = useState(false); 
    const [activities, setActivities] = useState([]);
    const [chartData, setChartData] = useState({});
    const [displayChart, setDisplayChart] = useState(false);
    // const inputRef = useRef(null);

    let customData;

    const limeOptions = { 
        color: 'red',
        weight: 3,
        lineJoin: "round"
    };

    const fetchAccessToken = async() => {
        await fetch("https://www.strava.com/oauth/token", {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: '71911',
                client_secret: '51a4006b0d57df03f843e3bc1b5cefc31f28e8ba',
                refresh_token: '23a5bfae16baafe79a021f4e9e246ee50a844199',
                grant_type: 'refresh_token'	
            })
        })
            .then(res => res.json() )
            .then(res => {
                setAuth(res.access_token);
                setIsAuth(true);
            }).catch(error => { console.log(error); })
    }

    const  fetchData = async() => {
        if(auth && !areActivitiesLoaded) {
            await fetch(`https://www.strava.com/api/v3/athlete/activities?access_token=${auth}`)
            .then(response => response.json())
            .then( (data) => {
                let newData = [...data];
                let L = window.L;
                newData.forEach((activity, index)=> {
                    if(activity.map.summary_polyline === null) return  
                    let coordinates = L.PolylineUtil.decode(activity.map.summary_polyline);
                    activity.coordinates = coordinates;
                });
                setActivities(newData);
                setAreActivitiesLoaded(true);
            }).catch((error) => {
                setAreActivitiesLoaded(false);
                setError(error);
            });
            
        }
    }

    
    
    const createChartJS = () => {
        if(activities && areActivitiesLoaded) {
            customData =  {
                datasets: [
                    {
                        label: "Distance",
                        data: activities.map((activity) => activity.distance ),
                        borderColor: `rgb(${Math.random()*256|0}, ${Math.random()*256|0}, ${Math.random()*256|0})`,
                        backgroundColor: `rgba(${Math.random()*256|0}, ${Math.random()*256|0}, ${Math.random()*256|0}, 0.5)`,
                    },
                    {
                        label: "Average speed",
                        data: activities.map((activity) => activity.average_speed / 60),
                        borderColor: `rgb(${Math.random()*256|0}, ${Math.random()*256|0}, ${Math.random()*256|0})`,
                        backgroundColor: `rgba(${Math.random()*256|0}, ${Math.random()*256|0}, ${Math.random()*256|0}, 0.5)`,
                    },
                    {
                        label: "Max speed",
                        data: activities.map((activity) => activity.elapsed_time / 60 ),
                        borderColor: `rgb(${Math.random()*256|0}, ${Math.random()*256|0}, ${Math.random()*256|0})`,
                        backgroundColor: `rgba(${Math.random()*256|0}, ${Math.random()*256|0}, ${Math.random()*256|0}, 0.5)`,
                    }
                ],
                labels: activities.map((activity) => {
                    //The maximum speed of this lat, in meters per second
                    //return activity.max_speed;
                    let date = activity.start_date.split("T");
                    return date[0];
                })

            } 
            return setChartData({...customData});
        }
    }

    const makeDataset = (event) => {
        let input = event.target.value;
        if(input === undefined) {
            input = event.target.previousSibling.value;
        }
        let chartDataCopyObject = Object.keys(activities[0]);
        if(chartDataCopyObject.includes(input)) {
            let dataset = {
                label: input,
                type: "bar",
                data: activities.map((activity) => {
                    return activity[input];
                }),
                borderColor: `rgb(${Math.random()*256|0}, ${Math.random()*256|0}, ${Math.random()*256|0})`,
                backgroundColor: `rgba(${Math.random()*256|0}, ${Math.random()*256|0}, ${Math.random()*256|0}, 0.5)`,
            } 
            let chartCompare;
            chartData.datasets.forEach((set,index) => {
                chartCompare = set;
            });

            if(dataset.label === chartCompare.label) {
                chartData.datasets.splice((chartData.datasets).length -1, 1);
                console.log(chartData.datasets);
                setChartData(chartData);
            } else {
                chartData.datasets.push(dataset);
                setChartData(chartData);
            }
            
            
            setDisplayChart(false);
            setTimeout(() => {
                setDisplayChart(true);
            }, 500);
        }
        
    } 
    const displayGraphs = () => {
        if(chartData && !displayChart) {
            setDisplayChart(true);
            
        } else {
            setDisplayChart(false);
        }
    }
    
    useEffect(() => {
        fetchAccessToken();
        fetchData(); 
        createChartJS();
    }, [auth, activities]);

    if(!areActivitiesLoaded) {
        return (
            <div className="loader"></div>
        )   
    } else {
        return (
                <div className="main">
                    <div className="menu">
                        <ul className="menu-list">
                            <li className="menu-li">
                                <div className="menu-item">Activities</div>
                            </li>
                            <li className="menu-li">
                                <div className="menu-item" onClick={displayGraphs}>Statistics</div>
                            </li>
                        </ul>
                    </div>
                    <div className="activities">
                    <h1 className="heading-primary">
                        View my activities 
                        <div className="heading-gradient">for fun</div>
                    </h1>                        
                        { displayChart ?
                            <CustomChartJS 
                                className="chart-js" 
                                data={ chartData } 
                            /> 
                            :
                            <div className="loader"></div>
                        }
                        
                        <div className="absciss-picker">
                            { Object.keys(activities[0]).map((chartPropertyValue, id) => (
                                <Input 
                                    value={ chartPropertyValue } 
                                    key={ id } 
                                    onClickChange = { makeDataset }
                                />
                            ))
                            }
                        </div>
                        { !displayChart && activities.map((activity, id, index) => (
                            <div className="activity" key={id}>
                                { activity.start_latitude && <MapContainer 
                                    className="map"
                                    center={[Number(activity.start_latitude), Number(activity.start_longitude)]}
                                    zoom={13} 
                                    scrollWheelZoom={false}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    { activity.coordinates && <Polyline pathOptions={limeOptions} positions={activity.coordinates} /> }
                                </MapContainer>}
                                <div className="type"> {activity.type} </div>
                                <div className="name"> {activity.name} </div>
                                <div className="distance">Distance: { (activity.distance / 1000).toFixed(2) }km</div>
                                <div className="average-speed">Average speed: { (activity.average_speed * 3.6).toFixed(1) }km/h</div>
                            </div>

                        ))}
                    </div>
                </div>
                
        );
    }
}

export default AuthorizeAPI;
