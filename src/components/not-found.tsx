import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';

const NotFound = () => (
	<div className="flex flex-col items-center justify-center h-96">
		<h1 className="text-4xl font-bold mb-4">404</h1>
		<p className="text-gray-600 mb-4">Page not found</p>
		<Link href="/">
			<Button>
				Return Home
			</Button>
		</Link>
	</div>
);

export default NotFound