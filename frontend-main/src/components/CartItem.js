import PropTypes from 'prop-types';
import { useState } from 'react';

const CartItem = (props) => {
    /** @type {{item: import('../@types/App').App.Item, editable: boolean, itemEdited: () => void}} */
    const { item, editable, itemEdited } = props;
    const [edit, setEdit] = useState(false);

    let count = <div onClick={setEdit}>{item.count}x</div>;

    if (editable && edit) {
        count = (
            <input
                type="number"
                onBlur={(e) => {
                    item.updateCount(parseInt(e.target.value));
                    setEdit(false);
                    itemEdited();
                }}
                defaultValue={props.item.count}
                style={{ width: '50px' }}
                autoFocus
            />
        );
    }

    return (
        <>
            <div>{item.name}</div>
            {count}
            <div>{Math.round(item.count * item.price * 100) / 100}€</div>
        </>
    );
};

CartItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        count: PropTypes.number,
        price: PropTypes.number,
        updateCount: PropTypes.func,
    }).isRequired,
    editable: PropTypes.bool,
    itemEdited: PropTypes.func,
};

CartItem.defaultProps = {
    editable: false,
    itemEdited: () => {},
};

export default CartItem;
