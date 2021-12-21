import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet';
import "./Polyline.leaflet";
import 'leaflet/dist/leaflet.css';  
import CustomChartJS from "./ChartJS";


const AuthorizeAPI = () => {
    const [error, setError] = useState(null);
    const [auth, setAuth] = useState([]); 
    const [isAuth, setIsAuth] = useState(false); 
    const [isLoaded, setIsLoaded] = useState(false); 
    const [activities, setActivities] = useState([]);
    const [chartData, setChartData] = useState({});
    const [displayChart, setDisplayChart] = useState(false);

    const limeOptions = { 
        color: 'red',
        weight: 3,
        lineJoin: "round"
    };

    const fetchAccessToken = () => {
        fetch("https://www.strava.com/oauth/token", {
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

    const fetchData = () => {
        if(auth && !isLoaded) {
            fetch(`https://www.strava.com/api/v3/athlete/activities?access_token=${auth}`)
            .then(response => response.json())
            .then((data) => {
                let newData = [...data];
                let L = window.L;
                newData.forEach((activity, index)=> {
                    if(activity.map.summary_polyline === null) return  
                    let coordinates = L.PolylineUtil.decode(activity.map.summary_polyline);
                    activity.coordinates = coordinates;
                });
                setActivities(newData);
                setIsLoaded(true);
            }).catch((error) => {
                setIsLoaded(false);
                setError(error);
            });
            
        }
    }
    let customData;
    
    const createChartJS = () => {
        if(activities) {
            customData =  {
                datasets: [
                    {
                        label: "Distance",
                        data: activities.map((activity) => activity.distance ),
                        borderColor: 'rgb(0, 255, 0)',
                        backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    },
                    {
                        label: "Average speed",
                        data: activities.map((activity) => activity.average_speed / 60),
                        borderColor: 'rgb(255, 0, 0)',
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    },
                    {
                        label: "Max speed",
                        data: activities.map((activity) => activity.elapsed_time / 60 ),
                        borderColor: 'rgb(0, 0, 255)',
                        backgroundColor: 'rgba(0, 0, 255, 0.5)',
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
    const displayGraphs = () => {
        if(chartData) {
            setDisplayChart(true);
        }
    }
    
    const makeDataset = (event) => {
        let input = event.target.value;
        
        let chartDataCopyObject = Object.keys(activities[0]);
        if(chartDataCopyObject.includes(input)) {
            console.log(input);
            let newDataset = {
                label: input,
                data: activities.map((activity) => {
                    return activity[input];
                }),
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
            } 
            return chartData.datasets.push(newDataset);  
        }
        

    } 
    useEffect(() => {
        fetchAccessToken();
        fetchData(); 
        createChartJS();
    }, [auth, activities]);

    if(!isLoaded) {
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
                    <div className="performance-form" >
                        <label for="datasetInput">Enter performance type</label>
                        <input id="datasetInput"type="text" onChange={makeDataset} placeholder="max_speed"></input>
                    </div>
                    { displayChart && 
                        <CustomChartJS className="map" data={ chartData } /> 
                    }
                        { activities.map((activity, id, index) => (
                            <div className="activity" key={id}>
                                { activity.start_latitude && <MapContainer 
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
