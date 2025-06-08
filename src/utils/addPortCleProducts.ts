import { supabase } from '../lib/supabase';

// Fonction pour ajouter des produits de type port-clés
export const addPortCleProducts = async () => {
  const categoryId = 'b96e1a7f-f32b-4d4f-b0f6-f43f25d46e0b'; // ID de la catégorie "Port Clés"
  
  // Exemples de produits port-clés
  const portCleProducts = [
    {
      name: "Porte-clés Labubu Classic",
      price: 9.99,
      original_price: 12.99,
      images: [
        "https://i.imgur.com/example1.jpg",
        "https://i.imgur.com/example2.jpg"
      ],
      category: "Port Clés",
      category_id: categoryId,
      collection: "Classic",
      description: "Porte-clés Labubu Classic en résine de haute qualité. Parfait pour les fans de Labubu.",
      stock_status: "in_stock",
      is_new: true
    },
    {
      name: "Porte-clés Labubu Zombie",
      price: 11.99,
      original_price: 14.99,
      images: [
        "https://i.imgur.com/example3.jpg",
        "https://i.imgur.com/example4.jpg"
      ],
      category: "Port Clés",
      category_id: categoryId,
      collection: "Halloween",
      description: "Porte-clés Labubu version zombie. Édition limitée pour Halloween.",
      stock_status: "in_stock",
      is_new: true
    },
    {
      name: "Porte-clés Labubu Astronaute",
      price: 12.99,
      original_price: 15.99,
      images: [
        "https://i.imgur.com/example5.jpg",
        "https://i.imgur.com/example6.jpg"
      ],
      category: "Port Clés",
      category_id: categoryId,
      collection: "Space",
      description: "Porte-clés Labubu en tenue d'astronaute. Parfait pour les amateurs d'espace.",
      stock_status: "in_stock",
      is_new: true
    }
  ];

  try {
    // Insérer les produits dans la base de données
    const { data, error } = await supabase
      .from('products')
      .insert(portCleProducts)
      .select();

    if (error) {
      console.error('Erreur lors de l\'ajout des produits port-clés:', error);
      return { success: false, error };
    }

    console.log('Produits port-clés ajoutés avec succès:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception lors de l\'ajout des produits port-clés:', error);
    return { success: false, error };
  }
};

// Fonction pour vérifier si des produits port-clés existent déjà
export const checkPortCleProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', 'b96e1a7f-f32b-4d4f-b0f6-f43f25d46e0b');

    if (error) {
      console.error('Erreur lors de la vérification des produits port-clés:', error);
      return { exists: false, error };
    }

    return { exists: data && data.length > 0, count: data?.length || 0 };
  } catch (error) {
    console.error('Exception lors de la vérification des produits port-clés:', error);
    return { exists: false, error };
  }
};
