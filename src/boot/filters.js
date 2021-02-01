export default ({ Vue, store}) => {
    Vue.filter('toCurrency', function (value) {
        if(isNaN(value)){
            return value;
        }
        var formatter = new Intl.NumberFormat('en-PH', {
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
    
    Vue.filter('toProductType', function(productId){
        if(!productId){
            return
        }
        const allProducts = store.state.product.allProducts
        let product = allProducts.find(function(product){
            return product.id == productId
        })
        if(!product){
            return
        }
        return product.productType
    });

    Vue.filter('toPHTimezone', function(date){
        if(!date){
            return
        }
        if(!(date instanceof Date)){
            date = date.toDate()
        }
        return date.toLocaleString("en-US", {timeZone: 'Asia/Manila'})
    })
}