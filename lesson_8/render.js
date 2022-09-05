
class Product {
    /**
     * Class for single product (pesudo-backend)
     * @param {Number} id 
     * @param {string} name 
     * @param {Number} price 
     * @param {string} description 
     * @param {string} imageRoot 
     */
    constructor(id, name, price, description, imageRoot) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.imageRoot = imageRoot;
    }

    /**
     * creating product card, with classes
     * @param {string} parentNode - selector where to put product cart 
     */
    buildSelf(parentNode) {
        parentNode = document.querySelector(parentNode);
        const featureItem = document.createElement('div');
        featureItem.classList.add('featuredItem');
        featureItem.dataset.id = this.id.toString();

        const featuredImage = document.createElement('div');
        featuredImage.classList.add('featuredImgWrap');
        featuredImage.insertAdjacentHTML('beforeEnd', `<img src=${this.imageRoot} alt=${this.name.slice(0, 6).replace(' ', '_').toLowerCase()}>`);
        featuredImage.insertAdjacentHTML('beforeend',
            `<div class="featuredImgDark">
                <button>
                    <img src="./images/cart.svg" alt="addcartbutton">
                    " Add to Cart "
                </button>
            </div>
        `);

        const featuredData = document.createElement('div');
        featuredData.classList.add('featuredData');
        featuredData.insertAdjacentHTML('beforeEnd',
            `<div class="featuredName"> ${this.name.toUpperCase()} </div>`);
        featuredData.insertAdjacentHTML('beforeEnd',
            `<div class="featuredText">
                " ${this.description} "
            </div>`);
        featuredData.insertAdjacentHTML('beforeEnd',
            `<div class="featuredPrice"> $${this.price}.00 </div>`)

        featureItem.append(featuredImage);
        featureItem.append(featuredData);
        parentNode.append(featureItem);
    }
}

/**
 * creating categories for filter pop-up
 */
function buildCategories() {
    categoriesToInsert = ['category', 'brand', 'designer'];
    filler = [
        "Accessories", "Bags", "Denim", "Hoodies & Sweatshirts",
        "Jackets & Coats", "Polos", "Shirts", "Shoes", "Sweaters & Knits",
        "T-Shirts", "Tanks",
    ];

    const filterPopup = document.querySelector('.filterPopup');

    for (let i = 0; i < 3; i++) {
        const nav = document.createElement('nav');
        nav.classList.add('filterCategory');
        nav.insertAdjacentHTML('beforeEnd',
            `<div class="filterCategoryHeader">${categoriesToInsert[i].toUpperCase()}</div>`
        );

        const catSub = document.createElement('div');
        catSub.classList.add('hidden');
        for (let c = 0; c < filler.length - 1; c++) {
            catSub.insertAdjacentHTML('beforeEnd', `
            <a href="#">${filler[c]}</a>`);
        }
        nav.append(catSub);
        filterPopup.append(nav);
    }
}


/**
 * Pseudo-backend class to store cart data
 */
class Cart {
    constructor(itemsBackend, parentEl) {
        // Костыль для задания
        this.itemsBackend = itemsBackend;
        this.parentEl = parentEl
        this.cartItems = this.getItems();
        this.buildSelf();
        this.buildSelfItems();
        this.setItemsAmount();
        this.setCartEvents();
        this.setTotalCost();
    }

    // Get cart items from local storage
    getItems() {
        let presavedItems = null;
        if (localStorage.length !== 0 && 'cart' in localStorage) {
            presavedItems = JSON.parse(localStorage.getItem('cart'));
        }
        return presavedItems;
    }

    // create cart wrapper element
    buildSelf() {
        const self = document.querySelector('.cartWrapper');
        if (self !== null) {
            self.remove();
        }
        const cartWrapper = document.createElement('div');
        cartWrapper.classList.add('cartWrapper', 'hidden');
        cartWrapper.insertAdjacentHTML('beforeEnd',
            `<div class="cartTitle">Shopping cart</div>`);
        cartWrapper.insertAdjacentHTML('beforeEnd',
            `<div class="cartItems"></div>`)
        cartWrapper.insertAdjacentHTML('beforeEnd',
            `<div class="cartTotal">
                <span>Total: $</span><span class="totalCost">00.00</span>
            </div>`)
        document.querySelector(this.parentEl).append(cartWrapper);
    }

    // place element items inside cart wrapper
    buildSelfItems() {
        if (!this.setItemsAmount()) {
            const createTo = document.querySelector('.cartItems');
            createTo.insertAdjacentHTML('beforeEnd',
                `<div class="emptyCartFiller">
                    <span>Cart is empty</span>
                <div>`);
            return;
        }
        function createDiv(cls, content) {
            const requestedRes =
                `<div class="${cls}">
                    <span>${content}</span>
                 </div>`;
            return requestedRes;
        }

        const createTo = document.querySelector('.cartItems');
        for (let item in this.cartItems) {
            item = Number(item);
            const cartItem = document.createElement('div');
            cartItem.classList.add('item');
            cartItem.dataset.id = this.itemsBackend[item].id;
            cartItem.insertAdjacentHTML('beforeEnd',
                //<img class="likeBtn" src="./images/heart_button.svg" alt="del">    
                `<div class="itemBtns">
                    <img class="deleteBtn" src="./images/delete_button.svg" alt="del">
                    <div class="likeBtn likeOff"></div>
                </div>`
                +
                `<div class="itemImg">
                    <img src='${this.itemsBackend[item].imageRoot}' alt=prodname>
                 </div>`
                +
                createDiv('itemName', Array.from(this.itemsBackend[item].name)
                    .splice(0, 10).join('') + '...')
                +
                createDiv('itemAmnt', this.cartItems[item])
                +
                createDiv('itemPrice', `$${this.itemsBackend[item].price}.00`)
                +
                createDiv('itemsPriceTotal', `$${this.itemsBackend[item].price * this.cartItems[item]}.00`)
            );

            createTo.insertAdjacentElement('beforeEnd', cartItem);
        }
    }

    // Set the amount of ites in cart based on this.cartItems / localStorage
    setItemsAmount() {
        let result = 0;
        if (this.cartItems !== null) {
            const cartItemsTotal = document.querySelector('.cartItemsCount');
            for (const itemId in this.cartItems) {
                result += this.cartItems[itemId];
            }
            cartItemsTotal.textContent = result.toString();
        }
        return result;
    }

    // Set the total cost of items
    setTotalCost() {
        if (this.cartItems !== null) {
            const costObj = document.querySelector('.totalCost');
            let result = 0;
            for (const itemId in this.cartItems) {
                result += this.cartItems[itemId] * this.itemsBackend[itemId].price;
            }
            costObj.textContent = `${result}.00`;
        }
    }

    // update local storage to remove the 0n items
    updateLocalStorage() {
        const newLocalObj = {};
        for (const item in this.cartItems) {
            if (this.cartItems[item] !== 0) {
                newLocalObj[item] = this.cartItems[item];
            }
        }
        this.cartItems = newLocalObj;
        localStorage.setItem('cart', JSON.stringify(newLocalObj));
    }

    // Update cart data after add item
    rebuildSelf() {
        this.updateLocalStorage();
        this.buildSelf();
        this.updateLocalStorage();
        this.buildSelfItems();
        this.setItemsAmount();
    }

    // remove item from cart
    delPosition(id) {
        this.cartItems[id] = 0;
        this.updateLocalStorage();
        if (!this.setItemsAmount()) {
            const createTo = document.querySelector('.cartItems');
            createTo.insertAdjacentHTML('beforeEnd',
                `<div class="emptyCartFiller">
                    <span>Cart is empty</span>
                <div>`);
        }
        this.setTotalCost();
    }

    // apply enet handler for cart
    setCartEvents() {
        document.querySelector('.cartWrapper').addEventListener('click', (e) => {
            if (e.target.tagName === "IMG"
                && e.target.classList.contains('deleteBtn')) {
                const elId = e.target.parentNode.parentNode.dataset.id;
                this.delPosition(elId);
                const elHtml = document.querySelector(`.cartItems > [data-id='${elId}']`);
                elHtml.parentNode.removeChild(elHtml);
            } else if (e.target.tagName === "DIV") {
                if (e.target.classList.contains('likeOff')) {
                    e.target.classList.remove('likeOff');
                    e.target.classList.add('likeOn');
                } else {
                    e.target.classList.remove('likeOn');
                    e.target.classList.add('likeOff');
                }
            }
        });
    }
}

// Get imagewrap item id from dataset
function getItemId(eventTarget, counter = 5) {
    if (counter === 0) {
        return -1;
    }
    if (eventTarget.dataset.id === undefined) {
        return getItemId(eventTarget.parentNode, counter - 1);
    } else {
        return eventTarget.dataset.id;
    }
}

function main() {
    // Наполненеие страницы болванками
    const sampleProducts = {
        1: new Product(
            1,
            'Superkrutaya slojno-sinaya kurtka',
            52,
            'Modnaya sinya kurtka dlya bolshih i surovih borodachey s \
            bogatim vnutrennim mirom',
            './images/featured/1.jpg',
        ),
        2: new Product(
            2,
            'Modnaya odejda dlya kabare',
            72,
            'Odejda chernogo tsveta... prostaya chernaya odejda s alika, \
            bez karmanov + besplatnaya ubka',
            './images/featured/2.jpg',
        ),
        3: new Product(
            3,
            'recursivnaya kenguruha',
            35,
            'Sinaya kenguruha s printom v vide ukradennoy kartini \
            malevicha siniykvadrat(cherniykvadrat(siniykvadrat(...)))',
            './images/featured/3.jpg',
        ),
        4: new Product(
            4,
            'Turok ishet nevidimogo kota',
            30,
            'Mujik v siney futbolke s narkomanskim printom pitaetsya naity \
            svoego nevidimogo kota. Pomogite emu kto-nibud',
            './images/featured/4.jpg',
        ),
        5: new Product(
            5,
            'Elegantniy kostum chetverka',
            150,
            "Handy-dandy kostum chetverka pozvolit pustit' pil' v glaza \
            hamovatim aristokratam v zagorodnom klube",
            './images/featured/7.JPG',
        ),
        6: new Product(
            6,
            'Polosatoe chto-to, pohojee na koftu',
            40,
            'Lubopitnaya chernaya jenshina pitaetsya nayti dengi, \
            potrachennie na stroitelstvo gazprom areni. udachi ei',
            './images/featured/6.jpg',
        )
    };

    // строим болванки Вызывая метод класса Product
    for (const prod in sampleProducts)
        sampleProducts[prod].buildSelf('.featuredItems');
    buildCategories();

    // Создаем корзину
    const cart = new Cart(sampleProducts, '.rightHeader');

    // Собираем клик по айтему || псевдо-бэк
    // Пересобираем корзину При добавлении
    document.querySelectorAll('.featuredImgDark > button').forEach(el => {
        el.addEventListener('click', (event) => {
            if (cart.cartItems !== null && localStorage.cart !== '{}') {
                if (getItemId(event.target) in cart.cartItems) {
                    cart.cartItems[getItemId(event.target)] += 1;
                } else {
                    cart.cartItems[getItemId(event.target)] = 1;
                }
            } else {
                cart.cartItems[getItemId(event.target)] = 1;
            }
            cart.rebuildSelf();
            cart.setCartEvents();
            cart.setTotalCost();
        })
    });
}

main();
