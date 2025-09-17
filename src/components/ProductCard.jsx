import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getSizes } from '../fake-api';

const colorMap = {
	черный: '#000000',
	белый: '#ffffff',
	серый: '#808080',
	желтый: '#ffff00',
	синий: '#0000ff',
};

const ProductCard = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [sizes, setSizes] = useState([]);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [prod, szs] = await Promise.all([
					getProduct(parseInt(id)),
					getSizes(),
				]);
				setProduct(prod);
				setSizes(szs);
				if (prod && prod.colors.length > 0) {
					const initialColor = prod.colors[0];
					setSelectedColor(initialColor);
					setCurrentImageIndex(0);
					const availSizes = szs.filter(s => initialColor.sizes.includes(s.id));
					setSelectedSize(availSizes[0]?.id || null);
				}
			} catch (error) {
				console.error('Error fetching product:', error);
			}
		};
		fetchData();
	}, [id]);

	useEffect(() => {
		setCurrentImageIndex(0);
	}, [selectedColor]);

	if (!product || !selectedColor)
		return <div className='text-center'>Loading...</div>;

	const handleColorChange = color => {
		if (selectedColor.id === color.id) return;
		setSelectedColor(color);
		const availSizes = sizes.filter(s => color.sizes.includes(s.id));
		setSelectedSize(availSizes[0]?.id || null);
	};

	const handlePrevImage = () => {
		if (selectedColor.images.length <= 1) return;
		setCurrentImageIndex(prev =>
			prev > 0 ? prev - 1 : selectedColor.images.length - 1
		);
	};

	const handleNextImage = () => {
		if (selectedColor.images.length <= 1) return;
		setCurrentImageIndex(prev =>
			prev < selectedColor.images.length - 1 ? prev + 1 : 0
		);
	};

	return (
		<div className='flex flex-col md:flex-row gap-8'>
			{/* Image Viewer */}
			<div className='flex-1'>
				<div className='relative'>
					<img
						src={selectedColor.images[currentImageIndex]}
						alt={`${product.name} - ${selectedColor.name} - Изображение ${
							currentImageIndex + 1
						}`}
						className='w-full h-96 object-cover rounded-lg'
					/>
					{selectedColor.images.length > 1 && (
						<>
							<button
								onClick={handlePrevImage}
								className='absolute left-2 top-1/2 transform -translate-y-1/2
								 bg-white bg-opacity-50 px-2 py-1 rounded hover:bg-opacity-75'
								aria-label='Предыдущее изображение'
							>
								&lt;
							</button>
							<button
								onClick={handleNextImage}
								className='absolute right-2 top-1/2 transform -translate-y-1/2
								 bg-white bg-opacity-50 px-2 py-1 rounded hover:bg-opacity-75'
								aria-label='Следующее изображение'
							>
								&gt;
							</button>
						</>
					)}
				</div>
				{selectedColor.images.length > 1 && (
					<div className='flex gap-2 mt-4 overflow-x-auto'>
						{selectedColor.images.map((img, index) => (
							<img
								key={index}
								src={img}
								alt={`Миниатюра ${index + 1}`}
								className={`w-16 h-16 object-cover cursor-pointer rounded flex-shrink-0 ${
									index === currentImageIndex ? 'border-2 border-blue-500' : ''
								}`}
								onClick={() => setCurrentImageIndex(index)}
							/>
						))}
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className='flex-1'>
				<h1 className='text-3xl font-bold mb-2'>{product.name}</h1>
				<p className='text-xl text-gray-800 mb-4'>{selectedColor.price} ₽</p>
				<p className='text-gray-600 mb-6'>{selectedColor.description}</p>

				{/* Color Selection */}
				<div className='mb-6'>
					<h3 className='text-lg font-semibold mb-2'>Цвет:</h3>
					<div className='flex gap-2'>
						{product.colors.map(color => (
							<button
								key={color.id}
								onClick={() => handleColorChange(color)}
								className={`w-8 h-8 rounded-full border-2 ${
									selectedColor.id === color.id
										? 'border-black ring-2 ring-blue-500'
										: 'border-gray-300'
								} transition-all`}
								style={{ backgroundColor: colorMap[color.name] || '#808080' }}
								title={color.name}
								aria-label={`Выбрать цвет ${color.name}`}
							></button>
						))}
					</div>
				</div>

				{/* Size Selection */}
				<div className='mb-6'>
					<h3 className='text-lg font-semibold mb-2'>Размер:</h3>
					{selectedColor.sizes.length === 0 ? (
						<p className='text-gray-500'>Размеры недоступны для этого цвета</p>
					) : (
						<div className='flex flex-wrap gap-2'>
							{sizes.map(size => {
								const available = selectedColor.sizes.includes(size.id);
								return (
									<button
										key={size.id}
										onClick={() => available && setSelectedSize(size.id)}
										className={`px-4 py-2 border rounded-md transition-colors ${
											selectedSize === size.id
												? 'bg-blue-500 text-white'
												: available
												? 'bg-white border-gray-300 hover:bg-blue-50 text-gray-700'
												: 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-400'
										}`}
										disabled={!available}
										aria-label={`Размер ${size.label} ${
											available ? '(доступен)' : '(недоступен)'
										}`}
									>
										{size.label}
									</button>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
