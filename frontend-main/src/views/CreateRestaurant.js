import styles from '../styles/CreateRestaurantView.module.scss';
import cx from 'classnames';
import { Component, createRef } from 'react';
import OperatingHours from '../components/OperatingHours';
import Category from '../components/FoodCategory';
import axios from 'axios';
import FileUploader from '../components/FileUploader';
import { APIAddress } from '../config.json';
import { Link } from 'react-router-dom';

class CreateRestaurant extends Component {
    categoryIndex = 0;
    foodIndex = 0;
    operatingHourIndex = 0;

    constructor(props) {
        super(props);
        this.state = {
            restaurantData: {
                name: '',
                address: {},
                type: '',
                priceLevel: 0,
                picture: {},

                operatingHours: [],

                categories: [],
            },

            categoryName: '',
            shortDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            error: '',
            showInputs: true,
            restaurantCreated: false,
            categoryNameInput: createRef(),
        };

        this.addCategory = this.addCategory.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addFoodToCategory = this.addFoodToCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.deleteFoodFromCategory = this.deleteFoodFromCategory.bind(this);
        this.addOperatingHour = this.addOperatingHour.bind(this);
        this.deleteOperatingHour = this.deleteOperatingHour.bind(this);
        this.setOperatingHours = this.setOperatingHours.bind(this);
        this.submit = this.submit.bind(this);
        this.setError = this.setOperatingHours.bind(this);
    }

    onChange(event) {
        let restaurantData = { ...this.state.restaurantData };

        switch (event.target.name) {
            case 'name':
                restaurantData.name = event.target.value;
                break;

            case 'streetAddress':
                restaurantData.address.streetAddress = event.target.value;
                break;

            case 'city':
                restaurantData.address.city = event.target.value;
                break;

            case 'postcode':
                restaurantData.address.postcode = event.target.value;
                break;

            case 'pricelevel':
                restaurantData.priceLevel = parseInt(event.target.value, 10);
                break;

            case 'type':
                restaurantData.type = event.target.value;
                break;

            case 'addCategory':
                this.setState({ categoryName: event.target.value });
                break;

            case 'picture':
                restaurantData.picture = URL.createObjectURL(event.target.files[0]);
                restaurantData.pictureFile = event.target.files[0];
                break;
        }

        this.setState({ restaurantData });
    }

    addOperatingHour() {
        let restaurantData = { ...this.state.restaurantData };
        restaurantData.operatingHours.push({ id: ++this.operatingHourIndex });
        this.setState({ restaurantData });
    }

    setOperatingHours(id, _case, value) {
        let restaurantData = { ...this.state.restaurantData };
        let index = restaurantData.operatingHours.findIndex((value) => value.id === id);

        switch (_case) {
            case 'fromDay':
                restaurantData.operatingHours[index].fromDay = value;
                break;

            case 'toDay':
                restaurantData.operatingHours[index].toDay = value;
                break;

            case 'kitchenClosingTime':
                restaurantData.operatingHours[index].kitchen_closing_time = parseInt(value);
                break;

            case 'fromHour': {
                let values = value.split(':');
                let time = new Date();
                time.setHours(Number(values[0]), Number(values[1]), 0, 0);
                restaurantData.operatingHours[index].fromHour = time;
                break;
            }

            case 'toHour': {
                let values = value.split(':');
                let time = new Date();
                time.setHours(Number(values[0]), Number(values[1]), 0, 0);
                restaurantData.operatingHours[index].toHour = time;
                break;
            }
        }

        this.setState({ restaurantData });
    }

    deleteOperatingHour(id) {
        let restaurantData = { ...this.state.restaurantData };
        let index = restaurantData.operatingHours.findIndex((value) => value.id === id);
        restaurantData.operatingHours.splice(index, 1);
        this.setState({ restaurantData });
    }

    addCategory() {
        let _state = {...this.state};
        _state.categoryNameInput.current.value = '';
        _state.restaurantData.categories.push({ id: ++this.categoryIndex, name: this.state.categoryName, foods: []});
        this.setState({_state });
    }

    addFoodToCategory(category, foodName, price, desc, picFile, pic) {
        let restaurantData = { ...this.state.restaurantData };
        restaurantData.categories
            .find((value) => value.id === category.id)
            .foods.push({ name: foodName, price, id: ++this.foodIndex, description: desc, pictureFile: picFile, picture: pic });
        this.setState({ restaurantData });
    }

    deleteCategory(id) {
        let restaurantData = { ...this.state.restaurantData };
        let index = restaurantData.categories.findIndex((value) => value.id === id);
        restaurantData.categories.splice(index, 1);
        this.setState({ restaurantData });
    }

    deleteFoodFromCategory(cId, fId) {
        let restaurantData = { ...this.state.restaurantData };
        let index = restaurantData.categories.find((value) => value.id === cId).foods.findIndex((value) => value.id === fId);
        restaurantData.categories.find((value) => value.id === cId).foods.splice(index, 1);
        this.setState({ restaurantData });
    }

    setError(errorMessage) {
        this.setState({ error: errorMessage });
    }

    submit(e) {
        e.preventDefault();
        let _state = { ...this.state };
        let operatingHours = [];
        let products = [];
        let productImageFiles = [];
        let restaurantData = { ...this.state.restaurantData };
        restaurantData.price_level = restaurantData.priceLevel;
        restaurantData.address = restaurantData.address.streetAddress + ', ' + restaurantData.address.postcode + ', ' + restaurantData.address.city;
        delete restaurantData.priceLevel;
        delete restaurantData.categories;
        delete restaurantData.operatingHours;
        delete restaurantData.pictureFile;
        delete restaurantData.picture;
        console.log(restaurantData);

        productImageFiles = _state.restaurantData.categories.map((category) =>
            category.foods.map((food) => {
                return food.pictureFile;
            })
        );

        productImageFiles = productImageFiles.flat();
        console.log(productImageFiles);

        products = _state.restaurantData.categories.map((category) =>
            category.foods.map((food) => {
                let item = food;
                delete item.id;
                item.type = category.name;
                delete item.pictureFile;
                return item;
            })
        );

        products = products.flat();

        for (let index = 0; index < _state.restaurantData.operatingHours.length; index++) {
            let startIndex = this.state.days.findIndex((val) => val === _state.restaurantData.operatingHours[index].fromDay);
            let endIndex = this.state.days.findIndex((val) => val === _state.restaurantData.operatingHours[index].toDay);
            if (startIndex > endIndex) [startIndex, endIndex] = [endIndex, startIndex];
            let result = _state.shortDays.slice(startIndex, endIndex + 1);
            let temp = { opening_time: '', closing_time: '', kitchen_closing_time: '', days: '' };
            temp.kitchen_closing_time = _state.restaurantData.operatingHours[index].kitchen_closing_time;
            temp.opening_time =
                _state.restaurantData.operatingHours[index].fromHour.getHours().toString().padStart(2, '0') +
                ':' +
                _state.restaurantData.operatingHours[index].fromHour.getMinutes().toString().padStart(2, '0') +
                ' ' +
                '+2';
            temp.closing_time =
                _state.restaurantData.operatingHours[index].toHour.getHours().toString().padStart(2, '0') +
                ':' +
                _state.restaurantData.operatingHours[index].toHour.getMinutes().toString().padStart(2, '0') +
                ' ' +
                '+2';
            temp.days = result.join(', ');
            operatingHours.push(temp);
        }

        let authorization = { Authorization: 'bearer ' + this.props.token };

        console.log(this.props.token);
        console.log(restaurantData);

        Promise.all([
            axios.post(APIAddress + 'restaurant', restaurantData, { headers: authorization }).then(
                (res) => {
                    let picture = new FormData();
                    picture.append('restaurant', res.data.restaurant_id);
                    picture.append('image', _state.restaurantData.pictureFile);

                    operatingHours.forEach((val) => (val.restaurant_id = res.data.restaurant_id));

                    products.forEach((val) => (val.restaurant_id = res.data.restaurant_id));

                    let productImages = new FormData();
                    productImages.append('restaurant', res.data.restaurant_id);
                    for (let i = 0; i < productImageFiles.length; i++) {
                        productImages.append('productImages', productImageFiles[i]);
                    }

                    axios.post(APIAddress + 'restaurant/operating-hours', operatingHours, { headers: authorization }).then(() => {
                    }),

                        axios
                            .post(APIAddress + 'products/upload', productImages, { headers: { 'content-type': 'multipart/form-data', ...authorization } })
                            .then(() => {
                            }),

                        axios
                            .post(APIAddress + 'restaurant/upload', picture, { headers: { 'content-type': 'multipart/form-data', ...authorization } })
                            .then((res) => {
                            }),

                        axios.post(APIAddress + 'products', products, { headers: authorization }).then(() => {
                        });
                },
            ),
        ])
        .then(() => {
            this.setState({ showInputs: false});
            this.setState({ restaurantCreated: true});
        })
        .catch(error => {
            this.setState({ error: error.data});
        })
    }

    render() {
        return (
            <div className={styles.contentArea}>
                {this.state.restaurantCreated && (
                    <div className={styles.created}>
                        <p>Restaurant was succesfully created</p>
                        <Link to="/" className={styles.link}>
                            Mainpage
                        </Link>
                    </div>
                )}
                {this.state.showInputs && (
                    <form className={styles.inputFields} onSubmit={this.submit}>
                        <div className={cx(styles.logo, styles.font)}>Restaurant Creation</div>
                        <FileUploader selected={this.onChange} style={styles.fileInput} />
                        <input required className={styles.input} onChange={this.onChange} name="name" type="text" placeholder="Name" />
                        <input
                            required
                            className={styles.input}
                            onChange={this.onChange}
                            pattern="[A-ö0-9\s-]+"
                            name="streetAddress"
                            type="text"
                            placeholder="StreetAddress"
                        />
                        <input required className={styles.input} onChange={this.onChange} name="city" type="text" placeholder="City" />
                        <input
                            required
                            className={styles.input}
                            onChange={this.onChange}
                            maxLength={5}
                            minLength={5}
                            name="postcode"
                            type="text"
                            placeholder="Postcode"
                        />
                        <div className={styles.operatingHours}>
                            <div className={styles.text}>Operating Hours</div>
                            {this.state.restaurantData.operatingHours.map((operatingHour) => (
                                <OperatingHours
                                    key={operatingHour.id}
                                    operatingHour={operatingHour}
                                    delete={this.deleteOperatingHour}
                                    days={this.state.days}
                                    set={this.setOperatingHours}
                                />
                            ))}
                            <button type='button' onClick={this.addOperatingHour} className={styles.button}>
                                + Add operatingHour
                            </button>
                        </div>
                        <div className={styles.setupMenu}>
                            <div className={styles.text}>Setup Menu</div>
                            {this.state.restaurantData.categories.map((category) => (
                                <Category
                                    key={category.id}
                                    category={category}
                                    addFood={this.addFoodToCategory}
                                    deleteCategory={this.deleteCategory}
                                    deleteFood={this.deleteFoodFromCategory}
                                />
                            ))}
                            <input ref={this.state.categoryNameInput} className={styles.input} name="addCategory" onChange={this.onChange} placeholder={'Category name'} />
                            <button type='button' className={styles.button} onClick={this.addCategory}>
                                + Add Category
                            </button>
                        </div>
                        <select required className={styles.select} name="pricelevel" onChange={this.onChange} defaultValue="default">
                            <option value="default" disabled hidden>
                                Select pricelevel
                            </option>
                            <option value={1}>€</option>
                            <option value={2}>€€</option>
                            <option value={3}>€€€</option>
                            <option value={4}>€€€€</option>
                        </select>
                        <select required className={styles.select} name="type" onChange={this.onChange} defaultValue="default">
                            <option value="default" disabled hidden>
                                Select restaurant type
                            </option>
                            <option value="Buffet">Buffet</option>
                            <option value="Fast Food">Fast Food</option>
                            <option value="Fast Casual">Fast Casual</option>
                            <option value="Casual dining">Casual dining</option>
                            <option value="Fine dining">Fine dining</option>
                        </select>
                        <button className={cx(styles.create, styles.font)} type="submit">
                            Create
                        </button>
                        <div className={styles.errors}>{this.state.error}</div>
                    </form>
                )}
                <img src={this.state.restaurantData.picture} className={styles.image} />
            </div>
        );
    }
}

export default CreateRestaurant;
