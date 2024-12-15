const crm = require('./adapters/crm.js');

exports.getProductsFromSalesOrder = async (salesOrderId) => {
    const objects = (await crm.querySalesOrderPosition(salesOrderId)).objects;
    return objects.map(object => ({
        productData: object.product,
        pricePerUnit: object.pricePerUnit,
        quantity: object.quantity,
        productDescription: object.productDescription,
    }));
}

exports.getCustomerFromSalesOrder = async (salesOrderId) => {
    const objects = (await crm.querySalesOrderPosition(salesOrderId)).objects;
    return objects.map(object => ({
        customerData: object.customer,
        customerName: object.name
    }))
}