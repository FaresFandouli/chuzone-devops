import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });
  const [filter, setFilter] = useState('all');

  // Charger les produits depuis localStorage au démarrage
  useEffect(() => {
    const savedProducts = localStorage.getItem('chuzone-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Données initiales pour la démo
      const initialProducts = [
        { id: 1, name: 'MacBook Pro M3', price: 2499, category: 'Informatique', createdAt: new Date().toISOString() },
        { id: 2, name: 'iPhone 15 Pro', price: 1299, category: 'Téléphonie', createdAt: new Date().toISOString() },
        { id: 3, name: 'AirPods Pro', price: 279, category: 'Audio', createdAt: new Date().toISOString() }
      ];
      setProducts(initialProducts);
      localStorage.setItem('chuzone-products', JSON.stringify(initialProducts));
    }
  }, []);

  // Sauvegarder les produits dans localStorage à chaque modification
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('chuzone-products', JSON.stringify(products));
    }
  }, [products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      createdAt: new Date().toISOString()
    };

    setProducts([product, ...products]);
    setNewProduct({ name: '', price: '', category: '' });
  };

  const deleteProduct = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const clearAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les produits ?')) {
      setProducts([]);
      localStorage.removeItem('chuzone-products');
    }
  };

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 ChuZone - Digital Product Platform</h1>
        <p className="subtitle">DevOps POC - CI/CD Pipeline Demo</p>
        <div className="version-badge">Version 1.0.0</div>
      </header>

      <main className="container">
        <section className="add-product-section">
          <h2>➕ Ajouter un Nouveau Produit</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <input
              type="text"
              placeholder="Nom du produit"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Prix (€)"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Catégorie"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary">Ajouter</button>
          </form>
        </section>

        <section className="products-section">
          <div className="section-header">
            <h2>📦 Catalogue de Produits ({filteredProducts.length})</h2>
            <div className="actions">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Toutes catégories' : cat}
                  </option>
                ))}
              </select>
              {products.length > 0 && (
                <button onClick={clearAll} className="btn-danger">
                  🗑️ Tout supprimer
                </button>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>📭 Aucun produit trouvé</p>
              <p className="hint">Ajoutez votre premier produit ci-dessus !</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className="category-badge">{product.category}</span>
                  </div>
                  <p className="price">{product.price.toFixed(2)} €</p>
                  <p className="date">
                    Ajouté le {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="btn-delete"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Produits Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{categories.length - 1}</div>
            <div className="stat-label">Catégories</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {products.reduce((sum, p) => sum + p.price, 0).toFixed(2)} €
            </div>
            <div className="stat-label">Valeur Totale</div>
          </div>
        </section>
      </main>

      <footer className="App-footer">
        <p>🎯 Built with ❤️ for DevOps Excellence</p>
        <p>Deployed via GitHub Actions → Docker Hub → Kubernetes → ArgoCD</p>
        <p className="tech-stack">React • Docker • Kubernetes • Terraform • ArgoCD</p>
      </footer>
    </div>
  );
}

export default App;
