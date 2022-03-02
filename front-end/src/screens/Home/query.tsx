// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';
import { authorFields } from 'src/fragments/author';

export const QUERY_ALL_POSTS = gql`
    query LatestPosts($limit: Int! = 10) {
        posts(limit: $limit, order_by: {
            onchain_link: {
                created_at: desc
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
                onchain_proposal_id
                onchain_proposal(where: {NOT: {proposalStatus_some: {OR: [{status: "Tabled"}, {status: "Cleared"}]}}}) {
                    id
                    proposalStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        id
                        method
                    }
                }
                onchain_bounty_id
                onchain_bounty(where: {NOT: {bountyStatus_some: {OR: [{status: "BountyCanceled"}, {status: "BountyRejected"}, {status: "BountyAwarded"}, {status: "BountyClaimed"}]}}}) {
                    id
                    bountyStatus(last: 1) {
                        id
                        status
                    }
                }
                onchain_motion_id
                onchain_motion(where: {NOT: {motionStatus_some: {OR: [{status: "Executed"}, {status: "Disapproved"}]}}}) {
                    id
                    motionStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        id
                        method
                    }
                }
                onchain_referendum_id
                onchain_referendum(where: {NOT: {referendumStatus_some: {OR: [{status: "Passed"}, {status: "Executed"}, {status: "NotPassed"}, {status: "Cancelled"}, {status: "Vetoed"}]}}}) {
                    id
                    end
                    referendumStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        id
                        method
                    }
                }
                onchain_tech_committee_proposal_id
                onchain_tech_committee_proposal(where: {NOT: {status_some: {OR: [{status: "Closed"}, {status: "Approved"}, {status: "Executed"}, {status: "Disapproved"}]}}}) {
                    id
                    status(last: 1) {
                        id
                        status
                    }
                    preimage {
                        id
                        method
                    }
                }
                onchain_tip_id
                onchain_tip(where: {NOT: {tipStatus_some: {OR: [{status: "TipClosed"}, {status: "TipClosing"}, {status: "TipRetracted"}]}}}) {
                    id
                    reason
                    tipStatus(last: 1) {
                        id
                        status
                    }
                }
                onchain_treasury_proposal_id
                onchain_treasury_spend_proposal(where: {}) {
                    id
                    treasuryStatus(last: 1) {
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

export const QUERY_COUNT_POSTS = gql`
    query PostsCount() {
        posts_aggregate{
            aggregate {
                count
            }
        }
    }
`;

export const QUERY_NETWORK_SOCIALS = gql`
    query NetworkSocials($network: String!) {
        blockchain_socials(where: {network: {_ilike: $network}}) {
            block_explorer
            discord
            github
            homepage
            id
            network
            reddit
            telegram
            twitter
            youtube
        }
    }   
`;