import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet';
import "./Polyline.leaflet";
import 'leaflet/dist/leaflet.css';  
import ApexChart from "./ApexChart";
import ThemeSwitcher from "./ThemeSwitcher";

const AuthorizeAPI = () => {
    const [error, setError] = useState(null);
    const [auth, setAuth] = useState(); 
    const [isAuth, setIsAuth] = useState(false); 
    const [areActivitiesLoaded, setAreActivitiesLoaded] = useState(false); 
    const [activities, setActivities] = useState([]);
    
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
                    activity.average_speed = (activity.average_speed * 3.6).toFixed(1);
                    activity.distance = (activity.distance / 1000).toFixed(2);
                    
                });
                setActivities(newData);
                setAreActivitiesLoaded(true);
            }).catch((error) => {
                setAreActivitiesLoaded(false);
                setError(error);
            });
            
        }
    }
    
    useEffect(() => {
        fetchAccessToken();
        fetchData(); 

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
                                <div className="menu-item">Statistics</div>
                            </li>
                            <li className="menu-li">
                                <div className="menu-item">
                                    <ThemeSwitcher />
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="activities">
                    <ApexChart 
                        xaxis={activities.map((activity => {
                            let date = activity.start_date.split("T");
                            return date[0];
                        }))} 
                        data={activities.map((activity => activity.average_speed))} 
                        name={"average_speed"}  
                        type={"area"}
                        activitiesLabel={ Object.keys(activities[0]) }
                        activities={activities}
                    />
                    
                    <h1 className="heading-primary">
                        View my activities 
                        <div className="heading-gradient">for fun</div>
                    </h1>  
                                       
                        { activities.map((activity, id, index) => (
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
                                <div className="distance">Distance: { activity.distance }km</div>
                                <div className="average-speed">Average speed: { activity.average_speed }km/h</div>
                            </div>
                        ))}
                    </div>
                </div>
                
        );
    }
}

export default AuthorizeAPI;
