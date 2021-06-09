const {getPRIdFromCommit, getPRIdFromSyncBranch} = require("./assignee");

test('Get PR id from commit message', () => {
    expect(getPRIdFromCommit("Merge pull request #345 from test/Sync-19.1-with-19.2-392b")).toBe("345");
});

test('Wrong commit message', () => {
    expect(getPRIdFromCommit("TT-40432 fix validation of null vat")).toBe(null);
    expect(getPRIdFromSyncBranch("TT-40432 fix validation of null vat")).toBe(null);
});

test('Get PR id from commit message of merge from sync branch', () => {
    expect(getPRIdFromSyncBranch("Merge pull request #400 from test/sync/30.0-with-develop-pr#383")).toBe("383");
    expect(getPRIdFromSyncBranch("Merge pull request #61 from test/sync/21.1-with-30.0-pr#59\\n\\nSync 21.1 with 30.0 for pr#59")).toBe("59");
});

test('Not a merge from sync branch', () => {
    expect(getPRIdFromSyncBranch("Merge pull request #400 from feature/TT-40235-add-assignee")).toBe(null);
});

