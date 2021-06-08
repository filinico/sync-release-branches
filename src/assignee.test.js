const {getPRIdFromCommit} = require("./assignee");

test('Get PR id from commit message', () => {
    expect(getPRIdFromCommit("Merge pull request #345 from test/Sync-19.1-with-19.2-392b")).toBe("345");
});

test('Wrong commit message', () => {
    expect(getPRIdFromCommit("TT-40432 fix validation of null vat")).toBe(null);
});
