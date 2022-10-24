// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import debounce from 'lodash/debounce';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SearchProps, SearchResultData } from 'semantic-ui-react';

import DiscussionCard from '../components/DiscussionCard';
import { useSearchPostsLazyQuery } from '../generated/graphql';
import getDefaultAddressField from '../util/getDefaultAddressField';

interface Props {
  className?: string
	size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive'
	placeholder?: string
}

const defaultAddressField = getDefaultAddressField();

const resultRenderer = (post: any) => (
	<DiscussionCard
		defaultAddress={post.author[defaultAddressField]}
		comments={post.comments_aggregate.aggregate?.count
			? post.comments_aggregate.aggregate.count.toString()
			: 'no'}
		created_at={post.created_at}
		last_update={post.last_update?.last_update}
		title={post.title || 'No title'}
		username={post.author.username}
	/>
);

const SearchBar = ({ className, placeholder, size }: Props) => {
	const navigate = useNavigate();

	const [results, setResults] = useState<any[]>([]);
	const [value, setValue] = useState<string>('');
	const [searchPostsQuery, { data, loading }] = useSearchPostsLazyQuery();

	const handleResultSelect = (e: React.MouseEvent<HTMLElement, MouseEvent>, { result }: SearchResultData) => {
		navigate(`/post/${result.id}`);
	};

	const handleSearchChange = (e: React.MouseEvent<HTMLElement, MouseEvent>, { value }: SearchProps) => {
		setValue(value || '');

		if (!value) {
			return;
		}

		searchPostsQuery({
			variables: {
				term: `%${value}%`
			}
		});

		if (data && data.posts && data.posts.length > 0) {
			setResults(data.posts);
		}
	};

	return (
		<Search
			className={className}
			size={size}
			fluid
			loading={loading}
			onResultSelect={handleResultSelect}
			onSearchChange={debounce(handleSearchChange, 500, { leading: true })}
			results={results}
			value={value}
			resultRenderer={resultRenderer}
			placeholder={placeholder ? placeholder : 'Search By Keyword'}
			input={{ icon: 'search', iconPosition: 'left' }}
		/>
	);
};

export default SearchBar;
