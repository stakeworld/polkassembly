// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import gql from 'graphql-tag';
import { authorFields } from 'src/fragments/author';
import { commentFields } from 'src/fragments/comments';

export const ALL_GOV2_FELLOWSHIP_POSTS = gql`
    query GetLatestGov2FellowshipPosts($limit: Int! = 10) {
        posts(limit: $limit, order_by: {id: desc}, where: {onchain_link: {onchain_fellowship_referendum_id: {_is_null: false}}}) {
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
                proposer_address
                track
                origin
                onchain_fellowship_referendum {
                    deciding
                    decisionDeposit
                    enactmentAfter
                    enactmentAt
                    id
                    origin
                    preimageHash
                    trackNumber
                    submitted
                    submittedAt
                    referendumId
                    referendumStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        method
                        metaDescription
                        section
                    }
                }
                onchain_fellowship_referendum_id
            }
            post_reactions {
                reaction
            }
        }
    }  
  ${authorFields}
`;

export const GOV2_FELLOWSHIP_POSTS_BY_TRACK_AND_STATUS = gql`
    query GetGov2FellowshipPostsByTrackAndStatus($track: Int!, $status: String!, $limit: Int! = 10) {
        posts(limit: $limit, where: {onchain_link: {onchain_fellowship_referendum_id: {_is_null: false}, onchain_fellowship_referendum_status: {_eq: $status}, track: {_eq: $track}}}, order_by: {id: desc}) {
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
                proposer_address
                track
                origin
                onchain_fellowship_referendum {
                    deciding
                    decisionDeposit
                    enactmentAfter
                    enactmentAt
                    id
                    origin
                    preimageHash
                    trackNumber
                    submitted
                    submittedAt
                    referendumId
                    referendumStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        method
                        metaDescription
                        section
                    }
                }
                onchain_fellowship_referendum_id
            }
            post_reactions {
                reaction
            }
        }
    }
    ${authorFields}
`;

export const GOV2_FELLOWSHIP_POSTS_BY_TRACK = gql`
    query GetGov2FellowshipPostsByTrack($track: Int!, $limit: Int! = 10) {
        posts(limit: $limit, where: {onchain_link: {onchain_fellowship_referendum_id: {_is_null: false}, track: {_eq: $track}}}, order_by: {id: desc}) {
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
                proposer_address
                track
                origin
                onchain_fellowship_referendum {
                    deciding
                    decisionDeposit
                    enactmentAfter
                    enactmentAt
                    id
                    origin
                    preimageHash
                    trackNumber
                    submitted
                    submittedAt
                    referendumId
                    referendumStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        method
                        metaDescription
                        section
                    }
                }
                onchain_fellowship_referendum_id
            }
            post_reactions {
                reaction
            }
        }
    }
    ${authorFields}
`;

export const FELLOWSHIP_REFERENDUM_POST_AND_COMMENTS = gql`
    query FellowshipReferendumPostAndComments ($id:Int!) {
        posts(where: {onchain_link: {onchain_fellowship_referendum_id: {_eq: $id}}}) {
            author {
                ...authorFields
            }
            content
            created_at
            id
            updated_at
            comments(order_by: {created_at: asc}) {
                ...commentFields
            }
            onchain_link{
                proposer_address
                track
                origin
                onchain_fellowship_referendum {
                    deciding
                    decisionDeposit
                    enactmentAfter
                    enactmentAt
                    id
                    origin
                    preimageHash
                    referendumId
                    trackNumber
                    tally
                    submitted
                    submittedAt
                    referendumStatus(orderBy: id_DESC){
                        id
                        status
                        blockNumber {
                            number
                        }
                    }
                    preimage {
                        method
                        metaDescription
                        section
                        enactmentPeriod
                        depositAmount
                        hash
                        length
                        preimageArguments {
                          name
                          value
                        }
                    }
                }
                onchain_fellowship_referendum_id
            }
            title
            topic {
                id
                name
            }
            type {
                id
                name
            }
        }
    }
    ${authorFields}
    ${commentFields}
`;

