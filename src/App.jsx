import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';
import BillSplitter from './pages/BillSplitter';
import RecipeCreator from './pages/RecipeCreator';
import MealOrganizer from './pages/MealOrganizer';

function App() {
  return (
    <BrowserRouter basename="/jeito-casa">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="lista-compras" element={<ShoppingList />} />
          <Route path="dividir-contas" element={<BillSplitter />} />
          <Route path="receitas" element={<RecipeCreator />} />
          <Route path="refeicoes" element={<MealOrganizer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
