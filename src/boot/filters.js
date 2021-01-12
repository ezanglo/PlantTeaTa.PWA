export default ({ Vue}) => {
    Vue.filter('toCurrency', function (value) {
        if(isNaN(value)){
            return value;
        }
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        });
        return formatter.format(value);
    });
}