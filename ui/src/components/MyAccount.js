
import React from "react";
import { useFetch } from './../providers/fetchProvider';
import { authProvider } from './../providers/authProvider';
import { AzureAD, AuthenticationState } from 'react-aad-msal';
import { ReviewCard } from './ReviewCard';

export const MyAccount = () => {
    const { loading, data } = useFetch(`${process.env.REACT_APP_API_ENDPOINT}/Reviews`);

    const inner = (account) => {
        if (loading) {
            return (<div>Loading...</div>);
        } else {
            return (
                <div className="container mt-5">
                    <h1>{account.name}</h1>
                    <div className="container mt-5">
                        <h2>Reviews</h2>
                        {(data ?? []).map((review) => <ReviewCard review={review} />)}
                    </div>
                </div>
            );
        }
    };

    return (
        <AzureAD provider={authProvider} forceLogin={false}>
            {
                ({ authenticationState, accountInfo }) => {
                    switch (authenticationState) {
                        case AuthenticationState.Authenticated:
                            return (inner(accountInfo.account));
                        case AuthenticationState.Unauthenticated:
                            return (<div className="container mt-5">You need to login</div>);
                        default:
                            return (<div />);
                    }
                }
            }
        </AzureAD>
    );
}
