import TakeSurvey from '@/components/take-survey'
import React, { Usable } from 'react'

function TakeSurveyPage({ params }: { params: Usable<unknown> }) {
	const { id } = React.use(params);

	return (
		<TakeSurvey id={id} />
	)
}

export default TakeSurveyPage