
const getPRIdFromCommit = (commitMessage) => {
    const regex = /#[0-9]+/g;
    const matches = commitMessage.match(regex);
    if (matches){
        return matches[0].replace("#", "");
    }
    return matches;
}


async function getSyncAssignee(octokit, context, serviceAccount) {
    if (!serviceAccount)
        return null;
    const {
        payload: { repository, commits },
    } = context;
    if (serviceAccount === commits[0].author.username){
        const prId = getPRIdFromCommit(commits[0].message);
        const { data: pullRequest } = await octokit.pulls.get({
            owner: repository.owner.login,
            repo: repository.name,
            pull_number: prId
        });
        const prCreator = pullRequest.user.login;
        if (serviceAccount === prCreator){
            const assignees = pullRequest.assignees;
            if (assignees && assignees.length > 0){
                return assignees[0].login;
            }
            else
                return null;
        }
        else
            return prCreator;
    }
    else{
        return commits[0].author.username;
    }
}
module.exports = {getPRIdFromCommit, getSyncAssignee};
