import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Order } from '../../lib/supabase';
import OrderList from './components/OrderList';
import OrderAnalytics from './components/OrderAnalytics';
import OrderFilters from './components/OrderFilters';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');

  // Fetch all orders from the database
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setOrders(data || []);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  
  // Apply filters to orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter !== 'all') {
        const orderDate = new Date(order.created_at || '');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        
        switch (dateFilter) {
          case 'today':
            if (orderDate < today) return false;
            break;
          case 'yesterday':
            if (orderDate < yesterday || orderDate >= today) return false;
            break;
          case 'last7days':
            if (orderDate < last7Days) return false;
            break;
          case 'last30days':
            if (orderDate < last30Days) return false;
            break;
          case 'thisMonth':
            if (orderDate < thisMonthStart) return false;
            break;
          case 'lastMonth':
            if (orderDate < lastMonthStart || orderDate > lastMonthEnd) return false;
            break;
        }
      }
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const orderId = order.id?.toLowerCase() || '';
        const customerName = `${order.shipping_info?.firstName || ''} ${order.shipping_info?.lastName || ''}`.toLowerCase();
        
        if (!orderId.includes(query) && !customerName.includes(query)) {
          return false;
        }
      }
      
      return true;
    });
  }, [orders, statusFilter, dateFilter, searchQuery]);

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert(`Failed to update order status: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="bg-white p-6 rounded-lg shadow text-red-600">
            <p>Error: {error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Order List
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded ${viewMode === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Analytics
            </button>
            <Link to="/" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Back to Store
            </Link>
          </div>
        </div>

        {/* Order Filters */}
        <OrderFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {viewMode === 'analytics' ? (
          <OrderAnalytics orders={filteredOrders} />
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Orders ({filteredOrders.length})
              </h3>
            </div>
            
            <OrderList 
              orders={filteredOrders} 
              updateOrderStatus={updateOrderStatus} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
