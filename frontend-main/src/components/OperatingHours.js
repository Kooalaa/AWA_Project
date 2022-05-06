import styles from '../styles/OperatingHours.module.scss';

export default function operatingHours(props) {
    const listOfDays = props.days.map((day) => <option key={day}>{day}</option>);

    return (
        <div className={styles.operatingHoursList}>
            <div className={styles.inputFields}>
                <div>
                    <select
                        className={styles.select}
                        defaultValue="default"
                        onChange={(event) => props.set(props.operatingHour.id, 'fromDay', event.target.value, event.target)}
                    >
                        <option value="default" disabled hidden>
                            From
                        </option>
                        {listOfDays}
                    </select>
                    <select
                        className={styles.select}
                        defaultValue="default"
                        onChange={(event) => props.set(props.operatingHour.id, 'toDay', event.target.value, event.target)}
                    >
                        <option value="default" disabled hidden>
                            To
                        </option>
                        {listOfDays}
                    </select>
                </div>
                <div>
                    <input
                        className={styles.timeInput}
                        type="time"
                        onChange={(event) => props.set(props.operatingHour.id, 'fromHour', event.target.value, event.target)}
                    ></input>
                    <input
                        className={styles.timeInput}
                        type="time"
                        onChange={(event) => props.set(props.operatingHour.id, 'toHour', event.target.value, event.target)}
                    ></input>
                    <div className={styles.lastRow}>
                        <input
                            className={styles.numberInput}
                            type="number"
                            onChange={(event) => props.set(props.operatingHour.id, 'kitchenClosingTime', event.target.value, event.target)}
                        ></input>
                        <button className={styles.button} onClick={() => props.delete(props.operatingHour.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
