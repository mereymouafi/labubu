import React, { useMemo } from 'react';
import { Order } from '../../../lib/supabase';

interface OrderAnalyticsProps {
  orders: Order[];
}

interface DailySalesData {
  date: string;
  count: number;
  revenue: number;
}

const OrderAnalytics: React.FC<OrderAnalyticsProps> = ({ orders }) => {
  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  }, [orders]);

  // Calculate average order value
  const averageOrderValue = useMemo(() => {
    if (orders.length === 0) return 0;
    return totalRevenue / orders.length;
  }, [orders, totalRevenue]);

  // Calculate orders by status
  const ordersByStatus = useMemo(() => {
    const statusCounts: Record<string, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      if (order.status && statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status]++;
      }
    });

    return statusCounts;
  }, [orders]);

  // Calculate daily sales data (last 7 days)
  const dailySalesData = useMemo(() => {
    const today = new Date();
    const last7Days: DailySalesData[] = [];

    // Create array of last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      last7Days.push({
        date: dateString,
        count: 0,
        revenue: 0
      });
    }

    // Fill with order data
    orders.forEach(order => {
      if (!order.created_at) return;
      
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      const dayData = last7Days.find(day => day.date === orderDate);
      
      if (dayData) {
        dayData.count++;
        dayData.revenue += order.total_amount || 0;
      }
    });

    return last7Days;
  }, [orders]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Orders */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
        </div>
        
        {/* Total Revenue */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-900">{totalRevenue.toFixed(2)} MAD</p>
        </div>
        
        {/* Average Order Value */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Average Order Value</h3>
          <p className="text-2xl font-bold text-purple-900">{averageOrderValue.toFixed(2)} MAD</p>
        </div>
        
        {/* Completed Orders */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Completed Orders</h3>
          <p className="text-2xl font-bold text-yellow-900">{ordersByStatus.completed}</p>
        </div>
      </div>
      
      {/* Order Status Breakdown */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">Order Status</h3>
        <div className="flex h-4 rounded-full overflow-hidden">
          {ordersByStatus.pending > 0 && (
            <div 
              className="bg-yellow-400" 
              style={{ width: `${(ordersByStatus.pending / orders.length) * 100}%` }}
              title={`Pending: ${ordersByStatus.pending}`}
            />
          )}
          {ordersByStatus.processing > 0 && (
            <div 
              className="bg-blue-400" 
              style={{ width: `${(ordersByStatus.processing / orders.length) * 100}%` }}
              title={`Processing: ${ordersByStatus.processing}`}
            />
          )}
          {ordersByStatus.completed > 0 && (
            <div 
              className="bg-green-400" 
              style={{ width: `${(ordersByStatus.completed / orders.length) * 100}%` }}
              title={`Completed: ${ordersByStatus.completed}`}
            />
          )}
          {ordersByStatus.cancelled > 0 && (
            <div 
              className="bg-red-400" 
              style={{ width: `${(ordersByStatus.cancelled / orders.length) * 100}%` }}
              title={`Cancelled: ${ordersByStatus.cancelled}`}
            />
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
            <span>Pending ({ordersByStatus.pending})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
            <span>Processing ({ordersByStatus.processing})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
            <span>Completed ({ordersByStatus.completed})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
            <span>Cancelled ({ordersByStatus.cancelled})</span>
          </div>
        </div>
      </div>
      
      {/* Daily Sales Chart */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-3">Orders by Day (Last 7 Days)</h3>
        <div className="relative h-60">
          {/* Chart bars */}
          <div className="flex items-end justify-between h-48 border-b border-gray-200">
            {dailySalesData.map((day, index) => {
              const maxRevenue = Math.max(...dailySalesData.map(d => d.revenue));
              const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center w-1/7">
                  <div 
                    className="w-12 bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                  >
                    <div className="text-xs text-white text-center pt-1">
                      {day.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {dailySalesData.map((day, index) => (
              <div key={index} className="text-xs text-gray-500 w-1/7 text-center">
                {formatDate(day.date)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;
