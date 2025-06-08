import React, { useEffect, useState } from 'react';
import { fetchProducts, Product } from '../lib/supabase';
import ProductCard from '../components/Product/ProductCard';
import { supabase } from '../lib/supabase';

const PortClePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortCleProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Méthode 1: Essayer de récupérer par nom de catégorie exact
        let portCleProducts = await fetchProducts({ 
          category: 'Port Clés' 
        });

        // Si aucun produit trouvé, essayer avec d'autres variantes du nom
        if (portCleProducts.length === 0) {
          portCleProducts = await fetchProducts({ 
            category: 'port clés' 
          });
        }

        if (portCleProducts.length === 0) {
          portCleProducts = await fetchProducts({ 
            category: 'port cles' 
          });
        }

        if (portCleProducts.length === 0) {
          portCleProducts = await fetchProducts({ 
            category: 'porte clés' 
          });
        }

        // Méthode 2: Si toujours rien, essayer de récupérer par ID de catégorie
        if (portCleProducts.length === 0) {
          // ID de catégorie visible dans votre image
          const categoryId = 'b96e1a7f-f32b-4d4f-b0f6-f43f25d46e0b';
          
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId);
          
          if (error) {
            throw error;
          }
          
          portCleProducts = data || [];
        }

        // Méthode 3: Si toujours rien, essayer de récupérer tous les produits et filtrer
        if (portCleProducts.length === 0) {
          const { data: allProducts, error } = await supabase
            .from('products')
            .select('*');
          
          if (error) {
            throw error;
          }
          
          // Filtrer les produits qui contiennent "clé", "cle", "porte" dans leur nom ou catégorie
          portCleProducts = (allProducts || []).filter(product => 
            product.name?.toLowerCase().includes('clé') || 
            product.name?.toLowerCase().includes('cle') || 
            product.name?.toLowerCase().includes('porte') ||
            product.category?.toLowerCase().includes('clé') ||
            product.category?.toLowerCase().includes('cle')
          );
        }
        
        setProducts(portCleProducts);
        
        if (portCleProducts.length === 0) {
          console.log('Aucun produit trouvé malgré plusieurs tentatives');
        }
      } catch (error) {
        console.error('Error loading port clé products:', error);
        setError('Erreur lors du chargement des produits');
      } finally {
        setIsLoading(false);
      }
    };

    loadPortCleProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Chargement des produits...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-lg text-red-500">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Port Clés
            </h1>
            <p className="text-gray-600 mt-2">
              Découvrez notre collection de porte-clés uniques
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-yellow-50 rounded-lg">
              <p className="text-lg text-gray-700">Aucun produit trouvé dans cette catégorie.</p>
              <p className="mt-2 text-sm text-gray-500">Essayez de vérifier si les produits sont correctement associés à la catégorie "Port Clés" dans la base de données.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PortClePage;
