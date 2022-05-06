import styles from '../styles/FoodCategory.module.scss';
import Food from './FoodItem';
import FileUploader from './FileUploader';
import { useRef } from 'react';

export default function Category(props) {
    var name = '';
    var price = 0.0;
    var desc = '';
    var picFile = '';
    var pic = '';

    const nameInput = useRef();
    const priceInput = useRef();
    const descInput = useRef();

    const setFoodName = (event) => {
        name = event.target.value;
    };

    const setPrice = (event) => {
        price = parseFloat(event.target.value);
    };

    const setDesc = (event) => {
        desc = event.target.value;
    };

    const setPic = (event) => {
        pic = event.target.files[0].name;
        picFile = event.target.files[0];
    };

    return (
        <>
            <div className={styles.content}>
                <div className={styles.category}>
                    <label className={styles.label}>{props.category.name}</label>
                    <button className={styles.button} onClick={() => props.deleteCategory(props.category.id)}>
                        Delete
                    </button>
                </div>
                <div className={styles.food}>
                    <div className={styles.row1}>
                        <input ref={nameInput} className={styles.input} onChange={setFoodName} placeholder={'Food name'}></input>
                        <input ref={priceInput} className={styles.input} type="number" min="0" step='0.01' onChange={setPrice} placeholder={'Food Price'}></input>
                    </div>
                    <div className={styles.row2}>
                        <input ref={descInput} className={styles.input} placeholder={'Description'} onChange={setDesc}></input>
                        <FileUploader selected={setPic} style={styles.fileInput} />
                        <button type='button' className={styles.button} onClick={() => {
                            nameInput.current.value = ('');
                            priceInput.current.value = ('');
                            descInput.current.value = ('');
                            props.addFood(props.category, name, price, desc, picFile, pic)
                            }}>
                            + Add
                        </button>
                    </div>
                </div>
                <div className={styles.foods}>
                    {props.category.foods.map((foods, index) => (
                        <Food key={index} food={foods} parentCallBack={props.deleteFood} categoryId={props.category.id} />
                    ))}
                </div>
            </div>
        </>
    );
}
