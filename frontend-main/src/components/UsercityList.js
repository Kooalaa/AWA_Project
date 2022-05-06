import styles from '../styles/UsercityList.module.scss';
import RestaurantItem from './RestaurantItem';

export default function UsercityList(props) {
    return (
        <div className={styles.userCityStyle}>
            <div className={styles.font}>{props.city}</div>
            <div className={styles.itemPlacement}>
                {console.log(props.userCity)}
                {props.userCity?.map((restaurant) => {
                    console.log(restaurant);
                    return <RestaurantItem key={restaurant.restaurant_id} restaurant={restaurant} />;
                })}
            </div>
        </div>
    );
}
