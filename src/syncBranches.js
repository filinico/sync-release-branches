const {getPrCreator, getPRIdFromSyncBranch, getPRIdFromCommit} = require("./assignee");
const {getVersionFromBranch, createBranch} = require("./branches");
const releaseBranchType = "release";

async function syncBranches(octokit, context, sourceBranch, targetBranch) {
    const {
        payload: { repository, head_commit },
    } = context;
    let prId = getPRIdFromSyncBranch(head_commit.message);
    if (!prId){
       prId = getPRIdFromCommit(head_commit.message);
    }
    const sourceBranchSuffix = getVersionFromBranch(sourceBranch, releaseBranchType);
    const targetBranchSuffix = getVersionFromBranch(targetBranch, releaseBranchType);
    const commitId = context.sha.slice(12);
    let syncBranch = `sync/${sourceBranchSuffix}-with-${targetBranchSuffix}-${commitId}`;
    let title = `Sync ${sourceBranchSuffix} with ${targetBranchSuffix} for commit ${commitId}`;
    let description = `Commit ${commitId} merged to release ${sourceBranchSuffix}.\nCreated branch ${syncBranch} and opened PR to ${targetBranchSuffix}.`;
    if (prId){
        syncBranch = `sync/${sourceBranchSuffix}-with-${targetBranchSuffix}-pr#${prId}`;
        title = `Sync ${sourceBranchSuffix} with ${targetBranchSuffix} for pr#${prId}`;
        description = `Changes from PR #${prId} merged to release ${sourceBranchSuffix}.\nCreated branch ${syncBranch} and opened PR to ${targetBranchSuffix}.`;
    }

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
            title: title,
            body: description,
            draft: false,
        });

        if (pullRequest.mergeable_state === "dirty" ){
            const prCreator = await getPrCreator(octokit, context, prId);
            if (prCreator){
                await octokit.issues.addAssignees({
                    owner: repository.owner.login,
                    repo: repository.name,
                    issue_number: pullRequest.number,
                    assignees: [prCreator],
                });
            }
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