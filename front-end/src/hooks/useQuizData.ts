// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useCallback, useEffect, useState } from 'react';

export default function(referendumId: number | null | undefined){

	const [quiz, setQuiz] = useState<any>({});

	const fetchQuizData = useCallback(() => {
		// setLoading(true);
		fetch('https://squid.subsquid.io/referenda-dashboard/v/1/graphql',
			{ body: JSON.stringify({
				query: `query QuizzesQuery {
                    quizzes(where: {referendumIndex_eq: ${referendumId}}) {
                      blockNumber
                      creator
                      id
                      referendumIndex
                      timestamp
                      version
                      questions {
                        id
                        quizId
                        text
                        indexCorrectAnswerHistory {
                          blockNumber
                          correctIndex
                          id
                          questionId
                          submitter
                          timestamp
                          version
                        }
                        answerOptions {
                          id
                          questionId
                          text
                        }
                      }
                      submissions {
                        answers {
                          id
						  isCorrect
                        }
                        blockNumber
                        id
                        quizId
                        referendumIndex
                        timestamp
                        version
                        wallet
                      }
                    }
                  }`
			}),
			headers: {
				'Accept': 'application/json, multipart/mixed',
				'content-type': 'application/json'
				// 'Sec-Fetch-Dest': 'empty',
				// 'Sec-Fetch-Mode': 'cors',
				// 'Sec-Fetch-Site': 'same-origin'
			},
			method: 'POST'
			})
			.then(async (res) => {
				const response = await res.json();
				if(response && response.data && response.data.quizzes) {
					setQuiz(response.data.quizzes[0]);
					console.log(response.data);
				}
			}).catch((err) => {
				console.log(err);
				console.log('Error in fetching voters :', err);
			});
	}, [referendumId]);

	useEffect(() => {
		fetchQuizData();
	}, [fetchQuizData, referendumId]);

	return quiz;
}