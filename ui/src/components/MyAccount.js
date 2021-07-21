
import React from "react";

import { useMsal } from "@azure/msal-react";

import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

import { useFetch } from './../providers/fetchProvider';
import { ReviewCard } from './ReviewCard';

const ErrorComponent = ({ error }) => {
    return <p>An Error Occurred: {error}</p>;
}
const LoadingComponent = () => {
    return (
        <p>
            Loading your account information...
        </p>
    );
}
export const MyAccount = () => {
    const { instance } = useMsal();
    const { loading, data } = useFetch(`${window.ENV.API_ENDPOINT}/Reviews`);
    const authRequest = { scopes: ["openid", "profile"] };

    return (
        <div className="container mt-5">
            <h1>My Account</h1>
            <MsalAuthenticationTemplate
                interactionType={InteractionType.Redirect}
                authenticationRequest={authRequest}
                errorComponent={ErrorComponent}
                loadingComponent={LoadingComponent}
            >
                <h2 className="mt-5">Reviews by {instance.getActiveAccount().name}</h2>
                {loading ? <div>Loading...</div> :
                    (data ?? []).map((review) => <ReviewCard key={review.id} review={review} />)
                }
            </MsalAuthenticationTemplate>
        </div >
    )
};
