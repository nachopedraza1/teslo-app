
export const format = (value: number) => {

    const formatter = new Intl.NumberFormat('en-ES', {
        currency: 'USD',
        style: 'currency',
        maximumFractionDigits: 2,
        maximumSignificantDigits: 2
    })

    return formatter.format(value);
}