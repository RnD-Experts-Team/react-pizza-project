import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useReduxAuth } from '../hooks/useReduxAuth';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
}

const Pizza: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [filteredPizzas, setFilteredPizzas] = useState<Pizza[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useReduxAuth();
  const navigate = useNavigate();

  // Mock pizza data
  const mockPizzas: Pizza[] = [
    {
      id: 1,
      name: 'Margherita',
      description:
        'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: 12.99,
      image:
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
      ingredients: ['Tomato Sauce', 'Mozzarella', 'Fresh Basil', 'Olive Oil'],
    },
    {
      id: 2,
      name: 'Pepperoni',
      description:
        'Traditional pizza topped with pepperoni and mozzarella cheese',
      price: 15.99,
      image:
        'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
      ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
    },
    {
      id: 3,
      name: 'Quattro Stagioni',
      description:
        'Four seasons pizza with mushrooms, ham, artichokes, and olives',
      price: 18.99,
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      ingredients: [
        'Tomato Sauce',
        'Mozzarella',
        'Mushrooms',
        'Ham',
        'Artichokes',
        'Olives',
      ],
    },
    {
      id: 4,
      name: 'Hawaiian',
      description: 'Tropical pizza with ham and pineapple',
      price: 16.99,
      image:
        'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop',
      ingredients: ['Tomato Sauce', 'Mozzarella', 'Ham', 'Pineapple'],
    },
    {
      id: 5,
      name: 'Vegetarian',
      description: 'Fresh vegetables with bell peppers, mushrooms, and onions',
      price: 14.99,
      image:
        'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=300&h=200&fit=crop',
      ingredients: [
        'Tomato Sauce',
        'Mozzarella',
        'Bell Peppers',
        'Mushrooms',
        'Onions',
        'Olives',
      ],
    },
    {
      id: 6,
      name: 'Meat Lovers',
      description: 'Loaded with pepperoni, sausage, ham, and bacon',
      price: 21.99,
      image:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
      ingredients: [
        'Tomato Sauce',
        'Mozzarella',
        'Pepperoni',
        'Sausage',
        'Ham',
        'Bacon',
      ],
    },
  ];

  // Simulate API call
  const fetchPizzas = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would make an actual API call:
      // const response = await axios.get('/api/pizzas');
      // setPizzas(response.data);

      setPizzas(mockPizzas);
      setFilteredPizzas(mockPizzas);
    } catch (error) {
      console.error('Error fetching pizzas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  useEffect(() => {
    const filtered = pizzas.filter(
      (pizza) =>
        pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pizza.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pizza.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
    setFilteredPizzas(filtered);
  }, [searchTerm, pizzas]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  🍕 Pizza Palace
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name}!
                  </span>
                )}
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                >
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Delicious Pizzas
              </h2>
              <div className="max-w-md">
                <Input
                  type="text"
                  placeholder="Search pizzas, ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                  Loading delicious pizzas...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPizzas.map((pizza) => (
                  <Card
                    key={pizza.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={pizza.image}
                        alt={pizza.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop';
                        }}
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{pizza.name}</CardTitle>
                        <span className="text-2xl font-bold text-orange-600">
                          ${pizza.price}
                        </span>
                      </div>
                      <CardDescription>{pizza.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          Ingredients:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {pizza.ingredients.map((ingredient, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredPizzas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No pizzas found matching your search.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pizza;
