import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UsercityList from '../components/UsercityList';
import { APIAddress } from '../config.json';
import { capitalize } from '../utility/string';

const Search = () => {
    const location = useLocation();
    const [cities, setCities] = useState({});

    useEffect(async () => {
        const newCities = {};
        try {
            const res = await axios.get(APIAddress + 'restaurant/search' + location.search);
            for (const item of res.data) {
                if (!newCities[capitalize(item.address.split(/, ?/)[2])]) newCities[capitalize(item.address.split(/, ?/)[2])] = [];
                newCities[capitalize(item.address.split(/, ?/)[2])].push(item);
            }
            console.log(newCities);
            setCities(newCities);
        } catch (err) {
            console.error(err);
        }
    }, [location.search]);

    console.log(cities);
    return (
        <div>
            {Object.entries(cities).map(([city, restaurants], index) => {
                return <UsercityList city={city} userCity={restaurants} key={index} />;
            })}
        </div>
    );
};

export default Search;
