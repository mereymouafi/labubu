import React, { useState } from 'react';
import { Order } from '../../../lib/supabase';

interface OrderListProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => Promise<void>;
}

const OrderList: React.FC<OrderListProps> = ({ orders, updateOrderStatus }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Toggle order details expansion
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
        No orders found.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {orders.map((order) => (
        <li key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <span className="font-medium">Order #{order.id?.substring(0, 8)}</span>
              <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-4">{order.total_amount?.toFixed(2)} MAD</span>
              <button
                onClick={() => toggleOrderDetails(order.id || '')}
                className="text-blue-600 hover:text-blue-800"
              >
                {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>
          </div>

          {expandedOrderId === order.id && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <p><span className="font-medium">Name:</span> {order.shipping_info?.firstName} {order.shipping_info?.lastName}</p>
                    <p><span className="font-medium">Phone:</span> {order.shipping_info?.phone}</p>
                    <p><span className="font-medium">Address:</span> {order.shipping_info?.address}</p>
                    {order.shipping_info?.city && (
                      <p><span className="font-medium">City:</span> {order.shipping_info?.city}</p>
                    )}
                  </div>
                </div>

                {/* Order Status Management */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Order Management</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="mb-2"><span className="font-medium">Payment Method:</span> {order.payment_method}</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateOrderStatus(order.id || '', 'pending')}
                        className={`px-3 py-1 text-xs rounded ${order.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id || '', 'processing')}
                        className={`px-3 py-1 text-xs rounded ${order.status === 'processing' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'}`}
                      >
                        Processing
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id || '', 'completed')}
                        className={`px-3 py-1 text-xs rounded ${order.status === 'completed' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id || '', 'cancelled')}
                        className={`px-3 py-1 text-xs rounded ${order.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'}`}
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                <div className="bg-gray-50 rounded overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customization
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.order_items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.product_image && (
                                <div className="flex-shrink-0 h-10 w-10 mr-4">
                                  <img 
                                    className="h-10 w-10 rounded-full object-cover" 
                                    src={item.product_image} 
                                    alt={item.product_name} 
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.product_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {item.product_id.substring(0, 8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.price.toFixed(2)} MAD
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.tshirt_options ? (
                              <div>
                                {item.tshirt_options.size && <div>Size: {item.tshirt_options.size}</div>}
                                {item.tshirt_options.color && <div>Color: {item.tshirt_options.color}</div>}
                                {item.tshirt_options.style && <div>Style: {item.tshirt_options.style}</div>}
                                {item.tshirt_options.age && <div>Age: {item.tshirt_options.age}</div>}
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
