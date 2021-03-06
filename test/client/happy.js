/* @flow */
/* eslint require-await: off, max-lines: off */

import { setupButton } from '../../src';

import { createButtonHTML, getMockCheckoutInstance,
    getOrderApiMock, captureOrderApiMock, authorizeOrderApiMock } from './mocks';
import { triggerKeyPress } from './util';

describe('happy cases', () => {

    it('should render a button, click the button, and render checkout', async () => {
    
        let renderToCalled = false;

        window.paypal.Checkout.renderTo = async () => {
            renderToCalled = true;
        };

        window.document.body.innerHTML = createButtonHTML();
    
        await setupButton();
    
        window.document.querySelector('.paypal-button').click();
    
        if (!renderToCalled) {
            throw new Error(`Expected renderTo to be called`);
        }
    });
    
    it('should render a button, press enter on the button, and render checkout', async () => {
    
        let renderToCalled = false;
    
        window.paypal.Checkout.renderTo = async () => {
            renderToCalled = true;
        };
    
        window.document.body.innerHTML = createButtonHTML();
    
        await setupButton();
    
        triggerKeyPress(window.document.querySelector('.paypal-button'), 13);
    
        if (!renderToCalled) {
            throw new Error(`Expected renderTo to be called`);
        }
    });
    
    it('should render a button, click the button, and call onClick', async () => {
    
        let onClickCalled = false;
    
        window.xprops.onClick = async () => {
            onClickCalled = true;
        };
    
        window.document.body.innerHTML = createButtonHTML();
    
        await setupButton();
    
        window.document.querySelector('.paypal-button').click();
    
        if (!onClickCalled) {
            throw new Error(`Expected onClick to be called`);
        }
    });
    
    it('should render a button, press enter on the button, and call onClick', async () => {
        
        let onClickCalled = false;
    
        window.xprops.onClick = async () => {
            onClickCalled = true;
        };
    
        window.document.body.innerHTML = createButtonHTML();
    
        await setupButton();
    
        triggerKeyPress(window.document.querySelector('.paypal-button'), 13);
    
        if (!onClickCalled) {
            throw new Error(`Expected onClick to be called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent', async () => {

        const orderID = 'XXXXXX';
        const payerID = 'YYYYYY';
    
        let onApprove;
        let onApproveCalled = false;

        window.xprops.onApprove = async (data) => {
            if (data.orderID !== orderID) {
                throw new Error(`Expected orderID to be ${ orderID }, got ${ data.orderID }`);
            }

            if (data.payerID !== payerID) {
                throw new Error(`Expected orderID to be ${ payerID }, got ${ data.payerID }`);
            }

            onApproveCalled = true;
        };

        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID });
        };
    
        window.document.body.innerHTML = createButtonHTML();
    
        await setupButton();
    
        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent with a paymentID', async () => {

        const orderID = 'XXXXXX';
        const payerID = 'YYYYYY';
        const paymentID = 'ZZZZZZ';

        let onApprove;
        let onApproveCalled = false;

        window.xprops.onApprove = async (data) => {
            if (data.paymentID !== paymentID) {
                throw new Error(`Expected paymentID to be ${ paymentID }, got ${ data.paymentID }`);
            }

            onApproveCalled = true;
        };

        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID, paymentID });
        };

        window.document.body.innerHTML = createButtonHTML();

        await setupButton();

        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onCancel callback to the parent', async () => {

        let onCancel;
        let onCancelCalled = false;

        window.xprops.onCancel = () => {
            onCancelCalled = true;
        };

        window.paypal.Checkout.renderTo = async (win, props) => {
            onCancel = props.onCancel.call(getMockCheckoutInstance(), {});
        };

        window.document.body.innerHTML = createButtonHTML();

        await setupButton();

        window.document.querySelector('.paypal-button').click();

        await onCancel;

        if (!onCancel || !onCancelCalled) {
            throw new Error(`Expected onCancel to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent with the correct data', async () => {
    
        const orderID = 'XXXXXXXXXX';
        const payerID = 'YYYYYYYYYY';

        let onApprove;
        let onApproveCalled = false;

        window.xprops.onApprove = async (data) => {

            if (data.orderID !== orderID) {
                throw new Error(`Expected data.orderID to be ${ orderID }, got ${ data.orderID }`);
            }

            if (data.orderID !== orderID) {
                throw new Error(`Expected data.orderID to be ${ orderID }, got ${ data.orderID }`);
            }

            onApproveCalled = true;
        };
    
        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID });
        };
    
        window.document.body.innerHTML = createButtonHTML();
    
        await setupButton();
    
        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent with actions.restart', async () => {
    
        const orderID = 'XXXXXXX';
        const payerID = 'YYYYYYYYYY';

        let onApprove;
        let onApproveCalled = false;
        let didRestart = false;

        window.xprops.onApprove = async (data, actions) => {
            if (didRestart) {
                onApproveCalled = true;
            } else {
                didRestart = true;
                onApprove = null;
                actions.restart();
            }
        };
    
        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID });
        };
    
        window.document.body.innerHTML = createButtonHTML();
    
        await setupButton();
    
        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent with actions.order.get', async () => {

        const orderID = 'XXXXXXXXXX';
        const payerID = 'YYYYYYYYYY';

        let onApprove;
        let onApproveCalled = false;

        window.xprops.onApprove = async (data, actions) => {

            const getOrderMock = getOrderApiMock();
            getOrderMock.expectCalls();
            await actions.order.get();
            getOrderMock.done();

            onApproveCalled = true;
        };

        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID });
        };

        window.document.body.innerHTML = createButtonHTML();

        await setupButton();

        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent with actions.order.capture', async () => {

        const orderID = 'XXXXXXXXXX';
        const payerID = 'YYYYYYYYYY';

        let onApprove;
        let onApproveCalled = false;

        window.xprops.onApprove = async (data, actions) => {

            const captureOrderMock = captureOrderApiMock();
            captureOrderMock.expectCalls();
            await actions.order.capture();
            captureOrderMock.done();

            onApproveCalled = true;
        };

        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID });
        };

        window.document.body.innerHTML = createButtonHTML();

        await setupButton();

        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent with actions.order.authorize', async () => {

        const orderID = 'XXXXXXXXXX';
        const payerID = 'YYYYYYYYYY';

        let onApprove;
        let onApproveCalled = false;

        window.xprops.onApprove = async (data, actions) => {

            const authorizeOrderMock = authorizeOrderApiMock();
            authorizeOrderMock.expectCalls();
            await actions.order.authorize();
            authorizeOrderMock.done();

            onApproveCalled = true;
        };

        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID });
        };

        window.document.body.innerHTML = createButtonHTML();

        await setupButton();

        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent with actions.order.capture call and automatic restart on CC_PROCESSOR_DECLINED', async () => {

        const orderID = 'XXXXXXXXXX';
        const payerID = 'YYYYYYYYYY';

        let onApprove;
        let onApproveCalled = false;
        let didRestart = false;

        window.xprops.onApprove = async (data, actions) => {
            if (didRestart) {
                onApproveCalled = true;
            } else {
                didRestart = true;
                onApprove = null;

                const captureOrderMock = captureOrderApiMock({
                    data: {
                        ack:         'contingency',
                        contingency: 'CC_PROCESSOR_DECLINED'
                    }
                });

                captureOrderMock.expectCalls();
                actions.order.capture();
                captureOrderMock.done();
            }
        };

        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID });
        };

        window.document.body.innerHTML = createButtonHTML();

        await setupButton();

        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent with actions.order.capture call and automatic restart on INSTRUMENT_DECLINED', async () => {

        const orderID = 'XXXXXXXXXX';
        const payerID = 'YYYYYYYYYY';

        let onApprove;
        let onApproveCalled = false;
        let didRestart = false;

        window.xprops.onApprove = async (data, actions) => {
            if (didRestart) {
                onApproveCalled = true;
            } else {
                didRestart = true;
                onApprove = null;

                const captureOrderMock = captureOrderApiMock({
                    data: {
                        ack:         'contingency',
                        contingency: 'INSTRUMENT_DECLINED'
                    }
                });

                captureOrderMock.expectCalls();
                actions.order.capture();
                captureOrderMock.done();
            }
        };

        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID });
        };

        window.document.body.innerHTML = createButtonHTML();

        await setupButton();

        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });

    it('should render a button, click the button, and render checkout, then pass onApprove callback to the parent with actions.order.authorize call and automatic restart on CC_PROCESSOR_DECLINED', async () => {

        const orderID = 'XXXXXXXXXX';
        const payerID = 'YYYYYYYYYY';

        let onApprove;
        let onApproveCalled = false;
        let didRestart = false;

        window.xprops.onApprove = async (data, actions) => {
            if (didRestart) {
                onApproveCalled = true;
            } else {
                didRestart = true;
                onApprove = null;

                const authorizeOrderMock = authorizeOrderApiMock({
                    data: {
                        ack:         'contingency',
                        contingency: 'CC_PROCESSOR_DECLINED'
                    }
                });

                authorizeOrderMock.expectCalls();
                actions.order.authorize();
                authorizeOrderMock.done();
            }
        };

        window.paypal.Checkout.renderTo = async (win, props) => {
            onApprove = props.onApprove.call(getMockCheckoutInstance(), { orderID, payerID });
        };

        window.document.body.innerHTML = createButtonHTML();

        await setupButton();

        window.document.querySelector('.paypal-button').click();

        await onApprove;

        if (!onApprove || !onApproveCalled) {
            throw new Error(`Expected onApprove to have been called`);
        }
    });
});
