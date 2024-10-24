import SurveyResults from '@/components/survey-results';
import React, { Usable } from 'react'

function SurveyResultsPage({ params }: { params: Usable<unknown> }) {
	const { id } = React.use(params);

	return (
		<SurveyResults id={id} />
	)
}

export default SurveyResultsPage