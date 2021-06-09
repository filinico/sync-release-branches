const {serviceAccount, devAccount} = require("../testData/userAccounts");
const {serviceAccountMergedSyncPRWithAssignee,
    serviceAccountMergedSyncPRWithoutAssignee,
    serviceAccountMergedOriginalPr,
    devAccountMergedPr} = require("../testData/gitHubContexts");
const {syncPrWithAssignee, syncPrWithoutAssignee, originalPr} = require("../testData/pullRequests");
const {mockOctokit} = require("../testData/mockOctokit");
const {getSyncAssignee} = require("../../src/assignee");
const pullRequestParams = {
    owner: "filinico",
    repo : "sync-release-branches",
};

beforeEach(() => {
    mockOctokit.pulls.get.mockReset();
});

test('Get the assignee from the sync PR', async () => {
    mockOctokit.pulls.get.mockReturnValue(syncPrWithAssignee);
    const data = await getSyncAssignee(mockOctokit, serviceAccountMergedSyncPRWithAssignee, serviceAccount);
    expect(data).toBe(devAccount);
    expect(mockOctokit.pulls.get).toHaveBeenCalledWith({
        ...pullRequestParams,
        pull_number: "345"
    });
});

test('No assignee from the sync PR', async () => {
    mockOctokit.pulls.get.mockReturnValue(syncPrWithoutAssignee);
    const data = await getSyncAssignee(mockOctokit, serviceAccountMergedSyncPRWithoutAssignee, serviceAccount);
    expect(data).toBeNull();
    expect(mockOctokit.pulls.get).toHaveBeenCalledWith({
        ...pullRequestParams,
        pull_number: "346"
    });
});

test('service account not provided, no assignee', async () => {
    const data = await getSyncAssignee(mockOctokit, serviceAccountMergedSyncPRWithAssignee, null);
    expect(data).toBeNull();
    expect(mockOctokit.pulls.get).not.toHaveBeenCalled();
});

test('Get the creator of the original PR', async () => {
    mockOctokit.pulls.get.mockReturnValue(originalPr);
    const data = await getSyncAssignee(mockOctokit, serviceAccountMergedOriginalPr, serviceAccount);
    expect(data).toBe(devAccount);
    expect(mockOctokit.pulls.get).toHaveBeenCalledWith({
        ...pullRequestParams,
        pull_number: "347"
    });
});

test('Get the author of the merge commit', async () => {
    const data = await getSyncAssignee(mockOctokit, devAccountMergedPr, serviceAccount);
    expect(data).toBe(devAccount);
    expect(mockOctokit.pulls.get).not.toHaveBeenCalled();
});
