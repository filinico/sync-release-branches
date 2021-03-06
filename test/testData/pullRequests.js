const {serviceAccount, devAccount} = require("./userAccounts");

const mockPrData = {
    "id": 1,
    "number": 111,
    "state": "closed",
    "title": "Sync 19.3 with 20.1",
    "user": {
        "login": "unknown",
    },
    "head": {
        "ref": "sync/10.0-with-20.0-pr#345",
    },
    "base": {
        "ref": "release/20.0",
    },
    "body": "Commit merged into",
    "assignees": [
    ],
    "comments": 10,
    "review_comments": 0,
    "maintainer_can_modify": true,
    "commits": 3,
    "additions": 100,
    "deletions": 3,
    "changed_files": 5,
    "auto_merge": null,
    "draft": false,
    "merged": true,
    "mergeable": true,
    "rebaseable": true,
    "mergeable_state": "clean",
};

const mockPr = {
    data : mockPrData
};

const prWithAssignee = {
    ...mockPrData,
    "number": 346,
    user:{
        "login": serviceAccount,
    },
    "mergeable": false,
    "mergeable_state": "dirty",
    "assignees": [
        {
            "login": devAccount,
        }
    ],
};

const syncPrWithAssignee = {
    ...mockPr,
    data : {
        ...prWithAssignee,
    }
};

const prWithoutAssignee = {
    ...mockPrData,
    "number": 347,
    user:{
        "login": serviceAccount,
    },
    "assignees": [
    ],
};

const syncPrWithoutAssignee = {
    ...mockPr,
    data : {
        ...prWithoutAssignee
    }
};

const originalPr = {
    ...mockPr,
    data : {
        ...mockPr.data,
        "number": 345,
        user:{
            "login": devAccount,
        },
        "assignees": [
        ],
    }
};

module.exports = {syncPrWithAssignee, syncPrWithoutAssignee, originalPr, prWithoutAssignee, prWithAssignee};