# CMUEats

Visit the site [here](http://cmueats.com/).

Keep track of the statuses of the various dining locations across Carnegie Mellon University. Quickly access the menus and specials at each location without having to go through the arduous process of visiting the CMU Dining Website. The following are some instructions and (hopefully useful) hints on the CMUEats development process. Don’t be afraid to ask questions if you are stuck!

## Developers

1. Join CMUEats’ Slack channel (`#tech-cmueats`) in the ScottyLabs Slack. Feel free to also put questions in there.

2. Create an account on [Github](https://github.com). Later, you should also apply to get access to the [Github Student Developer Pack](https://education.github.com/pack).

3. To start developing, you'll need to download [Bun.js](https://bun.sh/docs/installation), [Git](https://git-scm.com/download/win), and an IDE (I recommend [VSCode](https://code.visualstudio.com)). You should also download [Github Desktop](https://desktop.github.com) to make development easier at the beginning. I recommend checking out [Learn Git Branching](https://learngitbranching.js.org) later.

4. If you followed my IDE recommendation, also download the [Prettier VSCode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

5. Any of the following steps where you type something (i.e. git clone…, bun install, etc.) should be done in your IDE’s terminal.

6. Then, clone this repository to your computer by running `git clone https://github.com/ScottyLabs/cmueats.git` after making sure you have [git](https://git-scm.com/downloads) downloaded or running `gh repo clone ScottyLabs/cmueats` if you have the [Github CLI](https://cli.github.com/).

7. Now use `git fetch upstream`.

8. Do the same for the dining API in a new location. This time, replace `https://github.com/ScottyLabs/cmueats.git`with `https://github.com/ScottyLabs/dining-api.git` and `ScottyLabs/cmueats` with `ScottyLabs/dining-api`.

9. Now install the CMUEats dependencies by ['cd'-ing](https://www.geeksforgeeks.org/cd-command-in-linux-with-examples/#) into the root of the location where you cloned CMUEats and running `bun install`.

10. Now run the code with `bun start` and it should work! Just click on the link that appears and you’’ll see the web app. You can also use `bun run start` since `bun start` is its shorthand version

11. Now follow the installation steps for the dining API as well (steps 9 to 12).

12. To find bootcamp issues you can work on, please visit the [CMUEats issues page](https://github.com/ScottyLabs/cmueats/labels/bootcamp) or the [dining API issues page](https://github.com/ScottyLabs/dining-api/labels/bootcamp).

13. For every new issue or change you work on, first make sure your local repo is up-to-date with the ScottyLabs repo. To do this, go to your repo on your Github profile and click `Sync fork` if you are behind the main repo in commits. Then use `git pull origin main` in your IDE. Then type `cd main` in the local repository (folder containing all the code) for CMUEats or the dining API then type `git checkout -b branch-name`, where `branch-name` is the branch you want to work on (see [Learn Git Branching](https://learngitbranching.js.org)). To work on changes to a branch you already created, use `git checkout branch-name`, where `branch-name` is the branch you already created. Make sure to use `git checkout main` every t

14. When you want to commit changes, first stage changes with `git add .`. Then, use `git commit -m "commit message"` (alternatively commit using Github Desktop). To undo commits, use `git reset --hard (HEAD~# or commit-id)` (`--hard` removes staged and unstaged changes after commit chosen to reset to; `--soft` keeps changes in working directory and keeps reset commits in staging area). Replace `#` with the number of commits you want to go back by. Similarly, using `@{#}` instead of `~#` undos the reset (not necessarily just simplified). When you are ready to push changes, use `git push -f` or `git push -u branch-name`.

15. When you want to create a pull request for your changes, go to the ScottyLabs repo on the Github website and click on `Pull Requests`. Click on `New Pull Request`. On the right side, click on your repo’s branch you want to merge from, and, on the left side, make sure you have ScottyLabs’ `main` branch selected. Create a description then create the pull request. Feel free to request reviewers or ask a tech lead directly, so they can review your pull requests and requests changes or merge it.

Note that GitHub will automatically run checks (workflows) on your PR. This includes code linting (with tsc and eslint) and verifying that all unit tests in `/tests` pass with vitest.

![Example checks](checks_example.png)

16. To run unit tests locally, type `bun test`.
