export class DateFilterUtils {
    static init(intervalBtnId, dateFromBtnId, dateToBtnId, dateFromInputId, dateToInputId, onFilterChange) {
        const intervalBtn = document.getElementById(intervalBtnId);
        const dateFromBtn = document.getElementById(dateFromBtnId);
        const dateToBtn = document.getElementById(dateToBtnId);
        const dateFromInput = document.getElementById(dateFromInputId);
        const dateToInput = document.getElementById(dateToInputId);

        if (dateFromBtn) dateFromBtn.style.cursor = 'not-allowed';
        if (dateToBtn) dateToBtn.style.cursor = 'not-allowed';

        let dateFromPicker = null;
        let dateToPicker = null;

        const handleDateChange = () => {
            const dateFrom = dateFromInput.value;
            const dateTo = dateToInput.value;

            dateFromBtn.innerText = dateFrom ? dateFrom.split('-').reverse().join('.') : 'Дата';
            dateToBtn.innerText = dateTo ? dateTo.split('-').reverse().join('.') : 'Дата';

            if (dateFrom && dateTo) {
                onFilterChange('interval', dateFrom, dateTo);
            }
        };

        if (intervalBtn) {
            intervalBtn.addEventListener('change', () => {
                if (intervalBtn.checked) {
                    if (dateFromBtn) dateFromBtn.style.cursor = 'pointer';
                    if (dateToBtn) dateToBtn.style.cursor = 'pointer';

                    if (!dateFromPicker) {
                        dateFromPicker = flatpickr(dateFromInput, {
                            locale: 'ru',
                            dateFormat: 'Y-m-d',
                            disableMobile: true,
                            positionElement: dateFromBtn,
                            clickOpens: false,
                            onChange: handleDateChange
                        });
                    }

                    if (!dateToPicker) {
                        dateToPicker = flatpickr(dateToInput, {
                            locale: 'ru',
                            dateFormat: 'Y-m-d',
                            disableMobile: true,
                            positionElement: dateToBtn,
                            clickOpens: false,
                            onChange: handleDateChange
                        });
                    }

                    if (dateFromBtn) dateFromBtn.onclick = () => dateFromPicker.open();
                    if (dateToBtn) dateToBtn.onclick = () => dateToPicker.open();
                }
            });
        }

        const resetIntervalText = () => {
            dateFromBtn.innerText = 'Дата';
            dateToBtn.innerText = 'Дата';
            dateFromInput.value = '';
            dateToInput.value = '';
            dateFromBtn.style.cursor = 'not-allowed';
            dateToBtn.style.cursor = 'not-allowed';

            if (dateFromPicker) {
                dateFromPicker.destroy();
                dateFromPicker = null;
            }
            if (dateToPicker) {
                dateToPicker.destroy();
                dateToPicker = null;
            }

            dateFromBtn.onclick = null;
            dateToBtn.onclick = null;
        };

        const filterButtons = ['today-btn', 'week-btn', 'month-btn', 'year-btn', 'all-btn'];
        filterButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('change', () => {
                    resetIntervalText();
                    const period = btnId.replace('-btn', '');
                    onFilterChange(period, null, null);
                });
            }
        });
    }
}