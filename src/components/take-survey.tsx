'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { QUESTION_TYPES, RATINGS, RATINGS_10 } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const LoadingSpinner = () => (
	<div className="flex justify-center items-center h-32">
		<Loader2 className="w-8 h-8 animate-spin" />
	</div>
);

const TakeSurvey = ({ id }: { id: string }) => {
	// const { id } = useParams();
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [survey, setSurvey] = useState(null);
	const [answers, setAnswers] = useState({});

	useEffect(() => {
		const loadSurvey = async () => {
			// try {
			const surveys = JSON.parse(localStorage.getItem('completedSurveys') || '[]');
			if (surveys.includes(id)) {
				router.push('/alreadySubmitted');
			}
			// 	// const survey = surveys.find(s => s.id === id);
			// 	// if (!survey) throw new Error('Survey not found');
			// 	// setSurvey(survey);

			// } catch (error) {
			// 	router.push('/404');
			// } finally {
			// 	setLoading(false);
			// }
			fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/surveys/' + id)
				.then((res) => res.json())
				.then((data) => {
					setSurvey(data);
				})
				.catch(() => {
					router.push('/404');
				})
				.finally(() => {
					setLoading(false);
				})
		};
		loadSurvey();
	}, [id, router]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		// try {
		// 	// Validate required questions
		// 	const unanswered = survey.questions
		// 		.filter(q => q.required && !answers[q.id])
		// 		.map(q => q.text);

		// 	if (unanswered.length) {
		// 		throw new Error(`Please answer the following required questions:\n${unanswered.join('\n')}`);
		// 	}

		// 	const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
		// 	const updatedSurveys = surveys.map(s => {
		// 		if (s.id === survey.id) {
		// 			return {
		// 				...s,
		// 				responses: [...s.responses, {
		// 					id: Date.now().toString(),
		// 					timestamp: new Date().toISOString(),
		// 					answers
		// 				}]
		// 			};
		// 		}
		// 		return s;
		// 	});

		// 	localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
		// 	router.push('/surveys');
		// } catch (error) {
		// 	alert(error.message);
		// } finally {
		// 	setLoading(false);
		// }
		fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/surveys/' + id + '/responses/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ answers }),
		})
			.then((res) => {

				if (res.ok) {
					const surveys = JSON.parse(localStorage.getItem('completedSurveys') || '[]');
					const updatedSurveys = [...surveys, id];

					localStorage.setItem('completedSurveys', JSON.stringify(updatedSurveys));

					return router.push('/submitted');
				}

				throw new Error('Error occurred')
			})
			.catch(err => {
				alert(err.message)
			})
			.finally(() => {
				setLoading(false);
			})
	};

	if (loading) return <LoadingSpinner />;
	if (!survey) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{survey.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{survey.questions.map(question => (
						<div key={question.id + survey.id} className="space-y-2">
							<Label className='text-2xl'>
								{question.text}
								{question.required && <span className="text-red-500 ml-1">*</span>}
							</Label>

							{question.type === QUESTION_TYPES.RATING && (
								<div className="flex gap-2">
									{RATINGS.map(option => (
										<Button
											key={option}
											type="button"
											variant={answers[question.id] === option ? 'default' : 'outline'}
											onClick={() => setAnswers({ ...answers, [question.id]: option })}
										>
											{option}
										</Button>
									))}
								</div>
							)}

							{question.type === QUESTION_TYPES.RATING_10 && (
								<div className="flex gap-2">
									{RATINGS_10.map(option => (
										<Button
											key={option}
											type="button"
											variant={answers[question.id] === option ? 'default' : 'outline'}
											onClick={() => setAnswers({ ...answers, [question.id]: option })}
										>
											{option}
										</Button>
									))}
								</div>
							)}

							{question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
								<div className="space-y-2">
									{question.options.map(option => (
										<Button
											key={option}
											type="button"
											className="w-full justify-start"
											variant={answers[question.id] === option ? 'default' : 'outline'}
											onClick={() => setAnswers({ ...answers, [question.id]: option })}
										>
											{option}
										</Button>
									))}
								</div>
							)}

							{question.type === QUESTION_TYPES.TEXT && (
								<Textarea
									value={answers[question.id] || ''}
									onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
									placeholder="Enter your answer"
								/>
							)}

							{question.type === QUESTION_TYPES.BOOLEAN && (
								<div className="flex gap-2">
									{['Yes', 'No'].map(option => (
										<Button
											key={option}
											type="button"
											variant={answers[question.id] === option ? 'default' : 'outline'}
											onClick={() => setAnswers({ ...answers, [question.id]: option })}
										>
											{option}
										</Button>
									))}
								</div>
							)}
						</div>
					))}
					<Button type="submit" disabled={loading}>
						{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						Submit Response
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};


export default TakeSurvey;