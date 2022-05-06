import styles from '../styles/FoodItem.module.scss';

export default function FoodItem(props) {
    return (
        <div className={styles.content}>
            <label className={styles.label}>{props.food.name}</label>
            <label className={styles.label}>{props.food.price} €</label>
            <button className={styles.button} onClick={() => props.parentCallBack(props.categoryId, props.food.id)}>
                Delete
            </button>
        </div>
    );
}
