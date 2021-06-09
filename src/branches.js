
const getVersionFromBranch = (branchName, branchType) => {
    if (branchName.indexOf(branchType) > -1){
        const sourceBranchSuffixArray = branchName.split("/");
        if (sourceBranchSuffixArray.length > 1)
            return  sourceBranchSuffixArray[1];
    }
    return branchName;
};

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

module.exports = {getVersionFromBranch, createBranch};