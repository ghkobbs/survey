'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import * as htmlToImage from 'html-to-image';


// QR Code generation using SVG (simplified version)
const QRCodeSVG = (text, ref = "", size = 200) => {
	// const size = 200;
	return (
		<QRCode
			size={size}
			style={{ height: "auto", maxWidth: size, width: size }}
			value={text}
			viewBox='0 0 256 256'
			{...(ref ? { ref } : {})}
		/>
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

	const qrCodeRef = useRef(<svg></svg>);

	useEffect(() => {
		// const loadSurveys = async () => {
		// 	try {
		// 		const saved = localStorage.getItem('surveys');
		// 		setSurveys(saved ? JSON.parse(saved) : []);
		// 	} finally {
		// 		setLoading(false);
		// 	}
		// };
		const loadSurveys = async () => {
			fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/surveys')
				.then((res) => res.json())
				.then((data) => {
					setSurveys(data);
				})
				.catch(() => {
					setSurveys([])
				})
				.finally(() => {
					setLoading(false);
				})
		};
		loadSurveys();
	}, []);

	if (loading) return <LoadingSpinner />;

	const downloadQrCode = (survey) => {
		htmlToImage.toPng(qrCodeRef.current)
			.then((dataUrl) => {
				const link = document.createElement("a");
				link.href = dataUrl;
				link.download = 'survey_' + survey.id + 'qr_code.png';
				link.click();
			})
			.catch(() => { })
	}

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
							<Button
								variant="outline"
								onClick={() => downloadQrCode(survey)}
							>
								Download QR Code
							</Button>
						</div>
					</div>
					<Separator className="my-4" />
					<div className="flex justify-center">
						{
							QRCodeSVG(`${window.location.origin}/survey/${survey.id}`)
						}
					</div>
					<div style={{height: 0, overflow: 'hidden'}}>
						{/* <QRCodeSVG ref={qrCodeRef} text={`${window.location.origin}/survey/${survey.id}`} /> */}
							{
								QRCodeSVG(`${window.location.origin}/survey/${survey.id}`, qrCodeRef, 800)
							}
						</div>
				</Card>
			))}
		</div>
	);
};

export default Surveys;