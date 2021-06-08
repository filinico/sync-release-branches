const {serviceAccount, devAccount} = require("./userAccounts");

const mockContext = {
    "ref": "refs/heads/main",
    "sha": "c2939e3fa60b6febfbd20e1e993586a87d067cab",
    "repository": "filinico/sync-release-branches",
    "repository_owner": "filinico",
    "actor": "filinico",
    "workflow": ".github/workflows/test.yml",
    "head_ref": "",
    "base_ref": "",
    "event_name": "push",
    payload: {
        "after": "c2939e3fa60b6febfbd20e1e993586a87d067cab",
        "base_ref": null,
        "before": "4c96d1399d1c8211780f01b8b24c13db66ca1fbb",
        "commits": [
            {
                "author": {
                    "email": "noreply.github.com",
                    "name": "Service Account",
                },
                "committer": {
                    "email": "noreply@github.com",
                    "name": "GitHub",
                    "username": "web-flow"
                },
                "distinct": true,
                "id": "c2939e3fa60b6febfbd20e1e993586a87d067cab",
                "message": "Merge pull request #345 from test/Sync-19.1-with-19.2-392b",
                "timestamp": "2021-06-07T17:01:26+02:00",
                "tree_id": "7c5bdc84fa3ede2eda62db9e2287e63b09d304de",
            }
        ],
        "created": false,
        "deleted": false,
        "forced": false,
        "repository": {
            "name": "sync-release-branches",
            "owner": {
                "login": "filinico",
            }
        }
    }
};

const mockCommit = {
    "author": {
        "email": "noreply.github.com",
        "name": "Service Account",
    },
    "committer": {
        "email": "noreply@github.com",
        "name": "GitHub",
        "username": "web-flow"
    },
    "distinct": true,
    "id": "c2939e3fa60b6febfbd20e1e993586a87d067cab",
    "timestamp": "2021-06-07T17:01:26+02:00",
    "tree_id": "7c5bdc84fa3ede2eda62db9e2287e63b09d304de",
};

/* Sync Pr with assignee */

const commitMessageSyncPrWithAssignee = "Merge pull request #345 from test/Sync-19.1-with-19.2-392b";

const mergeCommitServiceAccountSyncPRWithAssignee = {
    ...mockCommit,
    author:{
        ...mockCommit.author,
        username: serviceAccount
    },
    message: commitMessageSyncPrWithAssignee
}

const serviceAccountMergedSyncPRWithAssignee = {
    ...mockContext,
    payload: {
        ...mockContext.payload,
        commits: [
            mergeCommitServiceAccountSyncPRWithAssignee
        ]
    }
}

/* Sync Pr without assignee */

const commitMessageSyncPrWithoutAssignee = "Merge pull request #346 from test/Sync-19.1-with-19.2-392b";

const mergeCommitServiceAccountSyncPRWithoutAssignee = {
    ...mockCommit,
    author:{
        ...mockCommit.author,
        username: serviceAccount
    },
    message: commitMessageSyncPrWithoutAssignee
}

const serviceAccountMergedSyncPRWithoutAssignee = {
    ...mockContext,
    payload: {
        ...mockContext.payload,
        commits: [
            mergeCommitServiceAccountSyncPRWithoutAssignee
        ]
    }
}

/* original Pr */

const commitMessageOriginalPr = "Merge pull request #347 from test/Sync-19.1-with-19.2-392b";

const mergeCommitServiceAccountOriginalPr = {
    ...mockCommit,
    author:{
        ...mockCommit.author,
        username: serviceAccount
    },
    message: commitMessageOriginalPr
}

const serviceAccountMergedOriginalPr = {
    ...mockContext,
    payload: {
        ...mockContext.payload,
        commits: [
            mergeCommitServiceAccountOriginalPr
        ]
    }
}

/* Pr merged by dev */

const commitMessageDevPr = "Merge pull request #348 from test/Sync-19.1-with-19.2-392b";

const mergeCommitDevPr = {
    ...mockCommit,
    author:{
        ...mockCommit.author,
        username: devAccount
    },
    message: commitMessageDevPr
}

const devAccountMergedPr = {
    ...mockContext,
    payload: {
        ...mockContext.payload,
        commits: [
            mergeCommitDevPr
        ]
    }
}

module.exports = {serviceAccountMergedSyncPRWithAssignee, serviceAccountMergedSyncPRWithoutAssignee, serviceAccountMergedOriginalPr, devAccountMergedPr};