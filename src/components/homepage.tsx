'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { QrCode, PlusCircle, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import Breadcrumb from './breadcrumbs';

const HomePage = () => {
	const router = useRouter();

	return (
		<>
			<div className="grid gap-4 md:grid-cols-3">
				<Card className="p-6 hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PlusCircle className="w-5 h-5" />
							Create Survey
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push('/create')} className="w-full">
							Get Started
						</Button>
					</CardContent>
				</Card>

				<Card className="p-6 hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<QrCode className="w-5 h-5" />
							View Surveys
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push('/surveys')} className="w-full">
							Browse
						</Button>
					</CardContent>
				</Card>

				<Card className="p-6 hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="w-5 h-5" />
							Analytics
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push('/analytics')} className="w-full">
							View Results
						</Button>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default HomePage;