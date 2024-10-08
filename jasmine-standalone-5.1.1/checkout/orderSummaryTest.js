import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import { addToCart , cart , loadFromStorage } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { loadProducts, loadProductsFetch } from "../../data/products.js";

describe('test suite : renderOrderSummary' , () =>{
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
        const product2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';
        // beforeAll((done) => {
        //   loadProductsFetch().then(() => {
        //     done();
        //   });
        beforeAll(async () => {
          await loadProductsFetch();
        });
        
          
        
  beforeEach(() => {
    spyOn(localStorage,'setItem')
      document.querySelector('.js-test-container').innerHTML = `
        <div class = "js-order-summary"></div>
        <div class = "js-payment-summary"></div>`
        ;
        document.querySelector('.js-test-checkout-header').innerHTML = `<div class = "js-checkout-header"></div>`;
        
        spyOn(localStorage , 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId : productId1,
                quantity : 2,
                deliveryOptionId : '1'
              },{
                productId : product2,
                quantity : 1,
                deliveryOptionId : '2'
              
              }]);
        });
        
        loadFromStorage();

        renderOrderSummary();
  });
    it('displays the cart' , () => {
        
        const testItems = document.querySelectorAll('.js-cart-item-container');
        expect(testItems.length).toEqual(2);
        expect(
          document.querySelector(`.js-product-quantity-${productId1}`).innerText
        ).toContain('Quantity: 2');
        expect(
          document.querySelector(`.js-product-quantity-${product2}`).innerText
        ).toContain('Quantity: 1');

        expect(
          document.querySelector(`.js-product-name-${productId1}`).innerHTML
        ).toContain('Black and Gray Athletic Cotton Socks - 6 Pairs');
        
        expect(
          document.querySelector(`.js-product-price-${productId1}`).innerHTML
        ).toContain('10.90');
    });

    it('removes a product', () => {
      

        document.querySelector(`.js-delete-link-${productId1}`).click();
        const testItems = document.querySelectorAll('.js-cart-item-container');
        expect(testItems.length).toEqual(1);
        expect(
        document.querySelector(`.js-cart-item-container-${productId1}`)
        ).toEqual(null);
        expect(
          document.querySelector(`.js-cart-item-container-${product2}`)
          ).not.toEqual(null);

          expect(cart.length).toEqual(1);
          expect(cart[0].productId).toEqual(product2);

          expect(
            document.querySelector(`.js-product-name-${product2}`).innerHTML
          ).toContain('Intermediate Size Basketball');
          

    });

    afterEach(() => {
      document.querySelector('.js-test-container').innerHTML = '';
    });

    it('update the delivery option : ' , () => {
      document.querySelector(`.js-del-option-${productId1}-${3}`).click();

      expect(
        document.querySelector(`.js-delivery-option-input-${productId1}-${3}`).checked).toEqual(true);

        expect(cart.length).toEqual(2);


        expect(cart[0].productId).toEqual(productId1);
        expect(cart[0].deliveryOptionId).toEqual('3');

        expect(
          document.querySelector('.js-payment-shipping').innerText
        ).toEqual('$14.98');

        expect(
          document.querySelector('.js-money-total').innerText
        ).toEqual('$63.50');

        
    })

    

});






