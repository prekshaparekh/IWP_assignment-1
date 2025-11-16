let cart = [];

function loadcartfromstorage(){
    const savedcart = localStorage.getItem('cartitems');

    if (savedcart){
        cart = JSON.parse(savedcart);
        updatecartui();
    }
}

function savcarttostorage(){
    localStorage.setItem('cartitems',JSON.stringify(cart));
}

function addtocart(itemname,itemprice){
    const exitingitem = cart.find(item => item.name === itemname);

    if (exitingitem){
        exitingitem.quantity+=1
    }
    else{
        cart.push(
            {
                name:itemname,
                price: itemprice,
                quantity:1
            }
        )
    }
    // alert(`${itemname} added to the cart`);
    savcarttostorage();
    updatecartui();
    
}
function removefromcart(itemname){
    cart = cart.filter(item => item.name  !== itemname);

    alert(`you removed ${itemname} from the cart`);
    savcarttostorage();
    updatecartui();

}

function updatequantity(itemname,change){
    const item = cart.find(item => item.name === itemname);

    if (item){
        item.quantity+=change;

        if (item.quantity <=0){
            removefromcart(itemname);
        }else{
            savcarttostorage();
            updatecartui();
        }

    }
}
function calctotal(){
    return cart.reduce((total,item) =>{
        return total+(item.price*item.quantity);
    },0);
}

function updatecartbadge(){
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    let badge = document.querySelector('.cart-badge');

    if(totalItems>0){
        if(!badge){
            badge = document.createElement('span');
            badge.className = 'cart-badge';

            const carticon = document.querySelector('.cart');
            carticon.appendChild(badge);
        }
        badge.textContent = totalItems
    }else{
        if(badge){
            badge.remove();
        }
    }
}

function updatecartui(){
    updatecartbadge();

    const cart_container = document.getElementById('cart-items');
    if (cart_container){
        displaycartitems();
    }
}

function displaycartitems(){
    const cart_container = document.getElementById('cart-items');
    const total_element = document.getElementById('cart-total');
    const cart_final_total = document.getElementById('cart-total-final')
    const emptycart_message = document.getElementById('empty-cart-message');

    if (cart.length === 0){
        if (emptycart_message) emptycart_message.style.display = "block";
        if (cart_container) cart_container.innerHTML ='';
        if (total_element) total_element.textContent = "₹0";
        if (cart_final_total) cart_final_total.textContent = "₹0";
        if (cart_container) cart_container.style.display ='none';
        return;
    }
    if(emptycart_message) emptycart_message.style.display = "none";
    cart_container.innerHTML = '';

    cart_container.style.display = "flex";

    cart.forEach(item => {
        const cartitemdiv = document.createElement('div');
        cartitemdiv.className = 'cart-item';

        cartitemdiv.innerHTML = `
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">₹${item.price} each</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updatequantity('${item.name}', -1)">
                    <i class="ri-subtract-line"></i>
                </button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updatequantity('${item.name}', 1)">
                    <i class="ri-add-line"></i>
                </button>
                <span class="item-total">₹${item.price * item.quantity}</span>
                <button class="remove-btn" onclick="removefromcart('${item.name}')">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;

        cart_container.appendChild(cartitemdiv);
    });
    const total = calctotal();
    if (total_element) {
        total_element.textContent = `₹${total}`;
        cart_final_total.textContent =  `₹${total}`;

    }

}
function clearcart(){
    if(confirm('Do you want to clear your cart?')){
        cart = [];
        savcarttostorage();
        updatecartui();
        alert('your cart is cleared !');
    }
}

function checkout(){
    if(cart.length === 0){
        alert('your cart is empty');
        return;
    }
    const total = calctotal();
    alert(`Order placed! Total: ₹${total}\n\nThank you for your order!`);

    cart= [];
    savcarttostorage();
    updatecartui();

}


document.addEventListener('DOMContentLoaded', function() {
    
    loadcartfromstorage();
    
    
    if (document.getElementById('cart-items')) {
        displaycartitems();
    }
});




