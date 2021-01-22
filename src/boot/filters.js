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
    
    Vue.filter('truncate', function(text, length, clamp){
        clamp = clamp || '...';
        var node = document.createElement('div');
        node.innerHTML = text;
        var content = node.textContent;
        return content.length > length ? content.slice(0, length) + clamp : content;
    });
}