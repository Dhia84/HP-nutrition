// Initialisation du panier
let cart = [];
const cartItemsContainer = document.getElementById('cart-items');
const totalContainer = document.getElementById('total');

// Fonction pour ajouter un produit au panier
function addToCart(productName, price) {
    const item = cart.find(i => i.name === productName);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    updateCart();
}

// Fonction pour mettre à jour l'affichage du panier
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.innerHTML = `${item.name} - ${item.price}€ x ${item.quantity}`;
        cartItemsContainer.appendChild(itemRow);
        total += item.price * item.quantity;
    });

    totalContainer.innerHTML = `Total: ${total.toFixed(2)}€`;
}

// Attacher les boutons "Ajouter au panier" aux produits
const buttons = document.querySelectorAll('.product-item button');
buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const productName = document.querySelectorAll('.product-item h3')[index].innerText;
        const productPrice = parseFloat(document.querySelectorAll('.product-item p')[index].innerText.replace('Prix: ', '').replace('€', ''));
        addToCart(productName, productPrice);
    });
});

// Intégration Stripe pour le paiement
const stripe = Stripe('pk_test_XXXXXXXXXXXXXXXXXXXXXX');

document.getElementById('checkout').addEventListener('click', () => {
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: cart }),
    })
    .then(response => response.json())
    .then(session => {
        return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(result => {
        if (result.error) {
            alert(result.error.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
