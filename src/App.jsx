import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import ProductList from './components/ProductList';

function App() {
	return (
		<Router>
			<div className='container mx-auto p-4'>
				<Routes>
					<Route path='/' element={<ProductList />} />
					<Route path='/product/:id' element={<ProductCard />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
