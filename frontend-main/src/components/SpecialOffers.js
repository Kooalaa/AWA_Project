import styles from '../styles/SpecialOffers.module.scss';
import SpecialOffersItem from './SpecialOffersItem';

export default function SpecialOffers(props) {
    return (
        <div className={styles.specialoffers}>
            <div className={styles.font}>Special Offers</div>
            <div className={styles.offerPlacement}>
                {props.specialOffers.map((specialOffer, index) => {
                    const product = props.products.find((product) => product.product_id === specialOffer.product_id);
                    const restaurant = props.restaurants.find((restaurant) => restaurant.restaurant_id === product.restaurant_id);
                    return <SpecialOffersItem key={index} restaurant={restaurant} product={product} specialOffer={specialOffer} />;
                })}
            </div>
        </div>
    );
}
