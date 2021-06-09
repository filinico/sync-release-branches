const {getSyncAssignee} = require("./assignee");
const {getVersionFromBranch, createBranch} = require("./branches");
const releaseBranchType = "release";

async function syncBranches(octokit, context, sourceBranch, targetBranch, serviceAccount) {
    const sourceBranchSuffix = getVersionFromBranch(sourceBranch, releaseBranchType);
    const targetBranchSuffix = getVersionFromBranch(targetBranch, releaseBranchType);
    const syncBranch = `Sync-${sourceBranchSuffix}-with-${targetBranchSuffix}-${context.sha.slice(-4)}`;

    const {
        payload: { repository },
    } = context;

    const { data: currentPulls } = await octokit.pulls.list({
        owner: repository.owner.login,
        repo: repository.name,
    });

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

        const assignee = await getSyncAssignee(octokit, context, serviceAccount);
        if (assignee){
            await octokit.issues.addAssignees({
                owner: repository.owner.login,
                repo: repository.name,
                issue_number: pullRequest.number,
                assignees: [assignee],
            });
        }

        return pullRequest;
    }
    else{
        console.log(
            `There is already a pull request (${currentPull.number}) to ${targetBranch} from ${syncBranch}.`,
            `You can view it here: https://github.com/coupa/${repository.name}/pull/${currentPull.number.toString()}`
        );
        return currentPull;
    }
}

module.exports = syncBranches;