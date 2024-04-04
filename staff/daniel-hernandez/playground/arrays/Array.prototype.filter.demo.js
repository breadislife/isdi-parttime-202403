//CASE filter words with a lenght greater that 6
var words = ['spray', 'elite', 'exuberant', 'destruction', 'present'];

var result = words.filter(function(word) { return word.length > 6 });

console.log(result);
// Expected output: Array ["exuberant", "destruction", "present"]

//CASE filter products via their min and max price
var shop = [
    {
        brand: 'Apple',
        model: 'MacBook Pro M2',
        kind: 'computer',
        year: 2023,
        price: 2500
    },
    {
        brand: 'Apple',
        model: 'MacBook Air',
        kind: 'computer',
        year: 2023,
        price: 950
    },
    {
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        kind: 'smatphone',
        year: 2023,
        price: 1200
    },
    {
        brand: 'Asus',
        model: 'Aspire',
        kind: 'computer',
        year: 2024,
        price: 600
    },
    {
        brand: 'Apple',
        model: 'Air Pods',
        kind: 'headphones',
        year: 2024,
        price: 200
    },
    {
        brand: 'Dell',
        model: 'Cool Dellirius',
        kind: 'computer',
        year: 2024,
        price: 400
    },
    {
        brand: 'Dell',
        model: 'Cool Dellirius 2',
        kind: 'computer',
        year: 2024,
        price: 550
    }
]

var products = shop.filter(function (product) {
    return product.price >= 500 && product.price <= 1000 && product.kind === 'computer'
})

console.debug(products)
