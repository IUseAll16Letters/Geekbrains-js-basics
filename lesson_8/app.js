'use strict';

let fitlerPopup = document.querySelector('.filterPopup');
let fitlerLabel = document.querySelector('.filterLabel');
let filterIcon = document.querySelector('.filterIcon');

fitlerLabel.addEventListener('click', function () {
    fitlerPopup.classList.toggle('hidden');
    fitlerLabel.classList.toggle('filterLabelPink');
    filterIcon.classList.toggle('filterIconPink');

    if (filterIcon.getAttribute('src') === 'images/filter.svg') {
        filterIcon.setAttribute('src', 'images/filterHover.svg')
    } else {
        filterIcon.setAttribute('src', 'images/filter.svg')
    }
});

let filterHeaders = document.querySelectorAll('.filterCategoryHeader');
filterHeaders.forEach(function (header) {
    header.addEventListener('click', function (event) {
        event.target.nextElementSibling.classList.toggle('hidden');
    })
});

let filterSizes = document.querySelector('.filterSizes');
let filterSizeWrap = document.querySelector('.filterSizeWrap');
filterSizeWrap.addEventListener('click', function () {
    filterSizes.classList.toggle('hidden');
});

class Product {
    /**
     * 
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

    buildSelf(parentNode) {
        parentNode = document.querySelector(parentNode);
        const featureItem = document.createElement('div');
        featureItem.classList.add('featuredItem');

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
            `<div class="featuredPrice"> $${this.price}.00 </div>`) // <<<<<<<

        featureItem.append(featuredImage);
        featureItem.append(featuredData);
        parentNode.append(featureItem);
    }
}

function main() {
    const blueJacket = new Product(
        1,
        'Superkrutaya sinaya kurtka',
        52,
        'Modnaya sinya kurtka dlya bolshih i surovih borodachey s bogatim vnutrennim mirom',
        './images/featured/1.jpg',
    );
    const blackClothes = new Product(
        2,
        'Modnaya odejda dlya kabare',
        72,
        'Odejda chernogo tsveta... prostaya chernaya odejda s alika, bez karmanov + besplatnaya ubka',
        './images/featured/2.jpg',
    );
    const gingerHat = new Product(
        3,
        'Sinaya kenguruha s glukami',
        35,
        'Sinaya kenguruha s printom v vide ukradennoy kartini malevicha siniykvadrat(cherniykvadrat(siniykvadrat(...)))',
        './images/featured/3.jpg',
    );
    const invisibleCat = new Product(
        4,
        'Turok ishet nevidimogo kota',
        30,
        'Mujik v siney futbolke s narkomanskim printom pitaetsya naity svoego nevidimogo kota Petu',
        './images/featured/4.jpg',
    );
    const fourSuit = new Product(
        5,
        'Four piece suit',
        150,
        'Handy-dandy kostum chetverka, pustite pil v glaza hamovatim aristokratam v zagorodnom klube',
        './images/featured/7.JPG',
    );
    const blindSpot = new Product(
        6,
        'Polosatoe chto-to, pohojee na koftu',
        40,
        'Lubopitnaya chernaya jenshina pitaetsya nayti dengi, potrachennie na stroitelstvo gazprom areni',
        './images/featured/6.jpg',
    );

    blueJacket.buildSelf('.featuredItems');
    blackClothes.buildSelf('.featuredItems');
    gingerHat.buildSelf('.featuredItems');
    invisibleCat.buildSelf('.featuredItems');
    fourSuit.buildSelf('.featuredItems');
    blindSpot.buildSelf('.featuredItems');

}

main();