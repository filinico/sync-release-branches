
const getPRIdFromCommit = (commitMessage) => {
    const regex = /#[0-9]+/g;
    const matches = commitMessage.match(regex);
    if (matches){
        return matches[0].replace("#", "");
    }
    return matches;
}

const getPRIdFromSyncBranch = (commitMessage) => {
    const regex = /Merge pull request #[0-9]+ from [a-z]+\/sync\/[0-9a-z.]+-with-[0-9a-z.]+-pr#([0-9]+)/g;
    const matches = Array.from(commitMessage.matchAll(regex), m => m[1]);
    if (matches.length){
        return matches[0];
    }
    return null;
}

async function getPrCreator(octokit, context, prId) {
    const {
        payload: { repository },
    } = context;
    if (prId){
        const { data: pullRequest } = await octokit.pulls.get({
            owner: repository.owner.login,
            repo: repository.name,
            pull_number: prId
        });
        return pullRequest.user.login;
    }
    return null;
}

module.exports = {getPRIdFromCommit, getPRIdFromSyncBranch, getPrCreator};
