const {getPRIdFromCommit, getSyncAssignee} = require("./assignee");

test('Get PR id from commit message', () => {
    expect(getPRIdFromCommit("Merge pull request #345 from test/Sync-19.1-with-19.2-392b")).toBe("345");
});

test('Wrong commit message', () => {
    expect(getPRIdFromCommit("TT-40432 fix validation of null vat")).toBe(null);
});

const mockOctokit = {
    pulls: {
        get: jest.fn()
    }
};

const serviceAccount = "serviceAccount";
const devAccount = "filinico";

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
    "payload": {
        "after": "c2939e3fa60b6febfbd20e1e993586a87d067cab",
        "base_ref": null,
        "before": "4c96d1399d1c8211780f01b8b24c13db66ca1fbb",
        "commits": [
            {
                "author": {
                    "email": "noreply.github.com",
                    "name": "Service Account",
                    "username": serviceAccount
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
                "name": "filinico",
            }
        }
    }
};

const syncPR = {
    data : {
        "id": 1,
        "number": 345,
        "state": "closed",
        "title": "Sync 19.3 with 20.1",
        "user": {
            "login": serviceAccount,
        },
        "body": "Commit merged into",
        "assignees": [
            {
                "login": devAccount,
            }
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
    }
};

test('Get the assignee from the sync PR', async () => {
    mockOctokit.pulls.get.mockReturnValue(syncPR);
    const data = await getSyncAssignee(mockOctokit, mockContext, serviceAccount);
    expect(data).toBe(devAccount);
});