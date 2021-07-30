import {
    EventType,
    LogLevel,
    PublicClientApplication
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

export const msalConfig = {
    auth: {
        clientId: window.ENV.CLIENT_ID,
        authority: window.ENV.AUTHORITY,
        redirectUri: document.location.protocol + "//" + document.location.host + "/",
        postLogoutRedirectUri: document.location.protocol + "//" + document.location.host + "/",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        console.debug(message);
                        return;
                }
            }
        }
    }
};

export const msalInstance = new PublicClientApplication(msalConfig);
// Set the currently active account and keep it up to date
msalInstance.addEventCallback(
    (event) => {
        if (
            event.eventType === EventType.LOGIN_SUCCESS &&
            event.payload.account
        ) {
            const account = event.payload.account;
            msalInstance.setActiveAccount(account);
        }
    },
    (error) => {
        console.error(`error`, error);
    }
);
const accounts = msalInstance.getAllAccounts();
if (accounts && accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
}

export const AuthProvider = ({ children }) => {
    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    )
}