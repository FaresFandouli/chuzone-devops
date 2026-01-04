import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ChuZone Application Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders main heading', () => {
      render(<App />);
      const heading = screen.getByText(/ChuZone - Digital Product Platform/i);
      expect(heading).toBeInTheDocument();
    });

    test('renders subtitle', () => {
      render(<App />);
      const subtitle = screen.getByText(/DevOps POC - CI\/CD Pipeline Demo/i);
      expect(subtitle).toBeInTheDocument();
    });

    test('renders version badge', () => {
      render(<App />);
      const version = screen.getByText(/Version 1\.0\.0/i);
      expect(version).toBeInTheDocument();
    });

    test('renders add product section', () => {
      render(<App />);
      const addProductHeading = screen.getByText(/Ajouter un Nouveau Produit/i);
      expect(addProductHeading).toBeInTheDocument();
    });

    test('renders product catalog section', () => {
      render(<App />);
      const catalogHeading = screen.getByText(/Catalogue de Produits/i);
      expect(catalogHeading).toBeInTheDocument();
    });

    test('renders footer with tech stack', () => {
      render(<App />);
      const techStack = screen.getByText(/React • Docker • Kubernetes • Terraform • ArgoCD/i);
      expect(techStack).toBeInTheDocument();
    });
  });

  describe('Form Input Tests', () => {
    test('has all required form inputs', () => {
      render(<App />);
      
      const nameInput = screen.getByPlaceholderText(/Nom du produit/i);
      const priceInput = screen.getByPlaceholderText(/Prix/i);
      const categoryInput = screen.getByPlaceholderText(/Catégorie/i);
      
      expect(nameInput).toBeInTheDocument();
      expect(priceInput).toBeInTheDocument();
      expect(categoryInput).toBeInTheDocument();
    });

    test('form inputs accept text', () => {
      render(<App />);
      
      const nameInput = screen.getByPlaceholderText(/Nom du produit/i);
      const priceInput = screen.getByPlaceholderText(/Prix/i);
      const categoryInput = screen.getByPlaceholderText(/Catégorie/i);
      
      fireEvent.change(nameInput, { target: { value: 'Test Product' } });
      fireEvent.change(priceInput, { target: { value: '99.99' } });
      fireEvent.change(categoryInput, { target: { value: 'Electronics' } });
      
      expect(nameInput.value).toBe('Test Product');
      expect(priceInput.value).toBe('99.99');
      expect(categoryInput.value).toBe('Electronics');
    });

    test('has submit button', () => {
      render(<App />);
      const submitButton = screen.getByRole('button', { name: /Ajouter/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Product Creation Tests', () => {
    test('can add a new product', async () => {
      render(<App />);
      
      const nameInput = screen.getByPlaceholderText(/Nom du produit/i);
      const priceInput = screen.getByPlaceholderText(/Prix/i);
      const categoryInput = screen.getByPlaceholderText(/Catégorie/i);
      const submitButton = screen.getByRole('button', { name: /Ajouter/i });
      
      fireEvent.change(nameInput, { target: { value: 'New Product' } });
      fireEvent.change(priceInput, { target: { value: '149.99' } });
      fireEvent.change(categoryInput, { target: { value: 'Test Category' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('New Product')).toBeInTheDocument();
      });
    });

    test('form clears after successful submission', async () => {
      render(<App />);
      
      const nameInput = screen.getByPlaceholderText(/Nom du produit/i);
      const priceInput = screen.getByPlaceholderText(/Prix/i);
      const categoryInput = screen.getByPlaceholderText(/Catégorie/i);
      const submitButton = screen.getByRole('button', { name: /Ajouter/i });
      
      fireEvent.change(nameInput, { target: { value: 'Product' } });
      fireEvent.change(priceInput, { target: { value: '99' } });
      fireEvent.change(categoryInput, { target: { value: 'Cat' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(priceInput.value).toBe('');
        expect(categoryInput.value).toBe('');
      });
    });

    test('displays product price correctly', async () => {
      render(<App />);
      
      const nameInput = screen.getByPlaceholderText(/Nom du produit/i);
      const priceInput = screen.getByPlaceholderText(/Prix/i);
      const categoryInput = screen.getByPlaceholderText(/Catégorie/i);
      const submitButton = screen.getByRole('button', { name: /Ajouter/i });
      
      fireEvent.change(nameInput, { target: { value: 'Priced Product' } });
      fireEvent.change(priceInput, { target: { value: '299.99' } });
      fireEvent.change(categoryInput, { target: { value: 'Premium' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('299.99 €')).toBeInTheDocument();
      });
    });
  });

  describe('LocalStorage Tests', () => {
    test('loads initial demo products from localStorage', () => {
      render(<App />);
      
      // Initial products should be loaded
      expect(screen.getByText(/MacBook Pro M3/i)).toBeInTheDocument();
      expect(screen.getByText(/iPhone 15 Pro/i)).toBeInTheDocument();
      expect(screen.getByText(/AirPods Pro/i)).toBeInTheDocument();
    });

    test('saves products to localStorage', async () => {
      render(<App />);
      
      const nameInput = screen.getByPlaceholderText(/Nom du produit/i);
      const priceInput = screen.getByPlaceholderText(/Prix/i);
      const categoryInput = screen.getByPlaceholderText(/Catégorie/i);
      const submitButton = screen.getByRole('button', { name: /Ajouter/i });
      
      fireEvent.change(nameInput, { target: { value: 'Saved Product' } });
      fireEvent.change(priceInput, { target: { value: '199' } });
      fireEvent.change(categoryInput, { target: { value: 'Saved' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const savedData = JSON.parse(localStorage.getItem('chuzone-products'));
        expect(savedData).toBeTruthy();
        expect(savedData.some(p => p.name === 'Saved Product')).toBe(true);
      });
    });
  });

  describe('Filter Tests', () => {
    test('filter dropdown is present', () => {
      render(<App />);
      const filterSelect = screen.getByRole('combobox');
      expect(filterSelect).toBeInTheDocument();
    });

    test('shows all categories option', () => {
      render(<App />);
      const allCategoriesOption = screen.getByText(/Toutes catégories/i);
      expect(allCategoriesOption).toBeInTheDocument();
    });
  });

  describe('Statistics Tests', () => {
    test('displays product statistics', () => {
      render(<App />);
      
      // Should show stats section
      expect(screen.getByText(/Produits Total/i)).toBeInTheDocument();
      expect(screen.getByText(/Catégories/i)).toBeInTheDocument();
      expect(screen.getByText(/Valeur Totale/i)).toBeInTheDocument();
    });
  });

  describe('Delete Functionality Tests', () => {
    test('delete buttons are present for products', () => {
      render(<App />);
      
      const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });
      // Should have delete buttons for initial products
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design Tests', () => {
    test('renders correctly on mobile viewport', () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
      
      render(<App />);
      
      const heading = screen.getByText(/ChuZone/i);
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    test('form inputs have proper types', () => {
      render(<App />);
      
      const nameInput = screen.getByPlaceholderText(/Nom du produit/i);
      const priceInput = screen.getByPlaceholderText(/Prix/i);
      
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(priceInput).toHaveAttribute('type', 'number');
    });

    test('form inputs are required', () => {
      render(<App />);
      
      const nameInput = screen.getByPlaceholderText(/Nom du produit/i);
      const priceInput = screen.getByPlaceholderText(/Prix/i);
      const categoryInput = screen.getByPlaceholderText(/Catégorie/i);
      
      expect(nameInput).toBeRequired();
      expect(priceInput).toBeRequired();
      expect(categoryInput).toBeRequired();
    });
  });
});
