import styles from '../styles/RestaurantView.module.scss';
import cx from 'classnames';
import RestaurantMenuPopUp from '../components/RestaurantMenuPopUp';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { APIAddress } from '../config.json';
import { CloudinaryContext, Image } from 'cloudinary-react';

export default function RestaurantView(props) {
    const { id } = useParams();
    const restaurantId = id;
    const [restaurant, setRestaurant] = useState({});
    const [product, setProduct] = useState({});
    const [operatingHours_0, setOperatingHours_0] = useState({});
    const [operatingHours_1, setOperatingHours_1] = useState({});
    const [operatingHours_2, setOperatingHours_2] = useState({});
    const [operatingHours_3, setOperatingHours_3] = useState({});

    let nothing = '-';

    useEffect(async () => {
        try {
            const res = await axios.get(APIAddress + 'restaurant');
            let restaurant = res.data.find((val) => val.restaurant_id == restaurantId) ?? {};
            setRestaurant(restaurant);

            const res1 = await axios.get(APIAddress + 'restaurant/' + restaurantId + '/menu');
            const _product = {};

            for (const item of res1.data) {
                if (!_product[item.type]) {
                    _product[item.type] = [];
                }
                _product[item.type].push(item);
            }
            setProduct(_product);

            const res2 = await axios.get(APIAddress + 'restaurant/' + restaurantId + '/operating-hours');
            let _operatingHours_0 = res2.data[0] ?? {};
            setOperatingHours_0(_operatingHours_0);

            const res3 = await axios.get(APIAddress + 'restaurant/' + restaurantId + '/operating-hours');
            let _operatingHours_1 = res3.data[1] ?? {};
            setOperatingHours_1(_operatingHours_1);

            const res4 = await axios.get(APIAddress + 'restaurant/' + restaurantId + '/operating-hours');
            let _operatingHours_2 = res4.data[2] ?? {};
            setOperatingHours_2(_operatingHours_2);

            const res5 = await axios.get(APIAddress + 'restaurant/' + restaurantId + '/operating-hours');
            let _operatingHours_3 = res5.data[3] ?? {};
            setOperatingHours_3(_operatingHours_3);
        } catch (err) {
            if (err) console.log(err);
        }
    }, [restaurantId]);

    
    var restaurantPicture = (
        <CloudinaryContext cloudName="ramppasamppa" className={styles.pictureStyle}>
            <Image publicId={restaurant.picture} className={styles.pictureStyleSize} />
        </CloudinaryContext>
    );

    var restaurantInfoText = (
        <div className={cx(styles.restInfo, styles.font)}>
            <div className={styles.name}>{restaurant.name}</div>
            <div className={styles.address}>{restaurant.address}</div>
            <div className={styles.restInfoBottom}>
                <div className={styles.operatingHours} >
                    <div className={styles.title}>Operating Hours</div>
                    <div className={styles.operatingHoursContent}>
                        <div className={styles.contentElem}>
                            <div>Days: {operatingHours_0.days ?? nothing}</div>
                            <div>Open: {operatingHours_0.opening_time ?? nothing}</div>
                            <div>Close: {operatingHours_0.closing_time ?? nothing}</div>
                        </div>
                        <div className={styles.contentElem}>
                            <div>Days: {operatingHours_1.days ?? nothing}</div>
                            <div>Open: {operatingHours_1.opening_time ?? nothing}</div>
                            <div>Close: {operatingHours_1.closing_time ?? nothing}</div>
                        </div>
                        <div className={styles.contentElem}>
                            <div>Days: {operatingHours_2.days ?? nothing}</div>
                            <div>Open: {operatingHours_2.opening_time ?? nothing}</div>
                            <div>Close: {operatingHours_2.closing_time ?? nothing}</div>
                        </div>
                        <div className={styles.contentElem}>
                            <div>Days: {operatingHours_3.days ?? nothing}</div>
                            <div>Open: {operatingHours_3.opening_time ?? nothing}</div>
                            <div>Close: {operatingHours_3.closing_time ?? nothing}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.typePriceRating}>
                    <div className={styles.type}>Type: {restaurant.type}</div>
                    <div className={styles.priceLevel}>Price Level: {restaurant.price_level}</div>
                    <div className={styles.rating}>Rating: {restaurant.star_rating / 2}★</div>
                </div>
            </div>
        </div>
    );

    var restaurantInfo = (
        <div className={styles.restaurantInfoStyle}>
            <div>{restaurantPicture}</div>
            <div>{restaurantInfoText}</div>
        </div>
    );

    var restaurantMenu = (
        <div className={cx(styles.restaurantMenuStyle, styles.font)}>
            <div className={styles.menuTitle}>Menu</div>
            {Object.entries(product).map(([categoryName, products], index) => {
                return (
                    <div className={styles.categoryData} key={index}>
                        <div className={styles.categoryName}>{categoryName}</div>
                        <div className={styles.categoryProducts}>
                            <div className={styles.product}>
                                {products.map((elem) => {
                                    return <RestaurantMenuPopUp index={elem.product_id} product={elem} key={elem.product_id} addToCart={props.addToCart} />;
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <>
            <div className={styles.content}>
                <div>{restaurantInfo}</div>
                <div>{restaurantMenu}</div>
            </div>
        </>
    );
}
