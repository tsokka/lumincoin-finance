declare const flatpickr: (el: HTMLElement, config: object) => any;

export class DateFilterUtils {
    public static init(
        intervalBtnId: string,
        dateFromBtnId: string,
        dateToBtnId: string,
        dateFromInputId: string,
        dateToInputId: string,
        onFilterChange: (period: string, dateFrom: string | null, dateTo: string | null) => void
    ): void {
        const intervalBtn = document.getElementById(intervalBtnId) as HTMLInputElement | null;
        const dateFromBtn: HTMLElement | null = document.getElementById(dateFromBtnId);
        const dateToBtn: HTMLElement | null = document.getElementById(dateToBtnId);
        const dateFromInput = document.getElementById(dateFromInputId) as HTMLInputElement | null;
        const dateToInput = document.getElementById(dateToInputId) as HTMLInputElement | null;

        if (dateFromBtn) dateFromBtn.style.cursor = 'not-allowed';
        if (dateToBtn) dateToBtn.style.cursor = 'not-allowed';

        let dateFromPicker: any = null;
        let dateToPicker: any = null;

        const handleDateChange: () => void = (): void => {
            if (!dateFromInput || !dateToInput) return;

            const dateFrom: string = dateFromInput.value;
            const dateTo: string = dateToInput.value;

            if (dateFromBtn && dateToBtn) {
                dateFromBtn.innerText = dateFrom ? dateFrom.split('-').reverse().join('.') : 'Дата';
                dateToBtn.innerText = dateTo ? dateTo.split('-').reverse().join('.') : 'Дата';
            }

            if (dateFrom && dateTo) {
                onFilterChange('interval', dateFrom, dateTo);
            }
        };

        if (intervalBtn) {
            intervalBtn.addEventListener('change', (): void => {
                if (intervalBtn.checked) {
                    if (dateFromBtn) dateFromBtn.style.cursor = 'pointer';
                    if (dateToBtn) dateToBtn.style.cursor = 'pointer';

                    if (dateFromInput && !dateFromPicker && dateFromBtn) {
                        dateFromPicker = flatpickr(dateFromInput, {
                            locale: 'ru',
                            dateFormat: 'Y-m-d',
                            disableMobile: true,
                            positionElement: dateFromBtn,
                            clickOpens: false,
                            onChange: handleDateChange
                        });
                    }

                    if (dateToInput && !dateToPicker && dateToBtn) {
                        dateToPicker = flatpickr(dateToInput, {
                            locale: 'ru',
                            dateFormat: 'Y-m-d',
                            disableMobile: true,
                            positionElement: dateToBtn,
                            clickOpens: false,
                            onChange: handleDateChange
                        });
                    }

                    if (dateFromBtn) dateFromBtn.onclick = (): void | undefined => dateFromPicker?.open();
                    if (dateToBtn) dateToBtn.onclick = (): void | undefined => dateToPicker?.open();
                }
            });
        }

        const resetIntervalText: () => void = (): void => {
            if (dateFromBtn && dateToBtn && dateFromInput && dateToInput) {
                dateFromBtn.innerText = 'Дата';
                dateToBtn.innerText = 'Дата';
                dateFromInput.value = '';
                dateToInput.value = '';
                dateFromBtn.style.cursor = 'not-allowed';
                dateToBtn.style.cursor = 'not-allowed';
            }

            if (dateFromPicker) {
                dateFromPicker.destroy();
                dateFromPicker = null;
            }
            if (dateToPicker) {
                dateToPicker.destroy();
                dateToPicker = null;
            }

            if (dateFromBtn) dateFromBtn.onclick = null;
            if (dateToBtn) dateToBtn.onclick = null;
        };

        const filterButtons: string[] = ['today-btn', 'week-btn', 'month-btn', 'year-btn', 'all-btn'];

        filterButtons.forEach(btnId => {
            const btn: HTMLElement | null = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('change', (): void => {
                    resetIntervalText();
                    const period: string = btnId.replace('-btn', '');
                    onFilterChange(period, null, null);
                });
            }
        });
    }
}