const syncBranches = require("../../src/syncBranches");
const {serviceAccount, devAccount} = require("../testData/userAccounts");
const {serviceAccountMergedSyncPRWithAssignee, serviceAccountMergedSyncPRWithoutAssignee} = require("../testData/gitHubContexts");
const {syncPrWithAssignee, syncPrWithoutAssignee, prWithoutAssignee} = require("../testData/pullRequests");
const {mockOctokit} = require("../testData/mockOctokit");
const exception = {
    name: "HttpError",
    status: 404
};
const requestParams = {
    owner: "filinico",
    repo : "sync-release-branches",
};

beforeEach(() => {
    mockOctokit.pulls.get.mockReset();
    mockOctokit.pulls.create.mockReset();
    mockOctokit.pulls.list.mockReset();
    mockOctokit.issues.addAssignees.mockReset();
    mockOctokit.repos.getBranch.mockReset();
    mockOctokit.git.createRef.mockReset();
});

test('sync pr created with assignee', async () => {
    mockOctokit.pulls.list.mockReturnValue({data: []});
    mockOctokit.pulls.get.mockReturnValue(syncPrWithAssignee);
    mockOctokit.pulls.create.mockReturnValue(syncPrWithoutAssignee);
    mockOctokit.repos.getBranch.mockRejectedValue(exception);

    const data = await syncBranches(mockOctokit, serviceAccountMergedSyncPRWithAssignee, "release/10.0", "release/20.0", serviceAccount);
    expect(data).toEqual(prWithoutAssignee);
    expect(mockOctokit.pulls.create).toHaveBeenCalled();
    expect(mockOctokit.git.createRef).toHaveBeenCalled();
    expect(mockOctokit.issues.addAssignees).toHaveBeenCalledWith({
        ...requestParams,
        issue_number: 346,
        assignees: [devAccount]
    });
});

test('sync pr created without assignee', async () => {
    mockOctokit.pulls.list.mockReturnValue({data: []});
    mockOctokit.pulls.get.mockReturnValue(syncPrWithoutAssignee);
    mockOctokit.pulls.create.mockReturnValue(syncPrWithoutAssignee);
    mockOctokit.repos.getBranch.mockRejectedValue(exception);

    const data = await syncBranches(mockOctokit, serviceAccountMergedSyncPRWithoutAssignee, "release/10.0", "release/20.0", serviceAccount);
    expect(data).toEqual(prWithoutAssignee);
    expect(mockOctokit.pulls.create).toHaveBeenCalled();
    expect(mockOctokit.git.createRef).toHaveBeenCalled();
    expect(mockOctokit.issues.addAssignees).not.toHaveBeenCalled();
});

test('sync pr already exists', async () => {
    mockOctokit.pulls.list.mockReturnValue({data: [{...prWithoutAssignee}]});
    const data = await syncBranches(mockOctokit, serviceAccountMergedSyncPRWithoutAssignee, "release/10.0", "release/20.0", serviceAccount);
    expect(data).toEqual(prWithoutAssignee);
    expect(mockOctokit.pulls.create).not.toHaveBeenCalled();
    expect(mockOctokit.pulls.get).not.toHaveBeenCalled();
    expect(mockOctokit.git.createRef).not.toHaveBeenCalled();
    expect(mockOctokit.issues.addAssignees).not.toHaveBeenCalled();
});