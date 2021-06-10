const syncBranches = require("../../src/syncBranches");
const {devAccount} = require("../testData/userAccounts");
const {contextSyncPrWithPrId, contextSyncPrWithoutPrId, contextOriginalPr} = require("../testData/gitHubContexts");
const {syncPrWithAssignee, syncPrWithoutAssignee, prWithoutAssignee, originalPr, prWithAssignee} = require("../testData/pullRequests");
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

test('When original Pr merged, sync pr created with conflicts and original pr creator as assignee', async () => {
    mockOctokit.pulls.list.mockReturnValue({data: []});
    mockOctokit.pulls.get.mockReturnValue(originalPr);
    mockOctokit.pulls.create.mockReturnValue(syncPrWithAssignee);
    mockOctokit.repos.getBranch.mockRejectedValue(exception);

    const data = await syncBranches(mockOctokit, contextOriginalPr, "release/10.0", "release/20.0");
    expect(data).toEqual(prWithAssignee);
    expect(mockOctokit.pulls.create).toHaveBeenCalled();
    expect(mockOctokit.git.createRef).toHaveBeenCalled();
    expect(mockOctokit.issues.addAssignees).toHaveBeenCalledWith({
        ...requestParams,
        issue_number: 346,
        assignees: [devAccount]
    });
    expect(mockOctokit.pulls.get).toHaveBeenCalledWith({
        ...requestParams,
        pull_number: "345",
    });
});

test('When Sync Pr merged, next sync pr created with conflicts and original pr creator as assignee', async () => {
    mockOctokit.pulls.list.mockReturnValue({data: []});
    mockOctokit.pulls.get.mockReturnValue(originalPr);
    mockOctokit.pulls.create.mockReturnValue(syncPrWithAssignee);
    mockOctokit.repos.getBranch.mockRejectedValue(exception);

    const data = await syncBranches(mockOctokit, contextSyncPrWithPrId, "release/10.0", "release/20.0");
    expect(data).toEqual(prWithAssignee);
    expect(mockOctokit.pulls.create).toHaveBeenCalled();
    expect(mockOctokit.git.createRef).toHaveBeenCalled();
    expect(mockOctokit.issues.addAssignees).toHaveBeenCalledWith({
        ...requestParams,
        issue_number: 346,
        assignees: [devAccount]
    });
    expect(mockOctokit.pulls.get).toHaveBeenCalledWith({
        ...requestParams,
        pull_number: "345",
    });
});

test('sync pr created without conflicts from original pr', async () => {
    mockOctokit.pulls.list.mockReturnValue({data: []});
    mockOctokit.pulls.get.mockReturnValue(syncPrWithoutAssignee);
    mockOctokit.pulls.create.mockReturnValue(syncPrWithoutAssignee);
    mockOctokit.repos.getBranch.mockRejectedValue(exception);

    const data = await syncBranches(mockOctokit, contextOriginalPr, "release/10.0", "release/20.0");
    expect(data).toEqual(prWithoutAssignee);
    expect(mockOctokit.pulls.create).toHaveBeenCalled();
    expect(mockOctokit.git.createRef).toHaveBeenCalled();
    expect(mockOctokit.issues.addAssignees).not.toHaveBeenCalled();
    expect(mockOctokit.pulls.get).not.toHaveBeenCalled();
});

test('next sync pr created without conflicts from sync pr', async () => {
    mockOctokit.pulls.list.mockReturnValue({data: []});
    mockOctokit.pulls.get.mockReturnValue(syncPrWithoutAssignee);
    mockOctokit.pulls.create.mockReturnValue(syncPrWithoutAssignee);
    mockOctokit.repos.getBranch.mockRejectedValue(exception);

    const data = await syncBranches(mockOctokit, contextSyncPrWithPrId, "release/10.0", "release/20.0");
    expect(data).toEqual(prWithoutAssignee);
    expect(mockOctokit.pulls.create).toHaveBeenCalled();
    expect(mockOctokit.git.createRef).toHaveBeenCalled();
    expect(mockOctokit.issues.addAssignees).not.toHaveBeenCalled();
    expect(mockOctokit.pulls.get).not.toHaveBeenCalled();
});

test('When Sync Pr merged sync pr created without assignee', async () => {
    mockOctokit.pulls.list.mockReturnValue({data: []});
    mockOctokit.pulls.get.mockReturnValue(syncPrWithoutAssignee);
    mockOctokit.pulls.create.mockReturnValue(syncPrWithoutAssignee);
    mockOctokit.repos.getBranch.mockRejectedValue(exception);

    const data = await syncBranches(mockOctokit, contextSyncPrWithoutPrId, "release/10.0", "release/20.0");
    expect(data).toEqual(prWithoutAssignee);
    expect(mockOctokit.pulls.create).toHaveBeenCalled();
    expect(mockOctokit.git.createRef).toHaveBeenCalled();
    expect(mockOctokit.issues.addAssignees).not.toHaveBeenCalled();
    expect(mockOctokit.pulls.get).not.toHaveBeenCalled();
});

test('sync pr already exists', async () => {
    mockOctokit.pulls.list.mockReturnValue({data: [{...prWithAssignee}]});
    const data = await syncBranches(mockOctokit, contextSyncPrWithPrId, "release/10.0", "release/20.0");
    expect(data).toEqual(prWithAssignee);
    expect(mockOctokit.pulls.create).not.toHaveBeenCalled();
    expect(mockOctokit.pulls.get).not.toHaveBeenCalled();
    expect(mockOctokit.git.createRef).not.toHaveBeenCalled();
    expect(mockOctokit.issues.addAssignees).not.toHaveBeenCalled();
});