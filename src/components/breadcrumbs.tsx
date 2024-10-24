'use client'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { Button } from './ui/button';

const Breadcrumb = () => {

	const router = useRouter();
	const paths = usePathname().split('/')?.filter(Boolean);

	const title = paths[paths?.length - 1]?.replace('-', ' ') ?? 'Dashboard';

	useEffect(() => {
		if (window) window.document.title = title.charAt(0).toUpperCase() + title.slice(1);
	}, [title])

	return (
		<div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => router.push('/')}
				className="p-0"
			>
				Home
			</Button>
			{paths.map((path) => (
				<React.Fragment key={path}>
					<span>/</span>
					<span className="capitalize">{path.replace('-', ' ')}</span>
				</React.Fragment>
			))}
		</div>
	);
};


export default Breadcrumb