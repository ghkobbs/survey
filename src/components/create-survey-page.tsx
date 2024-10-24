import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QUESTION_TYPES } from '@/lib/utils';

const CreateSurveyPage = () => {

	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [survey, setSurvey] = useState({
		title: '',
		questions: [
			{
				id: '1',
				text: '',
				type: QUESTION_TYPES.RATING,
				required: true,
				options: []
			}
		]
	});

	const addQuestion = () => {
		setSurvey({
			...survey,
			questions: [
				...survey.questions,
				{
					id: Date.now().toString(),
					text: '',
					type: QUESTION_TYPES.RATING,
					required: true,
					options: []
				}
			]
		});
	};

	const updateQuestion = (id, updates) => {
		setSurvey({
			...survey,
			questions: survey.questions.map(q =>
				q.id === id ? { ...q, ...updates } : q
			)
		});
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			// Validate survey
			if (!survey.title.trim()) {
				throw new Error('Survey title is required');
			}
			if (!survey.questions.every(q => q.text.trim())) {
				throw new Error('All questions must have text');
			}

			const newSurvey = {
				...survey,
				id: Date.now().toString(),
				created: new Date().toISOString(),
				responses: []
			};

			// Get existing surveys
			const existingSurveys = JSON.parse(localStorage.getItem('surveys') || '[]');
			localStorage.setItem('surveys', JSON.stringify([...existingSurveys, newSurvey]));

			router.push('/surveys');
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create New Survey</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div>
						<Label htmlFor="title">Survey Title</Label>
						<Input
							id="title"
							value={survey.title}
							onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
							placeholder="Enter survey title"
						/>
					</div>

					{survey.questions.map((question, index) => (
						<div key={question.id} className="space-y-4 p-4 border rounded-lg">
							<div className="flex justify-between items-center">
								<h3 className="font-medium">Question {index + 1}</h3>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSurvey({
										...survey,
										questions: survey.questions.filter(q => q.id !== question.id)
									})}
								>
									Remove
								</Button>
							</div>

							<div>
								<Label>Question Text</Label>
								<Input
									value={question.text}
									onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
									placeholder="Enter question text"
								/>
							</div>

							<div>
								<Label>Question Type</Label>
								<Select
									value={question.type}
									onValueChange={(value) => updateQuestion(question.id, {
										type: value,
										options: value === QUESTION_TYPES.MULTIPLE_CHOICE ? ['Option 1'] : []
									})}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={QUESTION_TYPES.RATING}>Rating 5 (1-5)</SelectItem>
										<SelectItem value={QUESTION_TYPES.RATING_10}>Rating 10 (1-10)</SelectItem>
										<SelectItem value={QUESTION_TYPES.MULTIPLE_CHOICE}>Multiple Choice</SelectItem>
										<SelectItem value={QUESTION_TYPES.TEXT}>Text</SelectItem>
										<SelectItem value={QUESTION_TYPES.BOOLEAN}>Yes/No</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
								<div className="space-y-2">
									<Label>Options</Label>
									{question.options.map((option, optionIndex) => (
										<div key={optionIndex} className="flex gap-2">
											<Input
												value={option}
												onChange={(e) => updateQuestion(question.id, {
													options: question.options.map((opt, i) =>
														i === optionIndex ? e.target.value : opt
													)
												})}
											/>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => updateQuestion(question.id, {
													options: question.options.filter((_, i) => i !== optionIndex)
												})}
											>
												Remove
											</Button>
										</div>
									))}
									<Button
										variant="outline"
										size="sm"
										onClick={() => updateQuestion(question.id, {
											options: [...question.options, `Option ${question.options.length + 1}`]
										})}
									>
										Add Option
									</Button>
								</div>
							)}
						</div>
					))}

					<div className="flex gap-4">
						<Button onClick={addQuestion}>Add Question</Button>
						<Button onClick={handleSubmit} disabled={loading}>
							{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
							Create Survey
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CreateSurveyPage;