const core = require("@actions/core");
const github = require("@actions/github");
const syncBranches = require("./src/syncBranches");

async function run() {
    try {
        const sourceBranch = core.getInput("SOURCE_BRANCH", { required: true });
        const targetBranch = core.getInput("TARGET_BRANCH", { required: true });
        const githubToken = core.getInput("GITHUB_TOKEN", { required: true });

        const octokit = github.getOctokit(githubToken);

        const pullRequest = await syncBranches(octokit, github.context, sourceBranch, targetBranch);
        const {
            payload: { repository },
        } = github.context;

        core.setOutput("PULL_REQUEST_NUMBER", pullRequest.number.toString());
        core.setOutput("PULL_REQUEST_URL",`https://github.com/coupa/${repository.name}/pull/${pullRequest.number.toString()}`);
    } catch (err) {
        core.setFailed(err.message);
    }
}

run();

