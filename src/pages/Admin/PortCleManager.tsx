import React, { useState, useEffect } from 'react';
import { addPortCleProducts, checkPortCleProducts } from '../../utils/addPortCleProducts';

type ProductStatus = {
  exists: boolean;
  count: number;
  error?: unknown;
};

const PortCleManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [existingProducts, setExistingProducts] = useState<ProductStatus | undefined>();

  useEffect(() => {
    checkExistingProducts();
  }, []);

  const checkExistingProducts = async () => {
    setLoading(true);
    try {
      const result = await checkPortCleProducts();
      // S'assurer que count est toujours défini
      setExistingProducts({
        exists: result.exists,
        count: result.count || 0,
        error: result.error
      });
      if (result.exists) {
        setMessage({
          text: `${result.count} produits de type port-clés trouvés dans la base de données.`,
          type: 'info'
        });
      } else {
        setMessage({
          text: 'Aucun produit de type port-clés trouvé dans la base de données.',
          type: 'info'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des produits:', error);
      setMessage({
        text: 'Erreur lors de la vérification des produits existants.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProducts = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const result = await addPortCleProducts();
      
      if (result.success) {
        setMessage({
          text: 'Produits port-clés ajoutés avec succès!',
          type: 'success'
        });
        // Rafraîchir le compteur de produits
        await checkExistingProducts();
      } else {
        setMessage({
          text: `Erreur lors de l'ajout des produits: ${result.error ? (typeof result.error === 'object' && result.error !== null && 'message' in result.error ? (result.error as Error).message : 'Erreur détaillée non disponible') : 'Erreur inconnue'}`,
          type: 'error'
        });
      }
    } catch (error: any) {
      setMessage({
        text: `Exception lors de l'ajout des produits: ${error?.message || 'Erreur inconnue'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Gestionnaire de Produits Port-Clés</h1>
        
        {message && (
          <div 
            className={`p-4 mb-6 rounded-md ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 
              message.type === 'error' ? 'bg-red-100 text-red-700' : 
              'bg-blue-100 text-blue-700'
            }`}
          >
            {message.text}
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">État actuel</h2>
          <p>
            {existingProducts ? 
              existingProducts.exists ? 
                `${existingProducts.count} produits de type port-clés trouvés.` : 
                'Aucun produit de type port-clés trouvé.' 
              : 'Vérification des produits...'}
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleAddProducts}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Traitement en cours...' : 'Ajouter des produits exemples'}
          </button>
          
          <button
            onClick={checkExistingProducts}
            disabled={loading}
            className={`px-4 py-2 rounded-md border ${
              loading ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Rafraîchir
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-600">
          <p>Note: Cette page vous permet d'ajouter des produits de type port-clés à la base de données.</p>
          <p>Les produits ajoutés seront visibles sur la page Port Clés du site.</p>
        </div>
      </div>
    </div>
  );
};

export default PortCleManager;
