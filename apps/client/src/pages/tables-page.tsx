import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { getAllRestaurants, getAllQrCodes, getAllOrders } from '@/services/api.service';
import { useOrderStore } from '@/components/order/order.store';
import type { Restaurant, QrCode, Order } from '@/types/types';
import { OrderStatus } from '@/types/types';
import { 
  Utensils, 
  QrCode as QrCodeIcon, 
  ShoppingCart, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign
} from 'lucide-react';

interface RestaurantWithQrCodes extends Restaurant {
  qrCodes: QrCode[];
  orders: Order[];
}

interface TableGroup {
  tableNumber: string;
  qrCodes: QrCode[];
  orders: Order[];
}

export const TablesPage = () => {
  const [restaurants, setRestaurants] = useState<RestaurantWithQrCodes[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { clearCurrentOrder } = useOrderStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsData, qrCodesData, ordersData] = await Promise.all([
          getAllRestaurants(),
          getAllQrCodes(),
          getAllOrders()
        ]);

        // Group qrCodes and orders by restaurant
        const restaurantsWithData = restaurantsData.map(restaurant => {
          const restaurantQrCodes = qrCodesData.filter(qrCode => qrCode.restaurantId === restaurant.id);
          const restaurantOrders = ordersData.filter(order => 
            restaurantQrCodes.some(qrCode => qrCode.qrId === order.qrId)
          );

          return {
            ...restaurant,
            qrCodes: restaurantQrCodes,
            orders: restaurantOrders
          };
        });

        setRestaurants(restaurantsWithData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTableClick = async (restaurantId: string, qrId: string) => {
    // Clear any existing order state
    clearCurrentOrder();
    
    // Navigate to the menu page
    navigate(`/${restaurantId}/${qrId}/menu`);
  };

  const groupQrCodesByTable = (qrCodes: QrCode[], orders: Order[]): TableGroup[] => {
    // Group QR codes by table number
    const tableGroups = new Map<string, QrCode[]>();
    
    qrCodes.forEach(qrCode => {
      const tableNumber = qrCode.tableNumber;
      if (!tableGroups.has(tableNumber)) {
        tableGroups.set(tableNumber, []);
      }
      tableGroups.get(tableNumber)!.push(qrCode);
    });

    // Convert to array and sort by table number, then sort QR codes within each table
    return Array.from(tableGroups.entries())
      .map(([tableNumber, qrCodes]) => ({
        tableNumber,
        qrCodes: qrCodes.sort((a, b) => a.qrId.localeCompare(b.qrId)),
        orders
      }))
      .sort((a, b) => {
        // Sort table numbers naturally (A1, A2, A10 instead of A1, A10, A2)
        const aNum = parseInt(a.tableNumber.replace(/\D/g, ''));
        const bNum = parseInt(b.tableNumber.replace(/\D/g, ''));
        const aPrefix = a.tableNumber.replace(/\d/g, '');
        const bPrefix = b.tableNumber.replace(/\d/g, '');
        
        if (aPrefix !== bPrefix) {
          return aPrefix.localeCompare(bPrefix);
        }
        return aNum - bNum;
      });
  };

  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case OrderStatus.InProgress:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case OrderStatus.Delivered:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case OrderStatus.Paid:
        return <DollarSign className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'Pending';
      case OrderStatus.InProgress:
        return 'In Progress';
      case OrderStatus.Delivered:
        return 'Delivered';
      case OrderStatus.Paid:
        return 'Paid';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading restaurants and qrCodes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan2Eat Dev Dashboard</h1>
        <p className="text-gray-600">Select a table to navigate to the menu</p>
      </div>

      <div className="space-y-8">
        {restaurants.map((restaurant) => {
          const tableGroups = groupQrCodesByTable(restaurant.qrCodes, restaurant.orders);
          
          return (
            <Card key={restaurant.id} className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Utensils className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{restaurant.key}</h2>
                  <p className="text-sm text-gray-500">ID: {restaurant.id}</p>
                </div>
              </div>

              <div className="space-y-6">
                {tableGroups.map((tableGroup) => (
                  <div key={tableGroup.tableNumber} className="border-l-4 border-blue-200 pl-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      Table {tableGroup.tableNumber}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tableGroup.qrCodes.map((qrCode) => {
                        const tableOrders = restaurant.orders.filter(order => order.qrId === qrCode.qrId);
                        const activeOrders = tableOrders.filter(order => 
                          order.status !== OrderStatus.Paid && order.status !== OrderStatus.Delivered
                        );

                        return (
                          <Card 
                            key={qrCode.id} 
                            className="p-4 border-2 hover:border-blue-400 transition-colors cursor-pointer"
                            onClick={() => handleTableClick(restaurant.id, qrCode.qrId)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <QrCodeIcon className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-900">
                                  QR {qrCode.qrId}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>

                            <div className="space-y-2">
                              <div className="text-sm text-gray-600">
                                Table: <span className="font-medium">{qrCode.tableNumber}</span>
                              </div>

                              {activeOrders.length > 0 && (
                                <div className="mt-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ShoppingCart className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                      Active Orders ({activeOrders.length})
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    {activeOrders.slice(0, 2).map((order) => (
                                      <div key={order.id} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1">
                                          {getOrderStatusIcon(order.status)}
                                          <span className="text-gray-600">
                                            {getOrderStatusText(order.status)}
                                          </span>
                                        </div>
                                        <span className="font-medium">
                                          ${(order.price / 1000).toFixed(0)}k
                                        </span>
                                      </div>
                                    ))}
                                    {activeOrders.length > 2 && (
                                      <div className="text-xs text-gray-500">
                                        +{activeOrders.length - 2} more orders
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {activeOrders.length === 0 && (
                                <div className="text-xs text-gray-500 mt-2">
                                  No active orders
                                </div>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {tableGroups.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No qrCodes found for this restaurant
                </div>
              )}
            </Card>
          );
        })}

        {restaurants.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No Restaurants Found</h3>
              <p>No restaurants have been created yet.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}; 