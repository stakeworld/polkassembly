// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';
import { authorFields } from 'src/fragments/author';

// for bounties postType should be 2, postTopic should be 4
export const QUERY_LATEST_CHILD_BOUNTIES = gql`
    query GetLatestChildBountyPosts($postType: Int!, $limit: Int! = 5, $offset: Int!) {
        posts(limit: $limit, offset: $offset, where: {
            type: {
                id: {
                    _eq: $postType
                }
            },
            onchain_link: {
                onchain_child_bounty_id: {
                    _is_null: false
                }
            }
        }, order_by: {
            onchain_link: {
                onchain_child_bounty_id: desc
            }
        }) {
            id
            title
            author {
                ...authorFields
            }
            created_at
            updated_at
            comments_aggregate {
                aggregate {
                    count
                }
            }
            type {
                name
                id
            }
            topic {
                id
                name
            }
            onchain_link {
                id
                onchain_child_bounty_id
                onchain_child_bounty {
                    id
                    childBountyStatus(last: 1) {
                        id
                        status
                    }
                }
                proposer_address
            }
        }
    }
    ${authorFields}
`;

export const QUERY_COUNT_CHILD_BOUNTIES = gql`
    query ChildBountiesCount($postType: Int!) {
        posts_aggregate(where: {type: {id: {_eq: $postType}}, onchain_link: {onchain_child_bounty_id: {_is_null: false}}}) {
            aggregate {
                count
            }
        }
    }
`;