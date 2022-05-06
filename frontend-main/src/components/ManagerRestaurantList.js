import styles from '../styles/ManagerRestaurantList.module.scss';
import RestaurantItem from './RestaurantItem';

export default function ManagerRestaurantList(props) {
    return (
        <div className={styles.managerList}>
            <div className={styles.font}>My Restaurants</div>
            <div className={styles.itemPlacement}>
                {props.managerRestaurants?.map((restaurant) => {
                    return <RestaurantItem key={restaurant.restaurant_id} restaurant={restaurant} />;
                })}
            </div>
        </div>
    );
}
