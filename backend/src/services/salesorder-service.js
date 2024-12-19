const crm = require('./adapters/crm.js');
const Customer = require('../models/Customer');
const Salesman = require('../models/Salesman');
const SalesOrder = require('../models/SalesOrder');
const Position   = require('../models/Position');
const Product    = require('../models/Product');
const customerService = require('../services/customer-service');
const salesmanService = require('../services/salesmen-service');

exports.getAllSaleOrdersFromOpenCRX = async (db) => {
    try {
        const salesOrders = await crm.queryAllSalesOrders();
        
        const mappedOrders = await Promise.all(salesOrders.map(async (order, orderIndex) => {
            const crmOrderId = order['@href'].split('/salesOrder/')[1];
            const orderDetail = await crm.querySalesOrderByUid(crmOrderId);
            const positionsData = await crm.querySalesOrderPositionByUid(crmOrderId);
            const positions = positionsData?.objects || [];

            // Look up customer and salesman IDs from database
            const customerUid = extractLastUrlPart(orderDetail.customer?.$ || '');
            //console.log('Customer UID:', customerUid);
            const salesmanUid = extractLastUrlPart(orderDetail.salesRep?.$ || '');
            //console.log('Salesman UID:', salesmanUid);
            
            const customerId = await customerService.getCustomerIdByUid(db, customerUid) || null;
            const salesmanId = await salesmanService.getSalesmanIdByUid(db, salesmanUid) || null;

            const year = orderDetail.activeOn ? 
                new Date(orderDetail.activeOn).getFullYear() : 
                new Date().getFullYear();
            
            const mappedPositions = await Promise.all(positions.map(async (pos, index) => {
                const productFullPath = pos.product?.$ || '';
                const productUid = productFullPath.split('/product/')[1] || `product-${index + 1}`;
                
                // Initialize productDetails with default values
                let productDetails = {
                    name: pos.product?.name || 'Unknown Product',
                    description: '',
                    minQuantity: 0,
                    maxQuantity: Number.MAX_SAFE_INTEGER,
                    minPositions: 0,
                    maxPositions: Number.MAX_SAFE_INTEGER
                };

                // Only try to fetch additional details if we have a valid product UID
                try {
                    if (productUid && productUid !== `product-${index + 1}`) {
                        const fetchedDetails = await crm.queryProductByUid(productUid);
                        if (fetchedDetails) {
                            productDetails = {
                                ...productDetails,
                                name: fetchedDetails.name || productDetails.name,
                                description: fetchedDetails.description || '',
                                minQuantity: fetchedDetails.minQuantity || 0,
                                maxQuantity: fetchedDetails.maxQuantity || Number.MAX_SAFE_INTEGER,
                                minPositions: fetchedDetails.minPositions || 0,
                                maxPositions: fetchedDetails.maxPositions || Number.MAX_SAFE_INTEGER
                            };
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to fetch details for product ${productUid}:`, err);
                    // Continue with default values
                }

                // Create product as plain object with extended information
                const product = {
                    productId: index + 1,
                    name: productDetails.name,
                    uid: productUid,
                    description: productDetails.description,
                    minQuantity: productDetails.minQuantity,
                    maxQuantity: productDetails.maxQuantity,
                    minPositions: productDetails.minPositions,
                    maxPositions: productDetails.maxPositions
                };

                // Rest of the code remains the same...
                return {
                    positionId: index + 1,
                    uid: pos.identity ? extractLastUrlPart(pos.identity) : '',
                    amount: parseAmount(pos.amount),
                    baseAmount: parseAmount(pos.baseAmount),
                    taxAmount: parseAmount(pos.taxAmount),
                    discountAmount: parseAmount(pos.discountAmount),
                    quantity: parseAmount(pos.quantity),
                    pricePerUnit: parseAmount(pos.pricePerUnit),
                    product: product
                };
            }));

            // Rest of the code remains the same...
            return {
                salesOrderId: orderIndex + 1,
                uid: extractLastUrlPart(orderDetail.identity),
                customerId: customerId,
                salesmanId: salesmanId,
                name: orderDetail.name,
                year: year,
                priority: orderDetail.priority || 1,
                submitStatus: orderDetail.submitStatus,
                pricingState: orderDetail.pricingState,
                totalAmount: parseAmount(orderDetail.totalAmount),
                totalTaxAmount: parseAmount(orderDetail.totalTaxAmount),
                totalBaseAmount: parseAmount(orderDetail.totalBaseAmount),
                totalAmountIncludingTax: parseAmount(orderDetail.totalAmountIncludingTax),
                totalDiscountAmount: parseAmount(orderDetail.totalDiscountAmount),
                totalSalesCommission: parseAmount(orderDetail.totalSalesCommission),
                positions: mappedPositions
            };
        }));

        return mappedOrders;
    } catch (error) {
        console.error('Error getting all sales orders:', error);
        throw new Error('Failed to fetch sales orders: ' + error.message);
    }
}

/**
 * Fetches sales orders from OpenCRX and inserts new records into MongoDB.
 * Only inserts records that don't already exist (based on uid).
 * Existing records are left unchanged.
 * @param {Object} db - MongoDB database connection.
 */
exports.updateSalesOrdersFromOpenCRX = async (db) => {
    const salesOrders = await this.getAllSaleOrdersFromOpenCRX(db);
    try {
        for (let salesOrder of salesOrders) {
            if (!salesOrder.uid) continue;

            const existingSalesOrder = await db.collection('salesorders').findOne({ uid: salesOrder.uid});
            if (!existingSalesOrder) {
                await db.collection('salesorders').insertOne(salesOrder);
            }
        }
    } catch (error) {
        console.error('Failed to update sales orders:', error);
        throw error;
    }
}

exports.getSalesmanOrders = async (db, salesmanId, year) => {
    const salesOrders = await db.collection('salesorders').find({ salesmanId: salesmanId, year: year }).toArray();
    return salesOrders;
}





const parseAmount = (str) => {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
};

const extractLastUrlPart = (url) => {
    if (!url) return '';
    return url.split('/').pop() || '';
};