Here is the overview:

UI Flow:

Browser -> Web API -> DB

DB Schema:
Items >-- Review



Create an app for the frontend UI

```
az ad app create --display-name="Reviewer" \
    --oauth2-allow-implicit-flow=true \
    --reply-urls="http://localhost:3000" \
    --available-to-other-tenants=true \
    --query "appId" -o tsv

```

Create SQL Server + Database
- Enable Azure AD Auth: https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-sql#enable-azure-ad-authentication
CREATE USER [id-reviewer-api] FROM EXTERNAL PROVIDER
ALTER ROLE db_datareader ADD MEMBER [id-reviewer-api]


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
- create contained user in Azure SQL


# GitHub Actions

Create a service principal with 'only' contributor access to our cluster that GitHub can assume and deploy our resources


```
az ad sp create-for-rbac --sdk-auth --skip-assignment --name aks-reviewer-deployment-principal

az role assignment create --assignee <ClientId> --scope <AKSId> --role Contributor
```