const {getVersionFromBranch} = require("./branches");


test('Get version from release branch', () => {
    expect(getVersionFromBranch("release/10.0", "release")).toBe("10.0");
});

test('No version available', () => {
    expect(getVersionFromBranch("my-branch", "release")).toBe("my-branch");
});