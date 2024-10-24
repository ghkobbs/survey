'use client'
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
	ResponsiveContainer,
	Cell
} from 'recharts';
import {
	ChartConfig, ChartContainer
} from '@/components/ui/chart';
import { QrCode, PlusCircle, BarChart3, Home, Loader2 } from 'lucide-react';
import CreateSurveyPage from '@/app/create/page';
import { useRouter } from 'next/navigation';
import Breadcrumb from './breadcrumbs';

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

const QUESTION_TYPES = {
	RATING: 'rating',
	MULTIPLE_CHOICE: 'multiple_choice',
	TEXT: 'text',
	BOOLEAN: 'boolean'
};

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const LoadingSpinner = () => (
	<div className="flex justify-center items-center h-32">
		<Loader2 className="w-8 h-8 animate-spin" />
	</div>
);

// const TakeSurveyPage = () => {
// 	const { id } = useParams();
// 	const navigate = useNavigate();
// 	const [loading, setLoading] = useState(true);
// 	const [survey, setSurvey] = useState(null);
// 	const [answers, setAnswers] = useState({});

// 	useEffect(() => {
// 		const loadSurvey = async () => {
// 			try {
// 				const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
// 				const survey = surveys.find(s => s.id === id);
// 				if (!survey) throw new Error('Survey not found');
// 				setSurvey(survey);
// 			} catch (error) {
// 				navigate('/404');
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		loadSurvey();
// 	}, [id, navigate]);

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		setLoading(true);
// 		try {
// 			// Validate required questions
// 			const unanswered = survey.questions
// 				.filter(q => q.required && !answers[q.id])
// 				.map(q => q.text);

// 			if (unanswered.length) {
// 				throw new Error(`Please answer the following required questions:\n${unanswered.join('\n')}`);
// 			}

// 			const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
// 			const updatedSurveys = surveys.map(s => {
// 				if (s.id === survey.id) {
// 					return {
// 						...s,
// 						responses: [...s.responses, {
// 							id: Date.now().toString(),
// 							timestamp: new Date().toISOString(),
// 							answers
// 						}]
// 					};
// 				}
// 				return s;
// 			});

// 			localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
// 			navigate('/surveys');
// 		} catch (error) {
// 			alert(error.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	if (loading) return <LoadingSpinner />;
// 	if (!survey) return null;

// 	return (
// 		<Card>
// 			<CardHeader>
// 				<CardTitle>{survey.title}</CardTitle>
// 			</CardHeader>
// 			<CardContent>
// 				<form onSubmit={handleSubmit} className="space-y-6">
// 					{survey.questions.map(question => (
// 						<div key={question.id + survey.id} className="space-y-2">
// 							<Label>
// 								{question.text}
// 								{question.required && <span className="text-red-500 ml-1">*</span>}
// 							</Label>

// 							{question.type === QUESTION_TYPES.RATING && (
// 								<div className="flex gap-2">
// 									{RATINGS.map(option => (
// 										<Button
// 											key={option}
// 											type="button"
// 											variant={answers[question.id] === option ? 'default' : 'outline'}
// 											onClick={() => setAnswers({ ...answers, [question.id]: option })}
// 										>
// 											{option}
// 										</Button>
// 									))}
// 								</div>
// 							)}

// 							{question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
// 								<div className="space-y-2">
// 									{question.options.map(option => (
// 										<Button
// 											key={option}
// 											type="button"
// 											className="w-full justify-start"
// 											variant={answers[question.id] === option ? 'default' : 'outline'}
// 											onClick={() => setAnswers({ ...answers, [question.id]: option })}
// 										>
// 											{option}
// 										</Button>
// 									))}
// 								</div>
// 							)}

// 							{question.type === QUESTION_TYPES.TEXT && (
// 								<Textarea
// 									value={answers[question.id] || ''}
// 									onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
// 									placeholder="Enter your answer"
// 								/>
// 							)}

// 							{question.type === QUESTION_TYPES.BOOLEAN && (
// 								<div className="flex gap-2">
// 									{['Yes', 'No'].map(option => (
// 										<Button
// 											key={option}
// 											type="button"
// 											variant={answers[question.id] === option ? 'default' : 'outline'}
// 											onClick={() => setAnswers({ ...answers, [question.id]: option })}
// 										>
// 											{option}
// 										</Button>
// 									))}
// 								</div>
// 							)}
// 						</div>
// 					))}
// 					<Button type="submit" disabled={loading}>
// 						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
// 						Submit Response
// 					</Button>
// 				</form>
// 			</CardContent>
// 		</Card>
// 	);
// };

// const ResultsPage = () => {
// 	const { id } = useParams();
// 	const navigate = useNavigate();
// 	const [loading, setLoading] = useState(true);
// 	const [survey, setSurvey] = useState(null);
// 	const [chartType, setChartType] = useState('bar');

// 	const chartConfig = {
// 		desktop: {
// 			label: "Desktop",
// 			color: "#2563eb",
// 		},
// 		mobile: {
// 			label: "Mobile",
// 			color: "#60a5fa",
// 		},
// 	} satisfies ChartConfig

// 	useEffect(() => {
// 		const loadSurvey = async () => {
// 			try {
// 				const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
// 				const survey = surveys.find(s => s.id === id);
// 				if (!survey) throw new Error('Survey not found');
// 				setSurvey(survey);
// 			} catch (error) {
// 				navigate('/404');
// 			} finally {
// 				setLoading(false);
// 			}
// 		};
// 		loadSurvey();
// 	}, [id, navigate]);

// 	if (loading) return <LoadingSpinner />;
// 	if (!survey) return null;

// 	const renderChart = (question) => {
// 		let data;

// 		if (question.type === QUESTION_TYPES.RATING) {
// 			data = RATINGS.map(rating => ({
// 				rating: `${rating}`,
// 				count: survey.responses.filter(r => r.answers[question.id] === rating).length
// 			}));
// 		} else if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE || question.type === QUESTION_TYPES.BOOLEAN) {
// 			const options = question.type === QUESTION_TYPES.BOOLEAN ? ['Yes', 'No'] : question.options;
// 			data = options.map(option => ({
// 				option,
// 				count: survey.responses.filter(r => r.answers[question.id] === option).length
// 			}));
// 		} else {
// 			return (
// 				<div className="space-y-2">
// 					<h4 className="font-medium">Text Responses:</h4>
// 					{survey.responses
// 						?.map(r => r.answers[question.id])
// 						.filter(Boolean)
// 						.map((answer, i) => (
// 							<p key={i} className="p-2 bg-gray-50 rounded">{answer}</p>
// 						))}
// 				</div>
// 			);
// 		}

// 		if (chartType === 'bar') {
// 			return (
// 				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
// 					<BarChart accessibilityLayer data={data}>
// 						<CartesianGrid strokeDasharray="3 3" />
// 						<XAxis dataKey={question.type === QUESTION_TYPES.RATING ? 'rating' : 'option'} />
// 						<YAxis />
// 						<Tooltip />
// 						<Bar dataKey="count" fill="#8884d8" />
// 					</BarChart>
// 				</ChartContainer>
// 			);
// 		} else if (chartType === 'line') {
// 			return (
// 				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
// 					<LineChart data={data}>
// 						<CartesianGrid strokeDasharray="3 3" />
// 						<XAxis dataKey={question.type === QUESTION_TYPES.RATING ? 'rating' : 'option'} />
// 						<YAxis />
// 						<Tooltip />
// 						<Line type="monotone" dataKey="count" stroke="#8884d8" />
// 					</LineChart>
// 				</ChartContainer>
// 			);
// 		} else {
// 			return (
// 				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
// 					<PieChart>
// 						<Pie
// 							data={data}
// 							dataKey="count"
// 							nameKey={question.type === QUESTION_TYPES.RATING ? 'rating' : 'option'}
// 							cx="50%"
// 							cy="50%"
// 							outerRadius={100}
// 							label
// 						>
// 							{data.map((entry, index) => (
// 								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// 							))}
// 						</Pie>
// 						<Tooltip />
// 					</PieChart>
// 				</ChartContainer>
// 			);
// 		}
// 	};

// 	return (
// 		<Card>
// 			<CardHeader>
// 				<CardTitle>Results: {survey.title}</CardTitle>
// 				<div className="flex gap-2 mt-4">
// 					<Button
// 						variant={chartType === 'bar' ? 'default' : 'outline'}
// 						onClick={() => setChartType('bar')}
// 					>
// 						Bar Chart
// 					</Button>
// 					<Button
// 						variant={chartType === 'line' ? 'default' : 'outline'}
// 						onClick={() => setChartType('line')}
// 					>
// 						Line Chart
// 					</Button>
// 					<Button
// 						variant={chartType === 'pie' ? 'default' : 'outline'}
// 						onClick={() => setChartType('pie')}
// 					>
// 						Pie Chart
// 					</Button>
// 				</div>
// 			</CardHeader>
// 			<CardContent>
// 				<div className="space-y-8">
// 					{survey.questions.map(question => (
// 						<div key={question.id + parseInt(Math.random() * 100)} className="space-y-4">
// 							<h3 className="font-medium">{question.text}</h3>
// 							{renderChart(question)}
// 						</div>
// 					))}
// 				</div>
// 			</CardContent>
// 		</Card>
// 	);
// };

const SurveyPlatform = () => {
	return (
		// <BrowserRouter>
		<div className="container mx-auto p-4 max-w-4xl">
			<Breadcrumb />
				{/* <Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/create" element={<CreateSurveyPage />} />
					<Route path="/surveys" element={<SurveysPage />} />
					<Route path="/survey/:id" element={<TakeSurveyPage />} />
					<Route path="/results/:id" element={<ResultsPage />} />
					<Route path="*" element={<NotFoundPage />} /> */}
		</div>
		// </BrowserRouter>
	);
};

export default SurveyPlatform;