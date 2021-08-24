# Reviewer

A real-world application that allows people to sign in using Azure AD and use an API to write to a SQL database and Blob Storage.

All hardcoded aspects are externalised as configuration to allow deployment and customisation in a variety of scenarios.

Now whilst the application itself doesn't do much, it serves as a good example of how to model a real-world, secure application.

No secrets were stored during the making of this repository

## App Architecture

![simple web app architecture](https://user-images.githubusercontent.com/51163690/130647736-32f9a540-fe2f-4057-9a9f-9286e5280c6f.png)


## Database


![one item has many reviews diagram](https://user-images.githubusercontent.com/51163690/130648496-4b9b8b38-d395-4ee2-8c3f-b6d4bef5697d.png)


## Azure AD

Create an app for the frontend UI. After creation change the access token version in the manifest to v2. Ensure that reply-urls are set as SPA rather than Web.

```
az ad app create --display-name="Item Reviewer" \
    --reply-urls="http://localhost:3000/" \
    --available-to-other-tenants=true \
    --query "appId" -o tsv

```

Create SQL Server + Database
- Enable Azure AD Auth: https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-sql#enable-azure-ad-authentication

```
CREATE USER [id-reviewer-api] FROM EXTERNAL PROVIDER
ALTER ROLE db_datareader ADD MEMBER [id-reviewer-api]
```

Create Azure Storage Account (reviewer...)
- Create container inside (images)

Create Kubernetes Cluster
- Create ACR
- Create Log Analytics Workspace

Create Managed Identity for the API and UI

```
az identity create -g rg-reviewer -n id-reviewer-api
az identity create -g rg-reviewer -n id-reviewer-ui
```

- grant RBAC to blob storage - Azure Blob Data Contributor


## Deployment

Create a service principal with 'only' contributor access to our cluster that GitHub can assume and deploy our resources


```
az ad sp create-for-rbac --sdk-auth --skip-assignment --name aks-reviewer-deployment-principal

az role assignment create --assignee <ClientId> --scope <AKSId> --role Contributor
```
