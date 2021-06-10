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

const commitMessageSyncPrWithPrId = "Merge pull request #346 from test/sync/19.1-with-19.2-pr#345";

const mergeCommitSyncPrWithPrId = {
    ...mockCommit,
    author:{
        ...mockCommit.author,
        username: serviceAccount
    },
    message: commitMessageSyncPrWithPrId
}

const contextSyncPrWithPrId = {
    ...mockContext,
    payload: {
        ...mockContext.payload,
        commits: [
            mergeCommitSyncPrWithPrId
        ],
        head_commit: {
            ...mergeCommitSyncPrWithPrId
        }
    }
}

/* Sync Pr without assignee */

const commitMessageSyncPrWithoutPrId = "TT-40432 fix validation of null vat";

const mergeCommitSyncPrWithoutPrId = {
    ...mockCommit,
    author:{
        ...mockCommit.author,
        username: serviceAccount
    },
    message: commitMessageSyncPrWithoutPrId
}

const contextSyncPrWithoutPrId = {
    ...mockContext,
    payload: {
        ...mockContext.payload,
        commits: [
            mergeCommitSyncPrWithoutPrId
        ],
        head_commit: {
            ...mergeCommitSyncPrWithoutPrId
        }
    }
}

/* original Pr */

const commitMessageOriginalPr = "Merge pull request #345 from test/feature/NN/TT-123456-new-feature";

const mergeCommitOriginalPr = {
    ...mockCommit,
    author:{
        ...mockCommit.author,
        username: serviceAccount
    },
    message: commitMessageOriginalPr
}

const contextOriginalPr = {
    ...mockContext,
    payload: {
        ...mockContext.payload,
        commits: [
            mergeCommitOriginalPr
        ],
        head_commit: {
            ...mergeCommitOriginalPr
        }
    }
}


module.exports = {contextSyncPrWithPrId, contextSyncPrWithoutPrId, contextOriginalPr};