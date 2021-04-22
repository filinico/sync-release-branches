const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
    try {
        const sourceBranch = core.getInput("SOURCE_BRANCH", { required: true });
        const targetBranch = core.getInput("TARGET_BRANCH", { required: true });
        const githubToken = core.getInput("GITHUB_TOKEN", { required: true });

        let sourceBranchSuffix = sourceBranch;
        if (sourceBranchSuffix.indexOf("release") > -1){
            const sourceBranchSuffixArray = sourceBranch.split("/");
            sourceBranchSuffix = sourceBranchSuffixArray[1];
        }

        let targetBranchSuffix = targetBranch;
        if (targetBranchSuffix.indexOf("release") > -1){
            const targetBranchSuffixArray = targetBranch.split("/");
            targetBranchSuffix = targetBranchSuffixArray[1];
        }

        const octokit = github.getOctokit(githubToken);
        const {
            payload: { repository },
        } = github.context;

        const { data: currentPulls } = await octokit.pulls.list({
            owner: repository.owner.login,
            repo: repository.name,
        });

        const context = github.context;
        const syncBranch = `Sync-${sourceBranchSuffix}-with-${targetBranchSuffix}-${context.sha.slice(-4)}`;
        const currentPull = currentPulls.find((pull) => {
            return pull.head.ref === syncBranch && pull.base.ref === targetBranch;
        });

        if (!currentPull) {
            await createBranch(octokit, context, syncBranch);
            const { data: pullRequest } = await octokit.pulls.create({
                owner: repository.owner.login,
                repo: repository.name,
                head: syncBranch,
                base: targetBranch,
                title: `Sync ${sourceBranchSuffix} with ${targetBranchSuffix} for commit ${context.sha.slice(-4)}`,
                body: `Commit ${context.sha.slice(-4)} merged to release ${sourceBranchSuffix}.\nCreated branch ${syncBranch} and opened PR to ${targetBranchSuffix}.`,
                draft: false,
            });

            core.setOutput("PULL_REQUEST_NUMBER", pullRequest.number.toString());
            core.setOutput("PULL_REQUEST_URL",`https://github.com/coupa/${repository.name}/pull/${pullRequest.number.toString()}`);
        } else {
            console.log(
                `There is already a pull request (${currentPull.number}) to ${targetBranch} from ${syncBranch}.`,
                `You can view it here: https://github.com/coupa/${repository.name}/pull/${currentPull.number.toString()}`
            );

            core.setOutput("PULL_REQUEST_NUMBER", currentPull.number.toString());
            core.setOutput("PULL_REQUEST_URL",`https://github.com/coupa/${repository.name}/pull/${currentPull.number.toString()}`);
        }

    } catch (err) {
        core.setFailed(err.message);
    }
}

async function createBranch(octokit, context, branch) {
    try {
        await octokit.repos.getBranch({
            ...context.repo,
            branch,
        });
    } catch (error) {
        if (error.name === "HttpError" && error.status === 404) {
            await octokit.git.createRef({
                ref: `refs/heads/${branch}`,
                sha: context.sha,
                ...context.repo,
            });
        } else {
            console.log("Error while creating new branch");
            throw Error(error);
        }
    }
}

run();

