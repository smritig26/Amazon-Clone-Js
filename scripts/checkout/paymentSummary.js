import { cart } from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import {getDeliveryOption} from "../../data/deliveryoptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";
export function renderPaymentSummary(){
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

        shippingPriceCents += deliveryOption.priceCents;

    });

    const totalBeforeTacCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTacCents * 0.1;
    const totalCents = totalBeforeTacCents + taxCents;

    let quant = 0;
    cart.forEach((item) => {
        quant += item.quantity;
    })

    const paymentSummaryHTML = `
            <div class="payment-summary-title">
                    Order Summary
                </div>

                <div class="payment-summary-row">
                    <div>Items (${quant}):</div>
                    <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
                </div>

                <div class="payment-summary-row">
                    <div>Shipping &amp; handling:</div>
                    <div class="payment-summary-money js-payment-shipping">$${formatCurrency(shippingPriceCents)}</div>
                </div>

                <div class="payment-summary-row subtotal-row">
                    <div>Total before tax:</div>
                    <div class="payment-summary-money">$${formatCurrency(totalBeforeTacCents)}</div>
                </div>

                <div class="payment-summary-row">
                    <div>Estimated tax (10%):</div>
                    <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
                </div>

                <div class="payment-summary-row total-row">
                    <div>Order total:</div>
                    <div class="payment-summary-money js-money-total">$${formatCurrency(totalCents)}</div>
                </div>

                <button class="place-order-button button-primary js-place-order">
                    Place your order
                </button>`;

                document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

                document.querySelector('.js-place-order').addEventListener('click' , async () => {
                    try{
                        const response =  await fetch('https://supersimplebackend.dev/orders' , {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                cart: cart
                            })
                        });
                       const order =  await response.json();
                    //    console.log(order);
                    addOrder(order);

                    } catch(error){
                        console.log('unexpected error!');
                    }

                    window.location.href = 'orders.html';
                   
                });
                
}

