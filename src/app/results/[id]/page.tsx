import SurveyResults from '@/components/survey-results';
import React from 'react'
import { PageProps } from '../../../../.next/types/app/page';

async function SurveyResultsPage(props: PageProps) {
	const { id } = await props.params;

	return (
		<SurveyResults id={id} />
	)
}

export default SurveyResultsPage