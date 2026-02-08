import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';
import ShoppingListForm from './pages/ShoppingListForm';
import ShoppingListUsage from './pages/ShoppingListUsage';
import BillSplitter from './pages/BillSplitter';
import RecipeList from './pages/RecipeList';
import RecipeForm from './pages/RecipeForm';
import MealOrganizer from './pages/MealOrganizer';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/jeito-casa">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Layout with Sidebar */}
          <Route path="/" element={<Layout />}>
            {/* Public Home */}
            <Route index element={<Home />} />
            
            {/* Public Tools - accessible without login */}
            <Route path="lista-compras" element={<ShoppingList />} />
            <Route path="lista-compras/edit/:listId" element={<ShoppingListForm />} />
            <Route path="lista-compras/view/:listId" element={<ShoppingListUsage />} />
            <Route path="dividir-contas" element={<BillSplitter />} />
            <Route path="recipes" element={<RecipeList />} />
            <Route path="recipe-form" element={<RecipeForm />} />
            <Route path="recipe-form/:recipeId" element={<RecipeForm />} />
            <Route path="refeicoes" element={<MealOrganizer />} />
            
            {/* Protected Routes - require login */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


