'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Cell
} from 'recharts';
import {
	ChartConfig, ChartContainer
} from '@/components/ui/chart';
import { Loader2 } from 'lucide-react';
import { QUESTION_TYPES, RATINGS, RATINGS_10 } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const LoadingSpinner = () => (
	<div className="flex justify-center items-center h-32">
		<Loader2 className="w-8 h-8 animate-spin" />
	</div>
);

const SurveyResults = ({ id }: { id: string }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [survey, setSurvey] = useState(null);
	const [chartType, setChartType] = useState('bar');

	const chartConfig = {
		desktop: {
			label: "Desktop",
			color: "#2563eb",
		},
		mobile: {
			label: "Mobile",
			color: "#60a5fa",
		},
	} satisfies ChartConfig

	useEffect(() => {
		const loadSurvey = async () => {
			try {
				const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
				const survey = surveys.find(s => s.id === id);
				if (!survey) throw new Error('Survey not found');
				setSurvey(survey);
			} catch (error) {
				router.push('/404');
			} finally {
				setLoading(false);
			}
		};
		loadSurvey();
	}, [id, router]);

	if (loading) return <LoadingSpinner />;
	if (!survey) return null;

	const renderChart = (question) => {
		let data;

		if (question.type === QUESTION_TYPES.RATING) {
			data = RATINGS.map(rating => ({
				rating: `${rating}`,
				count: survey.responses.filter(r => r.answers[question.id] === rating).length
			}));
		} else if (question.type === QUESTION_TYPES.RATING_10) {
			data = RATINGS_10.map(rating => ({
				rating_10: `${rating}`,
				count: survey.responses.filter(r => r.answers[question.id] === rating).length
			}));
		} else if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE || question.type === QUESTION_TYPES.BOOLEAN) {
			const options = question.type === QUESTION_TYPES.BOOLEAN ? ['Yes', 'No'] : question.options;
			data = options.map(option => ({
				option,
				count: survey.responses.filter(r => r.answers[question.id] === option).length
			}));
		} else {
			return (
				<div className="space-y-2">
					<h4 className="font-medium">Text Responses:</h4>
					{survey.responses
						?.map(r => r.answers[question.id])
						.filter(Boolean)
						.map((answer, i) => (
							<p key={i} className="p-2 bg-gray-50 rounded">{answer}</p>
						))}
				</div>
			);
		}

		if (chartType === 'bar') {
			return (
				<ChartContainer config={chartConfig} className="min-h-[400px] w-[full">
					<BarChart accessibilityLayer data={data} width={500} height={350}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey={question.type === QUESTION_TYPES.RATING ? 'rating' : question.type === QUESTION_TYPES.RATING_10 ? 'rating_10' : 'option'} />
						<YAxis />
						<Tooltip />
						<Bar dataKey="count" fill="#8884d8" />
					</BarChart>
				</ChartContainer>
			);
		} else if (chartType === 'line') {
			return (
				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
					<LineChart data={data} width={500} height={350}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey={question.type === QUESTION_TYPES.RATING ? 'rating' : question.type === QUESTION_TYPES.RATING_10 ? 'rating_10' : 'option'} />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="count" stroke="#8884d8" />
					</LineChart>
				</ChartContainer>
			);
		} else {
			return (
				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
					<PieChart width={500} height={350}>
						<Pie
							data={data}
							dataKey="count"
							nameKey={question.type === QUESTION_TYPES.RATING ? 'rating' : question.type === QUESTION_TYPES.RATING_10 ? 'rating_10' : 'option'}
							cx="50%"
							cy="50%"
							outerRadius={100}
							label
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ChartContainer>
			);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Results: {survey.title}</CardTitle>
				<div className="flex gap-2 mt-4">
					<Button
						variant={chartType === 'bar' ? 'default' : 'outline'}
						onClick={() => setChartType('bar')}
					>
						Bar Chart
					</Button>
					<Button
						variant={chartType === 'line' ? 'default' : 'outline'}
						onClick={() => setChartType('line')}
					>
						Line Chart
					</Button>
					<Button
						variant={chartType === 'pie' ? 'default' : 'outline'}
						onClick={() => setChartType('pie')}
					>
						Pie Chart
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 md:grid-cols-2">
					{survey.questions.map(question => (
						<div key={question.id + parseInt(Math.random() * 100)} className="space-y-8">
							<div className="space-y-4">
								<h3 className="font-medium">{question.text}</h3>
								{renderChart(question)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default SurveyResults;