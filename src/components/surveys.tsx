'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


// QR Code generation using SVG (simplified version)
const QRCodeSVG = ({ text }) => {
	const size = 200;
	const darkSquares = text.split('').map((char, i) => ({
		x: (i % 8) * 25,
		y: Math.floor(i / 8) * 25
	}));

	return (
		<svg viewBox={`0 0 ${size} ${size}`} className="w-32 h-32">
			<rect width={size} height={size} fill="white" />
			{darkSquares.map((square, i) => (
				<rect
					key={i}
					x={square.x}
					y={square.y}
					width="20"
					height="20"
					fill="black"
				/>
			))}
		</svg>
	);
};

const LoadingSpinner = () => (
	<div className="flex justify-center items-center h-32">
		<Loader2 className="w-8 h-8 animate-spin" />
	</div>
);


const Surveys = () => {
	const router = useRouter();
	const [surveys, setSurveys] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadSurveys = async () => {
			try {
				const saved = localStorage.getItem('surveys');
				setSurveys(saved ? JSON.parse(saved) : []);
			} finally {
				setLoading(false);
			}
		};
		loadSurveys();
	}, []);

	if (loading) return <LoadingSpinner />;

	return (
		<div className="space-y-4">
			{surveys.map(survey => (
				<Card key={survey.id} className="p-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">{survey.title}</h3>
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={() => router.push(`/surveys/${survey.id}`)}
							>
								Take Survey
							</Button>
							<Button
								variant="outline"
								onClick={() => router.push(`/results/${survey.id}`)}
							>
								View Results
							</Button>
						</div>
					</div>
					<Separator className="my-4" />
					<div className="flex justify-center">
						<QRCodeSVG text={`${window.location.origin}/survey/${survey.id}`} />
					</div>
				</Card>
			))}
		</div>
	);
};

export default Surveys;