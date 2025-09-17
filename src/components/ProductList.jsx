import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../fake-api';

const ProductList = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const fetchProducts = async () => {
			const data = await getProducts();
			setProducts(data);
		};
		fetchProducts();
	}, []);

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
			{products.map(product => (
				<Link
					key={product.id}
					to={`/product/${product.id}`}
					className='border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow'
				>
					<img
						src={product.colors[0]?.images[0]}
						alt={product.name}
						className='w-full h-48 object-cover'
					/>
					<div className='p-4'>
						<h2 className='text-lg font-semibold'>{product.name}</h2>
						<p className='text-gray-600'>{product.colors[0]?.price} ₽</p>
					</div>
				</Link>
			))}
		</div>
	);
};

export default ProductList;
