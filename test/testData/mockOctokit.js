const mockOctokit = {
    pulls: {
        get: jest.fn(),
        create: jest.fn(),
        list: jest.fn(),
    },
    issues: {
        addAssignees: jest.fn(),
    },
    repos: {
        getBranch: jest.fn()
    },
    git: {
        createRef: jest.fn()
    }
};

module.exports = {mockOctokit};